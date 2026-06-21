# Case de Portfólio — Radar Fundamentalista

## 1. Contexto

O Radar Fundamentalista nasceu como um projeto de portfólio para conectar Produto, Dados e Tecnologia em uma experiência prática.

A ideia central foi criar uma solução simples para organizar e comparar indicadores fundamentalistas de empresas brasileiras, transformando dados financeiros em uma leitura mais visual, estruturada e acessível.

O projeto foi desenvolvido como parte da minha transição de carreira para áreas de Produto, Dados e Tecnologia, com foco em aprendizado prático, documentação e construção de evidências reais de execução.

---

## 2. Problema

Investidores iniciantes, estudantes de finanças e analistas em formação costumam ter dificuldade para interpretar indicadores fundamentalistas de forma clara.

Mesmo quando os dados estão disponíveis, eles geralmente aparecem de forma técnica, dispersa e pouco visual.

Indicadores como P/L, ROE, ROIC, margem líquida, dividend yield e endividamento são importantes, mas podem ser difíceis de comparar quando estão isolados ou sem contexto.

Esse cenário gera insegurança, aumenta o esforço de análise e dificulta a tomada de decisão baseada em dados.

---

## 3. Objetivo do Produto

O objetivo do Radar Fundamentalista é criar uma solução analítica que permita:

* Organizar indicadores financeiros de empresas brasileiras;
* Comparar empresas por setor;
* Visualizar sinais de força, atenção ou risco;
* Apoiar uma análise inicial com base em dados;
* Transformar informações técnicas em uma experiência mais clara e comparável.

---

## 4. Público-alvo

O produto foi pensado para:

* Investidores iniciantes;
* Estudantes de finanças;
* Analistas júnior;
* Pessoas interessadas em aprender análise fundamentalista;
* Profissionais em transição para Produto, Dados ou Investimentos.

---

## 5. Hipótese do Produto

A principal hipótese do projeto é:

Se indicadores fundamentalistas forem organizados em uma solução visual e comparável, então usuários iniciantes conseguirão interpretar melhor os dados, reduzir o esforço de análise e ganhar mais confiança para comparar empresas.

---

## 6. MVP

O MVP foi definido como uma primeira versão simples, sem automações complexas, focada em validar a estrutura do produto e a lógica analítica.

O MVP inclui:

* Base simulada de empresas brasileiras;
* Indicadores fundamentalistas principais;
* Classificação das empresas em Forte, Atenção ou Risco;
* Estrutura em PostgreSQL;
* Consultas SQL analíticas;
* Planejamento de dashboard;
* Documentação completa do produto.

Nesta etapa, os dados utilizados são simulados para fins educacionais e de desenvolvimento do projeto.

---

## 7. Estrutura de Dados

A base foi organizada com os seguintes campos:

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

Também foi criado um dicionário de dados para explicar o significado de cada campo e facilitar a leitura técnica do projeto.

---

## 8. Modelagem SQL

O projeto utilizou PostgreSQL para estruturar a base em uma tabela chamada `empresas_fundamentalistas`.

Foram criados scripts para:

* criação da tabela;
* inserção de dados simulados;
* consultas iniciais;
* consultas específicas para alimentar um futuro dashboard.

As consultas permitem responder perguntas como:

* Quantas empresas foram analisadas?
* Quantos setores existem na base?
* Quantas empresas estão classificadas como Forte, Atenção ou Risco?
* Quais empresas possuem maior ROE?
* Quais empresas possuem maior Dividend Yield?
* Quais empresas possuem maior margem líquida?
* Quais empresas apresentam maior endividamento?

---

## 9. Planejamento do Dashboard

O dashboard foi planejado para transformar as consultas SQL em visualizações simples e úteis.

Componentes previstos:

* cards com total de empresas e setores;
* distribuição por classificação;
* empresas por setor;
* ranking de ROE;
* ranking de Dividend Yield;
* ranking de margem líquida;
* análise de endividamento;
* tabela analítica completa;
* filtros por setor, empresa, ticker e classificação.

O objetivo do dashboard é permitir que o usuário compreenda rapidamente o cenário geral da base e consiga comparar empresas de forma mais direcionada.

---

## 10. Decisões de Produto

Algumas decisões importantes do projeto:

* Começar com base simulada para validar estrutura antes de buscar dados reais;
* Separar documentação, dados, scripts e dashboard em pastas diferentes;
* Criar critérios simples de classificação para facilitar a leitura do usuário;
* Documentar o projeto em Markdown para facilitar publicação no GitHub;
* Usar PostgreSQL para demonstrar estruturação real de dados;
* Planejar o dashboard antes de construir a visualização.

Essas decisões ajudaram a manter o projeto organizado, evolutivo e apresentável como portfólio.

---

## 11. Competências Aplicadas

Este projeto demonstrou competências em:

* Product Management;
* análise de dados;
* SQL;
* PostgreSQL;
* Linux;
* Git e GitHub;
* documentação técnica;
* modelagem de dados;
* pensamento analítico;
* planejamento de dashboard;
* estruturação de portfólio;
* aprendizado autodidata.

---

## 12. Aprendizados

Durante o projeto, pratiquei a criação de uma solução do início ao fim, passando por etapas de produto, dados e tecnologia.

Aprendi a estruturar pastas, criar documentação em Markdown, trabalhar com terminal Linux, criar banco de dados no PostgreSQL, escrever consultas SQL, versionar o projeto com Git e publicá-lo no GitHub.

Mais do que executar comandos, o projeto ajudou a consolidar uma lógica de construção: entender o problema, estruturar a solução, organizar os dados, documentar decisões e transformar aprendizado em evidência prática.

---

## 13. Próximos Passos

As próximas etapas do Radar Fundamentalista serão:

* Construir o dashboard em uma ferramenta visual;
* Substituir a base simulada por dados reais;
* Criar prints e evidências visuais do painel;
* Refinar os critérios de classificação;
* Publicar o case no LinkedIn;
* Usar o projeto como material de apoio em entrevistas.

---

## 14. Observação

Este projeto tem finalidade educacional e de portfólio.

As informações e classificações utilizadas não representam recomendação de compra, venda ou manutenção de ativos.
