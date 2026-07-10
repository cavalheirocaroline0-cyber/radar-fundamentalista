-- DASH DIÁRIO — CONSULTAS DE INSIGHTS

-- 1. Empresas por classificação
SELECT
    COALESCE(classificacao, 'A classificar') AS label,
    COUNT(*) AS valor
FROM empresas_fundamentalistas
GROUP BY COALESCE(classificacao, 'A classificar')
ORDER BY valor DESC;


-- 2. Empresas por setor
SELECT
    COALESCE(NULLIF(setor, ''), 'A classificar') AS label,
    COUNT(*) AS valor
FROM empresas_fundamentalistas
GROUP BY COALESCE(NULLIF(setor, ''), 'A classificar')
ORDER BY valor DESC;


-- 3. Distribuição por score
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


-- 4. Top empresas por score
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


-- 5. Top dividend yield
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


-- 6. Top ROE
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


-- 7. Médias gerais da base
SELECT
    COUNT(*) AS total_empresas,
    ROUND(AVG(score)::numeric, 2) AS media_score,
    ROUND(AVG(roe)::numeric, 2) AS media_roe,
    ROUND(AVG(dividend_yield)::numeric, 2) AS media_dy,
    ROUND(AVG(pl)::numeric, 2) AS media_pl,
    ROUND(AVG(pvp)::numeric, 2) AS media_pvp
FROM empresas_fundamentalistas;
