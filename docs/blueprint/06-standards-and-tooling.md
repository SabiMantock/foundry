# 06 — Development Standards & Tooling

The factory's standards (the quality bar every agent inherits) and the shared substrate (the
tooling every product runs on). Standards are encoded once in the factory's `CLAUDE.md` and
enforced mechanically by the gates — not left to memory.

---

## 1. Why standards are infrastructure, not paperwork

In manufacturing, standards (tolerances, interfaces, test procedures) are what let independent
suppliers' parts fit together without coordination. The same is true here: because every agent
obeys the same standards and every module passes the same gates, work from a dozen parallel
workers integrates cleanly. Standards are what make the factory's parallelism *safe*.

The standards live in two places:
- **`.claude/CLAUDE.md`** — inherited by every agent at every tier (the constitution).
- **CI configuration** — the mechanical enforcement (the gates from `01 §6`).

A standard that isn't enforced by a gate is a suggestion. Aim to encode every standard as an
automated check.

---

## 2. Engineering standards

### Language & stack baseline
- **Default stack: TypeScript end-to-end** (see `05` for the full rationale). One language
  across web, API, and mobile maximizes module reuse and lets a single worker move across
  layers. Python is permitted *only* for genuinely compute/ML-heavy modules (e.g. heavy route
  optimization), behind a service contract.
- **Runtime:** Node LTS. **Package manager:** pnpm (workspaces). **Monorepo tool:** Turborepo
  (or Nx) for caching and task graphs.

### Code standards
- **Strict typing.** `strict: true`; no `any` without a written reason; public module surfaces
  are fully typed and match their contract.
- **Formatting & linting.** Prettier + ESLint, zero-warning policy in CI. Import-boundary lint
  rules forbid reaching into another module's internals (enforces the contract rule from `04`).
- **Naming & structure.** Consistent module layout: `src/`, `contract.ts`, `README.md`,
  `*.test.ts`. One capability per module.
- **Errors.** Typed, never swallowed; user-facing messages separated from internal detail.
- **Comments.** Explain *why*, not *what*. Contracts and docs carry the "what".

### Testing standards (owned by `qa-lead`, gates G2–G4)
- **Test pyramid:** many unit, fewer integration, few e2e. Plus **contract tests** for every
  module boundary.
- **Coverage floors:** `core`/`stable` modules ≥ 85% on changed lines; products ≥ 70% overall;
  critical paths (auth, money, dispatch) require explicit e2e coverage.
- **Determinism:** no flaky tests tolerated; quarantine + fix, don't retry-to-green.
- **Test data:** factories/fixtures, never production data.

### Security standards (gate G3)
- **AuthN/AuthZ** via the `auth` module only; no bespoke auth. Every endpoint declares its
  required permission.
- **Secrets** never in code; injected from the secret store; secret-scanning in CI.
- **Dependencies** scanned (SCA); no known-critical CVEs may ship; lockfiles committed.
- **Input validation** at every trust boundary; output encoding to prevent injection/XSS.
- **Data protection:** PII tagged and access-logged; encryption in transit and at rest;
  least-privilege by default. (Relevant for UK GDPR + Ghana Data Protection Act — see `05`.)
- **SAST** on every PR; findings above threshold block the gate and reach the operator.

### Accessibility & UX standards
- WCAG 2.1 AA for all UI modules; keyboard-navigable; sufficient contrast; tested with the
  accessibility gate. Mobile honors touch-target minimums and works one-handed.

### Documentation standards
- Every module: a README (purpose, usage, examples, limits) + an up-to-date contract.
- Every product: an architecture overview + ADRs for significant decisions.
- Docs are part of the definition of done; stale docs fail review.

### Definition of Done (the universal checklist)
A unit of work is done only when: it meets its acceptance criteria; compiles & type-checks;
tests written and green; lint/format clean; security checks pass; docs updated; contract
honored; observability hooks present; and the output envelope is written.

---

## 3. The shared substrate (tooling)

