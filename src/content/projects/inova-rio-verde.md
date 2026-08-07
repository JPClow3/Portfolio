---
title: "Inova Rio Verde"
slug: "inova-rio-verde"
description: "A city-level innovation ecosystem site for Rio Verde, mapping local hubs, incubators, and programs along an interactive geospatial trail."
tech: ["Next.js", "Tailwind CSS", "Mapbox", "MapTiler", "deck.gl", "Cloudflare Hyperdrive", "Neon Postgres", "Neon Auth"]
link: "https://inovarioverde.org/"
image: "/projects/inova-rio-verde.png"
featured: true
order: 6
lang: "en"
caseStudy: true
status: "live"
role: "Freelance full-stack — design and development, solo"
year: "2026"
decisionLog:
  problem: "Rio Verde's innovation ecosystem — hubs, incubators, universities, and programs — had no shared visual way to show where the city's innovation actors are and how they connect."
  constraint: "The site needed an interactive geospatial layer without the latency and operational cost of a heavy traditional backend, while staying easy to update."
  decision: "Built the frontend in Next.js with Mapbox, MapTiler, and deck.gl for the interactive trail, backed by Neon Postgres accessed through Cloudflare Hyperdrive for low-latency edge queries, with Neon Auth handling access control."
  outcome: "Inova Rio Verde presents the city's innovation ecosystem as an explorable geospatial trail instead of a static list of institutions."
metrics:
  - label: "Map layer"
    value: "Mapbox + deck.gl"
  - label: "Data layer"
    value: "Neon Postgres via Hyperdrive"
  - label: "Auth"
    value: "Neon Auth"
highlights:
  - "Interactive geospatial 'Innovation Trail' mapping the local ecosystem"
  - "Edge-optimized Postgres access via Cloudflare Hyperdrive"
  - "Deployed on Next.js with a fully serverless data path"
  - "Built solo: design, frontend, backend, and deployment"
---

## Overview

Inova Rio Verde is a local-government-facing site presenting Rio Verde's innovation ecosystem — hubs, incubators, universities, and support programs — as an interactive "Innovation Trail" instead of a plain directory page.

## Product Decisions

The map is the product. Next.js drives the frontend, Mapbox and MapTiler supply the base map, and deck.gl renders the interactive trail layer on top. Data lives in Neon Postgres, reached through Cloudflare Hyperdrive so queries stay fast from the edge instead of round-tripping to a single database region. Neon Auth handles the access layer.

## What I Built

- An interactive map-based "Innovation Trail" connecting the city's innovation actors.
- A serverless data path from Next.js through Cloudflare Hyperdrive to Neon Postgres.
- Authentication and access control via Neon Auth.
- The full visual identity and UI for the site.

## Role

Freelance engagement covering the full build: UI/UX design, frontend, backend, and deployment, delivered solo.
