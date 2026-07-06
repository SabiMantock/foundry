# 01 — Ecosystem Architecture

How the Foundry is structured. This is the "factory floor plan": the guilds, the registry,
the tiers of agents, the just-in-time flow, and the quality gates — each mapped from a real
feature of China's manufacturing ecosystem.

---

## 1. The cluster: agent guilds in a shared workspace

In Shenzhen, specialists cluster physically so that handoffs are cheap and fast. The Foundry
reproduces this with **guilds** — groups of specialist agents organized by discipline, all
operating against one shared workspace (a monorepo + shared Registry + shared context store).
Co-location is logical: every agent reads and writes the same source of truth, so a handoff
is a file commit and a task update, not a meeting.

The guilds:

- **Product Guild** — turns commissions into specs, scopes, and acceptance criteria.
- **Architecture Guild** — system design, module selection, interface contracts, ADRs.
- **Build Guild** — frontend, backend, data, and mobile implementation.
- **Quality Guild** — testing, code review, security, accessibility, performance.
- **Platform Guild** — CI/CD, infra, environments, observability, releases.
- **Operations Guild** — runs shipped products: monitoring, incidents, support triage.

Guilds are an *organizing concept*, not a runtime boundary. At runtime they manifest as
Claude Code subagents and skills (see `02-ai-agents.md`).

---

## 2. The component market: the Module Registry

Huaqiangbei is the beating heart of Shenzhen hardware — a market where any proven component
is available off the shelf with a known spec. The **Module Registry** is the Foundry's
equivalent: a curated, versioned catalog of reusable software modules, each with a fixed
interface contract, tests, docs, and a maturity rating.

Core rules of the Registry (detailed in `04-reusable-modules.md`):

- Every module publishes a **contract** (its public API / events / schema). Consumers depend
  on the contract, never the internals.
- Modules are **semantically versioned**; breaking a contract is a major version and a
  deliberate, reviewed act.
- Each module carries a **maturity tier**: `experimental → beta → stable → core`. Only the
  operator promotes a module up a tier.
- The first question of every build task is *"what's already in the Registry?"* — reuse is
  the default, net-new is the exception.

This is the compounding asset. A factory with 200 stable modules builds the 50th product far
faster than the first.

---

## 3. Reference designs: the *gongban* model

In China, a *gongban* (public board) is a shared reference design that anyone can adapt
rather than designing from scratch — it collapses the cost of starting. The Foundry keeps a
library of **Reference Designs**: opinionated, working blueprints for whole classes of thing.

Examples:

- *Reference Design: CRUD service* — a backend service with API, persistence, validation,
  auth, tests, and observability wired in.
- *Reference Design: operational dashboard* — list/detail/filter UI with real-time updates.
- *Reference Design: mobile field app* — offline-first data capture with sync.
- *Reference Design: event-driven integration* — webhook intake → queue → processor → notify.

An agent commissioned to build something first selects the closest reference design, then
composes Registry modules into it, and only writes net-new code for the genuinely novel
parts. This is how a small workforce produces a lot of software.

---

## 4. Tiered agents: the subcontracting pyramid

China's supply chain is tiered: a Tier-1 supplier integrates subsystems and subcontracts to
Tier-2 and Tier-3 specialists. The Foundry uses the same pyramid to keep each agent's context
small, focused, and high-quality.

```
                 ┌─────────────────────────┐
   TIER 0        │   Operator (you)        │  commissions, standards, gates
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
   TIER 1        │   Orchestrator agent    │  decomposes work, assigns, integrates
                 └────────────┬────────────┘
              ┌───────────────┼───────────────┐
   TIER 2     │   Specialist agents (guild leads): architect, build-lead,    │
              │   qa-lead — own a domain, plan it, delegate the granular work │
              └───────────────┬───────────────┘
              ┌───────────────┼───────────────┐
   TIER 3     │   Task-worker agents: implement one module, write one test    │
              │   suite, do one review pass — narrow, stateless, parallel      │
              └───────────────────────────────┘
```

Why tiering matters for AI agents specifically:

- **Context hygiene.** A Tier-3 worker sees only its task + relevant module contracts, not
  the whole product. Small context = higher quality, lower cost, fewer hallucinations.
- **Parallelism.** Independent Tier-3 tasks run concurrently (like parallel production lines).
- **Clear accountability.** Each tier integrates and checks the tier below before passing up.
- **Escalation paths.** Ambiguity flows *up* the pyramid until it reaches an agent (or you)
  with the authority to resolve it.

