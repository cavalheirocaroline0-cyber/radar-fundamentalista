# Resumo Executivo — Radar Fundamentalista

## Visão Geral

O Radar Fundamentalista é um projeto de Produto e Dados desenvolvido para transformar indicadores financeiros de empresas brasileiras em uma análise simples, visual e comparável.

A proposta do projeto é criar uma solução que ajude usuários a comparar empresas da Bolsa com base em indicadores fundamentalistas, facilitando a identificação de sinais de força, atenção ou risco.

---

## Problema

Investidores iniciantes, estudantes de finanças e analistas em formação costumam ter dificuldade para interpretar dados fundamentalistas de forma prática.

Embora indicadores como P/L, ROE, ROIC, margem líquida, dividend yield e endividamento estejam disponíveis em fontes públicas, essas informações muitas vezes aparecem de forma técnica, dispersa e pouco visual.

Isso dificulta a comparação entre empresas e aumenta a insegurança na tomada de decisão.

---

## Solução Proposta

O Radar Fundamentalista propõe uma experiência analítica simples, organizada e visual para comparação de empresas brasileiras.

A solução combina:

* documentação de produto;
* base de dados estruturada;
* modelagem SQL;
* consultas analíticas;
* critérios de classificação;
* planejamento de dashboard;
* visão orientada a métricas e tomada de decisão.

---

## Público-alvo

O produto foi pensado para:

* investidores iniciantes;
* estudantes de finanças;
* analistas júnior;
* pessoas interessadas em aprender análise fundamentalista;
* profissionais em transição para áreas de Produto, Dados ou Investimentos.

---

## MVP

O MVP do Radar Fundamentalista consiste em uma base inicial de empresas brasileiras, estruturada em CSV e PostgreSQL, com indicadores fundamentalistas e uma classificação simples:

* Forte;
* Atenção;
* Risco.

A primeira versão busca validar se a organização dos dados em uma experiência comparável ajuda o usuário a interpretar melhor os indicadores e reduzir o esforço de análise.

---

## Dados e Indicadores

A base considera indicadores como:

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

Nesta etapa inicial, os dados utilizados são simulados para fins educacionais e de desenvolvimento do projeto.

---

## Estrutura Técnica

O projeto foi organizado em pastas para separar documentação, dados, scripts SQL e dashboard.

Estrutura principal:

* `docs/` — documentação de produto, dados e estratégia;
* `data/` — bases em CSV;
* `scripts/` — arquivos SQL;
* `dashboard/` — espaço reservado para visualizações futuras;
* `README.md` — apresentação principal do projeto.

---

## SQL e PostgreSQL

O projeto utiliza PostgreSQL para estruturar os dados em uma tabela chamada `empresas_fundamentalistas`.

Foram criados scripts para:

* criação da tabela;
* inserção de dados simulados;
* consultas analíticas;
* consultas específicas para alimentar o futuro dashboard.

As consultas permitem analisar empresas por setor, classificação, ROE, dividend yield, margem líquida e endividamento.

---

## Dashboard Planejado

O dashboard será criado para transformar as consultas SQL em visualizações simples e úteis.

Componentes planejados:

* cards com total de empresas e setores;
* distribuição por classificação;
* empresas por setor;
* ranking de ROE;
* ranking de dividend yield;
* ranking de margem líquida;
* análise de endividamento;
* tabela analítica completa;
* filtros por setor, empresa, ticker e classificação.

---

## Valor do Projeto

O Radar Fundamentalista demonstra a conexão entre Produto, Dados e Tecnologia.

O projeto mostra a capacidade de:

* identificar um problema real;
* definir público-alvo e persona;
* criar hipótese de produto;
* estruturar MVP;
* planejar roadmap;
* criar métricas;
* modelar dados;
* escrever consultas SQL;
* documentar decisões;
* transformar dados técnicos em uma experiência mais clara para o usuário.

---

## Competências Demonstradas

Este projeto evidencia competências em:

* Product Management;
* análise de dados;
* SQL;
* PostgreSQL;
* Linux;
* documentação técnica;
* modelagem de dados;
* pensamento analítico;
* estruturação de portfólio;
* aprendizado autodidata.

---

## Próximas Etapas

As próximas etapas do projeto serão:

* aprofundar as consultas SQL;
* substituir a base simulada por dados reais;
* construir o dashboard;
* gerar prints e evidências visuais;
* publicar o projeto no GitHub;
* transformar o projeto em um case para LinkedIn e entrevistas.
