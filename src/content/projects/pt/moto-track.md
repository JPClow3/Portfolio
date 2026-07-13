---
title: "Moto Track"
slug: "moto-track"
description: "Um centro de comando para motocicletas que reúne consumo, manutenção, pneus, documentos, peças e inteligência de custos."
tech: ["Django", "HTMX", "Tailwind CSS", "PostgreSQL", "Docker"]
github: "https://github.com/JPClow3/moto_track"
image: "/projects/moto-track-og.png"
featured: true
order: 3
lang: "pt"
caseStudy: true
status: "live"
role: "Engenharia de produto, backend, interface e estratégia de deploy"
year: "2026"
decisionLog:
  problem: "Motociclistas registram combustível, manutenção, documentos, pneus e custos em anotações, apps e planilhas separadas."
  constraint: "O produto precisa responder como um app sem tornar o painel operacional difícil de manter ou publicar."
  decision: "Manter Django responsável pelo domínio e HTML do servidor, usar HTMX para interações focadas e Docker para uma execução reproduzível."
  outcome: "Uma única superfície conecta manutenção, custos, lembretes e uma futura visão de rentabilidade para quem trabalha com moto."
metrics:
  - label: "Módulos"
    value: "8"
  - label: "Interface"
    value: "HTMX"
  - label: "Deploy"
    value: "Docker-ready"
highlights:
  - "Consumo, custo por km e despesas"
  - "Intervalos de manutenção, lembretes e histórico"
  - "Ciclo de vida dos pneus, documentos e estoque de peças"
  - "Direção de produto para rentabilidade de trabalho"
---

## Visão geral

Moto Track começou como uma plataforma pessoal de gestão de motocicleta e evolui para uma proposta mais objetiva: ajudar quem pilota a entender o custo real de operação sem viver em planilhas.

## Decisões de produto

Django concentra o domínio e as páginas renderizadas no servidor, HTMX dá interatividade específica e Tailwind mantém a interface rápida de evoluir. Essa combinação preserva uma experiência responsiva e um caminho operacional simples.
