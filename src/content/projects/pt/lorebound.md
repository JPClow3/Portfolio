---
title: "Lorebound"
slug: "lorebound"
description: "Uma plataforma de ficção interativa focada no leitor, que combina mundos curados com turnos de IA controlados, memória persistente e uso transparente."
tech: ["TypeScript", "React", "Neon Postgres", "Drizzle", "Cloudflare Workers", "IA", "Stripe"]
image: "/projects/lorebound.webp"
featured: false
order: 10
lang: "pt"
caseStudy: true
status: "in-development"
role: "Direção de produto, experiência de leitura, contratos de IA e arquitetura full-stack"
year: "2026"
decisionLog:
  problem: "Ficção com IA pode parecer ilimitada, mas perde autoria, continuidade e uma razão clara para confiar no próximo turno."
  constraint: "A plataforma precisa de liberdade criativa sem custos escondidos, memória descartável ou uma experiência de leitura que pareça apenas um chat."
  decision: "Ancorar a leitura em story packs curados, persistir memória sobre escolhas e executar contratos e migrações compartilhados com Drizzle no Neon Postgres, atrás de uma API Hono na Cloudflare Workers."
  outcome: "Lorebound mantém o leitor dentro de mundos autorais e torna compreensíveis a capacidade da IA, a continuidade e o uso."
metrics:
  - label: "Modelo de leitura"
    value: "Story packs"
  - label: "Continuidade"
    value: "Memória persistente"
  - label: "Runtime"
    value: "Cloudflare Workers"
highlights:
  - "Mundos curados definem o tom antes de um turno de IA"
  - "Escolhas e memória orientam o próximo capítulo"
  - "Schema Drizzle e contratos TypeScript compartilhados no Neon Postgres"
  - "API Hono na Cloudflare Workers com mídia gerada de forma seletiva"
---

## Visão geral

Lorebound é uma plataforma de ficção interativa em desenvolvimento com uma perspectiva focada no leitor. A meta não é gerar texto sem limites; é criar mundos autorais que respondem ao leitor mantendo coerência, intenção e vontade de voltar.

## Decisões de produto

Story packs definem cenário, tom e material curado. A IA entra quando fortalece a leitura: para desenvolver um turno, manter memória relevante, aceitar uma ação personalizada ou adicionar mídia seletiva. Ink torna o modelo de custo visível, em vez de escondê-lo atrás de uma cota ambígua.

## Arquitetura atual

- O cliente é uma aplicação React e Vite progressiva para catálogo, leitura, conta e cobrança.
- Uma API Hono roda na Cloudflare Workers e concentra os contratos de histórias, conta, IA e uso no servidor.
- Tipos TypeScript compartilhados, schema Drizzle, migrações e seeds ficam em `packages/shared` e usam Neon Postgres.
- Neon Auth cuida da autenticação, enquanto Stripe e Cloudflare R2 apoiam cobrança e assets gerados.

Essa é a arquitetura atual de Neon/Drizzle/Cloudflare do Lorebound.

## O que estou construindo

- Uma experiência de leitura React apoiada por uma API Hono na Cloudflare Workers.
- Contratos compartilhados, eventos estruturados e persistência para estado e memória da história.
- Acesso a story packs e um modelo de uso único pensado para clareza do leitor.
- Uma base pronta para criadores sem tratar cada mundo como um produto diferente.
