---
name: reuse-search
description: >
  The first step of every build task. Search the Module Registry for an existing module
  that covers a capability before building anything new. Use when an agent needs a
  capability, or when the operator runs /reuse.
---

# Skill: reuse-search

Encodes the "reuse before build" rule (constitution §2.1). Run by `registry-librarian`
and at the start of every build task.

## Steps
1. **Extract the need** — name the capability in plain terms + 3–6 tags (e.g. "quote a
   templated email" → `email, notification, template, send`).
2. **Search the catalog** — scan `registry/index/*.yaml` and `contracts/*.yaml`, matching on
   capability summary + tags + category.
3. **Score the best match** and classify:
   - **REUSE** — ≥80% fit AND tier ∈ {stable, core}: configure + extend behind its contract.
   - **COMPOSE** — partial fit: combine 2–3 modules into the chosen reference design.
   - **BUILD-NEW** — <40% fit, or only experimental matches: propose a contract; flag as a
     harvest candidate.
4. **Record the decision** in the task output `notes` so the outer feedback loop can learn
   (build-new decisions are signals about catalog gaps).

## Output
```yaml
need: "send a templated email"
tags: [email, notification, template]
decision: REUSE | COMPOSE | BUILD-NEW
modules: [notifications@^1]      # for REUSE/COMPOSE
rationale: "notifications covers 90%; add a template adapter"
harvest_candidate: false
```

## Guardrails
- Never default to BUILD-NEW for convenience; justify it.
- Don't reuse `experimental`-tier modules in product code (spikes only).
- If the best match needs a breaking contract change to fit, that's an architect decision —
  escalate, don't fork.
