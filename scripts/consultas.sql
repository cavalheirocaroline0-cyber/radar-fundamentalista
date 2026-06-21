-- Consultas iniciais do projeto Radar Fundamentalista

-- Ver todas as empresas cadastradas
SELECT *
FROM empresas_fundamentalistas;

-- Quantidade de empresas por setor
SELECT setor, COUNT(*) AS quantidade_empresas
FROM empresas_fundamentalistas
GROUP BY setor
ORDER BY quantidade_empresas DESC;

-- Empresas com maior ROE
SELECT ticker, empresa, setor, roe
FROM empresas_fundamentalistas
ORDER BY roe DESC;

-- Empresas com maior Dividend Yield
SELECT ticker, empresa, setor, dividend_yield
FROM empresas_fundamentalistas
ORDER BY dividend_yield DESC;

-- Empresas com maior margem líquida
SELECT ticker, empresa, setor, margem_liquida
FROM empresas_fundamentalistas
ORDER BY margem_liquida DESC;

-- Empresas classificadas como Forte
SELECT ticker, empresa, setor, classificacao
FROM empresas_fundamentalistas
WHERE classificacao = 'Forte';
