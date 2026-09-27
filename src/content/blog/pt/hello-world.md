---
title: "Olá Mundo — Como Estas Notas Começaram"
description: "Uma nota sobre a passagem do blog pessoal de João Paulo Santos para as notas de engenharia e os cases da JPCLOW."
pubDate: 2025-01-15
updatedDate: 2026-09-27
tags: ["introdução", "portfólio", "notas de engenharia"]
draft: false
lang: pt
slug: hello-world
---

## Do blog pessoal às notas de engenharia

Esta página começou como a apresentação do blog pessoal de desenvolvimento de João Paulo Santos. Hoje, o site apresenta a JPCLOW, o estúdio de engenharia de software que ele fundou. A URL original continua disponível para preservar os links existentes; os novos artigos tratam de decisões concretas de produto e engenharia.

O [catálogo de cases](/pt/projects/) diferencia produtos em produção de protótipos, pesquisa e trabalhos em desenvolvimento. Cada case informa o problema, o papel desempenhado, a decisão principal e o resultado atual. A [página da empresa](/pt/about/) apresenta a trajetória de João Paulo e a forma de trabalho do estúdio.

## O que ler agora

- [Por que o Moto Track guarda apenas abastecimentos offline](/pt/blog/offline-fuel-capture-moto-track/) examina um fluxo offline específico e seus limites.
- [Case do Moto Track](/pt/projects/moto-track/) reúne o produto, a arquitetura e o escopo atual.

Estas notas descrevem comportamentos implementados e suas escolhas. Quando um projeto ainda é protótipo ou está em desenvolvimento, o respectivo case informa isso.

```typescript
type EvidenciaDoProjeto = {
  status: 'live' | 'in-development' | 'prototype' | 'research';
  papel: string;
  decisao: string;
};
```
