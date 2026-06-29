# The Foundry

A standalone, **product-agnostic** AI-agent software production ecosystem, modeled on
China's manufacturing clusters: specialized agents (guilds) assemble products from a
catalog of reusable modules, using reference designs, passing quality gates, coordinated
just-in-time. You operate it as **architect and operator** — you commission, set
standards, and approve at gates; the agent workforce builds.

The Foundry contains **no product of its own**. It is the machine; products are what it
produces. It ships as an installable Claude Code plugin, so the same factory can build any
number of separate products, each in its own repo.

> Design rationale lives in `../software-factory-blueprint/` (docs 00–07).

## What's in here

```
foundry/
├── .claude-plugin/plugin.json   # plugin manifest (makes the factory installable)
├── CLAUDE.md                    # the factory constitution (inherited by every agent)
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
│   └── workers/                 #   T3 — disposable, parallel task workers
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
│   ├── gate-security/           #   G3 checklist
│   ├── gate-design/             #   WCAG 2.1 AA + design-system/token adherence
│   └── gate-release/            #   G5 checklist
├── commands/                    # the operator console (slash commands)
│   ├── new-product.md  stack.md  design.md  commission.md  status.md
│   ├── gate.md  reuse.md  review.md  harvest.md  postmortem.md
│   ├── remember.md  recover.md  imprint.md
└── templates/                   # reference designs the factory STAMPS INTO a product
    ├── workspace/               #   pnpm/turbo/tsconfig/eslint(flat)/prettier root
    ├── ci/                      #   the gate-*.yml workflows + CODEOWNERS
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
    ├── adr-template.md
    └── spec-template.md
```

The clean separation: **the factory** (agents + skills + commands + constitution) is
portable and product-free; **templates/** is the factory's reference-design library — the
"molds" it presses into a product workspace when you commission one.

## Install the factory

This repo ships its own marketplace manifest (`.claude-plugin/marketplace.json` + `plugin.json`
at the root), so it's installable as a plugin.

### In Claude Code (CLI) — recommended
Launch Claude, then use the interactive plugin manager:

1. Open Claude Code.
2. Run **`/plugin`**.
3. Choose **Add marketplace** → enter `SabiMantock/foundry` (or the full
   `https://github.com/SabiMantock/foundry` URL). A local path also works here.
4. **Browse / Install → foundry.**

To update later: `git push` your changes (bump the version in `plugin.json` + `marketplace.json`),
then `/plugin` → update. Non-interactive equivalent:
```bash
claude plugin marketplace add SabiMantock/foundry   # or a local path
claude plugin install foundry@foundry-marketplace
```

### In the Claude app (Cowork)
The app installs from a **GitHub marketplace** (push this repo first): **Cowork tab → Customize
(sidebar) → Plugins → Add marketplace** → `SabiMantock/foundry` → **Browse plugins → foundry →
Install.**

### Manual (any repo) — copy into `.claude/`
```bash
mkdir -p .claude
cp CLAUDE.md .claude/CLAUDE.md
cp -R agents skills commands .claude/
```

## How you operate it

Commands are namespaced `/foundry:<command>` once installed. Run them from the product root.

1. `/foundry:new-product <name>` — scaffold a fresh product workspace (in the current folder). It
   runs stack then design first, so **you choose the tech stack and the design system** (profiles in
   `templates/stack-profiles.md` and `templates/design-profiles.md`); library versions are
   web-verified to latest stable before anything is pinned.
2. `/foundry:commission "<what to build>"` — capture the brief (gate **G0**); the `orchestrator`
   decomposes it and runs the line.
3. Approve the architecture at `/foundry:gate G1` — your highest-leverage decision.
4. Workers build in parallel; **G2–G4** run in CI from the stamped workflows.
5. Approve `/foundry:gate G5` to release; `ops-analyst` watches **G6**.
6. Curate the catalog with `/foundry:harvest`; raise the bar by editing `CLAUDE.md`.

Full step-by-step: `templates/commission-runbook.md`.

If you find yourself hand-building, a module or agent is missing — add it to the factory
rather than absorbing the work. That's the whole thesis.

## Status

- ✅ Factory built: constitution, 16 agents, 13 skills, 13 commands (plugin v0.3.3).
- ✅ Reference-design templates: workspace, CI gates, module skeleton, schemas, stack/design
  profiles, context pack, build-plan + unit-spec, commission runbook, ADR/spec.
- ⏳ Next: install/update the plugin, `/foundry:new-product` your first product, then commission it.

The factory is deliberately empty of products. Point it at whatever you want to build.
