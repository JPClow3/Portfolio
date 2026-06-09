---
title: "Hefesto"
description: "A daily wildfire ignition-risk modeling system for Goias, Brazil, built around versioned data, climate signals, and reproducible evaluation."
tech: ["Python", "XGBoost", "Geospatial Data", "Climate Data", "ML Ops"]
image: "/projects/hefesto-risk-grid.svg"
featured: true
order: 2
lang: "en"
caseStudy: true
role: "Data modeling, pipeline design, validation, and documentation"
year: "2026"
problem: "Wildfire ignition risk needs a reproducible daily model over a 1 km grid, with climate, dryness, vegetation, and historical comparability handled carefully."
solution: "A versioned research pipeline with schema contracts, dataset manifests, experiment profiles, model registry entries, diagnostics, and cross-version metrics."
impact: "Materialized climate and MODIS lines improved model ordering quality from v3.0 PR-AUC 0.407 to v5.0 PR-AUC 0.456 while keeping the work auditable."
metrics:
  - label: "Grid"
    value: "1 km"
  - label: "Best PR-AUC"
    value: "0.456"
  - label: "Roadmap"
    value: "v2-v8"
highlights:
  - "Versioned configs, manifests, metrics, and registry entries"
  - "XGBoost climate, dryness, and MODIS feature line"
  - "Calibration diagnostics by time, season, and subregion"
  - "Clear split between executable work and future backlog"
---

## Overview

Hefesto is a wildfire ignition-risk modeling project focused on Goias, Brazil. The work is less about a single model artifact and more about building a disciplined research system: repeatable datasets, versioned experiments, meaningful diagnostics, and a clean record of what changed.

The public-facing story stays intentionally safe. It explains the modeling architecture and impact without exposing private operational paths, credentials, or deployment details.

## Modeling Shape

The project works on a daily 1 km grid and compares experiment lines across fixed evaluation rules. The strongest materialized line adds climate antecedents, dry-window signals, nearest-station assignments, and MODIS-derived information.

The main quality gain came from treating the pipeline as a product: schema contracts, manifests, named versions, frozen baselines, registry entries, and diagnostics that make every result explainable.

## What I Built

- Versioned experiment profiles from baseline through climate and MODIS feature lines.
- Dataset manifests and validation checks to keep results comparable.
- XGBoost modeling workflows with PR-AUC tracking across versions.
- Calibration and diagnostic reporting for temporal and regional behavior.

## Outcome

The model line improved from a v3.0 PR-AUC of 0.407 to a v5.0 PR-AUC of 0.456. More importantly, the project now has enough structure to keep improving without losing the thread of why each experiment changed.
