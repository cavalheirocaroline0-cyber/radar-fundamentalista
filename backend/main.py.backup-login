import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI(title="Radar Fundamentalista API")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "online",
        "produto": "Radar Fundamentalista",
        "mensagem": "API funcionando"
    }

@app.get("/empresas")
def listar_empresas():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM empresas_fundamentalistas
        LIMIT 100;
    """)

    empresas = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total": len(empresas),
        "empresas": empresas
    }

@app.get("/ranking")
def ranking_empresas():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            preco,
            pl,
            pvp,
            roe,
            margem_liquida,
            dividend_yield,
            liquidez_2_meses,
            score,
            fonte,
            data_coleta
        FROM empresas_fundamentalistas
        ORDER BY score DESC NULLS LAST, roe DESC NULLS LAST
        LIMIT 20;
    """)

    ranking = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total": len(ranking),
        "ranking": ranking
    }

@app.get("/macro")
def listar_macro():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT DISTINCT ON (indicador)
            indicador,
            descricao,
            data_referencia,
            valor,
            unidade,
            fonte
        FROM indicadores_macro
        ORDER BY indicador, data_referencia DESC, criado_em DESC;
    """)

    indicadores = cur.fetchall()

    cur.execute("""
        SELECT DISTINCT ON (ativo)
            ativo,
            data_referencia,
            preco_brl,
            preco_usd,
            variacao_24h,
            fonte
        FROM ativos_mercado
        ORDER BY ativo, data_referencia DESC, criado_em DESC;
    """)

    ativos = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total_indicadores": len(indicadores),
        "total_ativos": len(ativos),
        "indicadores": indicadores,
        "ativos": ativos
    }

from fastapi import HTTPException

@app.get("/empresas/{ticker}")
def buscar_empresa(ticker: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM empresas_fundamentalistas
        WHERE UPPER(ticker) = UPPER(%s)
        LIMIT 1;
    """, (ticker,))

    empresa = cur.fetchone()

    cur.close()
    conn.close()

    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    return {
        "empresa": empresa
    }

from typing import Optional
from pydantic import BaseModel


class CadastroBeta(BaseModel):
    nome: str
    email: str
    perfil: Optional[str] = None
    investe_hoje: Optional[str] = None
    interesse: Optional[str] = None


class FeedbackBeta(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    nota: Optional[int] = None
    facilidade: Optional[str] = None
    utilidade: Optional[str] = None
    pagaria: Optional[str] = None
    valor_sugerido: Optional[str] = None
    comentario: Optional[str] = None


@app.post("/beta")
def cadastrar_beta(dados: CadastroBeta):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO cadastros_beta (
            nome,
            email,
            perfil,
            investe_hoje,
            interesse
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        dados.nome,
        dados.email,
        dados.perfil,
        dados.investe_hoje,
        dados.interesse
    ))

    cadastro = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": "sucesso",
        "mensagem": "Cadastro beta recebido",
        "id": cadastro["id"]
    }


@app.post("/feedback")
def enviar_feedback(dados: FeedbackBeta):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO feedback_beta (
            nome,
            email,
            nota,
            facilidade,
            utilidade,
            pagaria,
            valor_sugerido,
            comentario
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        dados.nome,
        dados.email,
        dados.nota,
        dados.facilidade,
        dados.utilidade,
        dados.pagaria,
        dados.valor_sugerido,
        dados.comentario
    ))

    feedback = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": "sucesso",
        "mensagem": "Feedback recebido",
        "id": feedback["id"]
    }


