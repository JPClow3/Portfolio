---
title: "DBS Telecom Subscriber Hub"
slug: "dbs-telecom"
description: "An interview project prototype exploring telecom subscriber self-service flows through a mobile app and guarded BFF."
tech: ["Expo", "React Native", "TypeScript", "Cloudflare Workers", "Neon Postgres", "IXC Soft", "AI"]
github: "https://github.com/JPClow3/dbs-telecom"
featured: false
order: 8
lang: "en"
caseStudy: true
status: "prototype"
role: "Mobile and backend prototype implementation for an interview project"
year: "2026"
decisionLog:
  problem: "The interview exercise explored bringing financial, technical, and service flows into one subscriber self-service experience."
  constraint: "The mobile app must never receive provider credentials, must prevent cross-account access, and must distinguish live provider data from demo or unavailable states."
  decision: "Built an Expo/React Native app behind a TypeScript BFF that centralizes JWT authorization, IXC Soft integration, Neon persistence, streaming chat, and bounded AI assistance."
  outcome: "The prototype demonstrates a journey for invoices, support, plans, and diagnostics with sensitive integrations isolated on the server; it is not a production customer service."
highlights:
  - "CPF/CNPJ authentication with server-side credentials and anti-IDOR checks"
  - "Invoices, support tickets, optical diagnostics, plans, queueing, CSAT, and referrals"
  - "Synchronous and streamed assistance with explicit AI guardrails"
  - "Cloudflare Worker BFF, Neon persistence, Expo app, and desktop/mobile browser E2E"
---

## Overview

This is a technical prototype I developed for an interview project, using a DBS Telecom subscriber hub as the scenario. The Expo/React Native app is backed by a TypeScript BFF and explores financial, technical, and assisted-service flows without exposing provider credentials to the device. It is not a deployed customer product.

## Product decisions

The BFF is the trust boundary. It owns authentication, authorization, provider adapters, persistence, and AI orchestration. Resource routes accept a self alias but still enforce account ownership, preventing a customer from substituting another identifier.

The interface also distinguishes live provider responses from demo, unavailable, and unauthorized states. That prevents a local fixture or partial integration from being presented as a real financial or network operation.

## Prototype scope

- Expo/React Native customer application with responsive web coverage.
- Authentication, invoices, plans, support tickets, queueing, diagnostics, CSAT, and referrals.
- TypeScript BFF for IXC Soft, Neon Postgres, notifications, and guarded AI assistance.
- Migration, readiness, deployment, and test contracts for Node and Cloudflare Worker runtimes.
