---
name: gate-design
description: >
  The design gate — accessibility + design-system adherence for any UI change. Runs alongside
  gate G2. Use when verifying a screen/component before it advances. Run by design-lead/qa-lead.
---

# Skill: gate-design (runs with G2)

Ensures UI is accessible and built from the design system, not improvised. A UI change does not
pass G2 until it also passes this.

## Accessibility (WCAG 2.1 AA — non-negotiable)
- **Contrast:** text ≥ 4.5:1 (≥ 3:1 large text / UI components).
- **Keyboard:** every interactive element reachable + operable; visible focus; logical order.
- **Semantics:** correct roles/labels/alt text; form fields labeled; errors announced.
- **Touch targets:** ≥ 44px; works one-handed on mobile.
- **Motion:** respects `prefers-reduced-motion`.

## Design-system adherence
- **Tokens only:** no hard-coded colors, font sizes, spacing, radii — everything references the
  product's tokens. Hard-coded values are a failure.
- **Components from the system:** screens are assembled from `design-system` components, not
  one-off markup/CSS.
- **Theming:** renders correctly in light/dark/brand themes.
- **States:** loading, empty, error, and success states all handled (no happy-path-only UI).
- **Responsive:** behaves at the product's breakpoints.

## Ruling
- Any a11y violation or hard-coded style / off-system component → **FAIL**; bounce to the worker
  with specifics.
- Borderline visual/brand judgments → `design-lead` decides; systemic gaps → escalate to operator.
- All clear → UI may advance with G2.
