# -*- coding: utf-8 -*-

import os
from datetime import datetime
from decimal import Decimal

import requests
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv(dotenv_path=".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada. Confira o arquivo .env.")


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


def buscar_bitcoin():
    url = (
        "https://api.coingecko.com/api/v3/simple/price"
        "?ids=bitcoin"
        "&vs_currencies=brl,usd"
        "&include_24hr_change=true"
        "&include_last_updated_at=true"
    )

    resposta = requests.get(
        url,
        headers={"accept": "application/json"},
        timeout=30
    )
    resposta.raise_for_status()

    dados = resposta.json()["bitcoin"]

    preco_brl = Decimal(str(dados["brl"]))
    preco_usd = Decimal(str(dados["usd"]))
    variacao_24h = Decimal(str(dados.get("brl_24h_change", 0)))

    data_referencia = datetime.fromtimestamp(
        dados["last_updated_at"]
    ).date()

    return data_referencia, preco_brl, preco_usd, variacao_24h


def salvar_bitcoin(conn, data_referencia, preco_brl, preco_usd, variacao_24h):
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
        "ativo": "bitcoin",
        "data_referencia": data_referencia,
        "preco_brl": preco_brl,
        "preco_usd": preco_usd,
        "variacao_24h": variacao_24h,
        "fonte": "CoinGecko",
    })


def main():
    print("Coletando Bitcoin via CoinGecko...")

    data_referencia, preco_brl, preco_usd, variacao_24h = buscar_bitcoin()

    engine = create_engine(DATABASE_URL)

    with engine.begin() as conn:
        criar_tabela_se_nao_existir(conn)
        salvar_bitcoin(
            conn,
            data_referencia,
            preco_brl,
            preco_usd,
            variacao_24h
        )

    print(f"Bitcoin BRL: {preco_brl}")
    print(f"Bitcoin USD: {preco_usd}")
    print(f"Variação 24h BRL: {variacao_24h}")
    print(f"Data referência: {data_referencia}")
    print("Bitcoin atualizado com sucesso.")


if __name__ == "__main__":
    main()
