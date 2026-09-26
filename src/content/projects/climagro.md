---
title: "ClimAgro"
slug: "climagro"
description: "ClimAgro UniRV, coordinated by Prof. Dr. Gilmar Oliveira Santos, brings together weather data and climate analysis to support agricultural planning in Rio Verde."
tech: ["Python", "Django", "JavaScript", "PostgreSQL", "INMET", "FAO-56", "Docker", "Playwright"]
image: "/projects/climagro.webp"
featured: true
order: 5
lang: "en"
caseStudy: true
status: "private-source"
role: "Web platform and data-flow development in a project coordinated by Prof. Dr. Gilmar Oliveira Santos"
year: "2026"
decisionLog:
  problem: "Raw station measurements are difficult to turn into timely, explainable irrigation and climate decisions for producers and technical teams."
  constraint: "The product depends on a separate ingestion service, incomplete historical windows, agronomic formulas, and infrastructure that must fail honestly when upstream data is stale or unavailable."
  decision: "The implementation separates weather ingestion from the Django application through an OpenAPI contract; FAO-56-based calculations include explicit historical warm-up, and charts are paired with accessible tables."
  outcome: "The platform presents daily and hourly climate data, water balance, irrigation estimates, and fire-risk inputs while indicating data freshness and gaps."
metrics:
  - label: "Weather resolution"
    value: "Daily + hourly"
  - label: "Decision workflows"
    value: "Water · irrigation · fire risk"
  - label: "Contract boundary"
    value: "Versioned producer OpenAPI"
highlights:
  - "FAO-56 evapotranspiration and water-balance calculations with historical warm-up"
  - "Paired INMET producer and Django consumer with contract-drift checks"
  - "Accessible chart tables, downloads, responsive visual regression, and freshness states"
  - "Containerized PostgreSQL deployment with health, metrics, backups, and immutable image tags"
---

## Overview

ClimAgro UniRV is coordinated by Prof. Dr. Gilmar Oliveira Santos to make regional weather information, historical data, and climate analysis available for agricultural planning. It also serves researchers, students, and the wider community. My contribution is to the web platform and its data flows.

## Product decisions

Ingestion and presentation are separate services with an explicit contract. The producer normalizes INMET data; the Django application consumes a pinned OpenAPI snapshot and fails contract checks when a sibling producer drifts. This keeps deployment boundaries visible instead of coupling calculations to a hidden scraper.

Agronomic outputs preserve chronology as well as totals. Water-balance calculations include the historical warm-up required for the selected period, expose residual deficit by magnitude and duration, and pair interactive charts with accessible tabular data and downloads.

## Technical contributions

- Daily and hourly station-data exploration with monthly and annual summaries.
- FAO-56 evapotranspiration, water balance, irrigation, and fire-risk workflows.
- Producer/consumer OpenAPI drift checks and truthful upstream freshness states.
- Responsive, accessible charts and downloadable data.
- PostgreSQL, container, health, metrics, backup, and release automation.

## Source availability

ClimAgro is a UniRV institutional project under the technical and scientific coordination of Prof. Dr. Gilmar Oliveira Santos, operated from private repositories. This case study describes my technical contribution without attributing authorship or coordination of the project to me.