---

## 5. Just-in-time orchestration

JIT manufacturing builds nothing until it's pulled by demand downstream, minimizing waste and
inventory. The Foundry's orchestration is **dependency-driven and pull-based**:

- Work is modeled as a **task graph** with explicit `blockedBy` / `blocks` dependencies.
- An agent only begins a task when its inputs (upstream modules, contracts, decisions) exist.
- Nothing speculative is built. If a module isn't needed yet, it isn't made.
- The critical path is visible, so the operator can see the true bottleneck at any moment.

Concretely this runs on the task system (the same task-list mechanism this session uses):
the orchestrator creates the graph, sets dependencies, assigns owners, and agents pull ready
tasks. Quality gates are themselves nodes in the graph — downstream work is *blocked by* its
gate.

---

## 6. Quality gates: the QC stations

A Chinese production line has inspection stations between stages; defective units don't
advance. The Foundry has the same, expressed as **gates** that a deliverable must pass before
the next stage can pull it. Gates are automated by default and human only where judgment is
genuinely required.

| Gate                    | Stage                       | Automated checks                                              | Human approval?         |
| ----------------------- | --------------------------- | ------------------------------------------------------------ | ----------------------- |
| **G0 — Brief**          | After commission            | Brief completeness, acceptance criteria present              | Operator                |
| **G1 — Architecture**   | After design                | Contract validity, module-reuse check, ADR recorded         | Operator (sign-off)     |
| **G2 — Code**           | Per pull request            | Lint, type-check, unit tests, code-review agent, coverage    | Spot-check / on risk    |
| **G3 — Security**       | Per pull request            | SAST, dependency/secret scan, authz review                  | On flagged findings     |
| **G4 — Integration**    | Before merge to main        | Integration + e2e tests, contract tests, perf budget        | No (auto if green)      |
| **G5 — Release**        | Before deploy to prod       | Migration safety, rollback plan, changelog, smoke tests     | Operator (release sign) |
| **G6 — Post-release**   | After deploy                | Health checks, error-rate/SLO watch, auto-rollback trigger  | On incident             |

Gate philosophy mirrors the founding principles: *quality is gated, not hoped for*, and the
operator's scarce attention is spent at G0, G1, and G5 — the points where judgment, not
mechanism, is the bottleneck.

---

## 7. The shared substrate

Everything above runs on shared infrastructure (the "industrial park" services every tenant
uses). Detailed in `06-standards-and-tooling.md`, summarized here:

- **Monorepo** — one repository, many products and modules, with enforced boundaries.
- **Module Registry** — versioned internal packages + a searchable catalog/index.
- **Context store** — shared, durable project memory (decisions, specs, ADRs, conventions)
  that agents read at task start and write at task end.
- **CI/CD** — the automation that runs the gates.
- **Environments** — preview, staging, production with promotion rules.
- **Observability** — logs, metrics, traces, and SLOs feeding the Operations Guild.

---

## 8. Data & control flow (the whole floor in one picture)

```
  OPERATOR
     │ commission + brief
     ▼
 ┌────────────┐   task graph   ┌──────────────┐   reuse query   ┌──────────────┐
 │Orchestrator├───────────────►│ Specialists  │◄───────────────►│   Module     │
 │  (Tier 1)  │                │  (Tier 2)    │                 │   Registry   │
 └─────┬──────┘                └──────┬───────┘                 └──────────────┘
       │ assign                       │ delegate                        ▲
       │                              ▼                                 │ harvest
       │                       ┌──────────────┐   reference designs     │
       │                       │ Task workers ├─────────────────────────┘
       │                       │  (Tier 3)    │
       │                       └──────┬───────┘
       │                              │ deliverables
       ▼                              ▼
 ┌──────────────────────── QUALITY GATES (G0–G6) ───────────────────────┐
 │  brief · architecture · code · security · integration · release · ops │
 └───────────────────────────────┬──────────────────────────────────────┘
                                  ▼
                           SHIPPED PRODUCT (e.g. Relay)
                                  │ telemetry, incidents, feedback
                                  ▼
                          OPERATIONS GUILD ──► lessons & modules back to Registry
```

The loop closes: operating shipped software generates lessons and reusable modules that flow
back into the catalog, making the next commission cheaper. That feedback loop is the entire
point of building an *ecosystem* rather than a project.
