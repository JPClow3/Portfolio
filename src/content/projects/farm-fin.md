---
title: "Farm-Fin"
slug: "farm-fin"
description: "A financial and agronomic management platform that connects farm cash flow, crops, inputs, inventory, barter, hedge, DRE, and Brazilian LCDPR reporting."
tech: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle", "Cloudflare", "Excel"]
featured: false
order: 15
lang: "en"
caseStudy: true
status: "private-source"
role: "Product architecture, financial/agronomic domain modeling, interface, and deployment"
year: "2026"
decisionLog:
  problem: "Farm financial control is often split between bank files, spreadsheets, accounting reports, input inventory, crop records, and physical commodity contracts."
  constraint: "The system must preserve accounting traceability across installments, approvals, reconciliations, units, cost allocation, tax output, and crop-specific operational views."
  decision: "Modeled the workflows in a strict TypeScript/Next.js application backed by Neon and Drizzle, with explicit domain states and native spreadsheet exports for operational handoff."
  outcome: "Farm managers can connect cash, inventory, field cost, receivables, barter, hedge, DRE, and LCDPR work in one consistent operational model."
metrics:
  - label: "Core workflow groups"
    value: "9"
  - label: "Tax output"
    value: "LCDPR layout 1.3"
  - label: "Operational exports"
    value: "Native multi-sheet XLSX"
highlights:
  - "Payables, receivables, cash-flow scenarios, bank reconciliation, and approvals"
  - "Barter and hedge contracts with physical and financial settlement states"
  - "Weighted-average inventory, lots, expiry, Kardex, and field/crop cost allocation"
  - "Agricultural DRE, LCDPR generation, printable reports, and Excel exports"
---

## Overview

Farm-Fin is a private agribusiness platform that connects financial controls with the physical reality of a farm. Cash movements, crops, fields, machinery, inputs, inventory, barter, hedge, accounting statements, and tax output share one domain model.

## Product decisions

The application uses explicit workflow states instead of treating every record as a generic transaction. Payables can carry installments, recurrence, attachments, approvals, and aging; contracts can remain open until price fixation or physical delivery; inventory preserves lot and weighted-average cost history.

Next.js and strict TypeScript define the product surface, Neon Postgres and Drizzle hold the relational model, and multi-sheet XLSX exports keep the system useful alongside accountants and established operational processes.

## What I built

- Farm, field, crop, partner, machinery, and labor master data.
- Payables, receivables, approvals, recurrence, cash-flow scenarios, and reconciliation.
- Barter, hedge, input stock, weighted-average cost, lots, Kardex, and overhead allocation.
- Crop/field cost, agricultural DRE, LCDPR 1.3, print, and Excel exports.

## Source availability

Farm-Fin is private-source work. This case study describes the domain and architecture without exposing client data or proprietary implementation details.
