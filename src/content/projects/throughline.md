---
title: "Throughline"
slug: "throughline"
description: "A calm, local-first planner that keeps goals, tasks, notes, boards, and timelines useful even when the network disappears."
tech: ["React", "TypeScript", "IndexedDB", "PWA", "End-to-End Encryption"]
github: "https://github.com/JPClow3/Throughline"
image: "https://raw.githubusercontent.com/JPClow3/Throughline/main/apps/web/public/screenshot-1.png"
featured: true
order: 1
lang: "en"
caseStudy: true
status: "live"
role: "Product strategy, interaction design, local-first architecture, and privacy model"
year: "2026"
decisionLog:
  problem: "Planning tools often fragment work across disconnected lists and become unreliable when a connection or a hosted service is unavailable."
  constraint: "The product must work offline and sync between devices without turning private goals and notes into readable server data."
  decision: "Use IndexedDB as the source of truth, encrypt sync records on-device, and keep push payloads deliberately redacted."
  outcome: "A calm installable planner works locally first, while optional sync preserves privacy without changing the daily workflow."
metrics:
  - label: "Persistence"
    value: "Offline-first"
  - label: "Sync"
    value: "E2E encrypted"
  - label: "Surfaces"
    value: "Goals · board · timeline"
highlights:
  - "Goals roll up task progress instead of sitting beside disconnected to-dos"
  - "Notes cross-link to tasks and goals"
  - "Installable PWA for browser, phone, and Windows"
  - "Optional game layer stays off until a user chooses it"
---

## Overview

Throughline is built around a simple promise: plans should remain calm and useful even when the connection is not. Goals hold the work, notes stay connected to it, and board and timeline views expose the same underlying plan without duplicating it.

## Privacy by architecture

The browser owns the working data through IndexedDB. When a user enables sync, records are encrypted on-device with a password-derived key before they leave the device. The server stores ciphertext, and reminder payloads avoid task titles or other sensitive detail.

## What I built

- A local-first PWA with goals, tasks, notes, projects, board, and timeline views.
- Encrypted cross-device sync that keeps the server out of the user’s private content.
- Notification infrastructure designed around redacted payloads.
- A visual system that favors calm, low-friction planning over constant engagement loops.
