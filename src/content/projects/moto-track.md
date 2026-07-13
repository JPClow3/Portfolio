---
title: "Moto Track"
slug: "moto-track"
description: "A motorcycle command center for fuel economy, maintenance, tires, documents, parts, and cost intelligence."
tech: ["Django", "HTMX", "Tailwind CSS", "PostgreSQL", "Docker"]
github: "https://github.com/JPClow3/moto_track"
image: "/projects/moto-track-og.png"
featured: true
order: 3
lang: "en"
caseStudy: true
status: "live"
decisionLog:
  problem: "Riders track fuel, maintenance, documents, tires, and costs across scattered notes, apps, and spreadsheets."
  constraint: "The product needs app-like feedback without making the operational dashboard difficult to maintain or deploy."
  decision: "Keep Django in charge of the domain and server-rendered UX, then use HTMX for focused interactions and Docker for a repeatable runtime."
  outcome: "One operating surface now connects upkeep, cost visibility, reminders, and a future profitability workflow for professional riders."
role: "Product engineering, backend, UI, and deployment strategy"
year: "2026"
problem: "Riders and work-vehicle owners track fuel, maintenance, documents, tires, and costs across scattered notes, apps, and spreadsheets."
solution: "A server-rendered Django and HTMX dashboard that centralizes vehicle records, reminders, lifecycle tracking, parts, and cost views."
impact: "Turns motorcycle upkeep into a single operating surface and creates a path toward profitability tracking for motoboys and mototaxis."
metrics:
  - label: "Core modules"
    value: "8"
  - label: "Interface"
    value: "HTMX"
  - label: "Deploy"
    value: "Docker-ready"
highlights:
  - "Fuel economy, cost-per-km, and expense tracking"
  - "Maintenance intervals, reminders, and service history"
  - "Tire lifecycle, document vault, and parts inventory"
  - "Product direction toward work-vehicle profitability"
---

## Overview

Moto Track started as a personal motorcycle management platform and is moving toward a sharper product thesis: help riders understand the real operating cost of a motorcycle without living in spreadsheets.

The product keeps the interface intentionally direct. Fuel, maintenance, documents, tires, parts, reminders, and expenses all sit in one place so the rider can answer practical questions quickly: what changed, what is due, and what is this vehicle really costing?

## Product Decisions

The stack favors speed and maintainability over novelty. Django owns the domain model and server-rendered pages, HTMX adds focused interactivity, Tailwind keeps the UI fast to iterate, and Docker keeps the deployment path predictable.

That combination lets the product feel app-like while staying simple enough to extend into work-vehicle use cases such as motoboy and mototaxi profitability tracking.

## What I Built

- A structured vehicle dashboard for fuel, costs, maintenance, tires, documents, and parts.
- Reminder surfaces for maintenance and operational tasks.
- Cost and efficiency views that make long-term ownership patterns visible.
- Documentation around deployment and product direction.

## Next Direction

The strongest next step is turning the personal tracker into a more explicit operational dashboard: revenue, work shifts, per-route costs, and monthly profitability for riders who use motorcycles as work vehicles.
