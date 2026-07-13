DROP VIEW IF EXISTS vw_tabela_comparativa;

CREATE VIEW vw_tabela_comparativa AS
SELECT
    ticker,
    nome,
    setor,
    classificacao,

    preco_atual,
    pl,
    pvp,
    dy,
    roe,
    margem_liquida,
    divida_liquida_ebitda,
    liquidez_diaria,

    CASE
        WHEN pl IS NOT NULL
         AND pvp IS NOT NULL
         AND roe IS NOT NULL
         AND dy IS NOT NULL
        THEN
            ROUND(
                (
                    COALESCE(roe, 0) * 0.35 +
                    COALESCE(dy, 0) * 0.25 -
                    COALESCE(pl, 0) * 0.15 -
                    COALESCE(pvp, 0) * 0.10 -
                    COALESCE(divida_liquida_ebitda, 0) * 0.15
                )::numeric,
                2
            )
        ELSE NULL
    END AS score_radar,

    CASE
        WHEN roe >= 15 AND dy >= 5 AND pl <= 10 THEN 'Muito atrativa'
        WHEN roe >= 10 AND dy >= 3 AND pl <= 15 THEN 'Atrativa'
        WHEN roe >= 5 THEN 'Neutra'
        ELSE 'Atenção'
    END AS leitura_radar

FROM empresas_fundamentalistas
ORDER BY score_radar DESC NULLS LAST;
