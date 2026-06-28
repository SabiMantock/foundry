---
description: Ask the registry-librarian what existing module covers a need.
argument-hint: <capability you need, e.g. "send a templated email">
---

Run the **reuse-search** skill for: **$ARGUMENTS**

Have `registry-librarian` search the Module Registry (`registry/index/*`, `contracts/*`) and
return:
- the best matching module(s) with tier and version,
- a classification (REUSE / COMPOSE / BUILD-NEW) with rationale,
- if BUILD-NEW, a proposed contract sketch and whether it's a harvest candidate.

This is the question every build task should ask first. Keep the answer short and decision-ready.
