# Radar Fundamentalista

## Sobre o Projeto

O Radar Fundamentalista é um projeto de Produto e Dados criado para transformar indicadores financeiros de empresas brasileiras em uma análise simples, visual e comparável.

A proposta é construir uma solução que ajude usuários a comparar empresas da Bolsa com base em indicadores fundamentalistas, facilitando a identificação de sinais de força, atenção ou risco.

---

## Problema

Investidores iniciantes, estudantes de finanças e analistas em formação costumam ter dificuldade para interpretar dados fundamentalistas de forma prática.

Indicadores como P/L, ROE, ROIC, margem líquida, dividend yield e endividamento são úteis, mas muitas vezes aparecem de forma técnica, dispersa e pouco visual.

Isso dificulta a comparação entre empresas e aumenta a insegurança na tomada de decisão.

---

## Solução

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

Nesta primeira versão, os dados utilizados são simulados para fins educacionais e de desenvolvimento do projeto.

---

## Indicadores Utilizados

A base considera os seguintes campos:

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

## Estrutura do Projeto

```text
radar-fundamentalista/
├── data/
│   ├── empresas_template.csv
│   └── empresas_amostra.csv
├── docs/
│   ├── produto.md
│   ├── backlog.md
│   ├── metricas.md
│   ├── dicionario_dados.md
│   ├── roadmap.md
│   ├── persona_hipotese.md
│   ├── mvp.md
│   ├── criterios_classificacao.md
│   ├── observacoes_base.md
│   ├── comandos_postgresql.md
│   ├── aprendizados.md
│   ├── dashboard_planejado.md
│   ├── mapeamento_dashboard_sql.md
│   └── resumo_executivo.md
├── scripts/
│   ├── schema.sql
│   ├── insert_amostra.sql
│   ├── consultas.sql
│   └── consultas_dashboard.sql
├── dashboard/
└── README.md
```
## Site

Radar Fundamentalista
├── Página inicial
│   ├── O que é o Radar
│   ├── Para quem é
│   ├── Como funciona a classificação
│   └── Botão: Acessar dashboard
│
├── Dashboard Metabase
│   ├── Visão geral
│   ├── Ranking de empresas
│   ├── Empresas por setor
│   ├── Maiores dividend yields
│   ├── Melhores ROEs
│   ├── Atenção com dívida
│   └── Tabela comparativa
│
└── Metodologia
    ├── Indicadores usados
    ├── Regras de classificação
    ├── Limitações
    └── Aviso de não recomendação

---

## Documentação do Projeto

Frente 1 — Produto / Experiência / Layout
Criar a cara do Radar Fundamentalista.

Frente 2 — Dados / Automação / Escala
Colocar mais empresas, atualização automática, regras, tratamento e histórico.

### Produto

* Visão do produto: `docs/produto.md`
* Backlog: `docs/backlog.md`
* Métricas: `docs/metricas.md`
* Roadmap: `docs/roadmap.md`
* Persona e hipóteses: `docs/persona_hipotese.md`
* MVP: `docs/mvp.md`
* Critérios de classificação: `docs/criterios_classificacao.md`

### Dados

* Dicionário de dados: `docs/dicionario_dados.md`
* Observações sobre a base: `docs/observacoes_base.md`
* Base template: `data/empresas_template.csv`
* Base simulada: `data/empresas_amostra.csv`

### SQL e PostgreSQL

* Estrutura da tabela: `scripts/schema.sql`
* Inserção de dados simulados: `scripts/insert_amostra.sql`
* Consultas iniciais: `scripts/consultas.sql`
* Consultas para dashboard: `scripts/consultas_dashboard.sql`
* Comandos PostgreSQL: `docs/comandos_postgresql.md`

### Dashboard

* Planejamento do dashboard: `docs/dashboard_planejado.md`
* Mapeamento SQL para dashboard: `docs/mapeamento_dashboard_sql.md`

### Portfólio

* Resumo executivo: `docs/resumo_executivo.md`
* Aprendizados do projeto: `docs/aprendizados.md`

---

## Tecnologias e Ferramentas

* Linux Debian;
* Terminal;
* Markdown;
* CSV;
* SQL;
* PostgreSQL;
* Metabase, Power BI ou Looker Studio para dashboard;
* GitHub para publicação do portfólio;
* Neon;
* Railway;
* Docker Image;
* Metabase;
* Postgres interno do Railway;
* variáveis de ambiente;
* porta 3000;
* SSL;
* logs;
* erro 502;
* Hobby plan;
* conexão com banco.

---

## Consultas SQL Desenvolvidas

O projeto possui consultas para responder perguntas como:

* Quantas empresas foram analisadas?
* Quantos setores existem na base?
* Quantas empresas estão classificadas como Forte, Atenção ou Risco?
* Quais empresas possuem maior ROE?
* Quais empresas possuem maior Dividend Yield?
* Quais empresas possuem maior margem líquida?
* Quais empresas apresentam maior endividamento?
* Como comparar empresas por setor?

---

## Valor do Projeto

O Radar Fundamentalista demonstra a conexão entre Produto, Dados e Tecnologia.

O projeto evidencia a capacidade de:

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

## Status do Projeto
MVP funcional + configuração da experiência do usuário
Conectar o banco correto do Neon
Organizar as tabelas no Metabase
Criar cards
Criar dashboard
Personalizar layout
Definir narrativa
Preparar compartilhamento
Validar com pessoas

## Produto
Discovery
Definição de problema
Proposta de valor
MVP
Modelagem de dados
Protótipo técnico
Deploy
Infraestrutura cloud
Construção da experiência do MVP
Dashboard
Validação de valor
Preparação para usuários
Feedback
Iteração
Escala de dados
Análises avançadas
Monetização
Produto com cadastro/assinatura

## Próximos Passos
tabela comparativa
indicadores principais
ranking por classificação
empresas por setor
alertas de dívida
oportunidades por múltiplos
dividend yield
ROE
margem
Em desenvolvimento.

---

## Próximas Etapas

* Aprofundar consultas SQL;
* Substituir a base simulada por dados reais;
* Construir o dashboard;
* Gerar prints e evidências visuais;
* Publicar o projeto no GitHub;
* Transformar o projeto em um case para LinkedIn e entrevistas.
* Banco de dados no Neon
  ✅ Infraestrutura online
✅ Metabase no Railway
✅ Banco Neon conectado
✅ Dashboard V2 criado
✅ Identidade textual inicial
✅ Primeira versão apresentável em PDF
