-- Consultas para alimentar o dashboard do projeto Radar Fundamentalista

-- 1. Total de empresas analisadas
SELECT COUNT(*) AS total_empresas
FROM empresas_fundamentalistas;

-- 2. Total de setores
SELECT COUNT(DISTINCT setor) AS total_setores
FROM empresas_fundamentalistas;

-- 3. Quantidade de empresas por classificação
SELECT classificacao, COUNT(*) AS quantidade
FROM empresas_fundamentalistas
GROUP BY classificacao
ORDER BY quantidade DESC;

-- 4. Quantidade de empresas por setor
SELECT setor, COUNT(*) AS quantidade_empresas
FROM empresas_fundamentalistas
GROUP BY setor
ORDER BY quantidade_empresas DESC;

-- 5. Ranking de empresas por ROE
SELECT ticker, empresa, setor, roe, classificacao
FROM empresas_fundamentalistas
ORDER BY roe DESC;

-- 6. Ranking de empresas por Dividend Yield
SELECT ticker, empresa, setor, dividend_yield, classificacao
FROM empresas_fundamentalistas
ORDER BY dividend_yield DESC;

-- 7. Ranking de empresas por margem líquida
SELECT ticker, empresa, setor, margem_liquida, classificacao
FROM empresas_fundamentalistas
ORDER BY margem_liquida DESC;

-- 8. Empresas com maior endividamento
SELECT ticker, empresa, setor, divida_liquida_ebitda, classificacao
FROM empresas_fundamentalistas
ORDER BY divida_liquida_ebitda DESC;

-- 9. Empresas classificadas como Forte
SELECT ticker, empresa, setor, roe, roic, margem_liquida, dividend_yield
FROM empresas_fundamentalistas
WHERE classificacao = 'Forte'
ORDER BY roe DESC;

-- 10. Empresas classificadas como Risco
SELECT ticker, empresa, setor, roe, roic, margem_liquida, divida_liquida_ebitda
FROM empresas_fundamentalistas
WHERE classificacao = 'Risco'
ORDER BY roe ASC;

-- 11. Tabela analítica completa
SELECT 
    ticker,
    empresa,
    setor,
    preco,
    pl,
    roe,
    roic,
    margem_liquida,
    dividend_yield,
    divida_liquida_ebitda,
    liquidez_corrente,
    classificacao
FROM empresas_fundamentalistas
ORDER BY setor, empresa;
