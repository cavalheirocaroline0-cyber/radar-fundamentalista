# Mapeamento SQL para Dashboard — Radar Fundamentalista

## Objetivo

Este documento explica como as consultas SQL criadas no projeto Radar Fundamentalista serão utilizadas para alimentar o dashboard.

A proposta é conectar as consultas do banco de dados com os componentes visuais do painel, como cards, gráficos, rankings, filtros e tabelas analíticas.

---

## Fonte de Dados

A fonte principal do dashboard será a tabela:

```sql
empresas_fundamentalistas
```

Essa tabela contém os principais dados das empresas analisadas, incluindo:

* ticker;
* empresa;
* setor;
* preço;
* P/L;
* ROE;
* ROIC;
* margem líquida;
* dividend yield;
* dívida líquida/EBITDA;
* liquidez corrente;
* classificação.

---

## Cards do Dashboard

### 1. Total de empresas analisadas

Consulta utilizada:

```sql
SELECT COUNT(*) AS total_empresas
FROM empresas_fundamentalistas;
```

Uso no dashboard:

Card principal mostrando quantas empresas existem na base.

---

### 2. Total de setores

Consulta utilizada:

```sql
SELECT COUNT(DISTINCT setor) AS total_setores
FROM empresas_fundamentalistas;
```

Uso no dashboard:

Card mostrando a quantidade de setores diferentes analisados.

---

## Gráficos do Dashboard

### 3. Empresas por classificação

Consulta utilizada:

```sql
SELECT classificacao, COUNT(*) AS quantidade
FROM empresas_fundamentalistas
GROUP BY classificacao
ORDER BY quantidade DESC;
```

Uso no dashboard:

Gráfico de barras ou pizza mostrando a distribuição entre:

* Forte;
* Atenção;
* Risco.

---

### 4. Empresas por setor

Consulta utilizada:

```sql
SELECT setor, COUNT(*) AS quantidade_empresas
FROM empresas_fundamentalistas
GROUP BY setor
ORDER BY quantidade_empresas DESC;
```

Uso no dashboard:

Gráfico de barras mostrando quantas empresas existem por setor.

---

## Rankings Analíticos

### 5. Ranking por ROE

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, roe, classificacao
FROM empresas_fundamentalistas
ORDER BY roe DESC;
```

Uso no dashboard:

Tabela ou gráfico para mostrar empresas com maior retorno sobre patrimônio líquido.

---

### 6. Ranking por Dividend Yield

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, dividend_yield, classificacao
FROM empresas_fundamentalistas
ORDER BY dividend_yield DESC;
```

Uso no dashboard:

Tabela para destacar empresas com maior retorno em dividendos.

---

### 7. Ranking por margem líquida

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, margem_liquida, classificacao
FROM empresas_fundamentalistas
ORDER BY margem_liquida DESC;
```

Uso no dashboard:

Visualização para comparar eficiência e lucratividade entre empresas.

---

### 8. Empresas com maior endividamento

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, divida_liquida_ebitda, classificacao
FROM empresas_fundamentalistas
ORDER BY divida_liquida_ebitda DESC;
```

Uso no dashboard:

Tabela ou gráfico para identificar empresas com maior nível de dívida.

---

## Tabelas de Apoio

### 9. Empresas classificadas como Forte

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, roe, roic, margem_liquida, dividend_yield
FROM empresas_fundamentalistas
WHERE classificacao = 'Forte'
ORDER BY roe DESC;
```

Uso no dashboard:

Tabela específica para empresas com melhores sinais financeiros.

---

### 10. Empresas classificadas como Risco

Consulta utilizada:

```sql
SELECT ticker, empresa, setor, roe, roic, margem_liquida, divida_liquida_ebitda
FROM empresas_fundamentalistas
WHERE classificacao = 'Risco'
ORDER BY roe ASC;
```

Uso no dashboard:

Tabela específica para empresas que exigem maior atenção.

---

## Tabela Analítica Completa

Consulta utilizada:

```sql
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
```

Uso no dashboard:

Tabela principal para análise detalhada e comparação entre empresas.

---

## Filtros Planejados

O dashboard deverá permitir filtros por:

* setor;
* classificação;
* ticker;
* empresa.

Esses filtros permitirão que o usuário navegue pela base e compare empresas de forma mais direcionada.

---

## Conexão com Produto

Cada consulta SQL foi pensada para responder uma pergunta relevante do usuário.

O objetivo não é apenas exibir dados, mas transformar informações financeiras em uma experiência simples, clara e comparável.

Dessa forma, o dashboard apoia a proposta de valor do Radar Fundamentalista: ajudar usuários a identificar sinais de força, atenção ou risco em empresas brasileiras.
