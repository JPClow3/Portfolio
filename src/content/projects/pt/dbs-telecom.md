---
title: "Central do Assinante DBS Telecom"
slug: "dbs-telecom"
description: "Protótipo criado para um projeto de entrevista, explorando fluxos de autoatendimento para assinantes de telecomunicações em um app móvel e BFF."
tech: ["Expo", "React Native", "TypeScript", "Cloudflare Workers", "Neon Postgres", "IXC Soft", "IA"]
github: "https://github.com/JPClow3/dbs-telecom"
featured: false
order: 8
lang: "pt"
caseStudy: true
status: "prototype"
role: "Implementação do protótipo mobile e backend para um projeto de entrevista"
year: "2026"
decisionLog:
  problem: "O exercício de entrevista propunha reunir fluxos financeiros, técnicos e de atendimento em uma experiência de autoatendimento para assinantes."
  constraint: "O aplicativo não pode receber credenciais de provedores, precisa impedir acesso entre contas e diferenciar dados reais de estados demonstrativos ou indisponíveis."
  decision: "Construí um app Expo/React Native atrás de um BFF TypeScript que centraliza autorização JWT, integração IXC Soft, persistência Neon, chat em streaming e assistência de IA com limites."
  outcome: "O protótipo demonstra uma jornada para faturas, suporte, planos e diagnósticos, com integrações sensíveis isoladas no servidor; não representa um serviço em produção."
highlights:
  - "Autenticação por CPF/CNPJ com credenciais no servidor e proteção anti-IDOR"
  - "Faturas, chamados, diagnóstico óptico, planos, fila, CSAT e indicação"
  - "Atendimento síncrono e em streaming com guardrails explícitos para IA"
  - "BFF em Cloudflare Worker, persistência Neon, aplicativo Expo e E2E desktop/mobile"
---

## Visão geral

Este é um protótipo técnico que desenvolvi como projeto de entrevista, usando o cenário de uma central do assinante DBS Telecom. A aplicação em Expo/React Native é apoiada por um BFF TypeScript e explora fluxos financeiros, técnicos e assistidos sem expor credenciais de provedores ao dispositivo. Não é um produto implantado para clientes.

## Decisões de produto

O BFF é a fronteira de confiança. Ele concentra autenticação, autorização, adaptadores de provedores, persistência e orquestração de IA. Rotas de recursos aceitam um alias da própria conta, mas continuam verificando propriedade, impedindo que um cliente substitua o identificador por outro.

A interface também diferencia respostas reais dos provedores de estados demonstrativos, indisponíveis e não autorizados. Isso evita apresentar uma fixture local ou uma integração parcial como operação financeira ou de rede efetiva.

## Escopo do protótipo

- Aplicação Expo/React Native com cobertura web responsiva.
- Autenticação, faturas, planos, chamados, fila, diagnósticos, CSAT e indicações.
- BFF TypeScript para IXC Soft, Neon Postgres, notificações e assistência de IA protegida.
- Contratos de migração, readiness, deploy e testes para runtimes Node e Cloudflare Worker.
