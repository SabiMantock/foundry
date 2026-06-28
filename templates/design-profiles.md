# Design Profiles — the operator chooses, per product

Design and styling are a **decision**, made once per product and recorded as an ADR
(`docs/decisions/0002-design-system.md`), exactly like the tech stack. Every UI agent then
builds **only** from the chosen design system and its tokens — never ad-hoc styles. This keeps
products visually consistent and accessible by construction.

Pick a profile as a starting point, then customize. Whatever is chosen, the UI library versions
are pinned to **web-verified latest stable** via `check-latest-versions` (last verification in
`stack-baseline.md`).

---

## Profile 1 — Tailwind + shadcn/ui *(default recommendation for React/Next)*
Utility-first CSS with **owned** components (you copy them in, you control them). Primitives via
the unified `radix-ui` package; shadcn CLI scaffolds and ships agent skills.

- **Styling:** Tailwind CSS · **Components:** shadcn/ui (Radix/Base UI primitives)
- **Mobile counterpart:** NativeWind (Tailwind for React Native) for token parity
- Best when you want full control of look + accessible primitives without a heavy dependency.

## Profile 2 — Design tokens + CSS Modules / vanilla-extract
Framework-agnostic, no utility classes. Strict token discipline; styles are typed and scoped.

- **Styling:** CSS Modules or vanilla-extract driven by a tokens file
- Best for teams wanting hard token enforcement or non-React/SSR-heavy UIs.

## Profile 3 — Opinionated component library (MUI / Mantine / Chakra)
Fastest path to a complete, consistent UI; less visual differentiation.

- **Components+styling:** one library, themed via its token system
- Best when speed and breadth of components matter more than a bespoke look.

## Profile 4 — Import an existing design (Figma → code)
You already have designs. Map Figma components and variables to code via **Code Connect**, pull
design **variables as tokens**, and keep code ↔ design in sync.

- **Source of truth:** Figma; **tokens:** exported from Figma variables
- Pairs with Profile 1 or 3 for the actual component implementation.
- Uses the Figma tooling (Code Connect, get_variable_defs) available in this toolchain.

## Profile 5 — Custom / existing design system
The product must match an existing brand or in-house design system. The `design-lead` records the
source of truth, tokens, and component inventory in the ADR and confirms the design gate
(accessibility + token adherence) has teeth before any UI is built.

---

## What every design decision must capture (recorded in the ADR)
- **Design tokens:** color palette (semantic, not raw), typography scale, spacing scale, radii,
  shadows/elevation, z-index, breakpoints. Start from `templates/design-tokens.example.json`.
- **Theming:** light/dark (and any brand variants); how themes switch.
- **Component source:** the library/approach above + iconography choice.
- **Accessibility target:** **WCAG 2.1 AA by default** (contrast, focus, keyboard, touch targets).
- **Responsive + motion:** breakpoints and a motion/easing policy (respect reduced-motion).
- **Web ↔ mobile parity:** how tokens stay shared across web and React Native.

## What the choice does and does not change
- **Changes:** the `design-system` module's implementation, how `frontend-worker`/`mobile-worker`
  style UI, the design gate's specifics.
- **Does NOT change:** the agent workforce, the gates' existence, the contract-driven module
  model, or accessibility being mandatory. The factory is the same; only the look differs.

## How to record it
`/design` writes `docs/decisions/0002-design-system.md` (from `templates/adr-template.md`) and
seeds a tokens file from `templates/design-tokens.example.json`. Changing the design system later
is a new ADR that supersedes it — a deliberate, reviewed act.
