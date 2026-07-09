from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI(title="Radar Fundamentalista API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
        LIMIT 50;
    """)

    empresas = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total": len(empresas),
        "empresas": empresas
    }
