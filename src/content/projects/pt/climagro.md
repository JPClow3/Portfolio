---
title: "ClimAgro"
slug: "climagro"
description: "Portal ClimAgro UniRV, coordenado pelo Prof. Dr. Gilmar Oliveira Santos, que reúne dados meteorológicos e análises para apoiar o planejamento agrícola em Rio Verde."
tech: ["Python", "Django", "JavaScript", "PostgreSQL", "INMET", "FAO-56", "Docker", "Playwright"]
image: "/projects/climagro.webp"
featured: true
order: 5
lang: "pt"
caseStudy: true
status: "private-source"
role: "Desenvolvimento da plataforma web e dos fluxos de dados em projeto coordenado pelo Prof. Dr. Gilmar Oliveira Santos"
year: "2026"
decisionLog:
  problem: "Medições brutas de estações são difíceis de transformar em decisões tempestivas e explicáveis de irrigação e clima para produtores e equipes técnicas."
  constraint: "O produto depende de um serviço separado de ingestão, janelas históricas incompletas, fórmulas agronômicas e infraestrutura que precisa falhar com honestidade quando os dados estão atrasados ou indisponíveis."
  decision: "Na implementação, a ingestão meteorológica foi separada da aplicação Django por um contrato OpenAPI; os cálculos baseados em FAO-56 incluem aquecimento histórico explícito e gráficos acompanhados de tabelas acessíveis."
  outcome: "A plataforma apresenta dados climáticos diários e horários, balanço hídrico, estimativas de irrigação e entradas de risco de fogo, indicando a atualidade e as lacunas dos dados."
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

O ClimAgro UniRV é uma iniciativa coordenada pelo Prof. Dr. Gilmar Oliveira Santos para disponibilizar informações meteorológicas, dados históricos e análises do clima da região. O portal apoia o planejamento agrícola e também atende pesquisadores, estudantes e a comunidade. Minha participação está no desenvolvimento da plataforma web e de seus fluxos de dados.

## Decisões de produto

Ingestão e apresentação são serviços separados por um contrato explícito. O produtor normaliza dados do INMET; a aplicação Django consome um snapshot OpenAPI fixado e falha a verificação quando o produtor irmão diverge. Isso torna o limite de implantação visível, sem acoplar cálculos a um coletor oculto.

Os resultados agronômicos preservam a cronologia, além dos totais. O balanço hídrico inclui o aquecimento histórico necessário ao período selecionado, expõe déficit residual por magnitude e duração e combina gráficos interativos com dados tabulares acessíveis e downloads.

## Contribuições técnicas

- Exploração diária e horária de estações, com resumos mensais e anuais.
- Evapotranspiração FAO-56, balanço hídrico, irrigação e risco de fogo.
- Verificação de divergência OpenAPI e estados honestos de atualidade do upstream.
- Gráficos responsivos, acessíveis e dados para download.
- PostgreSQL, containers, saúde, métricas, backup e automação de releases.

## Disponibilidade do código

ClimAgro é um projeto institucional da UniRV, sob coordenação técnica e científica do Prof. Dr. Gilmar Oliveira Santos, operado em repositórios privados. Este estudo de caso descreve minha contribuição técnica sem atribuir a mim a autoria ou a coordenação do projeto.
