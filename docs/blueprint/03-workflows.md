# 03 — Production Workflows

How a commission becomes shipped software. These are the factory's "production lines": the
end-to-end pipeline, the handoffs between agents, the orchestration patterns, and the feedback
loops. Everything here runs on the tiered agents (`02`) and passes the gates (`01 §6`).

---

## 1. The master pipeline

Every commission flows through the same eight stages. Stages are pull-based (JIT): each begins
only when its upstream gate is green.

```
 1 INTAKE        2 SPEC          3 DESIGN        4 PLAN
 commission  →   product-     →  architect   →  build-lead
 brief           analyst        (G1 gate)       (task graph)
 (G0 gate)       (spec)
     │                                              │
     └──────────────────────────────────────────────┘
                          │
 5 BUILD          6 VERIFY        7 RELEASE       8 OPERATE
 task-workers  →  qa-lead     →  platform-lead → ops-analyst
 in parallel      (G2–G4)        (G5 gate)       (G6 + feedback)
 (assemble                                          │
  from Registry)                                    ▼
                                          harvest → Registry
```

### Stage-by-stage

**1 · Intake (Gate G0).** You issue `/commission` with a brief: what, why, for whom, success
criteria, constraints, deadline. The `orchestrator` checks completeness and either runs the
brief by you for G0 approval or asks clarifying questions. *Output: an approved brief.*

**2 · Spec.** `product-analyst` expands the brief into a spec — problem statement, users,
in/out of scope, acceptance criteria, success metrics. *Output: spec + acceptance criteria.*

**3 · Design (Gate G1).** `architect` selects the closest **reference design**, queries the
Registry (via `registry-librarian`) for modules to reuse, defines contracts for anything
net-new, and records an ADR. **You sign off at G1** — this is the highest-leverage human gate,
because architecture mistakes are the expensive ones. *Output: architecture + module list +
contracts + ADR.*

**4 · Plan.** `build-lead` decomposes the architecture into a **task graph**: one node per
module/screen/endpoint, with `blockedBy`/`blocks` dependencies, assigned to Tier-3 workers.
*Output: task graph with owners and sequencing.*

**5 · Build.** Task-workers pull ready tasks and run in **parallel**. Each starts with a reuse
search, composes Registry modules into the reference design, writes only the novel code, adds
tests and docs, and emits its output envelope. *Output: implemented increments + PRs.*

**6 · Verify (Gates G2–G4).** `qa-lead` drives code review, security, integration, and contract
tests. Defects bounce back to the responsible worker (a tight inner loop, see §3). Only green
work advances. *Output: gate reports + merge-ready, tested increment.*

**7 · Release (Gate G5).** `platform-lead` prepares migration + rollback plans, changelog, and
smoke tests; **you sign off at G5** for production. Deploy is automated; rollback is one step.
*Output: shipped release.*

**8 · Operate (Gate G6 + feedback).** `ops-analyst` watches health/SLOs, auto-rollback fires on
regression, incidents are triaged, and recurring issues become **harvest candidates** or new
commissions. *Output: operational stability + lessons + modules fed back to the Registry.*

---

## 2. Orchestration patterns

The orchestrator composes work using a small set of repeatable patterns — the factory's
"production layouts".

### Pattern A — Fan-out / fan-in (parallel assembly)
Independent modules are built concurrently by separate workers, then integrated. Use when the
task graph has parallel branches with no shared mutable surface. *Fastest; the default for
greenfield modules.*

```
            ┌─ module-builder (pricing) ─┐
build-lead ─┼─ module-builder (routing) ─┼─► integrate ─► qa-lead (G2–G4)
            └─ frontend-worker (UI)     ─┘
```

### Pattern B — Pipeline (sequential dependency)
Each stage depends on the previous. Use when contracts must settle before consumers can be
built (e.g. schema → API → UI). The graph's `blockedBy` edges enforce order.

