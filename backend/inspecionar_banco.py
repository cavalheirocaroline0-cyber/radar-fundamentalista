from database import get_connection

conn = get_connection()
cur = conn.cursor()

print("\n=== TABELAS DO BANCO ===\n")

cur.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
""")

tabelas = cur.fetchall()

for tabela in tabelas:
    nome_tabela = tabela["table_name"]
    print(f"\nTABELA: {nome_tabela}")

    cur.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        ORDER BY ordinal_position;
    """, (nome_tabela,))

    colunas = cur.fetchall()

    for coluna in colunas:
        print(f"  - {coluna['column_name']} ({coluna['data_type']})")

cur.close()
conn.close()
