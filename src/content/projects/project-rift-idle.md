---
title: "Project Rift Idle"
slug: "project-rift-idle"
description: "A deterministic incremental team-building RPG where composition, positioning, items, and boss counters matter more than passive stat growth."
tech: ["TypeScript", "Vite", "Canvas 2D", "Vitest", "Cloudflare Workers", "Neon Postgres"]
featured: false
order: 14
lang: "en"
caseStudy: true
status: "prototype"
role: "Game design, deterministic combat, progression, UI, persistence, and deployment"
year: "2026"
decisionLog:
  problem: "Idle RPG progression can collapse into waiting for larger numbers, leaving team composition and encounter knowledge irrelevant."
  constraint: "Combat must be deterministic and testable, offline rewards bounded, licensed assets controlled, and the economy protected when cloud sync is enabled."
  decision: "Built a seeded 100 ms combat simulation around rows, statuses, equipment counters, and boss mechanics, then layered local progression and server-authoritative cloud economy boundaries on top."
  outcome: "The vertical slice supports a full 16-stage campaign, four mechanical bosses, repeated ascension, offline farming, achievements, and post-game rematches where better composition changes outcomes."
metrics:
  - label: "Campaign stages"
    value: "16"
  - label: "Mechanical bosses"
    value: "4"
  - label: "Offline reward cap"
    value: "12 hours"
highlights:
  - "Seeded deterministic combat with frontline/backline, status chains, and item counters"
  - "Progression from one champion to a full five-member composition"
  - "Ascension, mastery, achievements, offline farming, and post-game Rift Echoes"
  - "Versioned saves plus signed-in cloud sync and server-authoritative economy boundaries"
---

## Overview

Project Rift Idle is an incremental team-building RPG prototype built around a simple idea: time makes the team stronger, but knowledge unlocks progress. Players choose a formation, equipment, and synergy plan before deterministic automated battles expose whether that plan answers the encounter.

## Product decisions

Combat runs on a fixed 100 ms timestep with seeded randomness. Identical teams and seeds reproduce the same result, allowing boss counters and status interactions to be verified in tests instead of tuned only by feel.

The first campaign grows from one champion to five permanent slots, then feeds repeated ascension. Offline income is capped, persistent rewards are explicit, and cloud-enabled account economies keep authoritative writes on the server.

## What I built

- Deterministic headless combat, row positioning, status registry, equipment, and damage reporting.
- A 16-stage campaign with four bosses designed around composition and item counters.
- Training, mastery, Rune Essence, Rune Sanctum, achievements, ascension, and post-game rematches.
- Versioned local saves, bounded offline rewards, cloud sync, marketplace, and account systems.
- Original role-readable pixel art integrated alongside explicitly licensed assets.

## Current state

This is an unofficial private-source fan prototype and is not affiliated with or endorsed by Riot Games. It is presented as a game-systems and engineering study, not a live commercial product.
