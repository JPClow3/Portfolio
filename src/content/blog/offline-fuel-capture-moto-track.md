---
title: "Offline Capture Is a Narrow Promise: Moto Track's Fuel Queue"
description: "How Moto Track stores a fuel entry locally, replays it through a service worker, and states the limits of that offline workflow."
pubDate: 2026-09-27T12:00:00Z
tags: ["Moto Track", "offline", "SvelteKit", "product engineering"]
draft: false
lang: en
slug: offline-fuel-capture-moto-track
---

## The task that has to survive a lost connection

A rider may enter a fuel stop where reception is poor. Losing the date, odometer, liters, and price after filling a form is frustrating; claiming that an entire account works offline would be a much larger promise. In [Moto Track](/projects/moto-track/), the offline path is limited to creating a fuel record.

The form handles an online submission normally. When the browser reports that it is offline, it cancels that request and validates the required fuel fields before saving their text values in an IndexedDB queue. It gives the rider a visible message that the entry has been saved locally. A receipt or photo is excluded from this path: the form asks for that file to be uploaded when the rider is online.

## A queued entry is not a server record

Each queued entry has a local ID and creation time. A service worker reads the queue and posts entries to the same fuel creation action used by the online flow. It removes an entry only after the server responds successfully. The client requests a replay when a new online fuel submission starts; it also registers background sync when the browser supports that API.

This boundary matters. A saved local entry can still be waiting for authentication, connectivity, or a successful server response. Background sync support also varies by browser. The product should describe the entry as *queued*, not as already synchronized.

## Why the scope stays small

The service worker caches an offline page and the web manifest; it does not cache every authenticated screen or turn every Moto Track operation into an offline action. Fuel entries were chosen because they are short, structured records that can be validated and replayed. Attachments stay online because storing and retrying binary uploads adds another failure path.

The general lesson is to name the exact task that works without a network and make the remaining state visible. For Moto Track, that means offline fuel capture with a queue, followed by server confirmation when replay succeeds. The [live product](https://moto-track.net/) and [case study](/projects/moto-track/) show the broader motorcycle operation around that workflow.
