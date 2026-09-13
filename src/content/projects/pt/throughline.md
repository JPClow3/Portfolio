---
title: "Throughline"
slug: "throughline"
description: "Um planejador focado em privacidade que mantém metas, tarefas, notas, quadros e linhas do tempo disponíveis offline, com sincronização criptografada opcional."
tech: ["React", "TypeScript", "IndexedDB", "PWA", "Criptografia ponta a ponta"]
github: "https://github.com/JPClow3/Throughline"
image: "/projects/throughline.webp"
featured: true
order: 6
lang: "pt"
caseStudy: true
status: "live"
role: "Estratégia de produto, design de interação, arquitetura local-first e modelo de privacidade"
year: "2026"
decisionLog:
  problem: "Ferramentas de planejamento fragmentam o trabalho em listas desconectadas e deixam de ser confiáveis quando a conexão falha."
  constraint: "O produto precisa funcionar offline e sincronizar entre dispositivos sem expor metas e notas privadas ao servidor."
  decision: "Usar IndexedDB como fonte de verdade, criptografar registros de sincronização no dispositivo e reduzir propositalmente os dados das notificações."
  outcome: "Um planejador instalável funciona primeiro no dispositivo, enquanto a sincronização opcional preserva privacidade sem mudar o fluxo diário."
metrics:
  - label: "Uso offline"
    value: "Dados locais continuam disponíveis"
  - label: "Prova de privacidade"
    value: "Sincronização ponta a ponta"
  - label: "Visões de planejamento"
    value: "Metas · quadro · linha do tempo"
highlights:
  - "Metas agrupam o progresso das tarefas"
  - "Notas se conectam a tarefas e metas"
  - "PWA instalável para navegador, celular e Windows"
  - "Camada de gamificação permanece opcional"
---

## Visão geral

Throughline parte de uma promessa simples: planos devem continuar calmos e úteis mesmo quando a conexão não existe. Metas sustentam o trabalho, notas permanecem ligadas a ele e as visões de quadro e linha do tempo mostram o mesmo plano sem duplicá-lo.

## Privacidade pela arquitetura

O navegador mantém os dados de trabalho no IndexedDB. Ao ativar sincronização, a pessoa criptografa os registros no dispositivo com uma chave derivada da senha antes de enviá-los. O servidor recebe apenas texto cifrado.
