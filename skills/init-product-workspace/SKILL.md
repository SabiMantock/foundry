---
name: init-product-workspace
description: >
  Scaffold a fresh, gate-ready product workspace from the factory's templates. Use when the
  operator runs /new-product or starts building a product that has no repo yet.
---

# Skill: init-product-workspace

Presses the factory's reference designs (`templates/`) into a new product repo so it is
standards-compliant and gate-ready from the first commit. The factory stays separate; this
produces the *product*.

## Inputs
- Product name (kebab-case), e.g. `acme-billing`.
- Target directory (defaults to a sibling of the factory, NOT inside it).

## Steps
1. **Create the repo root** at the target directory (never inside the factory).
2. **Copy `templates/workspace/*`** to the root (package.json, pnpm-workspace.yaml,
   turbo.json, tsconfig.base.json, eslint.config.mjs, .prettierrc.json, .gitignore,
   .env.example, scripts/). Set the root `package.json` `name` to the product name.
3. **Copy `templates/ci/*.yml`** into `.github/workflows/` and `templates/ci/CODEOWNERS`
   into `.github/`.
4. **Create empty structure:** `packages/` (modules), `apps/` (the product app),
   `contracts/`, `registry/index/`, `docs/decisions/`, `docs/specs/`.
5. **Seed one module** from `scaffold-module` so `pnpm gate:code` is green immediately
   (proves the gates work end-to-end before any real work).
6. **Install the constitution** — ALWAYS copy the factory's `CLAUDE.md` to the product's
   `.claude/CLAUDE.md`. A plugin's own CLAUDE.md is NOT loaded as context, so even with the
   plugin installed the constitution must be stamped into each product. If the plugin is NOT
   installed, also copy `agents/`, `skills/`, `commands/` into `.claude/` so the workforce
   works in that repo (commands then run un-namespaced, e.g. `/commission`).
7. **Verify:** `pnpm install && pnpm gate:code && pnpm build && pnpm test:contract` are green.

## Output
A ready product repo + an output envelope noting the path and the green gate run.
`handoff_to: orchestrator` (ready to receive the first `/commission`).

## Guardrails
- The product repo lives OUTSIDE the factory — never mix product code into the factory.
- Don't customize standards here; change `templates/` if a standard should shift for ALL
  future products.

## Stack selection (do this FIRST)
Before copying `templates/workspace/`, run `/stack` (or the equivalent): have the operator pick
a profile from `templates/stack-profiles.md`, run `check-latest-versions` for that stack, and
record `docs/decisions/0001-tech-stack.md`. Then scaffold the workspace in the chosen stack and
pin the verified versions. The TS workspace template is the DEFAULT only — swap tooling if the
operator chose another profile.

## Design selection (after stack)
If the product has UI, run `/design` after `/stack`: pick a profile from
`templates/design-profiles.md`, web-verify UI library versions, seed tokens from
`templates/design-tokens.example.json`, and record `docs/decisions/0002-design-system.md`. Then
`design-lead`/`establish-design-system` stands up the `design-system` module the UI builds from.

## Context pack (seed it)
Seed the product context pack from `templates/context/` into `docs/context/`
(library-docs, ui-rules, ui-registry, progress-tracker) and create `docs/memory/`. These are living
files agents read at task start and keep current via `/remember` and `/imprint`. See
`templates/context/README.md` for the full map and the order-of-authority rule.

## Entry point & workflow rules
Also seed `templates/context/ai-workflow-rules.md` into `docs/context/`, and copy
`templates/AGENTS.md` to the product root as `AGENTS.md` (the read-order entry point; mirror to
`CLAUDE.md` if the agent prefers that name). The factory constitution still installs at
`.claude/CLAUDE.md`. Build plans/unit specs (`templates/build-plan-template.md`,
`templates/unit-spec-template.md`) are produced by `build-lead` per commission, not at init.
