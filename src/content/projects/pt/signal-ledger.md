---
title: "Signal Ledger"
slug: "signal-ledger"
description: "Uma PWA de briefings baseada em fontes que acompanha temas em evolução, mostra o que mudou e mantém as evidências perto de cada conclusão."
tech: ["Next.js", "TypeScript", "Cloudflare Workers", "Neon Postgres", "pgvector", "R2", "OpenNext"]
featured: false
order: 7
lang: "pt"
caseStudy: true
status: "private-source"
role: "Estratégia de produto, sistema editorial, arquitetura full-stack e deploy"
year: "2026"
decisionLog:
  problem: "Feeds de notícias priorizam links isolados e recência, dificultando acompanhar como um tema evolui ou quais fontes sustentam uma conclusão."
  constraint: "Ingestão e análise automatizadas precisam expor dados ausentes ou desatualizados com honestidade, preservar a proveniência e respeitar limites do runtime de borda e de tarefas agendadas."
  decision: "Projetei um pipeline orientado a temas que ingere fontes, agrupa coberturas relacionadas, preserva snapshots e produz briefings ligados às evidências em Cloudflare Workers, Neon e R2."
  outcome: "Leitores acompanham a evolução de um tema em uma interface editorial calma que diferencia evidência disponível, dados indisponíveis e áudio ou análise incompletos."
metrics:
  - label: "Cadência de ingestão"
    value: "A cada 10 minutos"
  - label: "Etapas do pipeline"
    value: "Ingerir · agrupar · analisar · resumir"
  - label: "Modelo de evidência"
    value: "Fontes junto de cada conclusão"
highlights:
  - "Linhas do tempo mostram o que mudou em vez de repetir um feed"
  - "Snapshots e proveniência permanecem vinculados à análise"
  - "Dados e áudios ausentes aparecem com honestidade, sem conteúdo artificial"
  - "Deploy na borda com tarefas agendadas, readiness e promoção por ambientes"
---

## Visão geral

Signal Ledger é um produto vivo de briefings por tema. Ele reúne cobertura de múltiplas fontes, agrupa reportagens relacionadas e apresenta a evolução de uma história com o contexto das fontes sempre próximo.

## Decisões de produto

O contrato editorial prioriza proveniência e ausência honesta em vez de completude sintética. Banco, briefing ou áudio ausente vira um estado indisponível claro. Fixtures locais ficam restritas a desenvolvimento e testes, salvo ativação explícita.

A aplicação funciona como PWA Next.js via OpenNext em Cloudflare Workers. Neon Postgres e pgvector sustentam artigos, clusters e briefings; R2 armazena snapshots das fontes; tarefas agendadas separam ingestão, agrupamento, análise e geração do briefing.

## O que eu construí

- Ingestão RSS e Atom com proveniência normalizada.
- Agrupamento por temas, comparação entre fontes e briefings ligados às evidências.
- Superfícies editoriais, fallback acessível por transcrição e comportamento responsivo de PWA.
- Readiness, tarefas agendadas, ambientes de staging/produção e deploy com caminho de rollback.

## Disponibilidade do código

O produto é operado a partir de um repositório privado. Este estudo de caso documenta arquitetura e decisões sem expor credenciais de provedores ou acordos de fontes não publicados.
