---
title: "AI Development Controller"
slug: "ai-dev-controller"
description: "A deterministic workflow controller that turns Linear issues into dependency-aware agent work, validated changes, and draft pull requests."
tech: ["TypeScript", "Linear", "GitHub", "Orca", "SQLite", "Vitest", "Windows"]
github: "https://github.com/JPClow3/ai-dev-controller"
featured: false
order: 9
lang: "en"
caseStudy: true
status: "prototype"
role: "System design, workflow engine, provider routing, safety policy, and operations"
year: "2026"
decisionLog:
  problem: "Agent-driven development becomes difficult to trust when planning, retries, dependencies, provider choice, and delivery evidence live only inside prompts."
  constraint: "Models may recommend actions but cannot own protected transitions, merge code, bypass dependency state, or retry indefinitely."
  decision: "Built a deterministic TypeScript controller around Linear, Orca, and GitHub with persisted lifecycle state, dependency waves, bounded recovery, safety-screened commands, and independent validation."
  outcome: "Issues progress from curation to draft PR through an auditable state machine, while genuine blockers surface with evidence and mechanical policies remain outside the model."
metrics:
  - label: "Delivery path"
    value: "Linear issue → draft PR"
  - label: "Scheduling model"
    value: "Merged-dependency waves"
  - label: "Recovery policy"
    value: "Bounded and resumable"
highlights:
  - "Persisted lifecycle, run claims, audit trail, scoring, and provider state"
  - "Fresh-base worktrees and dependency eligibility based on merged PRs"
  - "Safety-screened setup and validation commands with finite retry budgets"
  - "Windows supervisor, CLI/TUI operations, and multi-provider routing"
---

## Overview

AI Development Controller is the deterministic layer underneath an agent development workflow. Linear remains the planning surface, Orca runs isolated workers, and GitHub receives draft pull requests; the controller decides which transition is mechanically allowed.

## Product decisions

Models produce recommendations, not authority. The controller verifies lifecycle preconditions, dependency state, fresh base revisions, command safety, validation evidence, and retry budgets before writing a transition. A dependency is satisfied only after its pull request is merged.

Workflow state and audit evidence are persisted in SQLite so restarts do not erase claims or silently repeat work. Provider availability and routing are evaluated from one shared eligibility snapshot, while bounded recovery distinguishes routine remediation from genuine human blockers.

## What I built

- Linear issue curation and a persisted state machine through draft pull request creation.
- Dependency-aware scheduling, worktree setup, provider routing, scoring, and recovery.
- Safety-screened commands, immutable validation contracts, and independent review stages.
- CLI/TUI operations plus a current-user Windows supervisor for restart recovery.

## Current state

This is a working public prototype and operational research project. It is deliberately described as a controller, not as a general autonomous software engineer or a finished hosted platform.
