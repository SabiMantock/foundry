---
description: Circuit breaker — diagnose why work is stuck and fix the right thing in one pass.
argument-hint: [paste the raw terminal error / describe what's broken]
---

Run the **recover** skill on: **$ARGUMENTS**

Don't keep prompting fixes. Diagnose the failure mode first, then apply the matching remedy:
- **Targeted bug** → reproduce from the exact error, root-cause, fix, add a regression test.
- **Polluted context** → `/remember restore` + the context pack, discard the bad thread, re-approach
  with clean minimal context.
- **Wrong earlier assumption** → go up to `architect`/operator, fix the contract/schema/decision,
  record a superseding ADR, redo the dependent work.

Golden rule: paste the **raw** logs, not a paraphrase. If a fix is systemic, flag it as a harvest or
standards candidate so it can't recur.
