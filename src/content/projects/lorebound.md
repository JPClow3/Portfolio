---
title: "Lorebound"
slug: "lorebound"
description: "A reader-first interactive-fiction platform that pairs curated story worlds with controlled AI turns, persistent memory, and transparent usage."
tech: ["TypeScript", "React", "Cloudflare Workers", "Supabase", "AI", "Stripe"]
image: "/projects/lorebound-cover.svg"
featured: true
order: 2
lang: "en"
caseStudy: true
status: "in-development"
role: "Product direction, reader experience, AI contracts, and full-stack architecture"
year: "2026"
decisionLog:
  problem: "AI fiction can feel limitless but quickly loses authorship, continuity, and a clear reason for readers to trust the next turn."
  constraint: "The platform needs creative freedom without hidden costs, disposable memory, or a generic chat-first reading experience."
  decision: "Anchor play in curated story packs, persist memory around reader choices, and use one visible Ink cost table for turns, retries, images, and context."
  outcome: "Lorebound keeps the reader inside authored worlds while making AI capability, continuity, and usage understandable."
metrics:
  - label: "Reader model"
    value: "Story packs"
  - label: "Continuity"
    value: "Persistent memory"
  - label: "Usage"
    value: "One Ink table"
highlights:
  - "Curated worlds set the tone before an AI turn extends it"
  - "Reader choices and memory inform the next chapter"
  - "Structured worker API and shared TypeScript contracts"
  - "Selective generated media rather than generation for its own sake"
---

## Overview

Lorebound is an in-development interactive-fiction platform with a reader-first point of view. The goal is not unlimited generated text; it is authored worlds that can respond to a reader while remaining coherent, deliberate, and enjoyable to return to.

## Product decisions

Story packs provide the setting, tone, and curated material. AI is used where it strengthens the reading experience: evolving a turn, retaining meaningful memory, supporting a custom action, or adding selective media. Ink makes the cost model visible rather than hiding it behind an ambiguous quota.

## What I am building

- A React reader experience backed by a Hono API on Cloudflare Workers.
- Shared contracts, structured events, and persistence for story state and memory.
- Story-pack access and a platform-wide usage model designed for reader clarity.
- A creator-ready foundation that avoids treating every world as a different product.
