---
title: "FATEC Digital Platform"
slug: "fatec"
description: "A production education platform that unifies institutional content, admissions, public-service registration, candidate administration, and direct boleto access."
tech: ["Python", "Django", "HTMX", "Alpine.js", "Tailwind CSS", "PostgreSQL", "Banco do Brasil"]
link: "https://www.fateccacu.edu.br/"
featured: false
order: 16
lang: "en"
caseStudy: true
status: "private-source"
role: "Freelance product engineering — discovery, design, full-stack implementation, and operations"
year: "2026"
decisionLog:
  problem: "Institutional publishing, admissions, public-service applications, candidate support, and payments were split across manual processes and disconnected pages."
  constraint: "The system handles personal and payment data, multiple institutions, deadline-driven public notices, and non-technical administrators while its source remains client-confidential."
  decision: "Built a server-rendered Django platform with focused HTMX and Alpine.js interactions, a tailored Unfold administration workspace, private media controls, and Banco do Brasil Cobranças integration."
  outcome: "Candidates can register and access their boleto directly in the product, while staff manage notices, applications, documents, status changes, and reconciliation from one operational system."
metrics:
  - label: "Candidate journey"
    value: "Registration → boleto in product"
  - label: "Operational surfaces"
    value: "Public site · candidate area · admin"
  - label: "Payment path"
    value: "Banco do Brasil Cobranças"
highlights:
  - "Public notices, roles, applications, documents, and candidate status in one workflow"
  - "Direct boleto issuance and access without depending on email delivery"
  - "Private uploads, audit-friendly administration, and controlled payment reconciliation"
  - "Responsive and accessibility coverage for public and administrative journeys"
---

## Overview

The FATEC platform is more than an institutional website. It combines public content and course information with operational workflows for admissions, public-service registrations, candidate documents, administration, and payments.

## Product decisions

Server-rendered Django keeps sensitive workflows cohesive and auditable. HTMX and Alpine.js add interaction without turning every screen into a separate client application, while the Unfold-based administration area gives staff task-oriented views instead of exposing raw database records.

The payment flow treats email as cadastral data rather than a delivery dependency: after a valid registration, the candidate can access the generated boleto directly in the interface. Banco do Brasil integration, reconciliation, private document storage, and controlled status transitions stay behind the server boundary.

## What I built

- Institutional publishing, courses, news, units, and public contact journeys.
- Candidate registration, document submission, status tracking, and protected self-service.
- Administration for notices, roles, applications, exemptions, special-service requests, and payments.
- Banco do Brasil Cobranças boleto issuance and reconciliation.
- Deployment and operational safeguards for PostgreSQL, Redis, Nginx, Gunicorn, and scheduled reconciliation.

## Source availability

This is client work in production. The source repository is private; the public case study focuses on product scope, architecture, and non-sensitive operational decisions.
