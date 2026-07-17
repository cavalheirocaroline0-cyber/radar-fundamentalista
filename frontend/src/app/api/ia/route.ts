import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
Você é a Assistente IA do Dash Diário.

Seu papel é explicar indicadores fundamentalistas, rankings, mercado, economia e conceitos financeiros de forma simples, educativa e informativa.

Regras obrigatórias:
- Não recomende compra ou venda de ações, FIIs, criptomoedas ou qualquer ativo.
- Não diga ao usuário onde investir.
- Não monte carteira.
- Não prometa rentabilidade.
- Não faça previsão de preço.
- Se o usuário pedir recomendação de investimento, explique que você não pode recomendar, mas pode ajudar a entender os indicadores.
- Use linguagem clara, curta e didática.
- Sempre que fizer sentido, explique como o usuário pode analisar o dado com cautela.
- Reforce que o conteúdo é educativo e informativo.
`;

function extrairTextoResposta(data: any): string {
  if (typeof data?.output_text === "string") {
    return data.output_text;
  }

  const partes: string[] = [];

  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") {
        partes.push(content.text);
      }
    }
  }

  return partes.join("\n").trim();
}

export async function POST(request: NextRequest) {
  try {
    const { pergunta } = await request.json();

    if (!pergunta || typeof pergunta !== "string") {
      return NextResponse.json(
        { erro: "Pergunta inválida." },
        { status: 400 }
      );
    }

    if (pergunta.length > 1000) {
      return NextResponse.json(
        { erro: "Pergunta muito longa. Tente resumir." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    if (!apiKey) {
      return NextResponse.json(
        {
          erro: "OPENAI_API_KEY não configurada no servidor.",
        },
        { status: 500 }
      );
    }

    const resposta = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: pergunta,
          },
        ],
        max_output_tokens: 600,
      }),
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro OpenAI:", data);

      return NextResponse.json(
        {
          erro:
            data?.error?.message ||
            "Erro ao consultar a IA. Tente novamente em instantes.",
        },
        { status: resposta.status }
      );
    }

    const texto = extrairTextoResposta(data);

    return NextResponse.json({
      resposta:
        texto ||
        "Não consegui gerar uma resposta agora. Tente reformular a pergunta.",
    });
  } catch (error) {
    console.error("Erro na rota /api/ia:", error);

    return NextResponse.json(
      {
        erro: "Erro interno ao processar a pergunta.",
      },
      { status: 500 }
    );
  }
}
