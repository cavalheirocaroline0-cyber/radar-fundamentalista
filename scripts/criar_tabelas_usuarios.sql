-- Tabelas de usuários e favoritos do Dash Diário
-- Banco correto: Neon do Dash/Radar Fundamentalista

CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    plano VARCHAR(30) DEFAULT 'gratuito',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.favoritos_empresas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    ticker VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, ticker)
);

CREATE TABLE IF NOT EXISTS public.preferencias_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
    interesses TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email
ON public.usuarios(email);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario
ON public.favoritos_empresas(usuario_id);

CREATE INDEX IF NOT EXISTS idx_favoritos_ticker
ON public.favoritos_empresas(ticker);

CREATE TABLE IF NOT EXISTS public.recuperacao_senha (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    usado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recuperacao_senha_usuario
ON public.recuperacao_senha(usuario_id);

CREATE INDEX IF NOT EXISTS idx_recuperacao_senha_token
ON public.recuperacao_senha(token_hash);

CREATE TABLE IF NOT EXISTS public.recuperacao_senha (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    usado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recuperacao_senha_usuario
ON public.recuperacao_senha(usuario_id);

CREATE INDEX IF NOT EXISTS idx_recuperacao_senha_token
ON public.recuperacao_senha(token_hash);
