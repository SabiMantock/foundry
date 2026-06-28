---
description: Choose or change the tech stack for a product. Records it as an ADR.
argument-hint: [product] [profile A|B|C|D or free description]
---

The operator is deciding the tech stack: **$ARGUMENTS**

The Foundry mandates no stack — you decide, per product. Run this at `/new-product` time or to
change a stack later.

1. **Present the options** from `templates/stack-profiles.md` (A: TS-everywhere [default],
   B: Python backend + TS frontend, C: TS core + Python service module, D: custom). If the
   operator already named a choice in the arguments, confirm it; otherwise ask which they want.
2. **Pin versions for real.** Run the `check-latest-versions` skill for the chosen stack's key
   libraries — do NOT just copy `stack-baseline.md`. Use latest **stable** only; surface any
   EOL, RC-only, or compatibility flags (e.g. linter vs. new TS major) for the operator.
3. **Record the decision** as `docs/decisions/0001-tech-stack.md` (from
   `templates/adr-template.md`): chosen profile, concrete tools, pinned versions + the date
   verified, and the rationale. This ADR is what every agent reads and builds within.
4. **If changing an existing stack:** write a NEW ADR that supersedes the old one (don't edit
   in place) and flag the migration impact to the operator before any build proceeds.

Confirm the recorded stack back to the operator. The `architect` will honor this ADR at G1.
