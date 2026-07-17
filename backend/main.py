import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI(title="Radar Fundamentalista API")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
        LIMIT 100;
    """)

    empresas = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total": len(empresas),
        "empresas": empresas
    }

@app.get("/ranking")
def ranking_empresas():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            preco,
            pl,
            pvp,
            roe,
            margem_liquida,
            dividend_yield,
            liquidez_2_meses,
            score,
            fonte,
            data_coleta
        FROM empresas_fundamentalistas
        ORDER BY score DESC NULLS LAST, roe DESC NULLS LAST
        LIMIT 20;
    """)

    ranking = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total": len(ranking),
        "ranking": ranking
    }

@app.get("/macro")
def listar_macro():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT DISTINCT ON (indicador)
            indicador,
            descricao,
            data_referencia,
            valor,
            unidade,
            fonte
        FROM indicadores_macro
        ORDER BY indicador, data_referencia DESC, criado_em DESC;
    """)

    indicadores = cur.fetchall()

    cur.execute("""
        SELECT DISTINCT ON (ativo)
            ativo,
            data_referencia,
            preco_brl,
            preco_usd,
            variacao_24h,
            fonte
        FROM ativos_mercado
        ORDER BY ativo, data_referencia DESC, criado_em DESC;
    """)

    ativos = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "total_indicadores": len(indicadores),
        "total_ativos": len(ativos),
        "indicadores": indicadores,
        "ativos": ativos
    }

from fastapi import HTTPException

@app.get("/empresas/{ticker}")
def buscar_empresa(ticker: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM empresas_fundamentalistas
        WHERE UPPER(ticker) = UPPER(%s)
        LIMIT 1;
    """, (ticker,))

    empresa = cur.fetchone()

    cur.close()
    conn.close()

    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    return {
        "empresa": empresa
    }

from typing import Optional
from pydantic import BaseModel


class CadastroBeta(BaseModel):
    nome: str
    email: str
    perfil: Optional[str] = None
    investe_hoje: Optional[str] = None
    interesse: Optional[str] = None


class FeedbackBeta(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    nota: Optional[int] = None
    facilidade: Optional[str] = None
    utilidade: Optional[str] = None
    pagaria: Optional[str] = None
    valor_sugerido: Optional[str] = None
    comentario: Optional[str] = None


@app.post("/beta")
def cadastrar_beta(dados: CadastroBeta):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO cadastros_beta (
            nome,
            email,
            perfil,
            investe_hoje,
            interesse
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        dados.nome,
        dados.email,
        dados.perfil,
        dados.investe_hoje,
        dados.interesse
    ))

    cadastro = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": "sucesso",
        "mensagem": "Cadastro beta recebido",
        "id": cadastro["id"]
    }


@app.post("/feedback")
def enviar_feedback(dados: FeedbackBeta):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO feedback_beta (
            nome,
            email,
            nota,
            facilidade,
            utilidade,
            pagaria,
            valor_sugerido,
            comentario
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        dados.nome,
        dados.email,
        dados.nota,
        dados.facilidade,
        dados.utilidade,
        dados.pagaria,
        dados.valor_sugerido,
        dados.comentario
    ))

    feedback = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": "sucesso",
        "mensagem": "Feedback recebido",
        "id": feedback["id"]
    }


