# 02 — The AI Agent Workforce

The Foundry's workforce, implemented concretely as **Claude Code subagents, skills, and slash
commands**. Each agent is a "little giant": narrow scope, deep competence, a fixed I/O
contract. This document is the roster plus the implementation conventions.

---

## 1. How agents are realized in Claude Code

Three primitives do all the work:

- **Subagents** (`.claude/agents/*.md`) — a named agent with its own system prompt, tool
  allowlist, and (optionally) its own model. Spawned by the orchestrator or by you. Each runs
  in an isolated context, which is exactly the "context hygiene" the tiered model needs.
- **Skills** (`.claude/skills/<name>/SKILL.md`) — packaged, reusable procedures an agent
  invokes (e.g. "scaffold a CRUD service", "run the security gate"). Skills are the factory's
  *standard operating procedures*; they encode the reference designs and gate checklists.
- **Slash commands** (`.claude/commands/*.md`) — operator entry points. You type
  `/commission`, `/gate`, `/harvest`; the command kicks off the right agent + workflow.

Mapping to the tiers from `01`:

| Tier | Claude Code form                                  | Lifetime / context                          |
| ---- | ------------------------------------------------- | ------------------------------------------- |
| T1   | One **orchestrator** subagent                     | Long-running per commission; holds the plan |
| T2   | **Specialist (guild-lead)** subagents             | Per work-stream; holds domain context       |
| T3   | **Task-worker** subagents (often `general-purpose`)| Per task; stateless, parallel, disposable  |

Skills are shared across all tiers; the gate skills are owned by the Quality and Platform
guilds.

---

## 2. The roster

Each agent below is specified as: **Mandate** (its one job), **Inputs**, **Outputs**, **Tools**,
**Escalates when**. Outputs are written to the shared workspace + context store so the next
agent can pull them (JIT handoff).

### Tier 1 — Orchestration

#### `orchestrator`
- **Mandate:** Turn a commission into a task graph, assign owners, sequence by dependency,
  integrate results, and drive work to the gates.
- **Inputs:** Commission brief (from `/commission`), Registry index, reference design library.
- **Outputs:** Task graph (with `blockedBy`/`blocks`), assignments, an integration plan, a
  running status the operator can watch.
- **Tools:** Task tools, read access to repo + Registry, ability to spawn subagents.
- **Escalates when:** Scope is ambiguous, two specialists conflict, or a gate fails twice.

### Tier 2 — Specialists (guild leads)

#### `product-analyst` (Product Guild)
- **Mandate:** Convert a brief into a crisp spec: problem, users, scope/non-scope, acceptance
  criteria, success metrics. *Maps to the `write-spec` capability.*
- **Inputs:** Commission, market context, existing product docs.
- **Outputs:** Spec doc + acceptance criteria (the G0 gate artifact).
- **Escalates when:** The commission's intent or priority is unclear → asks the operator.

#### `architect` (Architecture Guild)
- **Mandate:** System & module design. Choose reference design, select Registry modules,
  define new interface contracts, record an ADR, flag build-vs-reuse decisions.
- **Inputs:** Spec, Registry catalog, standards.
- **Outputs:** Architecture doc, module selection list, contracts for any net-new modules,
  ADR (the G1 gate artifact).
- **Escalates when:** A required capability has no module and building it is expensive/risky.

#### `build-lead` (Build Guild)
- **Mandate:** Break the architecture into implementable module tasks, assign Tier-3 workers,
  integrate their output, own the working increment.
- **Outputs:** Implementation plan, integrated branch, PRs ready for the code gate.
- **Escalates when:** A contract proves unworkable in implementation (loops back to architect).

#### `qa-lead` (Quality Guild)
- **Mandate:** Own the test strategy and the G2–G4 gates. Decide what must be unit/integration/
  e2e/contract tested; commission test workers; adjudicate gate results.
- **Outputs:** Test plan, gate reports, pass/fail rulings with evidence.
- **Escalates when:** A defect is severe/systemic, or coverage of a critical path is impossible.

#### `platform-lead` (Platform Guild)
- **Mandate:** Own CI/CD, environments, releases (G5), and the deploy/rollback machinery.
- **Outputs:** Pipeline config, migration & rollback plans, release notes, deploy execution.
- **Escalates when:** A release is irreversible or risky → operator sign-off at G5.

#### `ops-analyst` (Operations Guild)
- **Mandate:** Watch shipped products; triage incidents and support signals; convert recurring
  problems into Registry improvements or new commissions.
- **Outputs:** SLO/health reports, incident summaries, "harvest candidates" for the Registry.
- **Escalates when:** An SLO breach or incident crosses severity threshold.

### Tier 3 — Task workers (narrow, parallel, disposable)

These are spawned on demand for a single unit of work, given only their task + the relevant
contracts. They are deliberately stateless and interchangeable.

