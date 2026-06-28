# UI Rules — <product>

Concise rules for building this product's UI consistently. The design assets + tokens
(`docs/context/ui-registry.md`, the design-system module) are the source of truth for visual
decisions; these rules capture the patterns and constraints that keep the UI coherent without
over-specifying every pixel. Derived from the design ADR (`docs/decisions/0002-design-system.md`).

## Font / type
- Use the product's chosen font; never fall back to a system font as primary.
- Three type levels max (heading / body / muted) — see tokens.

## Layout
- Page max-width, padding, and section gaps come from tokens — don't invent spacing.

## Color discipline
- **Tokens only.** Never hard-code hex; never use a framework's raw color classes
  (e.g. `bg-purple-500`). Use the semantic tokens from the design system.
- Color goes inside surfaces via badges/bars/text — not on card surfaces.

## Components
- Build from the `design-system` components; match the `ui-registry.md` pattern before inventing.
- Every interactive state (hover/active/disabled) and every data state
  (loading/empty/error/success) is handled.

## Accessibility
- WCAG 2.1 AA: contrast, keyboard, focus, labels, touch targets. Enforced by `gate-design`.

## Do-nots
- No hard-coded colors/sizes. No raw framework color classes. No inline one-off styles.
- No new font weights mid-element. No raw error text shown to users.

## Invariants
- Never hard-code values that exist as tokens.
- Every new component is imprinted into `ui-registry.md` as part of done.
- Accessibility is part of done, not a later pass.
