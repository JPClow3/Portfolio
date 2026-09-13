---
title: "Hefesto"
slug: "hefesto"
description: "Um projeto de pesquisa e rearquitetura para modelagem de risco de ignição de incêndios em Goiás. Os experimentos históricos são preservados para reprodutibilidade; a direção atual é real-time-first."
tech: ["Python", "XGBoost", "Dados geoespaciais", "Dados climáticos", "ML Ops"]
image: "/projects/hefesto-risk-grid.svg"
featured: false
order: 11
lang: "pt"
caseStudy: true
status: "research"
role: "Modelagem de dados, desenho de pipeline de pesquisa, validação e documentação"
year: "2026"
decisionLog:
  problem: "Construir um caminho defensável para modelagem diária de risco de ignição em Goiás sem confundir benchmarks históricos com um serviço operacional de previsão."
  constraint: "As linhas aposentadas de v1 a v5 usavam CSVs históricos em lote e fontes cuja latência operacional real não era adequada para um produto ativo."
  decision: "Aposentar as linhas anteriores, preservar seus contratos e relatórios e redesenhar o trabalho com contratos de fontes real-time-first antes de incluir novas features no pipeline."
  outcome: "Hefesto agora é pesquisa e rearquitetura; o PR-AUC 0.4565 é mantido somente como benchmark histórico do v5_0, não como desempenho de um modelo ativo."
problem: "A pesquisa de risco de ignição precisa de um modelo diário reproduzível em uma grade de 1 km, tratando clima, secura, vegetação e comparabilidade histórica com honestidade."
solution: "Um workspace de rearquitetura com contratos de schema, manifestos de datasets, histórico de experimentos, diagnósticos e uma auditoria explícita de fontes real-time-first."
impact: "O repositório mantém um benchmark histórico reproduzível e deixa visível o caminho operacional que ainda falta antes que qualquer novo modelo seja apresentado como ativo."
metrics:
  - label: "Grade"
    value: "1 km"
  - label: "PR-AUC histórico"
    value: "0.4565 (v5_0)"
  - label: "Estado atual"
    value: "Rearquitetura real-time-first"
highlights:
  - "Histórico v1-v5_0 preservado como pesquisa aposentada, não como serviço ativo"
  - "Auditoria de latência operacional das fontes de fogo, clima e vegetação"
  - "Contratos de dataset, manifestos, diagnósticos e registros de experimentos"
  - "Limite claro entre evidência histórica e a próxima fase de pesquisa"
---

## Visão geral

Hefesto é um projeto de pesquisa e rearquitetura para risco de ignição de incêndios em Goiás. Ele não é atualmente um sistema de previsão ativo. O repositório está em transição para um desenho real-time-first, tratando o contrato de dados e a latência das fontes como pré-requisitos para qualquer modelo operacional futuro.

## Estado atual

As linhas de experimento v1 a v5_0 foram aposentadas depois que uma auditoria mostrou que suas entradas eram CSVs históricos baixados em lote, e não fontes operacionais ao vivo. O GPM Final tem aproximadamente 3,5 meses de latência, o ERA5T cerca de cinco dias e os composites MODIS semanas de latência real. O repositório não tinha um puller de dados ao vivo, então as linhas antigas não são apresentadas como capacidade atual de serviço.

O trabalho atual preserva a estrutura de pesquisa útil — schemas, manifestos, validações, relatórios e histórico de experimentos — enquanto a próxima linha é desenhada com fontes documentadas e latência operacional conhecida.

## Benchmark histórico

O melhor resultado histórico é o v5_0: PR-AUC **0.4565**, F1 **0.4157** e ROC-AUC **0.7344** na avaliação histórica do repositório. Esse número é mantido apenas para reprodutibilidade e comparação. Ele não é uma pontuação ao vivo, uma alegação de modelo publicado ou evidência de que a rearquitetura real-time-first terminou.

## O que construí

- Registros de experimentos versionados e contratos de dataset para comparar linhas de pesquisa.
- Manifestos, validações, diagnósticos e relatórios que preservam o motivo de cada mudança.
- Histórico de XGBoost e engenharia de features em experimentos temporais, espaciais, climáticos, de secura e MODIS.
- Um limite claro de rearquitetura que exige uma fonte operacionalmente documentada antes de novas features entrarem em um pipeline futuro.

## Próxima fase de pesquisa

A próxima fase é validar primeiro as fontes operacionais e só então definir os contratos do dataset e do modelo real-time-first. Até lá, Hefesto continua sendo um projeto de pesquisa com benchmark histórico — não um produto de risco de incêndio publicado.
