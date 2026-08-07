---
title: "AgroHub UniRV"
slug: "agrohub"
description: "Um portal de hub de inovação para o ecossistema de empreendedorismo da UniRV, reunindo startups incubadas, eventos e serviços institucionais em um só lugar."
tech: ["Python", "Django", "HTMX", "Tailwind CSS", "Alpine.js", "Docker Swarm", "Portainer"]
link: "https://agrohub.unirv.edu.br/"
image: "/projects/agrohub.png"
featured: true
order: 5
lang: "pt"
caseStudy: true
status: "live"
role: "Freelance full-stack — design e desenvolvimento, sozinho"
year: "2026"
decisionLog:
  problem: "O ecossistema de inovação da UniRV não tinha um ponto único de entrada para startups, mentores, parceiros e o público encontrarem programas de incubação, eventos e informações institucionais."
  constraint: "O portal precisava atender públicos muito diferentes — candidatos, parceiros e exigências de transparência — sem virar um CMS institucional lento e difícil de manter."
  decision: "Construí uma aplicação Django renderizada no servidor, com HTMX para interatividade pontual e Alpine.js para comportamentos leves no cliente, publicada em containers com Docker Swarm e gerenciada pelo Portainer."
  outcome: "O AgroHub UniRV agora centraliza o diretório de startups, calendário de eventos, catálogo de serviços e canais de acesso institucional em um portal rápido e simples de operar."
metrics:
  - label: "Startups incubadas"
    value: "38+"
  - label: "Projetos atendidos"
    value: "100+"
  - label: "Parcerias"
    value: "20+"
highlights:
  - "Diretório público de startups incubadas"
  - "Calendário de eventos para mentorias, workshops e dias de pitch"
  - "Canais de transparência e acesso à informação integrados"
  - "Modelo de quádrupla hélice: universidade, indústria, governo e sociedade"
---

## Visão geral

O AgroHub UniRV é o portal do hub de inovação e empreendedorismo da Universidade de Rio Verde (UniRV). Ele reúne o programa de incubação de startups da universidade, o calendário de mentorias e eventos, os serviços oferecidos e as exigências de transparência institucional em um único site público.

## Decisões de produto

O stack prioriza confiabilidade e baixo custo operacional em vez de novidade. Django concentra o domínio e as páginas renderizadas no servidor, HTMX adiciona interatividade exatamente onde é necessário, e Alpine.js cuida de pequenos comportamentos no cliente sem trazer um framework de frontend completo. A aplicação roda em containers orquestrados com Docker Swarm e é gerenciada no dia a dia pelo Portainer.

## O que eu construí

- Diretório público de startups incubadas com detalhes do programa.
- Calendário de eventos cobrindo mentorias, workshops e dias de pitch.
- Catálogo de serviços do NIT (núcleo de inovação tecnológica) e programas voltados à comunidade.
- Canais de acesso institucional — transparência, ouvidoria e informação pública — integrados ao portal.

## Papel

Projeto freelance cobrindo a construção completa: design de UI/UX, frontend, backend e deploy, entregue sozinho.
