---
title: "Signal Ledger"
slug: "signal-ledger"
description: "A source-grounded briefing PWA that follows developing topics, shows what changed, and keeps evidence close to every conclusion."
tech: ["Next.js", "TypeScript", "Cloudflare Workers", "Neon Postgres", "pgvector", "R2", "OpenNext"]
featured: false
order: 7
lang: "en"
caseStudy: true
status: "private-source"
role: "Product strategy, editorial system, full-stack architecture, and deployment"
year: "2026"
decisionLog:
  problem: "News feeds optimize for individual links and recency, making it hard to follow how a topic changes or which sources support a conclusion."
  constraint: "Automated ingestion and analysis must expose missing or stale data honestly, preserve provenance, and run within edge-runtime and scheduled-job limits."
  decision: "Designed a topic-first pipeline that ingests sources, clusters related coverage, stores source snapshots, and produces evidence-linked briefings on Cloudflare Workers with Neon and R2."
  outcome: "Readers can follow the evolution of a topic through a calm briefing surface that distinguishes live evidence, unavailable data, and incomplete audio or analysis."
metrics:
  - label: "Ingestion cadence"
    value: "Every 10 minutes"
  - label: "Pipeline stages"
    value: "Ingest · cluster · analyze · brief"
  - label: "Evidence model"
    value: "Source context per conclusion"
highlights:
  - "Topic timelines emphasize what changed instead of repeating a feed"
  - "Source snapshots and provenance stay attached to analysis"
  - "Unavailable data and missing audio render honestly instead of falling back to fake content"
  - "Edge deployment with scheduled ingestion, readiness checks, and staged promotion"
---

## Overview

Signal Ledger is a living topic-briefing product. It collects coverage from multiple sources, groups related reporting, and presents the development of a story with the supporting source context close at hand.

## Product decisions

The editorial contract favors provenance and honest absence over synthetic completeness. A missing database, briefing, or audio asset becomes a clear unavailable state. Local fixtures are reserved for development and tests unless explicitly enabled.

The application runs as a Next.js PWA through OpenNext on Cloudflare Workers. Neon Postgres and pgvector support article, cluster, and briefing data; R2 stores source snapshots; scheduled jobs separate ingestion, clustering, analysis, and briefing work.

## What I built

- RSS and Atom ingestion with normalized source provenance.
- Topic clustering, multi-source comparison, and evidence-linked briefings.
- Editorial reading surfaces, accessible audio-transcript fallback, and responsive PWA behavior.
- Readiness checks, scheduled jobs, staging/production configuration, and rollback-aware deployment.

## Source availability

The product is actively operated from a private repository. This case study documents the architecture and product decisions without exposing provider credentials or unpublished source agreements.
