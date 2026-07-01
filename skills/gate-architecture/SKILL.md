---
name: gate-architecture
description: >
  Continuous architecture-conformance check (a fitness function) that runs alongside G2 on
  every PR. Catches contract/registry drift, orphaned modules, and layering violations before
  they pile up. Run by qa-lead/reviewer; mirrors templates/ci/gate-architecture.yml.
---

# Skill: gate-architecture (fitness function, runs alongside G2)

Teams that ship fast without losing architectural integrity use automated **fitness
functions** — continuous, objective checks of architecture rules, not a once-a-quarter audit
(see *Building Evolutionary Architectures*, Ford/Parsons/Kua). This is the Foundry's version:
cheap, mechanical, runs on every PR, blocks on drift.

## Automated (`pnpm architecture:check`, see `scripts/check-architecture.mjs`)
- **Contract coverage:** every `packages/*` has exactly one `contracts/<name>.vN.yaml`; no
  module ships without one.
- **Registry freshness:** every module in `packages/*` has a matching `registry/index/*.yaml`
  entry, and vice versa — no orphaned code, no phantom catalog entries.
- **Contract fidelity:** the module's public exports (`src/index.ts`) match the contract's
  declared `provides:` — no undeclared exports, no declared export that doesn't exist.
- **Layering:** within a module, `domain/` imports nothing from `application/` or
  `infrastructure/` (per the chosen reference design's layering rules — see
  `templates/reference-designs/`). This complements `eslint-plugin-boundaries`, which only
  covers the app↔module edge, not the layers inside a module.
- **Dependency graph:** no cycles between modules (`depends_on` in each contract must form a
  DAG).

## Judgment (reviewer/architect pass, when automation flags something)
- Is a flagged deviation from the blueprint (`templates/reference-designs/`) intentional and
  recorded in the ADR, or drift? Intentional + recorded → note it, allow it. Undocumented →
  block.
- Is a new module actually net-new, or should it have been a REUSE/COMPOSE per
  `registry-librarian`?

## Ruling
- Any automated check red with no matching ADR deviation → FAIL, bounce to the owning worker
  (contract/registry mismatches) or `architect` (layering/cycle issues — usually a design
  smell, not a coding mistake).
- Runs alongside G2; a red `gate-architecture` blocks the same as a red `gate-code`.
- All clear → proceeds with G2 to G3.

## Why this exists
As commission pace increases, the risk isn't one big bad decision — it's silent, incremental
drift: a module that quietly grows an undeclared export, a contract nobody updated, a registry
entry three versions stale. A fitness function catches that on PR #1 of the drift, not on audit
day, which is what makes "ship faster" compatible with "still see the gaps."
