# -*- coding: utf-8 -*-

import os
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
        CREATE TABLE IF NOT EXISTS indicadores_macro (
            id SERIAL PRIMARY KEY,
            indicador TEXT NOT NULL,
            descricao TEXT,
            data_referencia DATE NOT NULL,
            valor NUMERIC,
            unidade TEXT,
            fonte TEXT,
            criado_em TIMESTAMP DEFAULT NOW(),
            UNIQUE (indicador, data_referencia)
        );
    """))


def buscar_ipca_ibge():
    url = (
        "https://servicodados.ibge.gov.br/api/v3/agregados/1737/"
        "periodos/-1/variaveis/63?localidades=N1[all]"
    )

    resposta = requests.get(url, timeout=30)
    resposta.raise_for_status()

    dados = resposta.json()

    resultado = dados[0]["resultados"][0]["series"][0]
    periodo = list(resultado["serie"].keys())[0]
    valor_texto = list(resultado["serie"].values())[0]

    ano = int(periodo[:4])
    mes = int(periodo[4:6])

    data_referencia = f"{ano}-{mes:02d}-01"
    valor = Decimal(str(valor_texto).replace(",", "."))

    return data_referencia, valor


def salvar_ipca(conn, data_referencia, valor):
    conn.execute(text("""
        INSERT INTO indicadores_macro (
            indicador,
            descricao,
            data_referencia,
            valor,
            unidade,
            fonte
        )
        VALUES (
            :indicador,
            :descricao,
            :data_referencia,
            :valor,
            :unidade,
            :fonte
        )
        ON CONFLICT (indicador, data_referencia)
        DO UPDATE SET
            valor = EXCLUDED.valor,
            descricao = EXCLUDED.descricao,
            unidade = EXCLUDED.unidade,
            fonte = EXCLUDED.fonte;
    """), {
        "indicador": "ipca_mensal",
        "descricao": "IPCA mensal - variação no mês",
        "data_referencia": data_referencia,
        "valor": valor,
        "unidade": "%",
        "fonte": "IBGE - SIDRA tabela 1737",
    })


def main():
    print("Coletando IPCA via IBGE...")

    data_referencia, valor = buscar_ipca_ibge()

    engine = create_engine(DATABASE_URL)

    with engine.begin() as conn:
        criar_tabela_se_nao_existir(conn)
        salvar_ipca(conn, data_referencia, valor)

    print(f"IPCA mensal: {valor}% em {data_referencia}")
    print("IPCA atualizado com sucesso.")


if __name__ == "__main__":
    main()
