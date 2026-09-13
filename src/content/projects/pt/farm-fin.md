---
title: "Farm-Fin"
slug: "farm-fin"
description: "Uma plataforma de gestão financeira e agronômica que conecta fluxo de caixa, safras, insumos, estoque, barter, hedge, DRE e o LCDPR brasileiro."
tech: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle", "Cloudflare", "Excel"]
featured: false
order: 15
lang: "pt"
caseStudy: true
status: "private-source"
role: "Arquitetura de produto, modelagem financeira/agronômica, interface e deploy"
year: "2026"
decisionLog:
  problem: "O controle financeiro rural costuma ficar dividido entre arquivos bancários, planilhas, relatórios contábeis, estoque de insumos, registros de safra e contratos físicos de commodities."
  constraint: "O sistema precisa preservar rastreabilidade contábil entre parcelas, aprovações, conciliações, unidades, rateios, saída fiscal e visões operacionais por safra."
  decision: "Modelei os fluxos em uma aplicação Next.js com TypeScript estrito, Neon e Drizzle, usando estados explícitos do domínio e exportações nativas para integração operacional."
  outcome: "Gestores conectam caixa, estoque, custo por área, recebíveis, barter, hedge, DRE e LCDPR em um único modelo operacional consistente."
metrics:
  - label: "Grupos centrais de fluxo"
    value: "9"
  - label: "Saída fiscal"
    value: "LCDPR layout 1.3"
  - label: "Exportações operacionais"
    value: "XLSX nativo com múltiplas abas"
highlights:
  - "Contas, cenários de caixa, conciliação bancária, recorrência e aprovações"
  - "Contratos de barter e hedge com estados físicos e financeiros"
  - "Custo médio, lotes, validade, Kardex e rateio por talhão/safra"
  - "DRE agrícola, geração do LCDPR, impressão e exportações Excel"
---

## Visão geral

Farm-Fin é uma plataforma privada para o agronegócio que conecta controles financeiros à realidade física da fazenda. Movimentos de caixa, safras, talhões, máquinas, insumos, estoque, barter, hedge, demonstrativos e obrigações fiscais compartilham um único domínio.

## Decisões de produto

A aplicação usa estados de workflow explícitos em vez de tratar todo registro como transação genérica. Contas a pagar carregam parcelas, recorrência, anexos, aprovações e aging; contratos permanecem abertos até fixação ou entrega; estoque preserva lote e histórico de custo médio.

Next.js e TypeScript estrito definem a superfície, Neon Postgres e Drizzle sustentam o modelo relacional e exportações XLSX com múltiplas abas mantêm o sistema integrado ao trabalho de contadores e processos já estabelecidos.

## O que eu construí

- Cadastros de fazendas, talhões, safras, parceiros, máquinas e colaboradores.
- Contas, aprovações, recorrência, cenários de caixa e conciliação.
- Barter, hedge, estoque, custo médio, lotes, Kardex e rateio de overhead.
- Custo por safra/talhão, DRE agrícola, LCDPR 1.3, impressão e Excel.

## Disponibilidade do código

Farm-Fin é um trabalho de código privado. Este estudo de caso apresenta domínio e arquitetura sem expor dados de clientes ou detalhes proprietários.
