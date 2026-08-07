---
title: "AgroHub UniRV"
slug: "agrohub"
description: "An innovation-hub portal for UniRV's entrepreneurship ecosystem, bringing incubated startups, events, and institutional services into one place."
tech: ["Python", "Django", "HTMX", "Tailwind CSS", "Alpine.js", "Docker Swarm", "Portainer"]
link: "https://agrohub.unirv.edu.br/"
image: "/projects/agrohub.png"
featured: true
order: 5
lang: "en"
caseStudy: true
status: "live"
role: "Freelance full-stack — design and development, solo"
year: "2026"
decisionLog:
  problem: "UniRV's innovation ecosystem had no single entry point for startups, mentors, partners, and the public to find incubation programs, events, and institutional information."
  constraint: "The portal had to serve very different audiences — applicants, partners, and compliance/transparency requirements — without becoming a slow, hard-to-maintain institutional CMS."
  decision: "Built a server-rendered Django application with HTMX for focused interactivity and Alpine.js for lightweight client-side behavior, shipped as containers behind Docker Swarm and managed through Portainer."
  outcome: "AgroHub UniRV now centralizes the startup directory, events calendar, service listings, and institutional access channels in a portal that stays fast and simple to operate."
metrics:
  - label: "Startups incubated"
    value: "38+"
  - label: "Projects supported"
    value: "100+"
  - label: "Partnerships"
    value: "20+"
highlights:
  - "Public directory of incubated startups"
  - "Events calendar for mentorships, workshops, and pitch days"
  - "Institutional transparency and public-access channels built in"
  - "Quadruple-helix model: university, industry, government, and society"
---

## Overview

AgroHub UniRV is the innovation and entrepreneurship hub portal for Universidade de Rio Verde (UniRV). It brings together the university's startup incubation program, its calendar of mentorships and events, service offerings, and institutional transparency requirements in a single public-facing site.

## Product Decisions

The stack favors reliability and low operating cost over novelty. Django owns the domain model and server-rendered pages, HTMX adds interactivity exactly where it's needed, and Alpine.js handles small client-side behaviors without pulling in a full frontend framework. The app runs as containers orchestrated with Docker Swarm and managed day-to-day through Portainer.

## What I Built

- A public directory of incubated startups with program details.
- An events calendar covering mentorships, workshops, and pitch days.
- Service listings for the NIT (technology innovation office) and community-facing programs.
- Institutional access channels — transparency, ombudsman, and public information — integrated into the portal.

## Role

Freelance engagement covering the full build: UI/UX design, frontend, backend, and deployment, delivered solo.
