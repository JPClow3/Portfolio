---
title: "Local First Planning: Why Throughline Encrypts Before Sync"
description: "The architecture choice behind Throughline's offline planning and optional private sync across devices."
pubDate: 2026-09-27T12:00:00Z
tags: ["Throughline", "local first", "privacy", "PWA"]
draft: false
lang: en
slug: local-first-privacy-throughline
---

## Choose the working copy first

A planner should remain usable when a connection disappears. In [Throughline](/projects/throughline/), goals, tasks, notes, boards, and timelines use IndexedDB as the working store. Offline use is therefore part of the normal workflow, rather than a separate limited mode.

That choice also gives the product a clear privacy boundary. A hosted service does not need readable access to a person's goals and notes simply to keep a second device up to date.

## Make sync optional and encrypted

When a user chooses to sync, Throughline encrypts records on the device with a password-derived key before sending them. The server stores ciphertext. The local copy remains the source of the daily experience, so turning on sync does not change how planning works.

Reminders follow the same boundary: push payloads avoid task titles and other sensitive details. A notification channel should not undo the privacy promise made by storage and sync.

## The product decision

This architecture asks for more care around local persistence, encryption, and cross-device state. It also makes the promise precise: planning works locally, and optional sync keeps private content unreadable to the server. The [case study](/projects/throughline/) describes the product and the trade-off in more detail.
