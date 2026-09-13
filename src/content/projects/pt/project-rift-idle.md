---
title: "Project Rift Idle"
slug: "project-rift-idle"
description: "Um RPG incremental e determinístico de formação de equipes em que composição, posição, itens e respostas aos chefes importam mais que acumular atributos."
tech: ["TypeScript", "Vite", "Canvas 2D", "Vitest", "Cloudflare Workers", "Neon Postgres"]
featured: false
order: 14
lang: "pt"
caseStudy: true
status: "prototype"
role: "Game design, combate determinístico, progressão, interface, persistência e deploy"
year: "2026"
decisionLog:
  problem: "A progressão de RPGs idle pode virar apenas espera por números maiores, tornando composição e conhecimento do encontro irrelevantes."
  constraint: "O combate precisa ser determinístico e testável, recompensas offline limitadas, ativos licenciados controlados e a economia protegida quando há sincronização em nuvem."
  decision: "Construí uma simulação de combate semeada em passos de 100 ms, baseada em fileiras, estados, itens de resposta e mecânicas de chefes, com progressão local e limites de economia autoritativa no servidor."
  outcome: "A fatia vertical oferece campanha de 16 fases, quatro chefes mecânicos, ascensões repetidas, farm offline, conquistas e revanche pós-jogo em que uma composição melhor muda o resultado."
metrics:
  - label: "Fases da campanha"
    value: "16"
  - label: "Chefes mecânicos"
    value: "4"
  - label: "Limite de recompensa offline"
    value: "12 horas"
highlights:
  - "Combate determinístico com linhas, cadeias de estados e itens de resposta"
  - "Progressão de um campeão até uma composição completa de cinco membros"
  - "Ascensão, maestria, conquistas, farm offline e Rift Echoes pós-jogo"
  - "Saves versionados, sincronização autenticada e economia autoritativa no servidor"
---

## Visão geral

Project Rift Idle é um protótipo de RPG incremental baseado em uma ideia simples: o tempo fortalece a equipe, mas o conhecimento libera o progresso. Jogadores escolhem formação, equipamentos e sinergias antes de batalhas automáticas determinísticas mostrarem se o plano responde ao encontro.

## Decisões de produto

O combate usa passos fixos de 100 ms e aleatoriedade semeada. Equipes e seeds idênticos reproduzem o mesmo resultado, permitindo verificar respostas a chefes e interações de estados em testes, não apenas por sensação.

A primeira campanha cresce de um campeão para cinco vagas permanentes e então alimenta ascensões repetidas. Renda offline tem limite, recompensas persistentes são explícitas e economias vinculadas à conta mantêm gravações autoritativas no servidor.

## O que eu construí

- Combate headless determinístico, posicionamento, estados, equipamentos e relatório de dano.
- Campanha de 16 fases com quatro chefes baseados em composição e itens de resposta.
- Treinamento, maestria, Essência Rúnica, Santuário, conquistas, ascensão e revanche pós-jogo.
- Saves locais versionados, recompensas offline limitadas, sincronização em nuvem e marketplace.
- Pixel art original integrada a ativos com licenças registradas.

## Estado atual

Este é um protótipo fã de código privado, não afiliado nem endossado pela Riot Games. Ele é apresentado como estudo de sistemas de jogo e engenharia, não como produto comercial ao vivo.
