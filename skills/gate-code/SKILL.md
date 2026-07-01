---
name: gate-code
description: >
  The gate G2 checklist — code quality. Run by qa-lead/reviewer on every change before it
  can advance. Use when verifying a build increment's code quality.
---

# Skill: gate-code (G2)

Mechanical + judgment checks that gate every PR. Mirrors `.github/workflows/gate-code.yml`.

## Automated (must all pass)
- `pnpm format:check` — formatting clean.
- `pnpm lint` — zero warnings; contract-only imports respected (no deep `src/` imports).
- `pnpm typecheck` — no type errors; no unjustified `any`.
- `pnpm test` — unit tests green; coverage floor met (stable/core ≥85% changed lines).

## Judgment (reviewer pass)
- Meets the acceptance criterion it claims.
- Errors typed, not swallowed; all UI/data states handled.
- Public surface matches the contract.
- Names/structure clear; one capability per module.
- Tests cover unhappy paths and aren't flaky.

## Ruling
- Any automated check red, or any reviewer **blocker** → G2 FAIL; bounce to the owning worker
  with a precise repro.
- Second failure on the same task → escalate to `orchestrator` (design smell).
- All green + no blockers → advance to G3 (security).

## Peer gates (run alongside G2)
- **`gate-architecture`** — contract/registry drift, layering, dependency cycles (a continuous
  fitness function against `templates/reference-designs/`). Red blocks the same as a red G2.
- **`gate-design`** (UI work only) — WCAG 2.1 AA + design-system/token adherence.
