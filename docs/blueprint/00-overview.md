# The Foundry — An AI-Agent Software Production Ecosystem

> A modular "software factory" where specialized AI agents collaborate to produce
> high-quality software, modeled on the structure of China's manufacturing ecosystem.
> First product: **Relay**, an AI-powered logistics operations system for independent
> courier companies (launching generic-first, then localized for Ghana and the UK).

*"The Foundry" and "Relay" are working codenames — rename freely.*

---

## 1. Why model it on Chinese manufacturing?

China did not become the world's factory by building one giant vertically-integrated
plant. It built an **ecosystem**: dense clusters of hyper-specialized suppliers, a public
market of standardized components, shared reference designs, tiered subcontracting, and
relentless iteration. Any entrepreneur in Shenzhen can walk into Huaqiangbei, buy proven
modules off the shelf, hand a reference design to a contract manufacturer, and ship a
product in weeks — without owning a single machine.

That is precisely the leverage you want as an *architect and operator* rather than a
builder. You should be able to commission a product, and have a standing ecosystem of
specialized agents, reusable modules, and reference designs turn it into shipped software —
while you steer, set standards, and approve at the gates.

### The mapping

| Chinese manufacturing                              | The Foundry (software)                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| Industrial cluster / agglomeration (Shenzhen, PRD) | **Agent guilds** — co-located specialist agents sharing one workspace      |
| Component market (Huaqiangbei)                     | **Module Registry** — the internal catalog of reusable, versioned modules  |
| Reference designs / public boards (*gongban*)       | **Reference Designs** — scaffolds, blueprints, golden-path templates        |
| Tiered suppliers (Tier 1 / 2 / 3)                  | **Tiered agents** — orchestrators → specialists → task workers              |
| Just-in-time supply chain                          | **JIT orchestration** — dependency-driven work, nothing built until needed  |
| QC stations & standardized testing                 | **Quality gates** — automated review, tests, security, and human approvals  |
| OEM / ODM / OBM contract manufacturing             | **Product lines** — the factory builds many products; Relay is the first    |
| Tooling & mold shops                               | **Shared tooling** — CI/CD, scaffolders, generators, observability          |
| "Little giants" (specialist SMEs)                  | **Deep specialist agents** — narrow scope, exceptional quality              |
| Fast prototyping → tooling → mass production        | **Phased pipeline** — prototype → harden → productionize → operate          |

The deep principle borrowed from China is **economies of scope, not just scale**: the same
ecosystem that builds Relay should build the second and third products faster and cheaper,
because the modules, agents, standards, and tooling are reused. Each product makes the
factory stronger.

---

## 2. The four layers of the Foundry

The ecosystem is organized as four layers. Each subsequent document details one or more.

1. **Substrate** — the shared infrastructure every product depends on: the monorepo,
   Module Registry, CI/CD, environments, secrets, observability, and the tooling shop.
   *(See `06-standards-and-tooling.md`.)*

2. **Workforce** — the specialized AI agents (guilds) and how they are implemented as
   Claude Code subagents, skills, and slash commands. *(See `02-ai-agents.md`.)*

3. **Production system** — the workflows and orchestration that move a product idea from
   intake to shipped, with quality gates and feedback loops. *(See `03-workflows.md`.)*

4. **Catalog** — the reusable modules and reference designs that let the factory assemble
   rather than hand-build. *(See `04-reusable-modules.md`.)*

On top of these four layers sit **product lines** — the actual software being produced.
Relay is product line #1. *(See `05-logistics-platform.md`.)*

---

## 3. Your role: architect and operator

You operate the factory the way a factory owner does — you do not stand on the line. Your
work concentrates at five control points:

- **Commission** — define what product (or feature) to build and why; set the brief.
- **Standards** — own the development standards, the definition of done, and the quality bar.
- **Gates** — approve at the checkpoints where human judgment matters (architecture sign-off,
  pre-merge, pre-release, anything irreversible or costly).
- **Registry curation** — decide what gets promoted into the reusable Module Registry, and
  retire what rots. This is the compounding asset.
- **Exception handling** — step in when an agent escalates ambiguity, conflict, or risk.

Everything between those points is delegated to the agent workforce. The operating loop:

```
COMMISSION → DECOMPOSE → ASSEMBLE (reuse first) → BUILD → QC GATES → SHIP → OPERATE → LEARN
     ▲                                                  │                            │
     └──────────────── you approve at gates ────────────┘     feedback to Registry ──┘
```

### What "good" looks like for the operator

You should be able to issue a high-level commission (e.g. *"add proof-of-delivery with
offline photo capture to Relay"*), watch the orchestrator decompose it, see which existing
modules get reused, approve the architecture, and review the result at the gate — without
writing implementation code yourself. If you find yourself hand-building, that is a signal a
module or agent is missing from the factory; the fix is to add it, not to do the work.

---

## 4. How the documents fit together

| #  | Document                          | What it covers                                                       |
| -- | --------------------------------- | ------------------------------------------------------------------- |
| 00 | `00-overview.md` (this file)      | The vision, the analogy, the operating model                        |
| 01 | `01-ecosystem-architecture.md`    | The factory's structure: guilds, registry, tiers, JIT, gates        |
| 02 | `02-ai-agents.md`                 | The agent roster and Claude Code implementation                     |
| 03 | `03-workflows.md`                 | Production pipelines, handoffs, orchestration, feedback loops        |
| 04 | `04-reusable-modules.md`          | The module catalog, interface contracts, versioning, the registry   |
| 05 | `05-logistics-platform.md`        | Relay: stack, architecture, modules, Ghana+UK localization roadmap  |
| 06 | `06-standards-and-tooling.md`     | Development standards, quality gates, and the shared tool stack      |
| 07 | `07-roadmap-and-metrics.md`       | Build sequence, factory KPIs, and how the ecosystem compounds        |

---

## 5. Founding principles (the factory's "constitution")

1. **Reuse before build.** Every task starts by searching the Registry. Net-new code is the
   exception that must be justified, then harvested back into the catalog.
2. **Standard interfaces over standard implementations.** Like a component market, modules
   interoperate because their *contracts* are fixed, not their internals.
3. **Quality is gated, not hoped for.** Nothing advances past a checkpoint it hasn't passed.
   Gates are automated first, human only where judgment is required.
4. **Agents are narrow and deep.** A specialist that does one thing exceptionally beats a
   generalist that does everything adequately — the "little giants" model.
5. **The operator approves, the factory builds.** Human attention is the scarcest resource;
   spend it on gates, standards, and curation, not on production.
6. **Every product strengthens the factory.** Modules, patterns, and lessons flow back into
   the shared catalog so the next product is faster.
7. **Localize last, abstract first.** Build clean generic cores; push market-specifics
   (Ghana, UK, future markets) to the edges as pluggable adapters.
