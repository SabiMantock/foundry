---
name: imprint
description: >
  Keep the UI consistent across sessions by capturing each new component's pattern into the product's
  UI registry, and finding drift. Run after building any UI component/page, and before building a new
  one (to match existing patterns). Run by frontend-worker / design-lead.
---

# Skill: imprint (UI consistency)

The component-level twin of "reuse first". Without it, buttons/spacing/states drift apart across
sessions until the design system has silently fractured. The UI registry
(`docs/context/ui-registry.md`) is the living record that prevents this — and *becomes* the design
system when there's no Figma source.

## After building a UI component/page (capture)
Append/refresh an entry in `docs/context/ui-registry.md`:
- component name + file path;
- the exact tokens/classes used (from the design system — no hard-coded values);
- variants and states handled (default/hover/active/disabled, loading/empty/error/success);
- a11y notes (roles, labels, focus, contrast).

## Before building a new UI component (match)
Read the registry first. If a similar component exists → **match its exact pattern**, don't invent a
new one. Only build net-new when nothing fits, then imprint it.

## Across the codebase (audit)
Scan components against the registry + tokens and produce a fix list of inconsistencies: hard-coded
values, off-token colors/spacing, divergent variants, missing states. Feed fixes back as tasks.

## Rules
- Tokens only — a registry entry with hard-coded hex/sizes is itself a defect.
- The registry is updated as part of the Definition of Done for UI work — not a separate chore.
- imprint complements `gate-design`: imprint keeps the registry current; `gate-design` enforces it.

## Output
Updated `ui-registry.md` and/or a consistency fix list. `handoff_to: design-lead` for audit rulings.
