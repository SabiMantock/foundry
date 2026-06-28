# Stack Profiles — the operator chooses, per product

The Foundry does **not** mandate a stack. At `/new-product` (or any time via `/stack`), the
operator picks the stack for that product. The choice is recorded as an ADR
(`docs/decisions/0001-tech-stack.md`) that every agent reads and builds within.

Pick a profile below as a starting point, then customize. The factory's machinery (agents,
gates, contracts, reuse model) is stack-agnostic — only the *implementation* tooling changes.
Whatever is chosen, agents pin to **web-verified latest stable** versions via the
`check-latest-versions` skill (see `stack-baseline.md` for the last verification).

---

## Profile A — TypeScript-everywhere *(default recommendation)*
One language across web, API, and mobile. Maximizes module reuse (shared types/contracts) and
lets a single worker move across layers.

- **Web:** Next.js + React · **Mobile:** React Native (Expo) · **API:** Node + tRPC/REST
- **DB:** PostgreSQL (+ PostGIS if geo) · **Cache/queue:** Redis · **Tests:** Vitest
- **Monorepo:** pnpm + Turborepo · **Lang:** TypeScript (strict)
- Best when the product is orchestration/state/IO-heavy (most apps).

## Profile B — Python backend + TypeScript frontend
Use when heavy computation/ML is core (optimization, data pipelines, model serving).

- **Backend/AI:** Python (FastAPI) · **Frontend:** Next.js + React · **Mobile:** React Native
- **DB:** PostgreSQL · **Tests:** pytest (Py) + Vitest (TS)
- Python lives **behind a service contract**; the frontend depends on the contract, not internals.

## Profile C — TypeScript core + a Python service module
The default TS stack, but one or two compute-heavy capabilities are Python modules behind a
service contract. Best of both: TS reuse everywhere, Python only where it pays off.

## Profile D — Custom
Operator specifies language(s), frameworks, DB, hosting. The architect records the rationale in
the ADR and confirms the gates (lint/type/test/security) have equivalents in the chosen stack
before any build starts.

---

## What the choice does and does not change
- **Changes:** workspace tooling, the module template's language, lint/test commands, the
  scaffold the architect selects.
- **Does NOT change:** the agent workforce, the tiered workflow, the quality gates, the
  contract-driven module model, reuse-first, or the harvest loop. The factory is the same;
  only the molds differ.

## How to record it
`/stack` writes `docs/decisions/0001-tech-stack.md` from `templates/adr-template.md`, stating
the profile, the concrete tools + pinned (verified) versions, and why. Changing stack later is
a new ADR that supersedes it — a deliberate, reviewed act.