@app.get("/insights")
def listar_insights():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            COALESCE(classificacao, 'A classificar') AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        GROUP BY COALESCE(classificacao, 'A classificar')
        ORDER BY valor DESC;
    """)
    por_classificacao = cur.fetchall()

    cur.execute("""
        SELECT
            COALESCE(NULLIF(setor, ''), 'A classificar') AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        GROUP BY COALESCE(NULLIF(setor, ''), 'A classificar')
        ORDER BY valor DESC;
    """)
    por_setor = cur.fetchall()

    cur.execute("""
        SELECT
            CASE
                WHEN score >= 80 THEN '80+ Destaque'
                WHEN score >= 65 THEN '65 a 79 Forte'
                WHEN score >= 50 THEN '50 a 64 Neutra'
                WHEN score >= 35 THEN '35 a 49 Atenção'
                ELSE 'Abaixo de 35'
            END AS label,
            COUNT(*) AS valor
        FROM empresas_fundamentalistas
        WHERE score IS NOT NULL
        GROUP BY
            CASE
                WHEN score >= 80 THEN '80+ Destaque'
                WHEN score >= 65 THEN '65 a 79 Forte'
                WHEN score >= 50 THEN '50 a 64 Neutra'
                WHEN score >= 35 THEN '35 a 49 Atenção'
                ELSE 'Abaixo de 35'
            END
        ORDER BY valor DESC;
    """)
    distribuicao_score = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            score,
            roe,
            dividend_yield,
            pl,
            pvp
        FROM empresas_fundamentalistas
        ORDER BY score DESC NULLS LAST
        LIMIT 10;
    """)
    top_score = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            dividend_yield,
            score,
            roe,
            pl
        FROM empresas_fundamentalistas
        WHERE dividend_yield IS NOT NULL
        ORDER BY dividend_yield DESC
        LIMIT 10;
    """)
    top_dividend_yield = cur.fetchall()

    cur.execute("""
        SELECT
            ticker,
            empresa,
            setor,
            classificacao,
            roe,
            score,
            dividend_yield,
            pl
        FROM empresas_fundamentalistas
        WHERE roe IS NOT NULL
        ORDER BY roe DESC
        LIMIT 10;
    """)
    top_roe = cur.fetchall()

    cur.execute("""
        SELECT
            COUNT(*) AS total_empresas,
            ROUND(AVG(score)::numeric, 2) AS media_score,
            ROUND(AVG(roe)::numeric, 2) AS media_roe,
            ROUND(AVG(dividend_yield)::numeric, 2) AS media_dy,
            ROUND(AVG(pl)::numeric, 2) AS media_pl,
            ROUND(AVG(pvp)::numeric, 2) AS media_pvp
        FROM empresas_fundamentalistas;
    """)
    medias = cur.fetchone()

    cur.close()
    conn.close()

    return {
        "por_classificacao": por_classificacao,
        "por_setor": por_setor,
        "distribuicao_score": distribuicao_score,
        "top_score": top_score,
        "top_dividend_yield": top_dividend_yield,
        "top_roe": top_roe,
        "medias": medias,
    }


@app.get("/empresas-do-dia")
def listar_empresas_do_dia():
    """
    Retorna 3 empresas em destaque para a Home do Dash Diário.

    Critérios iniciais:
    1. Maior Dividend Yield
    2. Maior ROE
    3. Maior endividamento como alerta de risco
    """

    from decimal import Decimal

    def normalizar_linha(linha):
        dados = dict(linha)

        for chave, valor in dados.items():
            if isinstance(valor, Decimal):
                dados[chave] = float(valor)

        return dados

    conn = get_connection()
    cur = conn.cursor()

    empresas = []
    tickers_usados = set()

    criterios = [
        {
            "categoria": "Dividendos",
            "motivo": "Destaque em Dividend Yield",
            "descricao": "Empresa com Dividend Yield relevante dentro da base monitorada.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE dividend_yield IS NOT NULL
                ORDER BY dividend_yield DESC
                LIMIT 1;
            """,
        },
        {
            "categoria": "Rentabilidade",
            "motivo": "ROE forte na comparação",
            "descricao": "Empresa com rentabilidade sobre o patrimônio em destaque.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE roe IS NOT NULL
                ORDER BY roe DESC
                LIMIT 1;
            """,
        },
        {
            "categoria": "Alerta",
            "motivo": "Atenção ao endividamento",
            "descricao": "Empresa com maior Dívida Líquida/EBITDA dentro da base monitorada.",
            "sql": """
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                WHERE divida_liquida_ebitda IS NOT NULL
                ORDER BY divida_liquida_ebitda DESC
                LIMIT 1;
            """,
        },
    ]

    try:
        for criterio in criterios:
            cur.execute(criterio["sql"])
            linha = cur.fetchone()

            if not linha:
                continue

            empresa = normalizar_linha(linha)
            ticker = empresa.get("ticker")

            if ticker in tickers_usados:
                continue

            empresa["categoria_dia"] = criterio["categoria"]
            empresa["motivo"] = criterio["motivo"]
            empresa["descricao_motivo"] = criterio["descricao"]

            empresas.append(empresa)
            tickers_usados.add(ticker)

        if len(empresas) < 3:
            cur.execute("""
                SELECT
                    ticker,
                    empresa,
                    setor,
                    preco,
                    pl,
                    roe,
                    margem_liquida,
                    dividend_yield,
                    divida_liquida_ebitda,
                    classificacao
                FROM public.empresas_fundamentalistas
                ORDER BY roe DESC NULLS LAST, dividend_yield DESC NULLS LAST
                LIMIT 10;
            """)

            extras = cur.fetchall()

            for linha in extras:
                empresa = normalizar_linha(linha)
                ticker = empresa.get("ticker")

                if ticker in tickers_usados:
                    continue

                empresa["categoria_dia"] = "Destaque"
                empresa["motivo"] = "Empresa em destaque no ranking"
                empresa["descricao_motivo"] = "Empresa selecionada para completar os destaques do dia."

                empresas.append(empresa)
                tickers_usados.add(ticker)

                if len(empresas) == 3:
                    break

        return empresas

    finally:
        cur.close()
        conn.close()


# =========================
# Usuários, login e favoritos
# =========================

import hashlib
import secrets
from typing import Optional

from fastapi import HTTPException, Header
from pydantic import BaseModel
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CadastroUsuario(BaseModel):
    nome: str
    email: str
    senha: str


class LoginUsuario(BaseModel):
    email: str
    senha: str


class FavoritoEmpresa(BaseModel):
    ticker: str


def criar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verificar_senha(senha: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha, senha_hash)


def criar_token() -> str:
    return secrets.token_urlsafe(32)


def criar_hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def validar_email_simples(email: str) -> str:
    email_limpo = email.strip().lower()

    if "@" not in email_limpo or "." not in email_limpo:
        raise HTTPException(status_code=400, detail="E-mail inválido")

    return email_limpo


def buscar_usuario_por_token(authorization: Optional[str]):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não informado")

    partes = authorization.split(" ")

    if len(partes) != 2 or partes[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    token = partes[1].strip()
    token_hash = criar_hash_token(token)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT
                u.id,
                u.nome,
                u.email,
                u.plano,
                u.criado_em
            FROM public.usuarios u
            INNER JOIN public.sessoes_usuario s
                ON s.usuario_id = u.id
            WHERE s.token_hash = %s
            LIMIT 1;
            """,
            (token_hash,),
        )

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")

        return dict(usuario)

    finally:
        cur.close()
        conn.close()


