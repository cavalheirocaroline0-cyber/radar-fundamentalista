import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      process.env.BACKEND_URL;

    if (!apiBase) {
      return NextResponse.json(
        {
          erro:
            "URL do backend não configurada. Configure NEXT_PUBLIC_API_URL no frontend."
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const resposta = await fetch(`${apiBase}/premium/interesse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const dados = await resposta.json();

    return NextResponse.json(dados, { status: resposta.status });
  } catch {
    return NextResponse.json(
      {
        erro: "Erro interno ao registrar interesse premium."
      },
      { status: 500 }
    );
  }
}
