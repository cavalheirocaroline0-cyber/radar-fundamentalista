export type Empresa = {
  ticker: string;
  empresa: string;
  setor: string | null;
  classificacao: string | null;
  preco: number | string | null;
  pl: number | string | null;
  pvp: number | string | null;
  roe: number | string | null;
  margem_liquida: number | string | null;
  divida_liquida_ebitda: number | string | null;
  divida_bruta_patrimonio: number | string | null;
  dividend_yield: number | string | null;
  liquidez_2_meses: number | string | null;
  score: number | string | null;
  fonte: string | null;
  data_coleta: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function buscarEmpresas(): Promise<Empresa[]> {
  const resposta = await fetch(`${API_URL}/empresas`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar empresas da API");
  }

  const dados = await resposta.json();
  return dados.empresas;
}

export async function buscarRanking(): Promise<Empresa[]> {
  const resposta = await fetch(`${API_URL}/ranking`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar ranking da API");
  }

  const dados = await resposta.json();
  return dados.ranking;
}