@app.get("/insights")
def listar_insights():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            COALESCE(classificacao, 'A classificar') AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        GROUP BY COALESCE(classificacao, 'A classificar')
        ORDER BY valor DESC;
    """)
    por_classificacao = cur.fetchall()

    cur.execute("""
        SELECT
            COALESCE(NULLIF(setor, ''), 'A classificar') AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        GROUP BY COALESCE(NULLIF(setor, ''), 'A classificar')
        ORDER BY valor DESC;
    """)
    por_setor = cur.fetchall()

    cur.execute("""
        SELECT
            CASE
                WHEN score >= 80 THEN '80+ Destaque'
                WHEN score >= 65 THEN '65 a 79 Forte'
                WHEN score >= 50 THEN '50 a 64 Neutra'
                WHEN score >= 35 THEN '35 a 49 Atenção'
                ELSE 'Abaixo de 35'
            END AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        WHERE score IS NOT NULL
        GROUP BY
            CASE
                WHEN score >= 80 THEN '80+ Destaque'
                WHEN score >= 65 THEN '65 a 79 Forte'
                WHEN score >= 50 THEN '50 a 64 Neutra'
                WHEN score >= 35 THEN '35 a 49 Atenção'
                ELSE 'Abaixo de 35'
            END
        ORDER BY valor DESC;
    """)
    distribuicao_score = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            score,
            roe,
            dividend_yield,
            pl,
            pvp
        FROM empresas_fundamentalistas
        ORDER BY score DESC NULLS LAST
        LIMIT 10;
    """)
    top_score = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            dividend_yield,
            score,
            roe,
            pl
        FROM empresas_fundamentalistas
        WHERE dividend_yield IS NOT NULL
        ORDER BY dividend_yield DESC
        LIMIT 10;
    """)
    top_dividend_yield = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            roe,
            score,
            dividend_yield,
            pl
        FROM empresas_fundamentalistas
        WHERE roe IS NOT NULL
        ORDER BY roe DESC
        LIMIT 10;
    """)
    top_roe = cur.fetchall()

    cur.execute("""
        SELECT
            COUNT(*) AS total_empresas,
            ROUND(AVG(score)::numeric, 2) AS media_score,
            ROUND(AVG(roe)::numeric, 2) AS media_roe,
            ROUND(AVG(dividend_yield)::numeric, 2) AS media_dy,
            ROUND(AVG(pl)::numeric, 2) AS media_pl,
            ROUND(AVG(pvp)::numeric, 2) AS media_pvp
        FROM empresas_fundamentalistas;
    """)
    medias = cur.fetchone()

    cur.close()
    conn.close()

    return {
        "por_classificacao": por_classificacao,
        "por_setor": por_setor,
        "distribuicao_score": distribuicao_score,
        "top_score": top_score,
        "top_dividend_yield": top_dividend_yield,
        "top_roe": top_roe,
        "medias": medias,
    }


@app.get("/empresas-do-dia")
def listar_empresas_do_dia():
    """
    Retorna 3 empresas em destaque para a Home do Dash Diário.

    Critérios iniciais:
    1. Maior Dividend Yield
    2. Maior ROE
    3. Maior endividamento como alerta de risco
    """

    from decimal import Decimal

    def normalizar_linha(linha):
        dados = dict(linha)

        for chave, valor in dados.items():
            if isinstance(valor, Decimal):
                dados[chave] = float(valor)

        return dados

    conn = get_connection()
    cur = conn.cursor()

    empresas = []
    tickers_usados = set()

    criterios = [
        {
            "categoria": "Dividendos",
            "motivo": "Destaque em Dividend Yield",
            "descricao": "Empresa com Dividend Yield relevante dentro da base monitorada.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE dividend_yield IS NOT NULL
                ORDER BY dividend_yield DESC
                LIMIT 1;
            """,
        },
        {
            "categoria": "Rentabilidade",
            "motivo": "ROE forte na comparação",
            "descricao": "Empresa com rentabilidade sobre o patrimônio em destaque.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE roe IS NOT NULL
                ORDER BY roe DESC
                LIMIT 1;
            """,
        },
        {
            "categoria": "Alerta",
            "motivo": "Atenção ao endividamento",
            "descricao": "Empresa com maior Dívida Líquida/EBITDA dentro da base monitorada.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE divida_liquida_ebitda IS NOT NULL
                ORDER BY divida_liquida_ebitda DESC
                LIMIT 1;
            """,
        },
    ]

    try:
        for criterio in criterios:
            cur.execute(criterio["sql"])
            linha = cur.fetchone()

            if not linha:
                continue

            empresa = normalizar_linha(linha)
            ticker = empresa.get("ticker")

            if ticker in tickers_usados:
                continue

            empresa["categoria_dia"] = criterio["categoria"]
            empresa["motivo"] = criterio["motivo"]
            empresa["descricao_motivo"] = criterio["descricao"]

            empresas.append(empresa)
            tickers_usados.add(ticker)

        if len(empresas) < 3:
            cur.execute("""
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                ORDER BY roe DESC NULLS LAST, dividend_yield DESC NULLS LAST
                LIMIT 10;
            """)

            extras = cur.fetchall()

            for linha in extras:
                empresa = normalizar_linha(linha)
                ticker = empresa.get("ticker")

                if ticker in tickers_usados:
                    continue

                empresa["categoria_dia"] = "Destaque"
                empresa["motivo"] = "Empresa em destaque no ranking"
                empresa["descricao_motivo"] = "Empresa selecionada para completar os destaques do dia."

                empresas.append(empresa)
                tickers_usados.add(ticker)

                if len(empresas) == 3:
                    break

        return empresas

    finally:
        cur.close()
        conn.close()
