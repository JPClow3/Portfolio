---
title: "Lorebound"
slug: "lorebound"
description: "A reader-first interactive-fiction platform that pairs curated story worlds with controlled AI turns, persistent memory, and transparent usage."
tech: ["TypeScript", "React", "Neon Postgres", "Drizzle", "Cloudflare Workers", "AI", "Stripe"]
image: "/projects/lorebound.webp"
featured: true
order: 4
lang: "en"
caseStudy: true
status: "in-development"
role: "Product direction, reader experience, AI contracts, and full-stack architecture"
year: "2026"
decisionLog:
  problem: "AI fiction can feel limitless but quickly loses authorship, continuity, and a clear reason for readers to trust the next turn."
  constraint: "The platform needs creative freedom without hidden costs, disposable memory, or a generic chat-first reading experience."
  decision: "Anchor play in curated story packs, persist memory around reader choices, and run shared Drizzle contracts and migrations on Neon Postgres behind a Hono API on Cloudflare Workers."
  outcome: "Lorebound keeps the reader inside authored worlds while making AI capability, continuity, and usage understandable."
metrics:
  - label: "Reader model"
    value: "Story packs"
  - label: "Continuity"
    value: "Persistent memory"
  - label: "Runtime"
    value: "Cloudflare Workers"
highlights:
  - "Curated worlds set the tone before an AI turn extends it"
  - "Reader choices and memory inform the next chapter"
  - "Drizzle schema and shared TypeScript contracts on Neon Postgres"
  - "Hono API on Cloudflare Workers with selective generated media"
---

## Overview

Lorebound is an in-development interactive-fiction platform with a reader-first point of view. The goal is not unlimited generated text; it is authored worlds that can respond to a reader while remaining coherent, deliberate, and enjoyable to return to.

## Product Decisions

Story packs provide the setting, tone, and curated material. AI is used where it strengthens the reading experience: evolving a turn, retaining meaningful memory, supporting a custom action, or adding selective media. Ink makes the cost model visible rather than hiding it behind an ambiguous quota.

## Current Architecture

- The client is a React and Vite progressive web app for catalog, reading, account, and billing flows.
- A Hono API runs on Cloudflare Workers and owns the server-side story, account, AI, and usage contracts.
- Shared TypeScript types, Drizzle schema, migrations, and seed data live in `packages/shared` and target Neon Postgres.
- Neon Auth handles authentication, while Stripe and Cloudflare R2 support billing and generated assets.

This is the current Neon/Drizzle/Cloudflare architecture for Lorebound.

## What I Am Building

- A React reader experience backed by a Hono API on Cloudflare Workers.
- Shared contracts, structured events, and persistence for story state and memory.
- Story-pack access and a platform-wide usage model designed for reader clarity.
- A creator-ready foundation that avoids treating every world as a different product.
