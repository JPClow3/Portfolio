---
title: "Controlador de Desenvolvimento com IA"
slug: "ai-dev-controller"
description: "Um controlador determinístico que transforma issues do Linear em trabalho de agentes com dependências, mudanças validadas e pull requests em rascunho."
tech: ["TypeScript", "Linear", "GitHub", "Orca", "SQLite", "Vitest", "Windows"]
github: "https://github.com/JPClow3/ai-dev-controller"
featured: false
order: 9
lang: "pt"
caseStudy: true
status: "prototype"
role: "Design do sistema, motor de workflow, roteamento de provedores, política de segurança e operação"
year: "2026"
decisionLog:
  problem: "Desenvolvimento guiado por agentes fica difícil de confiar quando planejamento, tentativas, dependências, escolha de provedores e evidências existem apenas dentro de prompts."
  constraint: "Modelos podem recomendar ações, mas não podem controlar transições protegidas, fazer merge, ignorar dependências ou repetir indefinidamente."
  decision: "Construí um controlador TypeScript determinístico em torno de Linear, Orca e GitHub, com ciclo de vida persistido, ondas de dependências, recuperação limitada, comandos verificados e validação independente."
  outcome: "Issues avançam da curadoria ao pull request em rascunho por uma máquina de estados auditável, enquanto bloqueios reais aparecem com evidências e políticas mecânicas permanecem fora do modelo."
metrics:
  - label: "Caminho de entrega"
    value: "Issue do Linear → PR em rascunho"
  - label: "Modelo de agendamento"
    value: "Ondas por dependências integradas"
  - label: "Política de recuperação"
    value: "Limitada e retomável"
highlights:
  - "Ciclo de vida, claims, trilha de auditoria, pontuação e estado de provedores persistidos"
  - "Worktrees em base atual e elegibilidade por pull requests integrados"
  - "Comandos de setup e validação verificados com orçamento finito de tentativas"
  - "Supervisor no Windows, operação por CLI/TUI e roteamento multiprovedor"
---

## Visão geral

O Controlador de Desenvolvimento com IA é a camada determinística por baixo de um fluxo de engenharia com agentes. Linear continua como superfície de planejamento, Orca executa workers isolados e GitHub recebe pull requests em rascunho; o controlador decide quais transições são mecanicamente permitidas.

## Decisões de produto

Modelos produzem recomendações, não autoridade. O controlador verifica pré-condições do ciclo de vida, dependências, revisão base, segurança dos comandos, evidências de validação e orçamento de tentativas antes de registrar uma transição. Uma dependência só é atendida após o merge do pull request.

Estado e auditoria ficam persistidos em SQLite para que reinícios não apaguem claims nem repitam trabalho silenciosamente. Disponibilidade e roteamento de provedores partem do mesmo snapshot de elegibilidade, enquanto a recuperação limitada diferencia correção rotineira de bloqueio humano real.

## O que eu construí

- Curadoria de issues do Linear e máquina de estados persistida até a criação do pull request.
- Agendamento por dependências, preparação de worktrees, roteamento, pontuação e recuperação.
- Comandos verificados por segurança, contratos imutáveis de validação e revisão independente.
- Operação por CLI/TUI e supervisor de usuário no Windows para retomada após reinícios.

## Estado atual

Este é um protótipo público funcional e um projeto de pesquisa operacional. Ele é descrito como controlador, não como engenheiro autônomo generalista ou plataforma hospedada concluída.
