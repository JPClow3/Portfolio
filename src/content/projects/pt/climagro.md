---
title: "ClimAgro"
slug: "climagro"
description: "Uma plataforma agronômica operacional que transforma dados meteorológicos diários e horários em decisões de balanço hídrico, irrigação e risco de fogo."
tech: ["Python", "Django", "JavaScript", "PostgreSQL", "INMET", "FAO-56", "Docker", "Playwright"]
featured: true
order: 5
lang: "pt"
caseStudy: true
status: "private-source"
role: "Engenharia full-stack, contratos entre produtor e consumidor, modelos agronômicos e operação"
year: "2026"
decisionLog:
  problem: "Medições brutas de estações são difíceis de transformar em decisões tempestivas e explicáveis de irrigação e clima para produtores e equipes técnicas."
  constraint: "O produto depende de um serviço separado de ingestão, janelas históricas incompletas, fórmulas agronômicas e infraestrutura que precisa falhar com honestidade quando os dados estão atrasados ou indisponíveis."
  decision: "Separei a ingestão meteorológica do produto Django, fixei o contrato OpenAPI entre eles, implementei cálculos baseados em FAO-56 com aquecimento histórico explícito e acrescentei tabelas acessíveis aos gráficos interativos."
  outcome: "Usuários inspecionam dados climáticos diários e horários, balanço hídrico, estimativas de irrigação e entradas de risco de fogo em fluxos que expõem atualidade e lacunas em vez de escondê-las."
metrics:
  - label: "Resolução meteorológica"
    value: "Diária + horária"
  - label: "Fluxos de decisão"
    value: "Água · irrigação · risco de fogo"
  - label: "Contrato de dados"
    value: "OpenAPI versionado do produtor"
highlights:
  - "Evapotranspiração FAO-56 e balanço hídrico com aquecimento histórico"
  - "Produtor INMET e consumidor Django pareados por verificação de contrato"
  - "Tabelas acessíveis, downloads, regressão visual responsiva e estados de atualidade"
  - "Deploy em containers com PostgreSQL, saúde, métricas, backup e imagens imutáveis"
---

## Visão geral

ClimAgro transforma medições meteorológicas em ferramentas agronômicas operacionais. Dados diários e horários alimentam resumos climáticos, balanço hídrico, cálculo de irrigação, boletins e um fluxo de risco de fogo.

## Decisões de produto

Ingestão e apresentação são serviços separados por um contrato explícito. O produtor normaliza dados do INMET; a aplicação Django consome um snapshot OpenAPI fixado e falha a verificação quando o produtor irmão diverge. Isso torna o limite de implantação visível, sem acoplar cálculos a um coletor oculto.

Os resultados agronômicos preservam a cronologia, além dos totais. O balanço hídrico inclui o aquecimento histórico necessário ao período selecionado, expõe déficit residual por magnitude e duração e combina gráficos interativos com dados tabulares acessíveis e downloads.

## O que eu construí

- Exploração diária e horária de estações, com resumos mensais e anuais.
- Evapotranspiração FAO-56, balanço hídrico, irrigação e risco de fogo.
- Verificação de divergência OpenAPI e estados honestos de atualidade do upstream.
- Gráficos responsivos, acessíveis e dados para download.
- PostgreSQL, containers, saúde, métricas, backup e automação de releases.

## Disponibilidade do código

ClimAgro é um trabalho institucional operado em repositórios privados. O estudo de caso documenta o comportamento público e decisões de engenharia não sensíveis.
