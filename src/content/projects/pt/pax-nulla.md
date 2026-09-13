---
title: "Pax Nulla"
slug: "pax-nulla"
description: "Uma simulação geopolítica por turnos em que economia, diplomacia, comércio, guerra e política interna criam uma crise de 2026 diferente a cada campanha."
tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "d3-geo", "Cloudflare Pages"]
featured: false
order: 13
lang: "pt"
caseStudy: true
status: "prototype"
role: "Sistemas de jogo, motor de simulação, design de produto, interface e deploy"
year: "2026"
decisionLog:
  problem: "Jogos de estratégia geopolítica costumam reduzir poder a indicadores isolados, desconectando comércio, política interna, alianças e guerra."
  constraint: "Dezenas de nações controladas por IA precisam tomar decisões legíveis a cada turno mensal, enquanto os saves continuam determinísticos, portáteis e locais no navegador."
  decision: "Construí um motor tipado que avança sistemas nacionais interdependentes a partir de um único estado semeado, com saves locais versionados e uma interface de comando orientada por mapa."
  outcome: "Jogadores lideram mais de 40 nações em cinco cenários de crise enquanto escolhas econômicas, diplomáticas, militares, comerciais e políticas se propagam pelo mesmo mundo."
metrics:
  - label: "Nações jogáveis"
    value: "40+"
  - label: "Cenários de crise"
    value: "5"
  - label: "Mercados de commodities"
    value: "11"
highlights:
  - "Sistemas fiscais, monetários, comerciais, diplomáticos, militares, nucleares e políticos interligados"
  - "Turnos autônomos para todas as nações não controladas"
  - "Saves versionados com quicksave, autosave, slots, importação e exportação"
  - "Mapa, alertas, relatórios mensais e condições de vitória por cenário"
---

## Visão geral

Pax Nulla é uma simulação geopolítica sobre forjar estabilidade, não herdá-la. Uma campanha começa em janeiro de 2026 e avança mês a mês enquanto mercados, alianças, guerras, eleições, facções e crises encadeadas interagem.

## Decisões de produto

A simulação usa um estado de mundo compartilhado e tipado para que uma decisão não fique presa em um painel. Uma restrição comercial pode afetar preços, pressão fiscal, confiança diplomática, estabilidade interna e prontidão militar em turnos posteriores.

Os saves permanecem no navegador e seguem um schema versionado. Quicksave, autosaves rotativos, slots nomeados e importação/exportação em JSON tornam campanhas longas recuperáveis sem depender de contas.

## O que eu construí

- Mais de 40 perfis de nações jogáveis e cinco conjuntos de regras por cenário.
- Simulação mensal de economia, comércio bilateral, commodities, diplomacia, alianças, guerra, inteligência, eleições e regimes.
- Decisões autônomas para nações não jogadas e eventos de crise encadeados.
- Mapa de comando, painéis, alertas, relatórios, atalhos e gerenciamento local de saves.

## Estado atual

Pax Nulla é um protótipo de código privado em desenvolvimento ativo. O estudo de caso apresenta o design da simulação sem sugerir um serviço público em produção.
