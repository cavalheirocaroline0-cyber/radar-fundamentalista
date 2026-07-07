# -*- coding: utf-8 -*-
import os
from io import StringIO
from datetime import date

import pandas as pd
import requests
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada. Confira o arquivo .env.")


URL = "https://www.fundamentus.com.br/resultado.php"

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}


def limpar_numero(valor):
    if pd.isna(valor):
        return None

    if isinstance(valor, (int, float)):
        return float(valor)

    texto = str(valor).strip()

    if texto in ["", "-", "nan", "None"]:
        return None

    texto = texto.replace("%", "")
    texto = texto.replace(".", "")
    texto = texto.replace(",", ".")

    try:
        return float(texto)
    except ValueError:
        return None


def classificar_empresa(linha):
    roe = limpar_numero(linha.get("ROE"))
    margem = limpar_numero(linha.get("Mrg. Líq."))
    pl = limpar_numero(linha.get("P/L"))
    dividend_yield = limpar_numero(linha.get("Div.Yield"))
    divida_bruta_patrimonio = limpar_numero(linha.get("Dív.Brut/ Patrim."))

    score = 50

    if roe is not None:
        if roe > 15:
            score  = 20
        elif roe > 8:
            score += 10
        elif roe < 0:
            score -= 25

    if margem is not None:
        if margem > 10:
            score += 15
        elif margem < 0:
            score -= 20

    if pl is not None:
        if 3 <= pl <= 15:
            score += 15
        elif pl > 30:
            score -= 10
        elif pl < 0:
            score -= 15

    if dividend_yield is not None:
        if dividend_yield >= 5:
            score += 10

    if divida_bruta_patrimonio is not None:
        if divida_bruta_patrimonio < 1:
            score += 10
        elif divida_bruta_patrimonio > 3:
            score -= 20

    if score >= 75:
        classificacao = "Forte"
    elif score >= 60:
        classificacao = "Oportunidade"
    elif score >= 45:
        classificacao = "Neutra"
    elif score >= 30:
        classificacao = "Atenção"
    else:
        classificacao = "Risco elevado"

    return score, classificacao


def coletar_dados_fundamentus():
    resposta = requests.get(URL, headers=HEADERS, timeout=30)
    resposta.raise_for_status()

    tabelas = pd.read_html(StringIO(resposta.text), decimal=",", thousands=".")
    df = tabelas[0]

    df.columns = [str(col).strip() for col in df.columns]

    if "Liq.2meses" in df.columns:
        df = df.sort_values("Liq.2meses", ascending=False)

    df = df.head(50).copy()

    registros = []

    for _, linha in df.iterrows():
        score, classificacao = classificar_empresa(linha)

        ticker = str(linha.get("Papel")).strip().upper()

        registros.append(
            {
                "ticker": ticker,
                "empresa": ticker,
                "setor": "A classificar",
                "classificacao": classificacao,
                "preco": limpar_numero(linha.get("Cotação")),
                "pl": limpar_numero(linha.get("P/L")),
                "pvp": limpar_numero(linha.get("P/VP")),
                "roe": limpar_numero(linha.get("ROE")),
                "margem_liquida": limpar_numero(linha.get("Mrg. Líq.")),
                "divida_liquida_ebitda": None,
                "divida_bruta_patrimonio": limpar_numero(linha.get("Dív.Brut/ Patrim.")),
                "dividend_yield": limpar_numero(linha.get("Div.Yield")),
                "liquidez_2_meses": limpar_numero(linha.get("Liq.2meses")),
                "score": score,
                "fonte": "Fundamentus",
                "data_coleta": date.today(),
            }
        )

    return pd.DataFrame(registros)


def salvar_no_neon(df):
    engine = create_engine(DATABASE_URL)
    data_coleta = df["data_coleta"].iloc[0]

    with engine.begin() as conn:
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_empresas_ticker
            ON empresas(ticker);
        """))

        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_indicadores_ticker_data
            ON indicadores_fundamentalistas(ticker, data_coleta);
        """))

        conn.execute(
            text("DELETE FROM historico_fundamentalista WHERE data_coleta = :data_coleta"),
            {"data_coleta": data_coleta},
        )

        df.to_sql(
            "empresas_fundamentalistas",
            con=conn,
            if_exists="replace",
            index=False,
        )

        df.to_sql(
            "historico_fundamentalista",
            con=conn,
            if_exists="append",
            index=False,
        )

        conn.execute(text("""
            INSERT INTO empresas (
                ticker,
                empresa,
                setor,
                ativo,
                fonte
            )
            SELECT DISTINCT
                ticker,
                empresa,
                setor,
                TRUE AS ativo,
                fonte
            FROM empresas_fundamentalistas
            ON CONFLICT (ticker)
            DO UPDATE SET
                empresa = EXCLUDED.empresa,
                setor = EXCLUDED.setor,
                ativo = EXCLUDED.ativo,
                fonte = EXCLUDED.fonte;
        """))

        conn.execute(text("""
            INSERT INTO indicadores_fundamentalistas (
                ticker,
                data_coleta,
                preco,
                pl,
                pvp,
                roe,
                margem_liquida,
                dividend_yield,
                divida_liquida_ebitda,
                liquidez_corrente,
                valor_mercado,
                classificacao,
                score,
                fonte
            )
            SELECT
                ticker,
                data_coleta,
                preco,
                pl,
                pvp,
                roe,
                margem_liquida,
                dividend_yield,
                NULL AS divida_liquida_ebitda,
                NULL AS liquidez_corrente,
                NULL AS valor_mercado,
                classificacao,
                score,
                fonte
            FROM empresas_fundamentalistas
            ON CONFLICT (ticker, data_coleta)
            DO UPDATE SET
                preco = EXCLUDED.preco,
                pl = EXCLUDED.pl,
                pvp = EXCLUDED.pvp,
                roe = EXCLUDED.roe,
                margem_liquida = EXCLUDED.margem_liquida,
                dividend_yield = EXCLUDED.dividend_yield,
                classificacao = EXCLUDED.classificacao,
                score = EXCLUDED.score,
                fonte = EXCLUDED.fonte;
        """))


def main():
    print("Coletando dados do Fundamentus...")
    df = coletar_dados_fundamentus()

    print(f"Empresas coletadas: {len(df)}")
    print(df[["ticker", "preco", "pl", "pvp", "roe", "dividend_yield", "classificacao"]].head(10))

    print("Salvando no Neon...")
    salvar_no_neon(df)

    print("Atualização concluída com sucesso.")


if __name__ == "__main__":
    main()
