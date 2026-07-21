import os
import json
import urllib.request
from decimal import Decimal
from datetime import datetime

import psycopg2

try:
    from dotenv import load_dotenv
    load_dotenv(".env")
    load_dotenv("../.env")
except Exception:
    pass


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL não encontrada.")


SERIES_BCB = [
    {
        "indicador": "Selic acumulada no mês",
        "descricao": "Taxa Selic acumulada no mês",
        "codigo": 4390,
        "unidade": "% a.m.",
    },
    {
        "indicador": "DI acumulado no mês",
        "descricao": "Taxa DI/CDI acumulada no mês",
        "codigo": 4391,
        "unidade": "% a.m.",
    },
]


def buscar_bcb(codigo):
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados/ultimos/1?formato=json"

    with urllib.request.urlopen(url, timeout=30) as response:
        dados = json.loads(response.read().decode("utf-8"))

    if not dados:
        raise RuntimeError(f"Nenhum dado retornado pelo BCB para a série {codigo}.")

    item = dados[-1]

    data_referencia = datetime.strptime(item["data"], "%d/%m/%Y").date()
    valor = Decimal(str(item["valor"]).replace(",", "."))

    return data_referencia, valor


conn = psycopg2.connect(DATABASE_URL)

try:
    with conn:
        with conn.cursor() as cur:
            # Remove a Selic antiga diária para não aparecer junto com a nova mensal
            cur.execute("""
                DELETE FROM indicadores_macro
                WHERE LOWER(indicador) IN (
                    'selic',
                    'taxa selic',
                    'selic diária',
                    'selic diaria',
                    'taxa selic diária',
                    'taxa selic diaria'
                );
            """)

            for serie in SERIES_BCB:
                data_referencia, valor = buscar_bcb(serie["codigo"])

                # Evita duplicar o mesmo indicador na mesma data
                cur.execute("""
                    DELETE FROM indicadores_macro
                    WHERE indicador = %s
                    AND data_referencia = %s;
                """, (serie["indicador"], data_referencia))

                cur.execute("""
                    INSERT INTO indicadores_macro (
                        indicador,
                        descricao,
                        data_referencia,
                        valor,
                        unidade,
                        fonte
                    )
                    VALUES (%s, %s, %s, %s, %s, %s);
                """, (
                    serie["indicador"],
                    serie["descricao"],
                    data_referencia,
                    valor,
                    serie["unidade"],
                    f"Banco Central do Brasil - SGS {serie['codigo']}",
                ))

                print(
                    f"{serie['indicador']}: {valor} {serie['unidade']} "
                    f"em {data_referencia}"
                )

    print("Selic mensal e DI mensal atualizados com sucesso.")

finally:
    conn.close()