@app.post("/usuarios/cadastro")
def cadastrar_usuario(dados: CadastroUsuario):
    nome = dados.nome.strip()
    email = validar_email_simples(dados.email)
    senha = dados.senha.strip()

    if len(nome) < 2:
        raise HTTPException(status_code=400, detail="Nome muito curto")

    if len(senha) < 6:
        raise HTTPException(status_code=400, detail="A senha precisa ter pelo menos 6 caracteres")

    senha_hash = criar_hash_senha(senha)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO public.usuarios (
                nome,
                email,
                senha_hash
            )
            VALUES (%s, %s, %s)
            RETURNING id, nome, email, plano, criado_em;
            """,
            (nome, email, senha_hash),
        )

        usuario = dict(cur.fetchone())

        cur.execute(
            """
            INSERT INTO public.preferencias_usuario (
                usuario_id,
                interesses
            )
            VALUES (%s, ARRAY[]::TEXT[])
            ON CONFLICT (usuario_id) DO NOTHING;
            """,
            (usuario["id"],),
        )

        token = criar_token()
        token_hash = criar_hash_token(token)

        cur.execute(
            """
            INSERT INTO public.sessoes_usuario (
                usuario_id,
                token_hash
            )
            VALUES (%s, %s);
            """,
            (usuario["id"], token_hash),
        )

        conn.commit()

        return {
            "status": "sucesso",
            "mensagem": "Usuário cadastrado com sucesso",
            "token": token,
            "usuario": usuario,
        }

    except Exception as erro:
        conn.rollback()

        if "duplicate key" in str(erro).lower() or "usuarios_email_key" in str(erro).lower():
            raise HTTPException(status_code=409, detail="Este e-mail já está cadastrado")

        raise erro

    finally:
        cur.close()
        conn.close()


@app.post("/usuarios/login")
def login_usuario(dados: LoginUsuario):
    email = validar_email_simples(dados.email)
    senha = dados.senha.strip()

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT
                id,
                nome,
                email,
                senha_hash,
                plano,
                criado_em
            FROM public.usuarios
            WHERE email = %s
            LIMIT 1;
            """,
            (email,),
        )

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")

        usuario = dict(usuario)

        if not verificar_senha(senha, usuario["senha_hash"]):
            raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")

        token = criar_token()
        token_hash = criar_hash_token(token)

        cur.execute(
            """
            INSERT INTO public.sessoes_usuario (
                usuario_id,
                token_hash
            )
            VALUES (%s, %s);
            """,
            (usuario["id"], token_hash),
        )

        conn.commit()

        usuario.pop("senha_hash", None)

        return {
            "status": "sucesso",
            "mensagem": "Login realizado com sucesso",
            "token": token,
            "usuario": usuario,
        }

    finally:
        cur.close()
        conn.close()