### Pattern C — Iterative refinement (build → review → fix)
A worker and a `reviewer` loop until the gate passes. Bounded by a retry limit; on second
failure the orchestrator escalates (a defect that won't die is a design smell).

### Pattern D — Spike then build
For genuine unknowns, a throwaway `spike` task explores the risk first; its *findings* (not its
code) feed the architect. Mirrors the prototype-before-tooling step in manufacturing.

### Pattern E — Reuse-first assembly
Before any build pattern runs, `registry-librarian` answers "what already exists?". If a stable
module covers ≥80% of the need, the task becomes *configure + extend*, not *build*. This is the
pattern that makes the factory fast.

---

## 3. The two feedback loops

A factory improves through feedback. The Foundry has a fast inner loop (quality) and a slow
outer loop (the compounding ecosystem).

**Inner loop — per task (minutes/hours).**
`build → automated gate → reviewer → fix → re-gate`. Keeps defects from advancing. Fully
automated; humans only see it when it escalates past the retry limit.

**Outer loop — per product/incident (days/weeks).**
`operate → observe → harvest → Registry → next commission is cheaper`. This is the strategic
loop: every shipped product and every incident leaves the factory with more reusable modules,
better reference designs, and sharper standards. The `harvester` and `ops-analyst` agents feed
it; **you curate** what actually gets promoted.

```
        ┌──────── inner loop (quality) ────────┐
build → gate → reviewer → fix → gate → merge
                                        │
                                        ▼
                                     release → OPERATE
                                                  │
        ┌──────── outer loop (compounding) ───────┘
        ▼
   observe → harvest → Registry → reference designs/standards updated
        │
        └────────────► makes the NEXT commission faster ◄──────────
```

---

## 4. Handoff mechanics

Handoffs are file-based and asynchronous — the source of the factory's parallelism. There are
no "meetings"; there are commits, task updates, and output envelopes.

1. An agent finishes, writes its **output envelope** (`02 §3`) and any artifacts to the shared
   workspace, sets task `status: complete`, and names `handoff_to`.
2. The orchestrator (or the dependency graph) makes downstream tasks **ready**.
3. The next agent pulls, reading only the upstream `produced` artifacts + relevant contracts.
4. The **context store** holds durable decisions (specs, ADRs, conventions) so no agent has to
   reconstruct context from scratch.

This is the JIT discipline made literal: work is pulled when inputs exist, never pushed
speculatively.

---

## 5. Exception handling & escalation

Ambiguity and conflict travel *up* the tier pyramid until they reach an agent with authority to
resolve, and reach you only when judgment is genuinely required.

| Situation                              | Resolved by                         | Reaches operator?              |
| -------------------------------------- | ----------------------------------- | ------------------------------ |
| Unclear acceptance criterion           | `product-analyst`                   | If intent is ambiguous         |
| Two modules' contracts conflict        | `architect`                         | If it forces a scope change    |
| Implementation can't meet a contract   | `architect` ↔ `build-lead`          | Rarely                         |
| Gate fails twice on the same task      | `orchestrator`                      | If it's a design flaw          |
| Security finding above threshold       | `qa-lead` + `security-worker`       | Yes, always                    |
| Irreversible/costly release action     | `platform-lead`                     | Yes, at G5                     |
| SLO breach / sev-1 incident            | `ops-analyst`                       | Yes, immediately               |
| Build-vs-reuse for an expensive module | `architect` + `registry-librarian`  | Yes — it's a curation decision |

---

## 6. A worked example (small feature, end to end)

Commission: *"Add proof-of-delivery with offline photo capture to Relay."*

1. **G0:** `/commission` brief approved.
2. **Spec:** `product-analyst` → "Courier captures photo + signature + recipient name at
   delivery; works offline; syncs when online; visible in ops dashboard + customer tracking."
3. **G1:** `architect` picks *Reference Design: mobile field app*; reuses Registry modules
   `offline-sync`, `media-capture`, `auth`; defines net-new contract `proof-of-delivery.v1`;
   records ADR; **you approve**.
4. **Plan:** `build-lead` graph → `mobile-worker` (capture screen), `backend-worker` (POD
   endpoint), `data-worker` (POD schema + migration), `frontend-worker` (dashboard display),
   `test-worker` (e2e + contract tests). Backend/data first; mobile/frontend depend on them.
5. **Build:** workers run; mobile reuses `offline-sync` rather than re-implementing it.
6. **G2–G4:** review, security (photo storage authz!), integration green.
7. **G5:** `platform-lead` ships behind a flag; **you approve**; gradual rollout.
8. **G6 + harvest:** `ops-analyst` confirms healthy sync rates; `harvester` flags the
   tiered-zone offline batching as a candidate to promote into the Registry for the next
   product. Loop closes.

This is the operator experience: you touched the work at three points (G0, G1, G5) and
curated one harvest decision — the factory did the rest.
