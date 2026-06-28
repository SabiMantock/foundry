---
name: gate-release
description: >
  The gate G5 checklist — safe, reversible release. Run by platform-lead before a production
  deploy; requires operator sign-off. Use when shipping to production.
---

# Skill: gate-release (G5)

Mirrors `.github/workflows/gate-release.yml`. Operator-approved; nothing irreversible without
sign-off.

## Pre-deploy checklist
- **Migrations** are additive/backward-compatible; destructive changes have a reviewed plan
  and run in a separate, reversible step.
- **Rollback** is one step and has been tested.
- **Changelog / release notes** written.
- **Feature flags** set for gradual exposure.
- **Smoke tests** defined for post-deploy; auto-rollback wired (feeds G6).
- **Data residency / regions** correct for the applicable regulation.

## Promotion
preview → staging → production, one-directional. No manual hot-fix to prod; the fast path is
rollback.

## Ruling
- Any irreversible/costly step → **operator signs off** (the `production` GitHub Environment
  protection rule enforces this) before deploy proceeds.
- After deploy → hand to `ops-analyst` for the G6 watch.
