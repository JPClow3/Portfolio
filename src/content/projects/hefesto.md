---
title: "Hefesto"
slug: "hefesto"
description: "A research and re-architecture project for wildfire ignition-risk modeling in Goias, Brazil. Historical experiments are retained for reproducibility; the current direction is real-time-first."
tech: ["Python", "XGBoost", "Geospatial Data", "Climate Data", "ML Ops"]
image: "/projects/hefesto-risk-grid.svg"
featured: false
order: 11
lang: "en"
caseStudy: true
status: "research"
decisionLog:
  problem: "Build a defensible path toward daily wildfire ignition-risk modeling over Goias without confusing historical benchmarks with an operational prediction service."
  constraint: "The retired v1-v5 lines used historical batch CSVs and sources whose real operational latency was not suitable for a live product."
  decision: "Retire the previous lines, preserve their contracts and reports, and redesign around real-time-first source contracts before new dataset features enter the pipeline."
  outcome: "Hefesto is now research and re-architecture work; PR-AUC 0.4565 is retained only as the historical v5_0 benchmark, not as live-model performance."
role: "Data modeling, research-pipeline design, validation, and documentation"
year: "2026"
problem: "Wildfire ignition-risk research needs a reproducible daily model over a 1 km grid, with climate, dryness, vegetation, and historical comparability handled honestly."
solution: "A re-architecture workspace with schema contracts, dataset manifests, experiment history, diagnostics, and an explicit real-time-first source audit."
impact: "The repository keeps a reproducible historical benchmark while making the missing operational data path visible before any new model is presented as live."
metrics:
  - label: "Grid"
    value: "1 km"
  - label: "Historical PR-AUC"
    value: "0.4565 (v5_0)"
  - label: "Current state"
    value: "Real-time-first redesign"
highlights:
  - "v1-v5_0 history preserved as retired research, not a live service"
  - "Operational-latency audit for fire, climate, and vegetation sources"
  - "Dataset contracts, manifests, diagnostics, and experiment records"
  - "Clear boundary between historical evidence and the next research phase"
---

## Overview

Hefesto is a research and re-architecture project for wildfire ignition risk in Goias, Brazil. It is not currently a live prediction system. The repository is in transition toward a real-time-first design, with the data contract and source latency treated as prerequisites for any future operational model.

## Current State

The v1 through v5_0 experiment lines were retired after an audit found that their inputs were historical CSV batches rather than operationally live feeds. GPM Final has roughly 3.5 months of latency, ERA5T roughly five days, and MODIS composites weeks of real latency. The repository had no live data puller, so the old lines are not presented as current service capability.

The current work preserves the useful research structure—schemas, manifests, validation, reports, and experiment history—while the next line is designed around documented sources with known operational latency.

## Historical Benchmark

The best historical result is v5_0: PR-AUC **0.4565**, F1 **0.4157**, and ROC-AUC **0.7344** on the repository's historical evaluation. This number is kept for reproducibility and comparison only. It is not a live score, a deployed model claim, or evidence that the real-time-first redesign is complete.

## What I Built

- Versioned experiment records and dataset contracts for comparing research lines.
- Manifests, validation checks, diagnostics, and reports that preserve why a result changed.
- XGBoost and feature-engineering history across temporal, spatial, climate, dryness, and MODIS experiments.
- A clear re-architecture boundary that requires an operationally documented source before new features enter a future pipeline.

## Next Research Phase

The next phase is to validate operational sources first, then define the real-time-first dataset and model contracts. Until that work is complete, Hefesto remains a research project with a historical benchmark—not a deployed wildfire-risk product.
