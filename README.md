# The Foundry

A standalone, **product-agnostic** AI-agent software production ecosystem, modeled on
China's manufacturing clusters: specialized agents (guilds) assemble products from a
catalog of reusable modules, using reference designs, passing quality gates, coordinated
just-in-time. You operate it as **architect and operator** — you commission, set
standards, and approve at gates; the agent workforce builds.

The Foundry contains **no product of its own**. It is the machine; products are what it
produces. It ships as an installable Claude Code plugin, so the same factory can build any
number of separate products, each in its own repo.

> Design rationale ships with the repo in `docs/blueprint/` (docs 00–07). Doc 05 is the worked
> example of a first product (Relay, logistics) — rationale only, not shipped machinery.

## What's in here

```
foundry/
├── .claude-plugin/plugin.json   # plugin manifest (makes the factory installable)
├── docs/blueprint/              # design rationale (docs 00–07): why the factory is built this way
├── CLAUDE.md                    # the factory constitution — stamped into each product's
│                                #   .claude/CLAUDE.md by /new-product (a plugin's own
│                                #   CLAUDE.md is NOT auto-loaded; see "Install")
├── agents/                      # the workforce
│   ├── orchestrator.md          #   T1 — decomposes & integrates
│   ├── product-analyst.md       #   T2 guild leads
│   ├── architect.md
│   ├── design-lead.md           #   owns the design system, tokens, a11y gate
│   ├── build-lead.md
│   ├── qa-lead.md
│   ├── platform-lead.md
│   ├── ops-analyst.md
│   ├── registry-librarian.md    #   cross-cutting catalog guardian
│   └── workers/                 #   T3 — module-builder, backend/frontend/mobile/data,
│                                 #   test, reviewer, security, docs, harvester (disposable, parallel)
├── skills/                      # SOPs the agents run
│   ├── reuse-search/            #   find a module before building
│   ├── harvest-module/          #   promote proven code into the catalog
│   ├── scaffold-module/         #   reference design for a new module
│   ├── init-product-workspace/  #   stamp a fresh product repo from templates/
│   ├── check-latest-versions/   #   web-verify latest STABLE deps before pinning
│   ├── establish-design-system/ #   stand up tokens + components from the design profile
│   ├── remember/                #   save/restore context across sessions
│   ├── recover/                 #   circuit breaker: diagnose the failure mode
│   ├── imprint/                 #   capture components into the UI registry
│   ├── gate-code/               #   G2 checklist
│   ├── gate-architecture/       #   fitness function: contract/registry drift, layering, cycles
│   ├── gate-security/           #   G3 checklist
│   ├── gate-design/             #   WCAG 2.1 AA + design-system/token adherence
│   ├── gate-integration/        #   G4: contract pairs + e2e + perf budget
│   └── gate-release/            #   G5 checklist
├── commands/                    # the operator console (slash commands)
│   ├── new-product.md  stack.md  design.md  commission.md  status.md
│   ├── gate.md  reuse.md  review.md  harvest.md  postmortem.md
│   ├── remember.md  recover.md  imprint.md  standards.md
└── templates/                   # reference designs the factory STAMPS INTO a product
    ├── workspace/               #   pnpm/turbo/tsconfig/eslint(flat)/prettier root
    │   └── scripts/             #   check-architecture.mjs (the gate-architecture script)
    ├── ci/                      #   the gate-*.yml workflows + CODEOWNERS
    ├── reference-designs/       #   C4-style blueprints (CRUD/dashboard/mobile/event) + layering rules
    ├── module/                  #   the canonical module skeleton (neutral)
    ├── schemas/                 #   contract + registry-index example shapes
    ├── stack-profiles.md        #   selectable stacks (operator chooses per product)
    ├── stack-baseline.md        #   last web-verified stable versions + date
    ├── design-profiles.md       #   selectable design systems (operator chooses per product)
    ├── design-tokens.example.json #  starter semantic, theme-aware tokens
    ├── context/                 #   per-product context pack (library-docs, ui-rules,
    │                            #   ui-registry, ai-workflow-rules, progress-tracker)
    ├── AGENTS.md                #   product entry point — context read-order
    ├── build-plan-template.md   #   ordered units + ordering heuristics
    ├── unit-spec-template.md    #   per-unit spec w/ Verify-when-done checklist
    ├── commission-runbook.md    #   operator step-by-step: scaffold → commission → ship
    ├── factory-metrics.md       #   the factory scoreboard (reuse ratio, human-touch, cost)
    ├── adr-template.md
    └── spec-template.md
```

