---
description: View or tighten the development standards every agent inherits (the constitution + gates).
argument-hint: [view | tighten <what>, e.g. "raise coverage floor to 90"]
---

The operator is inspecting or tuning the factory's standards: **$ARGUMENTS**

Standards live in two places and MUST stay in sync — a standard that isn't enforced by a gate
is a suggestion:
- **The constitution** (the plugin's `CLAUDE.md`) — inherited by every agent at every tier.
- **The mechanical enforcement** — `templates/ci/gate-*.yml`, `templates/workspace/`
  (lint/tsconfig/scripts), and the gate skills (`gate-code`, `gate-security`,
  `gate-integration`, `gate-design`, `gate-architecture`, `gate-release`).

1. **view** (default) — summarize the current bar: standing rules (§2), Definition of Done
   (§4), gate checklist highlights, coverage floors, and anything the templates enforce that
   the constitution doesn't mention (or vice versa — flag drift).
2. **tighten/change** — for the named standard:
   - State the current rule and the proposed rule, and which products it affects (template
     changes apply to future stamps; existing products need the change ported).
   - Edit the constitution AND the matching enforcement point(s) together. Never one without
     the other.
   - If the change affects an existing product, list the files to port (its CI workflows,
     workspace config) and offer to apply them.
3. **Record it** — significant bar changes get an ADR in the affected product(s); a recurring
   mistake being promoted becomes an **Invariant** (§2.17).

This is one of the operator's highest-leverage actions: tightening a standard raises the bar
for every future unit of work across every product at once. Confirm the applied change back to
the operator.
