---
title: "ClimAgro"
slug: "climagro"
description: "An operational agronomy platform that turns daily and hourly weather data into water-balance, irrigation, and fire-risk decisions."
tech: ["Python", "Django", "JavaScript", "PostgreSQL", "INMET", "FAO-56", "Docker", "Playwright"]
featured: true
order: 5
lang: "en"
caseStudy: true
status: "private-source"
role: "Full-stack engineering, producer/consumer data contracts, agronomic models, and operations"
year: "2026"
decisionLog:
  problem: "Raw station measurements are difficult to turn into timely, explainable irrigation and climate decisions for producers and technical teams."
  constraint: "The product depends on a separate ingestion service, incomplete historical windows, agronomic formulas, and infrastructure that must fail honestly when upstream data is stale or unavailable."
  decision: "Separated weather ingestion from the Django product, pinned their OpenAPI contract, implemented FAO-56-based calculations with explicit warm-up semantics, and added accessible tables alongside interactive charts."
  outcome: "Users can inspect daily and hourly climate data, water balance, irrigation estimates, and fire-risk inputs through operational workflows that expose freshness and gaps instead of hiding them."
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

ClimAgro turns meteorological measurements into operational agronomy tools. Daily and hourly station data feed climate summaries, water balance, irrigation calculations, newsletters, and a fire-risk workflow.

## Product decisions

Ingestion and presentation are separate services with an explicit contract. The producer normalizes INMET data; the Django application consumes a pinned OpenAPI snapshot and fails contract checks when a sibling producer drifts. This keeps deployment boundaries visible instead of coupling calculations to a hidden scraper.

Agronomic outputs preserve chronology as well as totals. Water-balance calculations include the historical warm-up required for the selected period, expose residual deficit by magnitude and duration, and pair interactive charts with accessible tabular data and downloads.

## What I built

- Daily and hourly station-data exploration with monthly and annual summaries.
- FAO-56 evapotranspiration, water balance, irrigation, and fire-risk workflows.
- Producer/consumer OpenAPI drift checks and truthful upstream freshness states.
- Responsive, accessible charts and downloadable data.
- PostgreSQL, container, health, metrics, backup, and release automation.

## Source availability

ClimAgro is institutional work operated from private repositories. The case study documents the public product behavior and non-sensitive engineering decisions.
