---
title: "Hello World — How These Notes Began"
description: "A short note on the move from João Paulo Santos's personal development blog to JPCLOW's engineering notes and project case studies."
pubDate: 2025-01-15
updatedDate: 2026-09-27
tags: ["introduction", "portfolio", "engineering notes"]
draft: false
lang: en
slug: hello-world
---

## From a personal blog to engineering notes

This page began as the introduction to João Paulo Santos's personal development blog. The site now presents JPCLOW, the software engineering studio he founded. The original URL remains available so existing links continue to work; new articles focus on specific product and engineering decisions.

The [case study catalog](/projects/) distinguishes live products from prototypes, research, and work in development. Each case describes the problem, the role played, the main decision, and the current outcome. The [company page](/about/) explains João Paulo's background and the studio's way of working.

## What to read next

- [Why Moto Track queues only fuel records offline](/blog/offline-fuel-capture-moto-track/) examines one narrow offline workflow and its limits.
- [Moto Track case study](/projects/moto-track/) covers the product, stack, and current scope.

These notes describe implemented behavior and its trade-offs. When a project is still a prototype or under development, its case study says so.

```typescript
type ProjectEvidence = {
  status: 'live' | 'in-development' | 'prototype' | 'research';
  role: string;
  decision: string;
};
```
