-- Estrutura da tabela principal do projeto Radar Fundamentalista

CREATE TABLE empresas_fundamentalistas (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    setor VARCHAR(100),
    preco NUMERIC(10,2),
    pl NUMERIC(10,2),
    roe NUMERIC(10,2),
    roic NUMERIC(10,2),
    margem_liquida NUMERIC(10,2),
    dividend_yield NUMERIC(10,2),
    divida_liquida_ebitda NUMERIC(10,2),
    liquidez_corrente NUMERIC(10,2),
    classificacao VARCHAR(50)
);
