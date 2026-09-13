---
title: "DBS Telecom Subscriber Hub"
slug: "dbs-telecom"
description: "A mobile self-service platform that connects DBS Telecom customers to billing, support, plans, diagnostics, and assisted service through one guarded BFF."
tech: ["Expo", "React Native", "TypeScript", "Cloudflare Workers", "Neon Postgres", "IXC Soft", "AI"]
github: "https://github.com/JPClow3/dbs-telecom"
featured: false
order: 8
lang: "en"
caseStudy: true
status: "live"
role: "Mobile and backend product engineering, integrations, security boundaries, and delivery"
year: "2026"
decisionLog:
  problem: "Subscriber support tasks were fragmented across financial, technical, and service channels, creating friction for customers and operational load for staff."
  constraint: "The mobile app must never receive provider credentials, must prevent cross-account access, and must distinguish live provider data from demo or unavailable states."
  decision: "Built an Expo/React Native app behind a TypeScript BFF that centralizes JWT authorization, IXC Soft integration, Neon persistence, streaming chat, and bounded AI assistance."
  outcome: "Customers get one self-service journey for invoices, support, plans, diagnostics, queueing, and feedback while sensitive integrations remain isolated behind the server boundary."
metrics:
  - label: "Backend regression suite"
    value: "190 tests"
  - label: "Service channels"
    value: "Financial · technical · assisted"
  - label: "Truthful data states"
    value: "Live · demo · unavailable · unauthorized"
highlights:
  - "CPF/CNPJ authentication with server-side credentials and anti-IDOR checks"
  - "Invoices, support tickets, optical diagnostics, plans, queueing, CSAT, and referrals"
  - "Synchronous and streamed assistance with explicit AI guardrails"
  - "Cloudflare Worker BFF, Neon persistence, Expo delivery, and desktop/mobile browser E2E"
---

## Overview

The DBS Telecom Subscriber Hub is an Expo/React Native self-service application backed by a TypeScript BFF. It brings financial, technical, and assisted-service workflows into one customer journey without exposing IXC or AI provider credentials to the device.

## Product decisions

The BFF is the trust boundary. It owns authentication, authorization, provider adapters, persistence, and AI orchestration. Resource routes accept a self alias but still enforce account ownership, preventing a customer from substituting another identifier.

The interface also distinguishes live provider responses from demo, unavailable, and unauthorized states. That prevents a local fixture or partial integration from being presented as a real financial or network operation.

## What I built

- Expo/React Native customer application with responsive web coverage.
- Authentication, invoices, plans, support tickets, queueing, diagnostics, CSAT, and referrals.
- TypeScript BFF for IXC Soft, Neon Postgres, notifications, and guarded AI assistance.
- Migration, readiness, deployment, and test contracts for Node and Cloudflare Worker runtimes.
