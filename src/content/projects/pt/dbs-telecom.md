---
title: "Central do Assinante DBS Telecom"
slug: "dbs-telecom"
description: "Uma plataforma móvel de autoatendimento que conecta clientes da DBS a financeiro, suporte, planos, diagnósticos e atendimento assistido por um único BFF protegido."
tech: ["Expo", "React Native", "TypeScript", "Cloudflare Workers", "Neon Postgres", "IXC Soft", "IA"]
github: "https://github.com/JPClow3/dbs-telecom"
featured: false
order: 8
lang: "pt"
caseStudy: true
status: "live"
role: "Engenharia de produto mobile e backend, integrações, limites de segurança e entrega"
year: "2026"
decisionLog:
  problem: "Tarefas de suporte ao assinante estavam fragmentadas entre canais financeiros, técnicos e de atendimento, criando atrito para clientes e carga operacional para a equipe."
  constraint: "O aplicativo não pode receber credenciais de provedores, precisa impedir acesso entre contas e diferenciar dados reais de estados demonstrativos ou indisponíveis."
  decision: "Construí um app Expo/React Native atrás de um BFF TypeScript que centraliza autorização JWT, integração IXC Soft, persistência Neon, chat em streaming e assistência de IA com limites."
  outcome: "Clientes ganham uma jornada única para faturas, suporte, planos, diagnósticos, fila e avaliação, enquanto integrações sensíveis permanecem isoladas no servidor."
metrics:
  - label: "Suíte de regressão do backend"
    value: "190 testes"
  - label: "Canais de serviço"
    value: "Financeiro · técnico · assistido"
  - label: "Estados de dados"
    value: "Real · demo · indisponível · não autorizado"
highlights:
  - "Autenticação por CPF/CNPJ com credenciais no servidor e proteção anti-IDOR"
  - "Faturas, chamados, diagnóstico óptico, planos, fila, CSAT e indicação"
  - "Atendimento síncrono e em streaming com guardrails explícitos para IA"
  - "BFF em Cloudflare Worker, persistência Neon, entrega Expo e E2E desktop/mobile"
---

## Visão geral

A Central do Assinante DBS Telecom é uma aplicação de autoatendimento em Expo/React Native apoiada por um BFF TypeScript. Ela reúne fluxos financeiros, técnicos e assistidos em uma jornada sem expor credenciais do IXC ou de provedores de IA ao dispositivo.

## Decisões de produto

O BFF é a fronteira de confiança. Ele concentra autenticação, autorização, adaptadores de provedores, persistência e orquestração de IA. Rotas de recursos aceitam um alias da própria conta, mas continuam verificando propriedade, impedindo que um cliente substitua o identificador por outro.

A interface também diferencia respostas reais dos provedores de estados demonstrativos, indisponíveis e não autorizados. Isso evita apresentar uma fixture local ou uma integração parcial como operação financeira ou de rede efetiva.

## O que eu construí

- Aplicação Expo/React Native com cobertura web responsiva.
- Autenticação, faturas, planos, chamados, fila, diagnósticos, CSAT e indicações.
- BFF TypeScript para IXC Soft, Neon Postgres, notificações e assistência de IA protegida.
- Contratos de migração, readiness, deploy e testes para runtimes Node e Cloudflare Worker.
