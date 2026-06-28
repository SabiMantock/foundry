---
description: Scaffold a fresh, gate-ready product workspace from the factory templates.
argument-hint: <product-name> [target directory]
---

The operator is starting a new product: **$ARGUMENTS**

Run the **init-product-workspace** skill.

1. Confirm the product name (kebab-case) and target directory. The product repo must live
   **outside** the factory — never inside it. If the target is ambiguous, ask.
2. Press the factory's `templates/` into the new repo: workspace config, CI gates, empty
   `packages/ apps/ contracts/ registry/index/ docs/`, and one seed module so the gates are
   green on day one.
3. Install the factory workforce into the product's `.claude/` (or note the plugin is already
   installed) so `/commission`, `/gate`, etc. work in that repo.
4. Verify `pnpm install && pnpm gate:code && pnpm build && pnpm test:contract` are green and
   report the path.

Then tell the operator they can `/commission "<first feature>"` in the new repo.
Keep the factory itself product-free.

## Stack first
Before scaffolding, run `/stack` for this product: the operator picks a profile
(`templates/stack-profiles.md`), versions are web-verified via `check-latest-versions`, and the
choice is recorded as `docs/decisions/0001-tech-stack.md`. Scaffold in THAT stack — the
TypeScript workspace template is only the default.

## Design next
After `/stack`, run `/design` for this product: the operator picks a design profile
(`templates/design-profiles.md`), UI library versions are web-verified, tokens are seeded from
`templates/design-tokens.example.json`, and the choice is recorded as
`docs/decisions/0002-design-system.md`. `design-lead` then stands up the `design-system` module.

## Context pack
Scaffolding also seeds the product context pack (`docs/context/` + `docs/memory/`) from
`templates/context/` — library-docs, ui-rules, ui-registry, progress-tracker. Agents read these at
task start; `/remember` and `/imprint` keep them current across sessions.

## Entry point
Scaffolding also drops a product `AGENTS.md` at the root (read-order entry point) and seeds
`ai-workflow-rules.md` into `docs/context/`. Build plans + unit specs are produced per commission by
`build-lead`.

## Runbook
Drop a copy of `templates/commission-runbook.md` into the product as `docs/commission-runbook.md`
(filled with the product name) so the operator has the scaffold → commission → ship steps on hand.

## Working directory
If the operator is already in the folder where the product should live (the root), scaffold **in
place** — no path argument needed. Only create/scaffold into a subfolder when a path is given. Either
way the product lives OUTSIDE the factory.