@app.get("/usuarios/me")
def obter_usuario_logado(authorization: Optional[str] = Header(default=None)):
    usuario = buscar_usuario_por_token(authorization)

    return {
        "usuario": usuario
    }


# =========================
# Recuperação de senha
# =========================

from datetime import datetime, timedelta


class EsqueciSenha(BaseModel):
    email: str


class RedefinirSenha(BaseModel):
    token: str
    nova_senha: str


@app.post("/usuarios/esqueci-senha")
def esqueci_senha(dados: EsqueciSenha):
    email = validar_email_simples(dados.email)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT id, nome, email
            FROM public.usuarios
            WHERE email = %s
            LIMIT 1;
            """,
            (email,),
        )

        usuario = cur.fetchone()

        # Resposta genérica por segurança.
        # Assim ninguém descobre se um e-mail existe ou não.
        if not usuario:
            return {
                "status": "sucesso",
                "mensagem": "Se o e-mail estiver cadastrado, enviaremos instruções de recuperação."
            }

        usuario = dict(usuario)

        token = criar_token()
        token_hash = criar_hash_token(token)
        expira_em = datetime.utcnow() + timedelta(hours=1)

        cur.execute(
            """
            INSERT INTO public.recuperacao_senha (
                usuario_id,
                token_hash,
                expira_em
            )
            VALUES (%s, %s, %s);
            """,
            (usuario["id"], token_hash, expira_em),
        )

        conn.commit()

        # MVP: por enquanto devolvemos o link na resposta para teste.
        # Em produção, esse link deve ser enviado por e-mail.
        link_redefinicao = f"http://localhost:3000/redefinir-senha?token={token}"

        return {
            "status": "sucesso",
            "mensagem": "Link de recuperação gerado com sucesso.",
            "link_redefinicao": link_redefinicao
        }

    finally:
        cur.close()
        conn.close()


@app.post("/usuarios/redefinir-senha")
def redefinir_senha(dados: RedefinirSenha):
    token = dados.token.strip()
    nova_senha = dados.nova_senha.strip()

    if len(nova_senha) < 6:
        raise HTTPException(status_code=400, detail="A nova senha precisa ter pelo menos 6 caracteres")

    token_hash = criar_hash_token(token)
    nova_senha_hash = criar_hash_senha(nova_senha)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT id, usuario_id, usado, expira_em
            FROM public.recuperacao_senha
            WHERE token_hash = %s
            LIMIT 1;
            """,
            (token_hash,),
        )

        recuperacao = cur.fetchone()

        if not recuperacao:
            raise HTTPException(status_code=400, detail="Token inválido")

        recuperacao = dict(recuperacao)

        if recuperacao["usado"]:
            raise HTTPException(status_code=400, detail="Token já utilizado")

        if recuperacao["expira_em"] < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Token expirado")

        cur.execute(
            """
            UPDATE public.usuarios
            SET senha_hash = %s,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = %s;
            """,
            (nova_senha_hash, recuperacao["usuario_id"]),
        )

        cur.execute(
            """
            UPDATE public.recuperacao_senha
            SET usado = TRUE
            WHERE id = %s;
            """,
            (recuperacao["id"],),
        )

        conn.commit()

        return {
            "status": "sucesso",
            "mensagem": "Senha redefinida com sucesso"
        }

    finally:
        cur.close()
        conn.close()


# =========================
# Favoritos / Watchlist
# =========================

from typing import Optional
from fastapi import Header


class FavoritoPayload(BaseModel):
    ticker: str


