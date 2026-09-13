---
title: "Inova Rio Verde"
slug: "inova-rio-verde"
description: "Uma experiência geoespacial em produção que transforma hubs, incubadoras e programas de Rio Verde em uma trilha de inovação explorável."
tech: ["Next.js", "Tailwind CSS", "Mapbox", "MapTiler", "deck.gl", "Cloudflare Hyperdrive", "Neon Postgres", "Neon Auth"]
link: "https://inovarioverde.org/"
image: "/projects/inova-rio-verde.webp"
featured: true
order: 3
lang: "pt"
caseStudy: true
status: "live"
role: "Freelance full-stack — design e desenvolvimento, sozinho"
year: "2026"
decisionLog:
  problem: "O ecossistema de inovação de Rio Verde — hubs, incubadoras, universidades e programas — não tinha uma forma visual compartilhada de mostrar onde estão os atores de inovação da cidade e como eles se conectam."
  constraint: "O site precisava de uma camada geoespacial interativa sem a latência e o custo operacional de um backend tradicional pesado, mantendo-se fácil de atualizar."
  decision: "Construí o frontend em Next.js com Mapbox, MapTiler e deck.gl para a trilha interativa, com Neon Postgres acessado via Cloudflare Hyperdrive para consultas de baixa latência na borda, e Neon Auth cuidando do controle de acesso."
  outcome: "O Inova Rio Verde apresenta o ecossistema de inovação da cidade como uma trilha geoespacial explorável, em vez de uma lista estática de instituições."
metrics:
  - label: "Superfície do produto"
    value: "Trilha de inovação municipal"
  - label: "Modelo operacional"
    value: "Dados geoespaciais na borda"
  - label: "Escopo da entrega"
    value: "Do design ao deploy"
highlights:
  - "Trilha da Inovação interativa e geoespacial mapeando o ecossistema local"
  - "Acesso a Postgres otimizado na borda via Cloudflare Hyperdrive"
  - "Implantado em Next.js com um caminho de dados totalmente serverless"
  - "Construído sozinho: design, frontend, backend e deploy"
---

## Visão geral

O Inova Rio Verde é um site voltado ao poder público local que apresenta o ecossistema de inovação de Rio Verde — hubs, incubadoras, universidades e programas de apoio — como uma "Trilha da Inovação" interativa, em vez de uma página de diretório comum.

## Decisões de produto

O mapa é o produto. Next.js conduz o frontend, Mapbox e MapTiler fornecem o mapa base, e deck.gl renderiza a camada interativa da trilha por cima. Os dados ficam no Neon Postgres, acessados via Cloudflare Hyperdrive para que as consultas continuem rápidas a partir da borda, em vez de percorrerem uma única região de banco de dados. O Neon Auth cuida da camada de acesso.

## O que eu construí

- Uma "Trilha da Inovação" interativa baseada em mapa conectando os atores de inovação da cidade.
- Um caminho de dados serverless do Next.js até o Neon Postgres, passando pelo Cloudflare Hyperdrive.
- Autenticação e controle de acesso via Neon Auth.
- Toda a identidade visual e a interface do site.

## Papel

Projeto freelance cobrindo a construção completa: design de UI/UX, frontend, backend e deploy, entregue sozinho.
