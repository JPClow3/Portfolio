---
title: "AgroHub UniRV"
slug: "agrohub"
description: "A live Django web portal for UniRV's startup ecosystem, events, services, and public-access channels, built as a fast, maintainable institutional home."
tech: ["Python", "Django", "HTMX", "Tailwind CSS", "Alpine.js", "Docker Swarm", "Portainer"]
link: "https://agrohub.unirv.edu.br/"
image: "/projects/agrohub.webp"
featured: true
order: 2
lang: "en"
caseStudy: true
status: "live"
role: "Web application development for a UniRV institutional project"
year: "2026"
decisionLog:
  problem: "UniRV's innovation ecosystem had no single entry point for startups, mentors, partners, and the public to find incubation programs, events, and institutional information."
  constraint: "The portal had to serve very different audiences — applicants, partners, and compliance/transparency requirements — without becoming a slow, hard-to-maintain institutional CMS."
  decision: "Contributed to the server-rendered Django application, using HTMX for focused interactivity and Alpine.js for lightweight client-side behavior, and shipping it in containers behind Docker Swarm."
  outcome: "AgroHub UniRV now centralizes the startup directory, events calendar, service listings, and institutional access channels in a portal that stays fast and simple to operate."
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

## Technical Contributions

- A public directory of incubated startups with program details.
- An events calendar covering mentorships, workshops, and pitch days.
- Service listings for the NIT (technology innovation office) and community-facing programs.
- Institutional access channels — transparency, ombudsman, and public information — integrated into the portal.

## Role

AgroHub is a UniRV institutional project developed with the hub team. My role focused on web application development and deployment. UniRV leads the initiative and its institutional decisions.
