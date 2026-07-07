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


SERIES_BCB = {
    "dolar_venda": {
        "codigo": 1,
        "descricao": "Dólar americano venda diário",
        "unidade": "BRL",
    },
    "selic_diaria": {
        "codigo": 11,
        "descricao": "Taxa Selic diária",
        "unidade": "%",
    },
}


def buscar_ultimo_valor_bcb(codigo_serie):
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo_serie}/dados/ultimos/1?formato=json"
    resposta = requests.get(url, timeout=30)
    resposta.raise_for_status()

    dados = resposta.json()

    if not dados:
        return None

    item = dados[0]

    data_referencia = datetime.strptime(item["data"], "%d/%m/%Y").date()
    valor = Decimal(str(item["valor"]).replace(",", "."))

    return data_referencia, valor


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


def salvar_indicador(conn, indicador, descricao, data_referencia, valor, unidade):
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
        "indicador": indicador,
        "descricao": descricao,
        "data_referencia": data_referencia,
        "valor": valor,
        "unidade": unidade,
        "fonte": "Banco Central do Brasil - SGS/BCData",
    })


def main():
    print("Coletando indicadores macro do Banco Central...")

    engine = create_engine(DATABASE_URL)

    with engine.begin() as conn:
        criar_tabela_se_nao_existir(conn)

        for indicador, config in SERIES_BCB.items():
            resultado = buscar_ultimo_valor_bcb(config["codigo"])

            if resultado is None:
                print(f"Nenhum dado encontrado para {indicador}")
                continue

            data_referencia, valor = resultado

            salvar_indicador(
                conn=conn,
                indicador=indicador,
                descricao=config["descricao"],
                data_referencia=data_referencia,
                valor=valor,
                unidade=config["unidade"],
            )

            print(f"{indicador}: {valor} em {data_referencia}")

    print("Indicadores macro atualizados com sucesso.")


if __name__ == "__main__":
    main()
