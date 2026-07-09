from database import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS cadastros_beta (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    perfil TEXT,
    investe_hoje TEXT,
    interesse TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS feedback_beta (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    email TEXT,
    nota INTEGER,
    facilidade TEXT,
    utilidade TEXT,
    pagaria TEXT,
    valor_sugerido TEXT,
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

conn.commit()
cur.close()
conn.close()

print("Tabelas beta criadas com sucesso.")
