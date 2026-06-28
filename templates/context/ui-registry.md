# UI Registry — <product>

Living document. Updated after every component is built (via `/imprint`). **Read this before
building any UI component — match an existing pattern before inventing a new one.** When there is no
external design source, this registry *is* the design system.

## How to use
1. Before building UI → check if a similar component exists below. If yes, match its exact tokens/
   classes/variants. If no, build it from `ui-rules.md` + the design-system, then add it here.
2. After building UI → add/refresh its entry (this is part of the Definition of Done for UI work).

## Components
_Empty. Components are added here as they are built._

<!--
Entry template:
### <ComponentName>  (path: components/.../ComponentName.tsx)
- Tokens/classes: <exact tokens used — no hard-coded values>
- Variants: <e.g. primary | secondary | ghost>
- States: default / hover / active / disabled / loading / empty / error / success (as applicable)
- A11y: <roles, labels, focus, contrast notes>
-->

## Invariants
- Read this file before building UI; match before inventing.
- Every entry uses tokens only — no hard-coded colors/sizes.
- The registry is updated as part of done, never skipped.