def obter_usuario_logado_por_header(authorization: Optional[str]):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não informado")

    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    token = authorization.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(status_code=401, detail="Token vazio")

    token_hash = criar_hash_token(token)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT 
                u.id,
                u.nome,
                u.email,
                u.plano
            FROM public.sessoes_usuario s
            JOIN public.usuarios u ON u.id = s.usuario_id
            WHERE s.token_hash = %s
              AND (s.expira_em IS NULL OR s.expira_em > CURRENT_TIMESTAMP)
            LIMIT 1;
            """,
            (token_hash,),
        )

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")

        return dict(usuario)

    finally:
        cur.close()
        conn.close()


@app.get("/favoritos")
def listar_favoritos(authorization: Optional[str] = Header(default=None)):
    usuario = obter_usuario_logado_por_header(authorization)

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT 
                f.ticker,
                e.empresa AS empresa,
                e.setor,
                e.classificacao,
		e.preco,
		e.pl,
		e.pvp,
		e.roe,
		e.dividend_yield
            FROM public.favoritos_empresas f
            LEFT JOIN public.empresas_fundamentalistas e
                ON UPPER(e.ticker) = UPPER(f.ticker)
            WHERE f.usuario_id = %s
            ORDER BY f.id DESC;
            """,
            (usuario["id"],),
        )

        favoritos = [dict(row) for row in cur.fetchall()]

        return {
            "usuario_id": usuario["id"],
            "favoritos": favoritos
        }

    finally:
        cur.close()
        conn.close()


@app.post("/favoritos")
def adicionar_favorito(
    dados: FavoritoPayload,
    authorization: Optional[str] = Header(default=None)
):
    usuario = obter_usuario_logado_por_header(authorization)

    ticker = dados.ticker.strip().upper()

    if not ticker:
        raise HTTPException(status_code=400, detail="Informe um ticker")

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT ticker
            FROM public.empresas_fundamentalistas
            WHERE UPPER(ticker) = UPPER(%s)
            LIMIT 1;
            """,
            (ticker,),
        )

        empresa = cur.fetchone()

        if not empresa:
            raise HTTPException(status_code=404, detail="Empresa não encontrada. Use o ticker, exemplo: PETR4, VALE3, ITUB4.")

        empresa = dict(empresa)
        ticker_correto = empresa["ticker"].upper()

        cur.execute(
            """
            INSERT INTO public.favoritos_empresas (usuario_id, ticker)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
            """,
            (usuario["id"], ticker_correto),
        )

        conn.commit()

        return {
            "status": "sucesso",
            "mensagem": f"{ticker_correto} adicionada à sua watchlist.",
            "ticker": ticker_correto
        }

    finally:
        cur.close()
        conn.close()


@app.delete("/favoritos/{ticker}")
def remover_favorito(
    ticker: str,
    authorization: Optional[str] = Header(default=None)
):
    usuario = obter_usuario_logado_por_header(authorization)

    ticker_normalizado = ticker.strip().upper()

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            DELETE FROM public.favoritos_empresas
            WHERE usuario_id = %s
              AND UPPER(ticker) = UPPER(%s);
            """,
            (usuario["id"], ticker_normalizado),
        )

        conn.commit()

        return {
            "status": "sucesso",
            "mensagem": f"{ticker_normalizado} removida da watchlist."
        }

    finally:
        cur.close()
        conn.close()

# --- Lista Premium Dash Diário ---

from typing import Optional
from pydantic import BaseModel
from fastapi import HTTPException
from sqlalchemy import create_engine, text
import os
import re


class InteressePremiumPayload(BaseModel):
    nome: str
    email: str
    whatsapp: Optional[str] = None


@app.post("/premium/interesse")
def criar_interesse_premium(payload: InteressePremiumPayload):
    nome = payload.nome.strip()
    email = payload.email.strip().lower()
    whatsapp = (payload.whatsapp or "").strip()

    if len(nome) < 2:
        raise HTTPException(status_code=400, detail="Informe seu nome.")

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=400, detail="Informe um e-mail válido.")

    if whatsapp and len(whatsapp) < 8:
        raise HTTPException(status_code=400, detail="Informe um WhatsApp válido.")

    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise HTTPException(status_code=500, detail="DATABASE_URL não configurada.")

    engine = create_engine(database_url)

    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS lista_premium (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                whatsapp TEXT,
                origem TEXT DEFAULT 'pagina_premium',
                status TEXT DEFAULT 'interessado',
                criado_em TIMESTAMP DEFAULT NOW()
            );
        """))

        conn.execute(text("""
            INSERT INTO lista_premium (
                nome,
                email,
                whatsapp,
                origem,
                status
            )
            VALUES (
                :nome,
                :email,
                :whatsapp,
                'pagina_premium',
                'interessado'
            );
        """), {
            "nome": nome,
            "email": email,
            "whatsapp": whatsapp,
        })

    return {
        "mensagem": "Interesse premium registrado com sucesso."
    }