The "industrial park" — services every product and agent depends on. Choices favor reuse,
automation, and the Ghana+UK context (cost, reliability, data residency).

### Source & structure
- **Git monorepo**, hosted on **GitHub** (PRs are the unit of the G2 gate).
- **Turborepo/pnpm workspaces**: `apps/*` (products), `packages/*` (Registry modules),
  `contracts/*`, `tooling/*`.
- Enforced module boundaries via lint + CODEOWNERS mapping to guilds.

### CI/CD (runs the gates)
- **GitHub Actions** pipelines, one per gate, gating merge and deploy.
- Pipeline stages: install → lint/type → unit → build → security/SCA → integration/contract →
  e2e → preview deploy → (on main) staging → prod with approval.
- **Preview environments** per PR for human spot-checks.
- **Deploys** are automated and reversible; every release ships with a one-step rollback.

### Runtime & hosting
- **Containers** (Docker) orchestrated on a managed platform — start simple (e.g. Fly.io /
  Render / managed Kubernetes) and scale later. Keep it portable; avoid deep cloud lock-in so a
  UK data-residency or Ghana-region requirement can be met without a rewrite.
- **Database:** PostgreSQL (managed) — relational core, strong consistency for logistics state.
  Add Redis for queues/cache and PostGIS for geo.
- **Object storage:** S3-compatible for proof-of-delivery media, exports.
- **Edge/CDN** for static assets and low-latency tracking pages (matters on Ghanaian mobile
  networks).

### Observability (feeds the Operations Guild, gate G6)
- **Structured logging**, **metrics**, **distributed tracing** via OpenTelemetry into a managed
  backend (e.g. Grafana stack / Datadog).
- **SLOs** defined per product with error budgets; alerts route to `ops-analyst` then to you.
- **Audit log** (the `audit-log` module) for every state change to logistics data.

### Secrets & config
- Centralized secret store (cloud secrets manager / Vault); typed config via the `config`
  module; feature flags for safe, gradual rollout.

### Agent operating tooling
- **Claude Code** as the agent runtime; `.claude/` holds agents, skills, commands (`02 §6`).
- **Task system** for the JIT task graph (the same mechanism that tracks work in a session).
- **Context store** — a durable `docs/decisions/` + `docs/specs/` tree (and/or a Notion space)
  that agents read at task start and write at task end.
- **Module Registry index** under `registry/index/*` for reuse search.

---

## 4. Environments & promotion

| Environment | Purpose                          | Who/what deploys           | Gate to enter        |
| ----------- | -------------------------------- | -------------------------- | -------------------- |
| Preview     | Per-PR review & spot-checks      | CI on PR open              | G2 (code) green      |
| Staging     | Integration, e2e, UAT           | CI on merge to main        | G4 (integration)     |
| Production  | Live product                     | `platform-lead` on approve | G5 (release) + you   |

Promotion is one-directional and gated; no manual hot-fixes straight to prod (the rollback
path is the fast path instead).

---

## 5. How standards get enforced (the mechanism)

```
 standard (in CLAUDE.md)  ──encoded as──►  CI check (a gate step)
        │                                        │
        ▼                                        ▼
 every agent inherits it          PR/merge/deploy blocked until green
        │                                        │
        └──────────────► agent self-checks before handoff ◄──────────
```

The operator's lever here is **the standards file and the gate config**. Tightening a standard
(e.g. raising the coverage floor) instantly raises the bar for every future unit of work across
every product — one of the highest-leverage actions available to you.

---

## 6. Cost & reliability discipline (Ghana + UK reality)

Because the first product serves operators in markets with variable connectivity and
cost-sensitivity, these are factory-wide defaults, not Relay-only concerns:

- **Offline-first** as a default capability (`offline-sync`, `mobile-shell`).
- **Low-bandwidth budgets** — performance budgets in CI (bundle size, payload size, requests).
- **Graceful degradation** — SMS/USSD fallbacks where data is unreliable.
- **Cost observability** — track infra + AI-token spend per product as a first-class metric;
  the factory should be cheap to run, like its inspiration.