- `module-builder` — implements one module to its contract, with tests and docs.
- `frontend-worker` — builds one screen/component against the design system.
- `backend-worker` — builds one endpoint/service against its contract.
- `data-worker` — schema, migration, query, or pipeline for one data concern.
- `mobile-worker` — one offline-first screen/sync flow.
- `test-worker` — one test suite (unit/integration/e2e/contract).
- `reviewer` — one code-review pass (correctness, style, security smell).
- `security-worker` — runs the security gate skill; reports findings.
- `docs-worker` — writes/refreshes docs for a module or feature.
- `harvester` — extracts a proven pattern from product code into a reusable Registry module.

### Cross-cutting

#### `registry-librarian`
- **Mandate:** Guard the Module Registry: catalog new modules, enforce contract/versioning
  rules, run the reuse-search that every build task starts with, propose promotions/retirements.
- **Why separate:** Like a parts-market quality authority — keeps the catalog trustworthy so
  "reuse first" is safe.
- **Escalates when:** A promotion/retirement decision is needed → operator curates.

---

## 3. The I/O contract pattern (how handoffs stay clean)

Every agent reads and writes through a small, consistent envelope so any agent can consume any
other's output without bespoke glue — the software analog of standardized component packaging.

```yaml
# task-output.yaml  — written by every agent at task completion
task_id: BUILD-142
agent: module-builder
status: complete            # complete | blocked | escalated
produced:
  - path: packages/pricing/                 # code, docs, contracts...
    kind: module
    contract: contracts/pricing.v1.yaml
checks:
  tests: pass               # results of any gates this agent ran
  lint: pass
handoff_to: qa-lead         # next owner in the graph
notes: >
  Implemented pricing.v1 contract. Reused money + tax modules from Registry.
  Net-new: tiered-zone calculator (candidate to harvest).
escalation: null            # or { reason, question, blocking }
```

This envelope is what makes the JIT task graph work: downstream agents pull on `handoff_to`
and `status: complete`, and the orchestrator integrates from `produced`.

---

## 4. Standards every agent obeys

Encoded once (in the shared `CLAUDE.md` + the standards doc) and inherited by all agents:

1. **Reuse first.** Begin by querying the Registry via `registry-librarian`. Justify any
   net-new build in `notes`.
2. **Contract-driven.** Depend on contracts, not implementations. Never reach into a module's
   internals.
3. **Definition of done.** Code compiles, types pass, tests written and green, docs updated,
   gate checks run, output envelope written.
4. **Small context.** Request only the files/contracts you need. Don't load the whole product.
5. **Escalate, don't guess.** Ambiguity or conflict flows up the tier pyramid, not into a
   silent assumption.
6. **Harvest as you go.** Flag net-new patterns worth promoting so the catalog compounds.

---

## 5. Operator slash commands (your console)

| Command         | What it does                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `/commission`   | Start a new product/feature: captures the brief, spawns `orchestrator`.      |
| `/status`       | Show the live task graph, critical path, and which gate work is sitting at.  |
| `/gate <id>`    | Open a gate for your review/approval (G0, G1, G5 by default).                |
| `/reuse <need>` | Ask `registry-librarian` what existing module covers a need.                |
| `/harvest <x>`  | Promote a pattern from product code into a Registry module.                  |
| `/standards`    | View/edit the development standards every agent inherits.                    |
| `/postmortem`   | Have `ops-analyst` turn an incident into lessons + harvest candidates.       |

These keep your interface at the *operator* altitude: you commission, inspect, approve,
curate — the workforce does the rest.

---

## 6. Implementation skeleton

```
.claude/
├── CLAUDE.md                      # the factory constitution: standards all agents inherit
├── agents/
│   ├── orchestrator.md
│   ├── product-analyst.md
│   ├── architect.md
│   ├── build-lead.md
│   ├── qa-lead.md
│   ├── platform-lead.md
│   ├── ops-analyst.md
│   ├── registry-librarian.md
│   └── workers/                   # task-worker subagents (T3)
│       ├── module-builder.md
│       ├── frontend-worker.md
│       ├── backend-worker.md
│       ├── test-worker.md
│       ├── reviewer.md
│       └── ...
├── skills/
│   ├── scaffold-crud-service/SKILL.md     # reference designs as skills
│   ├── scaffold-dashboard/SKILL.md
│   ├── scaffold-mobile-field-app/SKILL.md
│   ├── gate-code/SKILL.md                 # gate checklists as skills
│   ├── gate-security/SKILL.md
│   ├── gate-release/SKILL.md
│   ├── reuse-search/SKILL.md
│   └── harvest-module/SKILL.md
└── commands/
    ├── commission.md
    ├── status.md
    ├── gate.md
    ├── reuse.md
    ├── harvest.md
    └── postmortem.md
```

When you're ready to move from blueprint to build, the next step is to author these subagent
and skill files — that *is* hiring the workforce. (Out of scope for this first pass; this
document is the hiring spec.)
