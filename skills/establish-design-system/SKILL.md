---
name: establish-design-system
description: >
  Define and stand up a product's design system from the chosen design profile: tokens, theming,
  accessible components, and (optionally) a Figma import. Use at /design time or when a product
  first needs UI. Run by design-lead.
---

# Skill: establish-design-system

Turns the operator's design decision into a real, reusable `design-system` module that all UI is
built from. The design analog of scaffolding a module from a contract.

## Inputs
- The design ADR `docs/decisions/0002-design-system.md` (chosen profile + requirements).
- The starter `templates/design-tokens.example.json`.

## Steps
1. **Tokens.** Create the product's tokens from the starter: semantic names
   (`color.bg.surface`, not `gray-100`), full scales (type/space/radii/shadow/breakpoints/
   motion), light/dark + brand themes. Tokens are the single source of truth.
2. **Pin libraries.** Run `check-latest-versions` for the profile's UI libs (e.g. Tailwind,
   shadcn CLI, or the component library) — latest **stable** only; record versions in the ADR.
3. **Stand up the `design-system` module.** Following the module template: tokens export +
   accessible primitives + documented components (each with variants, states, and a11y notes).
   This module is what `frontend-worker`/`mobile-worker` import; nothing styles outside it.
4. **Theming.** Wire light/dark/brand switching off the tokens (CSS variables / theme provider).
5. **Web ↔ mobile parity.** Share the token source across web and React Native (e.g. NativeWind)
   so both surfaces stay visually consistent.
6. **Figma import (Profile 4):** pull design variables as tokens and set up Code Connect so code
   and design stay in sync; map components to their code counterparts.
7. **Verify** with `gate-design` (a11y + token adherence + states) before declaring it ready.

## Output
A `design-system` Registry module + tokens file + an updated ADR. `handoff_to: build-lead`.

## Guardrails
- Semantic tokens only — raw hex/sizes in components defeat theming and rebrands.
- Accessibility (WCAG 2.1 AA) is built in from token contrast up, not bolted on.
- One design system per product; market/brand variants are themes, not forks.
