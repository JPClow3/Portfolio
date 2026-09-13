---
title: "Moto Track"
slug: "moto-track"
description: "A live SvelteKit motorcycle operations platform for fuel, maintenance, documents, costs, professional shifts, and profitability, backed by Neon and Cloudflare."
tech: ["SvelteKit", "TypeScript", "Neon Postgres", "Cloudflare", "Stripe", "Resend"]
github: "https://github.com/JPClow3/moto_track"
link: "https://moto-track.net/"
image: "/projects/moto-track.webp"
featured: true
order: 1
lang: "en"
caseStudy: true
status: "live"
decisionLog:
  problem: "Riders and professional motorcycle operators need one reliable place for fuel, upkeep, documents, costs, and the work that makes a motorcycle profitable."
  constraint: "The product needs fast app-like workflows, offline capture, edge deployment, and paid plans without splitting operational data across separate systems."
  decision: "Rebuild the product with SvelteKit, Neon Postgres, and Cloudflare services, then connect Stripe for plans and Resend for transactional email."
  outcome: "The live product now covers day-to-day motorcycle operations, including professional shifts, profitability, offline fuel capture, and supporting guides."
role: "Product engineering, full-stack delivery, UI, and deployment strategy"
year: "2026"
problem: "Riders and professional motorcycle operators need one reliable place for fuel, upkeep, documents, costs, and the work that makes a motorcycle profitable."
solution: "A live SvelteKit platform that centralizes fuel, maintenance, tires, documents, reminders, expenses, professional shifts, and profitability reports."
impact: "Moto Track turns scattered motorcycle records into an operating surface for ownership and work use, with offline fuel capture and a clear path from free access to Stripe plans."
metrics:
  - label: "Product status"
    value: "Live SaaS"
  - label: "Offline workflow"
    value: "Fuel capture + sync"
  - label: "Business model"
    value: "Stripe plans"
highlights:
  - "Fuel, maintenance, tires, documents, reminders, and expenses"
  - "Professional shifts, work costs, and profitability reports"
  - "Offline fuel capture with queued synchronization"
  - "Pricing, guides, transactional email, and Cloudflare delivery"
---

## Overview

Moto Track is a live SvelteKit motorcycle operations platform. It brings fuel, maintenance, tires, documents, reminders, expenses, professional shifts, and profitability into one place instead of leaving the rider to reconcile notes and spreadsheets.

The product serves both everyday ownership and work use. Riders can record fuel while offline and synchronize it later, follow maintenance and tire history, review operating costs, and use work and report views to understand whether professional riding is paying off.

## Product Decisions

The current application uses SvelteKit and TypeScript for the product surface, Neon Postgres for persistent data, and Cloudflare for the edge runtime and object storage. Neon Auth handles authentication, while app-layer ownership checks protect records. Stripe powers the paid plans and billing lifecycle; Resend sends transactional app email in-process.

This keeps the operational workflows close to the data while preserving a deployment path that is fast to iterate. Offline fuel capture is deliberately narrow and explicit: it queues the supported record locally and synchronizes it when connectivity returns instead of pretending the entire product is offline-first.

## What I Built

- A live motorcycle dashboard for fuel, maintenance, tires, documents, reminders, expenses, and reports.
- Professional work-shift records with cost and profitability views.
- Offline fuel capture with a visible queue and synchronization path.
- Pricing and Stripe checkout/portal flows, plus transactional email through Resend.
- Public guides and supporting product surfaces around the authenticated application.

## Current Scope

Moto Track is live at [moto-track.net](https://moto-track.net/) and remains an actively evolving product. Its public roadmap can describe future work, but the workflows above are already part of the current product.
