---
title: "Pax Nulla"
slug: "pax-nulla"
description: "A turn-based geopolitical simulation where interconnected economics, diplomacy, trade, war, and domestic politics create a different 2026 crisis each run."
tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "d3-geo", "Cloudflare Pages"]
featured: false
order: 13
lang: "en"
caseStudy: true
status: "prototype"
role: "Game systems, simulation engine, product design, interface, and deployment"
year: "2026"
decisionLog:
  problem: "Geopolitical strategy games often simplify power into isolated meters, leaving trade, domestic politics, alliances, and war disconnected."
  constraint: "Dozens of AI-controlled nations must make legible decisions every monthly turn while saves remain deterministic, portable, and local to the browser."
  decision: "Built a typed simulation engine that advances interdependent national systems from one seeded state, with versioned local saves and a map-driven command interface."
  outcome: "Players can lead more than 40 nations through five crisis scenarios while economic, diplomatic, military, trade, and political choices propagate across the same world state."
metrics:
  - label: "Playable nations"
    value: "40+"
  - label: "Crisis scenarios"
    value: "5"
  - label: "Commodity markets"
    value: "11"
highlights:
  - "Interlocking fiscal, monetary, trade, diplomacy, military, nuclear, and political systems"
  - "Autonomous turns for every non-player nation"
  - "Versioned browser saves with quicksave, autosave, slots, import, and export"
  - "Map, alerts, monthly reports, and scenario-specific victory conditions"
---

## Overview

Pax Nulla is a geopolitical simulation about forging stability rather than inheriting it. A campaign starts in January 2026 and advances month by month as markets, alliances, wars, elections, internal factions, and chained crises interact.

## Product decisions

The simulation uses a shared, typed world state so a policy decision is not confined to one dashboard. A trade restriction can affect commodity prices, fiscal pressure, diplomatic trust, domestic stability, and military readiness over later turns.

Saves remain in the browser and follow a versioned schema. Quicksave, rotating autosaves, named slots, and JSON import/export make long campaigns recoverable without depending on an account service.

## What I built

- More than 40 playable nation profiles and five scenario rule sets.
- Monthly simulation for economics, bilateral trade, commodities, diplomacy, alliances, war, intelligence, elections, and regime change.
- Autonomous decision-making for non-player nations and chained crisis events.
- Command map, dashboards, alerts, reports, shortcuts, and local save management.

## Current state

Pax Nulla is an actively developed private-source prototype. The case study presents the simulation design without implying a public production service.
