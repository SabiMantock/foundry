---
name: harvest-module
description: >
  Extract a proven pattern from product code into a reusable, generalized Registry module.
  Use when a worker or ops-analyst flags a harvest candidate, or the operator runs /harvest.
---

# Skill: harvest-module

Turns product code that proved itself into a catalog asset. This is the outer feedback loop
(constitution §2.8). Run by the `harvester`.

## Preconditions
- The pattern has a current or clearly imminent **2nd consumer** (no speculative abstraction).
- It is genuinely net-new (confirm via reuse-search).

## Steps
1. **Isolate** the pattern from its first home; identify its true inputs/outputs.
2. **Generalize** — remove first-instance quirks. Push any market/locale/tenant specifics into a
   separate adapter; the harvested core stays market-neutral and *configurable*.
3. **Package to the template** (`templates/module` shape): `src/index.ts` contract
   surface, internals, unit + `contract.test.ts`, README, `package.json` `foundry` metadata
   at `tier: experimental`.
4. **Write the contract** `contracts/<name>.vN.yaml`.
5. **Catalog** — add `registry/index/<name>.yaml`.
6. **Verify** — `pnpm lint && pnpm typecheck && pnpm test && pnpm test:contract`.
7. **Hand to `registry-librarian`**; the operator admits and later promotes it.

## Guardrails
- Enters at `experimental`. Promotion to stable needs ≥2 real consumers + operator sign-off.
- At `stable`, propose extraction to the operator's shared cross-product registry (see
  `registry-librarian`) so other product repos consume it as a dependency, not a copy.
- If generalizing balloons scope, stop — maybe it isn't ready to harvest yet.
- Harvest the pattern, not the bug-compatible behavior of its first instance.
