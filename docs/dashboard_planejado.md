# Dashboard Planejado — Radar Fundamentalista

## Objetivo do Dashboard

O dashboard do Radar Fundamentalista tem como objetivo transformar indicadores financeiros em uma visualização simples, comparável e útil para análise de empresas brasileiras.

A proposta é permitir que o usuário compare empresas por setor, visualize indicadores relevantes e identifique sinais de força, atenção ou risco.

---

## Perguntas que o Dashboard deve responder

O painel deve ajudar o usuário a responder perguntas como:

* Quais empresas estão classificadas como Forte, Atenção ou Risco?
* Quantas empresas existem em cada setor?
* Quais empresas possuem maior ROE?
* Quais empresas possuem maior Dividend Yield?
* Quais empresas possuem maior margem líquida?
* Quais empresas apresentam maior endividamento?
* Como comparar empresas de um mesmo setor?

---

## Cards principais

O dashboard deverá conter cards com os principais números do projeto:

### 1. Total de empresas analisadas

Mostra a quantidade total de empresas cadastradas na base.

### 2. Total de setores

Mostra quantos setores diferentes existem na base.

### 3. Empresas classificadas como Forte

Mostra a quantidade de empresas com melhor combinação de indicadores.

### 4. Empresas em Atenção

Mostra empresas que exigem análise mais cuidadosa.

### 5. Empresas em Risco

Mostra empresas com sinais financeiros mais preocupantes.

---

## Filtros do Dashboard

O dashboard deverá permitir filtros por:

* Setor;
* Classificação;
* Empresa;
* Ticker.

Esses filtros ajudam o usuário a navegar pela base e comparar empresas de forma mais direcionada.

---

## Gráficos planejados

### 1. Empresas por classificação

Gráfico para mostrar a distribuição entre:

* Forte;
* Atenção;
* Risco.

### 2. Empresas por setor

Gráfico para mostrar quantas empresas existem em cada setor.

### 3. Ranking de ROE

Tabela ou gráfico mostrando as empresas com maior ROE.

### 4. Ranking de Dividend Yield

Tabela ou gráfico mostrando as empresas com maior retorno em dividendos.

### 5. Comparação de margem líquida

Gráfico comparando a margem líquida entre empresas.

### 6. Comparação de endividamento

Gráfico mostrando empresas com maior ou menor dívida líquida/EBITDA.

---

## Tabela analítica

O dashboard também deverá ter uma tabela consolidada contendo:

* Ticker;
* Empresa;
* Setor;
* Preço;
* P/L;
* ROE;
* ROIC;
* Margem líquida;
* Dividend Yield;
* Dívida líquida/EBITDA;
* Liquidez corrente;
* Classificação.

Essa tabela será importante para permitir uma análise mais detalhada.

---

## Experiência do Usuário

O dashboard deve ser simples, objetivo e visual.

A experiência desejada é que o usuário consiga, em poucos minutos:

* Entender o cenário geral da base;
* Filtrar empresas por setor;
* Comparar indicadores;
* Identificar empresas com sinais positivos ou negativos;
* Compreender por que uma empresa foi classificada como Forte, Atenção ou Risco.

---

## Ferramentas possíveis

As ferramentas consideradas para construção do dashboard são:

* Metabase;
* Power BI;
* Looker Studio.

Para o MVP, a prioridade será usar uma ferramenta simples que permita conectar ao banco PostgreSQL ou importar a base CSV.

---

## Critérios de Sucesso do Dashboard

O dashboard será considerado bem-sucedido se permitir:

* Visualizar rapidamente a distribuição das empresas;
* Comparar empresas por indicador;
* Filtrar dados com facilidade;
* Apoiar uma análise inicial;
* Transformar dados técnicos em uma leitura mais clara e acessível.
