---
description: Choose or change the design system & styling for a product. Records it as an ADR.
argument-hint: [product] [profile 1-5 or free description]
---

The operator is deciding the design system & styling: **$ARGUMENTS**

The Foundry mandates no look — you decide, per product. Run this at `/new-product` time (after
`/stack`) or to change a design later.

1. **Present the options** from `templates/design-profiles.md` (1: Tailwind + shadcn/ui
   [default], 2: tokens + CSS Modules/vanilla-extract, 3: component library, 4: import from
   Figma, 5: custom/existing system). If the operator named a choice, confirm it; else ask.
2. **Capture the design decision** — tokens (color/type/space/radii/shadow/breakpoints),
   theming (light/dark/brand), component source + icons, **accessibility target (WCAG 2.1 AA
   default)**, responsive + motion policy, and web↔mobile token parity. Seed a tokens file from
   `templates/design-tokens.example.json`.
3. **Pin UI library versions for real** via `check-latest-versions` (e.g. Tailwind, shadcn CLI,
   the component library) — latest **stable** only, note EOL/breaking changes.
4. **If importing from Figma (Profile 4):** pull design variables as tokens and set up Code
   Connect so code ↔ design stay in sync (use the Figma tooling available in this toolchain).
5. **Record** `docs/decisions/0002-design-system.md` (from `templates/adr-template.md`): chosen
   profile, tokens summary, component source + pinned versions, a11y target, and rationale. This
   ADR is what the `design-lead` and UI workers build within.
6. **If changing an existing design:** write a NEW ADR that supersedes the old one and flag the
   reskin/migration impact before any UI work proceeds.

Confirm the recorded design back to the operator. `design-lead` owns it; `frontend-worker`/
`mobile-worker` build only from these tokens/components; the design gate enforces it.
