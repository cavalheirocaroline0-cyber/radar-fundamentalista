import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Registro = Record<string, unknown>;

function saudacaoPorHora(horaLocal?: number) {
  const hora = typeof horaLocal === "number" ? horaLocal : new Date().getHours();

  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

function normalizarPagina(pathname: string) {
  if (!pathname || pathname === "/") return "home";
  if (pathname.startsWith("/empresa/")) return "empresa";
  if (pathname.startsWith("/empresas")) return "empresas";
  if (pathname.startsWith("/ranking")) return "ranking";
  if (pathname.startsWith("/macro")) return "macro";
  if (pathname.startsWith("/ia")) return "ia";
  if (pathname.startsWith("/premium")) return "premium";
  if (pathname.startsWith("/perfil")) return "perfil";
  return "geral";
}

async function buscarJson(url: string) {
  try {
    const resposta = await fetch(url, { cache: "no-store" });

    if (!resposta.ok) {
      return null;
    }

    return await resposta.json();
  } catch {
    return null;
  }
}

function coletarRegistros(valor: unknown): Registro[] {
  const registros: Registro[] = [];

  function visitar(item: unknown) {
    if (!item) return;

    if (Array.isArray(item)) {
      item.forEach(visitar);
      return;
    }

    if (typeof item !== "object") return;

    const registro = item as Registro;
    const chaves = Object.keys(registro);

    const pareceRegistro =
      chaves.includes("ticker") ||
      chaves.includes("codigo") ||
      chaves.includes("indicador") ||
      chaves.includes("nome") ||
      chaves.includes("ativo") ||
      chaves.includes("chave");

    if (pareceRegistro) {
      registros.push(registro);
    }

    for (const valorInterno of Object.values(registro)) {
      if (Array.isArray(valorInterno) || typeof valorInterno === "object") {
        visitar(valorInterno);
      }
    }
  }

  visitar(valor);
  return registros;
}

function textoDoRegistro(registro: Registro) {
  return Object.values(registro)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function encontrar(registros: Registro[], termos: string[]) {
  const termosNormalizados = termos.map((termo) =>
    termo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );

  return registros.find((registro) => {
    const texto = textoDoRegistro(registro);
    return termosNormalizados.some((termo) => texto.includes(termo));
  });
}

function pegarTexto(registro: Registro | undefined, chaves: string[]) {
  if (!registro) return "";

  for (const chave of chaves) {
    const valor = registro[chave];

    if (typeof valor === "string" && valor.trim()) {
      return valor.trim();
    }

    if (typeof valor === "number") {
      return String(valor);
    }
  }

  return "";
}

function parseNumero(valor: unknown) {
  if (typeof valor === "number") return valor;

  if (typeof valor !== "string") return null;

  const limpo = valor
    .replace("R$", "")
    .replace("%", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numero = Number(limpo);

  return Number.isFinite(numero) ? numero : null;
}

function pegarNumero(registro: Registro | undefined, chaves: string[]) {
  if (!registro) return null;

  for (const chave of chaves) {
    const numero = parseNumero(registro[chave]);

    if (numero !== null) {
      return numero;
    }
  }

  return null;
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
  }).format(valor);
}

function formatarPercentual(valor: number) {
  return `${Math.abs(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

function descreverIndicador(
  registros: Registro[],
  nomeFalado: string,
  termos: string[],
  tipo: "moeda" | "percentual" | "numero" = "numero"
) {
  const item = encontrar(registros, termos);

  if (!item) return "";

  const valor = pegarNumero(item, [
    "valor",
    "valor_atual",
    "preco",
    "preco_atual",
    "cotacao",
    "ultimo",
    "ultima",
    "valor_brl",
    "close"
  ]);

  const variacao = pegarNumero(item, [
    "variacao",
    "variacao_percentual",
    "variacao_24h",
    "variacao_24h_percentual",
    "percentual",
    "change_percent",
    "percent_change"
  ]);

  if (valor === null) return "";

  let valorTexto = valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2
  });

  if (tipo === "moeda") {
    valorTexto = formatarMoeda(valor);
  }

  if (tipo === "percentual") {
    valorTexto = formatarPercentual(valor);
  }

  let frase = `${nomeFalado} está em ${valorTexto}`;

  if (variacao !== null && variacao !== 0) {
    const direcao = variacao > 0 ? "alta" : "queda";
    frase += `, com ${direcao} de ${formatarPercentual(variacao)}`;
  }

  return frase + ".";
}

function resumoRanking(registros: Registro[]) {
  const item = registros.find((registro) => {
    const ticker = pegarTexto(registro, ["ticker", "codigo"]);
    const score = pegarNumero(registro, ["score", "pontuacao"]);
    return ticker && score !== null;
  });

  if (!item) return "";

  const ticker = pegarTexto(item, ["ticker", "codigo"]);
  const empresa = pegarTexto(item, ["empresa", "nome", "razao_social"]);
  const score = pegarNumero(item, ["score", "pontuacao"]);

  if (!ticker) return "";

  const nome = empresa ? `${ticker}, ${empresa}` : ticker;

  if (score !== null) {
    return `No ranking fundamentalista, um dos destaques exibidos é ${nome}, com score ${score.toLocaleString("pt-BR", {
      maximumFractionDigits: 1
    })}.`;
  }

  return `No ranking fundamentalista, um dos destaques exibidos é ${nome}.`;
}

async function montarTextoDaPagina(pathname: string, nome: string, horaLocal?: number) {
  const saudacao = saudacaoPorHora(horaLocal);
  const pagina = normalizarPagina(pathname);
  const primeiroNome = nome ? `, ${nome.split(" ")[0]}` : "";

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    "";

  let registrosMacro: Registro[] = [];
  let registrosRanking: Registro[] = [];
  let registrosEmpresas: Registro[] = [];

  if (apiBase) {
    const [macro, ranking, empresas] = await Promise.all([
      buscarJson(`${apiBase}/macro`),
      buscarJson(`${apiBase}/ranking`),
      buscarJson(`${apiBase}/empresas`)
    ]);

    registrosMacro = coletarRegistros(macro);
    registrosRanking = coletarRegistros(ranking);
    registrosEmpresas = coletarRegistros(empresas);
  }

  const todos = [...registrosMacro, ...registrosRanking, ...registrosEmpresas];

  const bitcoin = descreverIndicador(todos, "Bitcoin", ["bitcoin", "btc"], "moeda");
  const dolar = descreverIndicador(todos, "Dólar", ["dolar", "dólar", "usd"], "moeda");
  const selic = descreverIndicador(todos, "Selic", ["selic"], "percentual");
  const ipca = descreverIndicador(todos, "IPCA", ["ipca"], "percentual");
  const ouro = descreverIndicador(todos, "Ouro", ["ouro", "gold"], "moeda");
  const prata = descreverIndicador(todos, "Prata", ["prata", "silver"], "moeda");
  const ranking = resumoRanking(registrosRanking);

  const leituraMercado = [bitcoin, dolar, selic, ipca, ouro, prata]
    .filter(Boolean)
    .join(" ");

  if (pagina === "home") {
    return `${saudacao}${primeiroNome}. Você está no Dash Diário. ${
      leituraMercado
        ? `Na leitura de agora, ${leituraMercado}`
        : "Hoje o Dash reúne os principais dados de mercado, indicadores macroeconômicos, empresas e rankings fundamentalistas."
    } ${
      ranking || ""
    } A IA do Dash está liberada por tempo limitado para ajudar você a entender indicadores, empresas, rankings e cenário de mercado em linguagem simples. Conteúdo educativo e informativo, sem recomendação de investimento.`;
  }

  if (pagina === "macro") {
    return `${saudacao}${primeiroNome}. Você está na página Macro do Dash Diário. ${
      leituraMercado
        ? `Aqui está a leitura dos indicadores agora: ${leituraMercado}`
        : "Aqui você acompanha Selic, IPCA, dólar, Bitcoin, ouro e prata para entender o cenário econômico do dia."
    } Use estes dados para contextualizar o mercado antes de analisar empresas individualmente.`;
  }

  if (pagina === "ranking") {
    return `${saudacao}${primeiroNome}. Você está no Ranking do Dash Diário. ${
      ranking || "Aqui as empresas são organizadas por score e indicadores fundamentalistas."
    } Use esta página para comparar empresas, observar destaques relativos e estudar o mercado com mais estrutura.`;
  }

  if (pagina === "empresas") {
    return `${saudacao}${primeiroNome}. Você está na página de empresas do Dash Diário. Aqui você pode consultar as empresas analisadas e comparar indicadores como preço, P/L, P/VP, ROE, dividend yield, liquidez e score. A IA do Dash está liberada por tempo limitado para ajudar você a entender esses conceitos.`;
  }

  if (pagina === "empresa") {
    return `${saudacao}${primeiroNome}. Você está na página individual de uma empresa. Aqui o Dash organiza os principais indicadores daquele ativo para facilitar sua leitura. Observe preço, múltiplos, rentabilidade, dividendos, dívida e score. Use a IA liberada por tempo limitado para entender os conceitos de forma educativa.`;
  }

  if (pagina === "ia") {
    return `${saudacao}${primeiroNome}. Você está na área de inteligência artificial do Dash Diário. A IA está liberada por tempo limitado para ajudar você a entender indicadores, rankings, empresas e cenário de mercado. Faça perguntas sobre P/L, P/VP, ROE, dividend yield, Selic, IPCA, dólar, score e outros conceitos. A IA não faz recomendação de investimento.`;
  }

  if (pagina === "premium") {
    return `${saudacao}${primeiroNome}. Você está na área premium do Dash Diário. Esta área concentra a evolução dos recursos avançados da plataforma. No momento, a IA do Dash está liberada por tempo limitado para validação da experiência.`;
  }

  return `${saudacao}${primeiroNome}. Você está no Dash Diário. A plataforma organiza dados de mercado, empresas, rankings e indicadores econômicos para apoiar sua leitura diária. A IA está liberada por tempo limitado para ajudar na interpretação educativa dos dados.`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { erro: "OPENAI_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const pathname = String(body.pathname || "/");
    const nome = String(body.nome || "").trim();
    const horaLocal =
      typeof body.horaLocal === "number" ? body.horaLocal : undefined;

    const texto = await montarTextoDaPagina(pathname, nome, horaLocal);

    const resposta = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "shimmer",
        input: texto,
        instructions:
          "Fale em português brasileiro com voz feminina jovem adulta, natural, espontânea e moderna. O tom deve ser leve, inteligente, seguro e próximo, como uma assistente digital premium acompanhando a rotina do usuário. Fale com energia moderada, ritmo um pouco mais rápido, boa dicção e pausas naturais. Não soe robótico, não soe dramático, não soe formal demais e não soe como telemarketing.",
        response_format: "mp3",
        speed: 1.12
      })
    });

    if (!resposta.ok) {
      const erroTexto = await resposta.text();

      return NextResponse.json(
        {
          erro: "Erro ao gerar áudio com a OpenAI.",
          detalhe: erroTexto
        },
        { status: resposta.status }
      );
    }

    const audio = await resposta.arrayBuffer();

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro interno ao gerar voz do Dash." },
      { status: 500 }
    );
  }
}