The clean separation: **the factory** (agents + skills + commands + constitution) is
portable and product-free; **templates/** is the factory's reference-design library — the
"molds" it presses into a product workspace when you commission one.

## Install the factory

This repo ships its own marketplace manifest (`.claude-plugin/marketplace.json` + `plugin.json`),
so it installs as a plugin. Pick ONE of the three routes.

> **One rule the plugin system imposes:** a plugin's own `CLAUDE.md` is **not** loaded into
> context. The constitution only governs a product once it exists at that product's
> `.claude/CLAUDE.md` — `/foundry:new-product` stamps it there automatically. If you point the
> factory at an *existing* repo, copy it yourself: `cp CLAUDE.md <repo>/.claude/CLAUDE.md`.

### A — Claude Code (CLI)
```bash
claude plugin marketplace add <owner>/foundry   # GitHub repo — or /path/to/foundry for local
claude plugin install foundry@foundry-marketplace
claude plugin list                              # verify version
```
(Or interactively: `/plugin` → Add marketplace → Browse & install.)
Update later: bump the version in `plugin.json` + `marketplace.json`, push, then
`claude plugin update foundry`. Local-path marketplaces pick up changes on update too.

### B — Claude app (Cowork)
Cowork installs from a **GitHub** marketplace, so push this repo first. Then: **Customize →
Plugins → Personal plugins → + → Add marketplace** → `<owner>/foundry` → install **foundry**.

### C — Manual (single repo, no plugin)
Copy the factory straight into one product repo:
```bash
mkdir -p .claude
cp CLAUDE.md .claude/CLAUDE.md
cp -R agents skills commands .claude/
```
Note: with manual copy the commands are **un-namespaced** (`/commission`, not
`/foundry:commission`), and updates mean re-copying.

## Run it (first product, end to end)

Commands are namespaced `/foundry:<command>` when installed as a plugin (routes A/B).

1. **`cd` into an empty folder** where the product should live — **outside** the factory repo.
2. **`/foundry:new-product <name>`** — one command scaffolds everything. It walks you through
   the two setup decisions — **stack** (`templates/stack-profiles.md`) and **design system**
   (`templates/design-profiles.md`), both recorded as ADRs, versions web-verified to latest
   stable — then presses the templates: workspace config, CI gates, context pack, `AGENTS.md`,
   the constitution at `.claude/CLAUDE.md`, and one seed module so all gates are green on day
   one. (To change stack/design later: `/foundry:stack`, `/foundry:design`.)
3. **`/foundry:commission "<brief>"`** — what/why/users/scope/non-scope/acceptance
   criteria/constraints/success. Approve the brief at **G0**; the `orchestrator` runs the line.
4. **`/foundry:gate G1`** — review reference design, reuse-vs-build, contracts, ADR. Your
   highest-leverage decision.
5. Workers build in parallel; **G2–G4** run in CI from the stamped workflows. Check in with
   `/foundry:status`.
6. **`/foundry:gate G5`** to ship; `ops-analyst` watches **G6**.

Session habits: `/foundry:remember save` at the end of a session, `restore` at the start of the
next; `/foundry:imprint` after building UI; `/foundry:recover` when stuck after one failed fix.
Improve the factory: `/foundry:harvest` (grow the catalog), `/foundry:standards` (raise the bar),
`templates/factory-metrics.md` (is it compounding?).

Full step-by-step with a worked example: `templates/commission-runbook.md` (stamped into each
product as `docs/commission-runbook.md`).

If you find yourself hand-building, a module or agent is missing — add it to the factory
rather than absorbing the work. That's the whole thesis.

## Status

- ✅ Factory built: constitution, 19 agents, 15 skills, 14 commands (plugin v0.5.0).
- ✅ Reference-design templates: workspace (+ `gate-architecture` fitness-function script), CI
  gates, C4-style reference-design blueprints, module skeleton, schemas, stack/design profiles,
  context pack, build-plan + unit-spec, commission runbook, factory scoreboard, ADR/spec.
- ⏳ Next: install/update the plugin, `/foundry:new-product` your first product, then commission it.

The factory is deliberately empty of products. Point it at whatever you want to build.
