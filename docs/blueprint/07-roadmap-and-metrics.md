# 07 — Build Roadmap & Factory Metrics

How to stand up the Foundry itself (not just Relay), how to know it's working, and how the
ecosystem compounds. The earlier docs describe the *design*; this one describes the *sequence*
and the *scoreboard*.

---

## 1. Standing up the factory (build order)

Build the factory and its first product in interleaved phases. The discipline: **don't build
Relay features before the factory machinery that produces them exists** — otherwise you hand-build
and lose the entire leverage thesis.

| Phase | Theme                      | You build                                                                                     | Done when…                                                              |
| ----- | -------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **0** | Substrate                  | Monorepo, CI + gates G2–G4, environments, secret store, observability skeleton               | A trivial service can pass all gates and deploy                         |
| **1** | Workforce                  | `.claude/` agents, skills, slash commands; the `CLAUDE.md` constitution                      | `/commission` runs end-to-end on a toy feature with agents handing off |
| **2** | Catalog seed               | Foundation modules + the Registry index + `reuse-search`/`harvest` skills                    | An agent can find and reuse a module via `/reuse`                       |
| **3** | Relay MVP                  | Generic courier ops (orders, dispatch, tracking, POD, pricing, dashboard)                    | A courier could run a real day on it; first domain modules harvested   |
| **4** | Relay AI layer             | Auto-dispatch, routing/ETA, exception detection, ops copilot                                 | Dispatcher uses the copilot in anger                                    |
| **5** | UK localization            | UK adapters (address/tax/payments) + GDPR posture                                            | UK courier onboarded; core untouched                                   |
| **6** | Ghana localization         | MoMo/USSD/SMS/offline adapters + GhanaPostGPS                                                 | Ghana courier onboarded over patchy network                            |
| **7** | Operate & product #2       | `ops-analyst` runs Relay; commission the second product to test the flywheel                 | Product #2's first feature is mostly assembled, not built              |

Phases 0–2 are the actual answer to *"I want to be the architect/operator, not the builder"* —
they are the machine that builds for you. Resist the urge to skip them and start on Relay
directly; that's the trap that turns an ecosystem back into a project.

---

## 2. The operator's recurring loop

Once the factory runs, your week looks like this (everything else is delegated):

- **Commission** new work via `/commission`; approve briefs at **G0**.
- **Sign off architecture** at **G1** — your highest-leverage recurring decision.
- **Approve releases** at **G5**; respond to **G6** incidents `ops-analyst` escalates.
- **Curate the Registry** — review `/harvest` candidates; promote/retire modules.
- **Tune standards** — tighten a gate or standard when quality data warrants; it raises the bar
  everywhere at once.

If you find yourself doing anything else regularly, an agent, module, or skill is missing — add
it to the factory rather than absorbing the work.

---

## 3. Factory metrics (is the ecosystem working?)

Product metrics for Relay live in `05 §8`. These measure the *factory itself* — the thing that
distinguishes an ecosystem from a one-off project.

**Leverage metrics (the core thesis)**
- **Reuse ratio** — % of a new product/feature assembled from existing Registry modules. Should
  *rise* over time. The headline number.
- **Marginal build cost** — effort/tokens/time to ship feature N vs. feature 1. Should *fall*.
- **Time-to-first-increment** — commission → first working, gated increment. Should *shrink*.
- **Catalog growth** — count of `stable`/`core` modules; harvest rate per product.

**Quality metrics (are the gates holding?)**
- Gate pass rate (first-time-right %), defect escape rate to production, change-failure rate,
  mean-time-to-restore, test coverage trend.

**Flow metrics (is work moving?)**
- Throughput (commissions shipped/period), cycle time per stage, WIP, % time blocked, critical-
  path bottleneck location.

**Operator-leverage metrics (are you staying at altitude?)**
- Human-touch ratio — operator interventions per shipped feature. Should *fall* as the factory
  matures (more is automated/delegated over time).
- Escalation rate and escalation resolution time.

**Cost metrics (is it cheap to run, like its inspiration?)**
- Infra cost + AI-token cost per product and per shipped feature; trend over time.

Track these on a simple live dashboard (a good early candidate to build *with* the factory once
Phase 2 is up). The single sentence that tells you it's working: **"feature N cost less than
feature N-1, and I touched it less."**

---

## 4. Risks & mitigations

| Risk                                              | Mitigation                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Skipping Phases 0–2 and hand-building Relay       | Treat the factory as the product first; measure reuse ratio from day one         |
| Catalog rot / untrustworthy Registry             | Contract tests in CI; librarian audits; require 2 consumers before `stable`       |
| Premature/over-abstraction                        | Harvest from real use, not speculation; YAGNI as a standard                       |
| Agents producing plausible-but-wrong work         | Gates are non-negotiable; human sign-off at G1/G5; small-context tiering          |
| Localization leaking into the core                | Adapter pattern enforced by boundary lint; market logic only at the edges         |
| Over-spending operator attention                  | Keep humans only at G0/G1/G5 + curation; automate the rest; watch human-touch ratio|
| Ghana/UK regulatory missteps (GDPR / GH DPA)      | Compliance baked into standards (`06 §2`); privacy review in the security gate     |
| Vendor/model lock-in                              | Contract-driven modules; portable hosting; vendor-neutral architecture under the CC implementation |

---

## 5. Immediate next steps

When you're ready to move from blueprint to build, the natural first commissions are:

1. **Scaffold the substrate** (Phase 0) — monorepo + CI gates + one trivial service through all
   gates. *I can generate this repo structure and CI config.*
2. **Author the workforce** (Phase 1) — write the `.claude/` subagent, skill, and command files
   from the specs in `02`. *I can draft these as the actual agent files.*
3. **Seed the catalog** (Phase 2) — implement the first foundation modules + Registry index.
4. **Commission Relay MVP** (Phase 3) — run the factory on its first real product.

Any of these can be the next session. This document set is the blueprint; the next step is to
start building the machine that builds.
