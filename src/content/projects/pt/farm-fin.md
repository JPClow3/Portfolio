---
title: "Farm-Fin"
slug: "farm-fin"
description: "Projeto acadêmico da disciplina Prática de Engenharia de Software da UniRV sobre modelagem de fluxos financeiros e operacionais no agronegócio."
tech: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle", "Cloudflare", "Excel"]
featured: false
order: 15
lang: "pt"
caseStudy: true
status: "in-development"
role: "Modelagem de domínio e implementação em projeto da disciplina Prática de Engenharia de Software da UniRV"
year: "2026"
decisionLog:
  problem: "O controle financeiro rural costuma ficar dividido entre arquivos bancários, planilhas, relatórios contábeis, estoque de insumos, registros de safra e contratos físicos de commodities."
  constraint: "O exercício exige pensar na rastreabilidade entre parcelas, aprovações, conciliações, unidades, rateios, saída fiscal e visões por safra, sem tratar o protótipo como sistema implantado em uma fazenda."
  decision: "O domínio foi modelado em uma aplicação Next.js com TypeScript, Neon e Drizzle, com estados explícitos para estudar as relações entre os fluxos."
  outcome: "O trabalho organiza requisitos e decisões de implementação para um protótipo acadêmico de gestão rural; não representa uma operação em produção."
highlights:
  - "Modelagem de contas, cenários de caixa, conciliação, recorrência e aprovações"
  - "Estudo de contratos de barter e hedge e seus estados físicos e financeiros"
  - "Modelagem de estoque, custo médio e rateio por talhão e safra"
  - "Exploração de DRE agrícola, LCDPR e exportações para a rotina contábil"
---

## Visão geral

Farm-Fin é um projeto da disciplina Prática de Engenharia de Software da UniRV. O protótipo explora como controles financeiros podem se relacionar com safras, talhões, máquinas, insumos, estoque, contratos e obrigações fiscais. É um trabalho acadêmico em desenvolvimento, sem operação em fazendas.

## Decisões de produto

Na modelagem do protótipo, estados explícitos ajudam a diferenciar parcelas, aprovações, contratos e movimentos de estoque em vez de tratar tudo como uma transação genérica.

Next.js e TypeScript definem a aplicação; Neon Postgres e Drizzle apoiam o modelo relacional. O estudo também considera exportações XLSX para representar a troca de informações com rotinas contábeis.

## Escopo estudado no protótipo

- Cadastro e relação entre fazendas, talhões, safras, parceiros e máquinas.
- Estados de contas, aprovações, recorrência, cenários de caixa e conciliação.
- Relações entre contratos, estoque, custo médio, lotes e rateio.
- Requisitos de custo por safra, DRE agrícola, LCDPR e exportação.

## Disponibilidade do código

O código do Farm-Fin é privado. Este estudo de caso apresenta a proposta e decisões de engenharia do trabalho acadêmico, sem sugerir uso em produção ou dados de clientes.
