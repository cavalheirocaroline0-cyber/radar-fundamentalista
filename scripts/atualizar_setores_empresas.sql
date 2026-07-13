-- DASH DIÁRIO — atualização inicial de nomes e setores
-- Classificação setorial provisória para melhorar a leitura do site

UPDATE empresas_fundamentalistas
SET
    empresa = CASE ticker
        WHEN 'PETR4' THEN 'Petrobras PN'
        WHEN 'PETR3' THEN 'Petrobras ON'
        WHEN 'VALE3' THEN 'Vale'
        WHEN 'ITUB4' THEN 'Itaú Unibanco PN'
        WHEN 'ITUB3' THEN 'Itaú Unibanco ON'
        WHEN 'BBDC4' THEN 'Bradesco PN'
        WHEN 'BBDC3' THEN 'Bradesco ON'
        WHEN 'BBAS3' THEN 'Banco do Brasil'
        WHEN 'BPAC11' THEN 'BTG Pactual'
        WHEN 'B3SA3' THEN 'B3'
        WHEN 'PRIO3' THEN 'PRIO'
        WHEN 'BRAV3' THEN 'Brava Energia'
        WHEN 'AXIA3' THEN 'Axia Energia'
        WHEN 'SBSP3' THEN 'Sabesp'
        WHEN 'CSMG3' THEN 'Copasa'
        WHEN 'EQTL3' THEN 'Equatorial Energia'
        WHEN 'CPLE3' THEN 'Copel'
        WHEN 'CMIG4' THEN 'Cemig PN'
        WHEN 'ENGI11' THEN 'Energisa'
        WHEN 'ENEV3' THEN 'Eneva'
        WHEN 'WEGE3' THEN 'WEG'
        WHEN 'SUZB3' THEN 'Suzano'
        WHEN 'RDOR3' THEN 'Rede D’Or'
        WHEN 'TOTS3' THEN 'TOTVS'
        WHEN 'VBBR3' THEN 'Vibra Energia'
        WHEN 'UGPA3' THEN 'Ultrapar'
        WHEN 'CSAN3' THEN 'Cosan'
        WHEN 'LREN3' THEN 'Lojas Renner'
        WHEN 'MGLU3' THEN 'Magazine Luiza'
        WHEN 'ASAI3' THEN 'Assaí'
        WHEN 'RADL3' THEN 'Raia Drogasil'
        WHEN 'VIVT3' THEN 'Vivo'
        WHEN 'TIMS3' THEN 'TIM'
        WHEN 'RAIL3' THEN 'Rumo'
        WHEN 'MOTV3' THEN 'Motiva'
        WHEN 'GGBR4' THEN 'Gerdau PN'
        WHEN 'USIM5' THEN 'Usiminas PNA'
        WHEN 'BBSE3' THEN 'BB Seguridade'
        WHEN 'CXSE3' THEN 'Caixa Seguridade'
        WHEN 'CYRE3' THEN 'Cyrela'
        WHEN 'CURY3' THEN 'Cury'
        WHEN 'DIRR3' THEN 'Direcional'
        WHEN 'ALOS3' THEN 'ALLOS'
        WHEN 'NATU3' THEN 'Natura'
        WHEN 'MBRF3' THEN 'Marfrig/BRF'
        WHEN 'EMBJ3' THEN 'Embraer'
        WHEN 'RENT3' THEN 'Localiza'
        WHEN 'SMFT3' THEN 'Smart Fit'
        ELSE empresa
    END,

    setor = CASE ticker
        WHEN 'PETR4' THEN 'Petróleo, gás e combustíveis'
        WHEN 'PETR3' THEN 'Petróleo, gás e combustíveis'
        WHEN 'PRIO3' THEN 'Petróleo, gás e combustíveis'
        WHEN 'BRAV3' THEN 'Petróleo, gás e combustíveis'
        WHEN 'VBBR3' THEN 'Distribuição de combustíveis'
        WHEN 'UGPA3' THEN 'Distribuição de combustíveis'
        WHEN 'CSAN3' THEN 'Energia, açúcar e logística'

        WHEN 'VALE3' THEN 'Mineração'
        WHEN 'GGBR4' THEN 'Siderurgia e metalurgia'
        WHEN 'USIM5' THEN 'Siderurgia e metalurgia'
        WHEN 'SUZB3' THEN 'Papel e celulose'

        WHEN 'ITUB4' THEN 'Bancos'
        WHEN 'ITUB3' THEN 'Bancos'
        WHEN 'BBDC4' THEN 'Bancos'
        WHEN 'BBDC3' THEN 'Bancos'
        WHEN 'BBAS3' THEN 'Bancos'
        WHEN 'BPAC11' THEN 'Bancos e serviços financeiros'
        WHEN 'B3SA3' THEN 'Bolsa e infraestrutura de mercado'
        WHEN 'BBSE3' THEN 'Seguradoras'
        WHEN 'CXSE3' THEN 'Seguradoras'

        WHEN 'AXIA3' THEN 'Energia elétrica'
        WHEN 'EQTL3' THEN 'Energia elétrica'
        WHEN 'CPLE3' THEN 'Energia elétrica'
        WHEN 'CMIG4' THEN 'Energia elétrica'
        WHEN 'ENGI11' THEN 'Energia elétrica'
        WHEN 'ENEV3' THEN 'Energia elétrica'

        WHEN 'SBSP3' THEN 'Saneamento'
        WHEN 'CSMG3' THEN 'Saneamento'

        WHEN 'WEGE3' THEN 'Indústria e tecnologia'
        WHEN 'EMBJ3' THEN 'Aeroespacial e defesa'
        WHEN 'TOTS3' THEN 'Tecnologia'

        WHEN 'RDOR3' THEN 'Saúde'
        WHEN 'RADL3' THEN 'Farmácias e saúde'
        WHEN 'SMFT3' THEN 'Bem-estar e academias'

        WHEN 'LREN3' THEN 'Varejo'
        WHEN 'MGLU3' THEN 'Varejo'
        WHEN 'ASAI3' THEN 'Atacarejo e alimentos'
        WHEN 'NATU3' THEN 'Consumo e cosméticos'
        WHEN 'MBRF3' THEN 'Alimentos'

        WHEN 'VIVT3' THEN 'Telecomunicações'
        WHEN 'TIMS3' THEN 'Telecomunicações'

        WHEN 'RAIL3' THEN 'Logística'
        WHEN 'MOTV3' THEN 'Concessões e infraestrutura'

        WHEN 'CYRE3' THEN 'Construção civil'
        WHEN 'CURY3' THEN 'Construção civil'
        WHEN 'DIRR3' THEN 'Construção civil'
        WHEN 'ALOS3' THEN 'Shopping centers'

        WHEN 'RENT3' THEN 'Locação de veículos'

        ELSE COALESCE(NULLIF(setor, ''), 'A classificar')
    END
WHERE ticker IN (
    'PETR4','PETR3','VALE3','ITUB4','ITUB3','BBDC4','BBDC3','BBAS3',
    'BPAC11','B3SA3','PRIO3','BRAV3','AXIA3','SBSP3','CSMG3','EQTL3',
    'CPLE3','CMIG4','ENGI11','ENEV3','WEGE3','SUZB3','RDOR3','TOTS3',
    'VBBR3','UGPA3','CSAN3','LREN3','MGLU3','ASAI3','RADL3','VIVT3',
    'TIMS3','RAIL3','MOTV3','GGBR4','USIM5','BBSE3','CXSE3','CYRE3',
    'CURY3','DIRR3','ALOS3','NATU3','MBRF3','EMBJ3','RENT3','SMFT3'
);
