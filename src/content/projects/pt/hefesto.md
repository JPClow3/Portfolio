---
title: "Hefesto"
slug: "hefesto"
description: "Um sistema diário de modelagem de risco de ignição de incêndios em Goiás, baseado em dados versionados, sinais climáticos e avaliação reproduzível."
tech: ["Python", "XGBoost", "Dados geoespaciais", "Dados climáticos", "ML Ops"]
image: "/projects/hefesto-risk-grid.svg"
featured: true
order: 4
lang: "pt"
caseStudy: true
status: "live"
role: "Modelagem de dados, desenho de pipeline, validação e documentação"
year: "2026"
decisionLog:
  problem: "O risco diário de ignição precisa ser comparável entre clima, secura, vegetação e condições históricas."
  constraint: "Uma melhoria de modelo não serve se dados, hipóteses e avaliação não puderem ser reproduzidos ou explicados."
  decision: "Tratar o pipeline de pesquisa como produto, com contratos de schema, manifestos, perfis de experimento, registros e diagnósticos."
  outcome: "A linha materializada de clima e MODIS elevou o PR-AUC de 0.407 para 0.456 e preservou um caminho auditável de evolução."
metrics:
  - label: "Grade"
    value: "1 km"
  - label: "Melhor PR-AUC"
    value: "0.456"
  - label: "Roadmap"
    value: "v2-v8"
highlights:
  - "Configurações, manifestos, métricas e registros versionados"
  - "Linha XGBoost com clima, secura e MODIS"
  - "Diagnósticos por tempo, estação e sub-região"
  - "Separação clara entre execução e backlog"
---

## Visão geral

Hefesto é um projeto de risco de ignição de incêndios em Goiás. O trabalho não é apenas um modelo: é um sistema de pesquisa disciplinado com dados repetíveis, experimentos versionados e diagnósticos que expliquem cada mudança.
