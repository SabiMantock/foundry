---
description: Capture a new component's pattern into the UI registry and find design drift.
argument-hint: [component/page just built, or "audit" to scan the whole codebase]
---

Run the **imprint** skill: **$ARGUMENTS**

- After building UI → capture the component into `docs/context/ui-registry.md`: name, path, exact
  tokens/classes, variants, states, a11y notes.
- Before building UI → match an existing registry pattern instead of inventing a new one.
- `audit` → scan the codebase against the registry + tokens and return a fix list of inconsistencies
  (hard-coded values, off-token colors/spacing, missing states).

Often auto-runs as part of the Definition of Done for UI work — check whether `ui-registry.md`
already updated before running manually. Pairs with `gate-design`, which enforces what imprint records.
