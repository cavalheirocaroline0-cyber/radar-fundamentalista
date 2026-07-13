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

export type IndicadorMacro = {
  indicador: string;
  descricao: string | null;
  data_referencia: string | null;
  valor: number | string | null;
  unidade: string | null;
  fonte: string | null;
};

export type AtivoMercado = {
  ativo: string;
  data_referencia: string | null;
  preco_brl: number | string | null;
  preco_usd: number | string | null;
  variacao_24h: number | string | null;
  fonte: string | null;
};

export type DadosMacro = {
  indicadores: IndicadorMacro[];
  ativos: AtivoMercado[];
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

export async function buscarMacro(): Promise<DadosMacro> {
  const resposta = await fetch(`${API_URL}/macro`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar indicadores macro da API");
  }

  const dados = await resposta.json();

  return {
    indicadores: dados.indicadores,
    ativos: dados.ativos,
  };
}

export async function buscarEmpresaPorTicker(ticker: string): Promise<Empresa> {
  const resposta = await fetch(`${API_URL}/empresas/${ticker}`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar empresa da API");
  }

  const dados = await resposta.json();
  return dados.empresa;
}

export type InsightItem = {
  label: string;
  valor: number | string;
};

export type InsightEmpresa = {
  ticker: string;
  empresa: string | null;
  setor: string | null;
  classificacao: string | null;
  score?: number | string | null;
  roe?: number | string | null;
  dividend_yield?: number | string | null;
  pl?: number | string | null;
  pvp?: number | string | null;
};

export type InsightsDash = {
  por_classificacao: InsightItem[];
  por_setor: InsightItem[];
  distribuicao_score: InsightItem[];
  top_score: InsightEmpresa[];
  top_dividend_yield: InsightEmpresa[];
  top_roe: InsightEmpresa[];
  medias: {
    total_empresas: number | string;
    media_score: number | string | null;
    media_roe: number | string | null;
    media_dy: number | string | null;
    media_pl: number | string | null;
    media_pvp: number | string | null;
  };
};

export async function buscarInsights(): Promise<InsightsDash> {
  const resposta = await fetch(`${API_URL}/insights`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar insights da API");
  }

  return resposta.json();
}

export type EmpresaDoDia = {
  ticker: string;
  empresa: string | null;
  setor: string | null;
  preco?: number | string | null;
  pl?: number | string | null;
  roe?: number | string | null;
  margem_liquida?: number | string | null;
  dividend_yield?: number | string | null;
  divida_liquida_ebitda?: number | string | null;
  classificacao: string | null;
  categoria_dia: string;
  motivo: string;
  descricao_motivo: string;
};

export async function buscarEmpresasDoDia(): Promise<EmpresaDoDia[]> {
  const resposta = await fetch(`${API_URL}/empresas-do-dia`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar empresas do dia da API");
  }

  return resposta.json();
}
