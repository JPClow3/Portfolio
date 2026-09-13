---
title: "Moto Track"
slug: "moto-track"
description: "Uma plataforma SaaS ativa em SvelteKit para operação de motocicletas, com abastecimento, manutenção, documentos, custos, turnos profissionais e rentabilidade, apoiada por Neon e Cloudflare."
tech: ["SvelteKit", "TypeScript", "Neon Postgres", "Cloudflare", "Stripe", "Resend"]
github: "https://github.com/JPClow3/moto_track"
link: "https://moto-track.net/"
image: "/projects/moto-track.webp"
featured: true
order: 1
lang: "pt"
caseStudy: true
status: "live"
role: "Engenharia de produto, entrega full-stack, interface e estratégia de deploy"
year: "2026"
decisionLog:
  problem: "Motociclistas e profissionais que trabalham com moto precisam de um lugar confiável para abastecimento, manutenção, documentos, custos e para o trabalho que torna a moto rentável."
  constraint: "O produto precisa de fluxos rápidos como os de um app, captura offline, execução na borda e planos pagos sem dividir os dados operacionais entre sistemas separados."
  decision: "Reconstruir o produto com SvelteKit, Neon Postgres e serviços Cloudflare, conectando Stripe para planos e Resend para emails transacionais."
  outcome: "O produto ativo agora cobre a operação diária da moto, incluindo turnos profissionais, rentabilidade, registro offline de abastecimento e guias de apoio."
problem: "Motociclistas e profissionais que trabalham com moto precisam de um lugar confiável para abastecimento, manutenção, documentos, custos e para o trabalho que torna a moto rentável."
solution: "Uma plataforma SvelteKit ativa que centraliza abastecimento, manutenção, pneus, documentos, lembretes, despesas, turnos profissionais e relatórios de rentabilidade."
impact: "O Moto Track transforma registros espalhados em uma superfície de operação para uso pessoal e profissional, com captura offline de abastecimento e um caminho claro do acesso gratuito aos planos Stripe."
metrics:
  - label: "Status do produto"
    value: "SaaS ativo"
  - label: "Fluxo offline"
    value: "Abastecimento + sincronização"
  - label: "Modelo de negócio"
    value: "Planos Stripe"
highlights:
  - "Abastecimento, manutenção, pneus, documentos, lembretes e despesas"
  - "Turnos profissionais, custos de trabalho e relatórios de rentabilidade"
  - "Captura offline de abastecimento com sincronização em fila"
  - "Preços, guias, emails transacionais e entrega na Cloudflare"
---

## Visão geral

Moto Track é uma plataforma ativa em SvelteKit para a operação de motocicletas. Ela reúne abastecimento, manutenção, pneus, documentos, lembretes, despesas, turnos profissionais e rentabilidade em um só lugar, sem exigir que o motociclista concilie anotações e planilhas.

O produto atende tanto a posse cotidiana quanto o uso profissional. É possível registrar um abastecimento offline e sincronizá-lo depois, acompanhar o histórico de manutenção e pneus, revisar custos de operação e usar as visões de trabalho e relatórios para entender se trabalhar com a moto está valendo a pena.

## Decisões de produto

A aplicação atual usa SvelteKit e TypeScript na superfície do produto, Neon Postgres para os dados persistentes e Cloudflare para o runtime na borda e o armazenamento de objetos. O Neon Auth cuida da autenticação, enquanto verificações no aplicativo protegem os registros por proprietário. O Stripe alimenta os planos pagos e o ciclo de cobrança; o Resend envia emails transacionais dentro da aplicação.

Isso mantém os fluxos operacionais próximos dos dados e preserva um caminho de deploy rápido de evoluir. A captura offline de abastecimento é deliberadamente explícita: ela coloca o registro compatível em uma fila local e sincroniza quando a conexão retorna, sem fingir que todo o produto é offline-first.

## O que construí

- Um painel ativo para abastecimento, manutenção, pneus, documentos, lembretes, despesas e relatórios.
- Registros de turnos profissionais com visões de custo e rentabilidade.
- Captura offline de abastecimento com fila e caminho visível de sincronização.
- Páginas de preços e fluxos de checkout/portal do Stripe, além de emails transacionais pelo Resend.
- Guias públicos e superfícies de apoio ao redor da aplicação autenticada.

## Escopo atual

O Moto Track está ativo em [moto-track.net](https://moto-track.net/) e continua evoluindo. O roadmap público pode descrever trabalhos futuros, mas os fluxos acima já fazem parte do produto atual.
