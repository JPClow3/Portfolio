---
title: "Farm-Fin"
slug: "farm-fin"
description: "An academic project for UniRV's Software Engineering Practice course, exploring financial and operational workflows for Brazilian agriculture."
tech: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle", "Cloudflare", "Excel"]
featured: false
order: 15
lang: "en"
caseStudy: true
status: "in-development"
role: "Domain modeling and implementation for UniRV's Software Engineering Practice course"
year: "2026"
decisionLog:
  problem: "Farm financial control is often split between bank files, spreadsheets, accounting reports, input inventory, crop records, and physical commodity contracts."
  constraint: "The exercise must account for traceability across installments, approvals, reconciliation, units, allocation, tax output, and crop-specific views without presenting the prototype as a deployed farm system."
  decision: "The domain was modeled in a Next.js and TypeScript application backed by Neon and Drizzle, using explicit states to study relationships among workflows."
  outcome: "The work organizes requirements and implementation decisions for an academic rural-management prototype; it does not represent a production operation."
highlights:
  - "Modeling payables, cash-flow scenarios, reconciliation, recurrence, and approvals"
  - "Studying barter and hedge contracts and their physical and financial states"
  - "Modeling inventory, weighted-average cost, and field/crop allocation"
  - "Exploring agricultural DRE, LCDPR, and exports for accounting workflows"
---

## Overview

Farm-Fin is a project for UniRV's Software Engineering Practice course. The prototype explores how financial controls relate to crops, fields, machinery, inputs, inventory, contracts, and tax reporting. It is academic work in development, not a system operating on farms.

## Product decisions

The prototype models explicit states for installments, approvals, contracts, and inventory movements instead of treating every record as a generic transaction.

Next.js and TypeScript define the application, while Neon Postgres and Drizzle support the relational model. The study also considers XLSX exports to represent information exchange with accounting workflows.

## Scope explored in the prototype

- Relationships among farms, fields, crops, partners, and machinery.
- States for accounts, approvals, recurrence, cash-flow scenarios, and reconciliation.
- Relationships among contracts, inventory, weighted-average cost, lots, and allocation.
- Requirements for crop cost, agricultural DRE, LCDPR, and exports.

## Source availability

Farm-Fin's source code is private. This case study describes the proposal and engineering decisions behind the academic work without suggesting production use or client data.
