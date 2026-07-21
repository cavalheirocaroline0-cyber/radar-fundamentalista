import os
import psycopg2

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL não encontrada. Rode este script com a variável do banco configurada.")

sql = """
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS plano TEXT DEFAULT 'gratuito',
ADD COLUMN IF NOT EXISTS status_assinatura TEXT DEFAULT 'gratuito',
ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS assinatura_atualizada_em TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS asaas_webhook_eventos (
    id SERIAL PRIMARY KEY,
    event_id TEXT UNIQUE,
    event_type TEXT,
    payment_id TEXT,
    customer_id TEXT,
    subscription_id TEXT,
    raw_payload JSONB,
    usuarios_atualizados INTEGER DEFAULT 0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
"""

conn = psycopg2.connect(DATABASE_URL)

try:
    with conn:
        with conn.cursor() as cur:
            cur.execute(sql)

    print("Estrutura de assinaturas criada/atualizada com sucesso.")
finally:
    conn.close()
