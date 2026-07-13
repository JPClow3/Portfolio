---
title: "Lorebound"
slug: "lorebound"
description: "Uma plataforma de ficção interativa focada no leitor, que combina mundos curados com turnos de IA controlados, memória persistente e uso transparente."
tech: ["TypeScript", "React", "Cloudflare Workers", "Supabase", "IA", "Stripe"]
image: "/projects/lorebound-cover.svg"
featured: true
order: 2
lang: "pt"
caseStudy: true
status: "in-development"
role: "Direção de produto, experiência de leitura, contratos de IA e arquitetura full-stack"
year: "2026"
decisionLog:
  problem: "Ficção com IA pode parecer ilimitada, mas perde autoria, continuidade e uma razão clara para confiar no próximo turno."
  constraint: "A plataforma precisa de liberdade criativa sem custos escondidos, memória descartável ou uma experiência de leitura que pareça apenas um chat."
  decision: "Ancorar a leitura em story packs curados, persistir memória sobre escolhas e usar uma única tabela visível de Ink para turnos, tentativas, imagens e contexto."
  outcome: "Lorebound mantém o leitor dentro de mundos autorais e torna compreensíveis a capacidade da IA, a continuidade e o uso."
metrics:
  - label: "Modelo de leitura"
    value: "Story packs"
  - label: "Continuidade"
    value: "Memória persistente"
  - label: "Uso"
    value: "Uma tabela de Ink"
highlights:
  - "Mundos curados definem o tom antes de um turno de IA"
  - "Escolhas e memória orientam o próximo capítulo"
  - "API estruturada e contratos TypeScript compartilhados"
  - "Mídia gerada de forma seletiva"
---

## Visão geral

Lorebound é uma plataforma de ficção interativa em desenvolvimento com uma perspectiva focada no leitor. A meta não é gerar texto sem limites; é criar mundos autorais que respondem ao leitor mantendo coerência, intenção e vontade de voltar.

## Decisões de produto

Story packs definem cenário, tom e material curado. A IA entra quando fortalece a leitura: para desenvolver um turno, manter memória relevante, aceitar uma ação personalizada ou adicionar mídia seletiva.
