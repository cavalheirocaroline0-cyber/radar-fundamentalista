# -*- coding: utf-8 -*-

import os
from datetime import datetime, timezone
from decimal import Decimal

import requests
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv(dotenv_path=".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada. Confira o arquivo .env.")


ATIVOS = {
    "ouro": "GC=F",
    "prata": "SI=F",
}


def criar_tabela_se_nao_existir(conn):
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS ativos_mercado (
            id SERIAL PRIMARY KEY,
            ativo TEXT NOT NULL,
            data_referencia DATE NOT NULL,
            preco_brl NUMERIC,
            preco_usd NUMERIC,
            variacao_24h NUMERIC,
            fonte TEXT,
            criado_em TIMESTAMP DEFAULT NOW(),
            UNIQUE (ativo, data_referencia)
        );
    """))


def buscar_dolar_mais_recente(conn):
    resultado = conn.execute(text("""
        SELECT valor
        FROM indicadores_macro
        WHERE indicador = 'dolar_venda'
        ORDER BY data_referencia DESC
        LIMIT 1;
    """)).scalar()

    if resultado is None:
        return None

    return Decimal(str(resultado))


def buscar_ativo_yahoo(nome_ativo, simbolo):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{simbolo}"

    params = {
        "range": "5d",
        "interval": "1d",
    }

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    resposta = requests.get(url, params=params, headers=headers, timeout=30)
    resposta.raise_for_status()

    dados = resposta.json()

    resultado = dados["chart"]["result"][0]
    timestamps = resultado["timestamp"]
    closes = resultado["indicators"]["quote"][0]["close"]

    ultimo_timestamp = None
    ultimo_preco = None

    for timestamp, preco in zip(timestamps, closes):
        if preco is not None:
            ultimo_timestamp = timestamp
            ultimo_preco = preco

    if ultimo_timestamp is None or ultimo_preco is None:
        raise ValueError(f"Nenhum preço válido encontrado para {nome_ativo}.")

    data_referencia = datetime.fromtimestamp(
        ultimo_timestamp,
        tz=timezone.utc
    ).date()

    return {
        "ativo": nome_ativo,
        "data_referencia": data_referencia,
        "preco_usd": Decimal(str(round(ultimo_preco, 4))),
        "fonte": f"Yahoo Finance - {simbolo}",
    }


def buscar_metais_yahoo():
    resultados = []

    for nome_ativo, simbolo in ATIVOS.items():
        resultados.append(buscar_ativo_yahoo(nome_ativo, simbolo))

    return resultados


def salvar_metais(conn, metais, dolar):
    for metal in metais:
        preco_brl = None

        if dolar is not None:
            preco_brl = metal["preco_usd"] * dolar

        conn.execute(text("""
            INSERT INTO ativos_mercado (
                ativo,
                data_referencia,
                preco_brl,
                preco_usd,
                variacao_24h,
                fonte
            )
            VALUES (
                :ativo,
                :data_referencia,
                :preco_brl,
                :preco_usd,
                :variacao_24h,
                :fonte
            )
            ON CONFLICT (ativo, data_referencia)
            DO UPDATE SET
                preco_brl = EXCLUDED.preco_brl,
                preco_usd = EXCLUDED.preco_usd,
                variacao_24h = EXCLUDED.variacao_24h,
                fonte = EXCLUDED.fonte;
        """), {
            "ativo": metal["ativo"],
            "data_referencia": metal["data_referencia"],
            "preco_brl": preco_brl,
            "preco_usd": metal["preco_usd"],
            "variacao_24h": None,
            "fonte": metal["fonte"],
        })


def main():
    print("Coletando ouro e prata via Yahoo Finance...")

    engine = create_engine(DATABASE_URL)

    metais = buscar_metais_yahoo()

    with engine.begin() as conn:
        criar_tabela_se_nao_existir(conn)
        dolar = buscar_dolar_mais_recente(conn)
        salvar_metais(conn, metais, dolar)

    for metal in metais:
        print(
            f"{metal['ativo']}: US$ {metal['preco_usd']} "
            f"em {metal['data_referencia']}"
        )

    print("Ouro e prata atualizados com sucesso.")


if __name__ == "__main__":
    main()
