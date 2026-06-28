---
name: recover
description: >
  Circuit breaker for stuck work. Diagnoses WHICH failure mode you're in — targeted bug, polluted
  context, or a wrong earlier assumption — and applies the right fix instead of spiraling. Use when
  something is broken and one corrective attempt already failed, or a gate keeps failing.
---

# Skill: recover (failure-mode diagnosis)

When work is stuck, the instinct is to keep prompting fixes — which compounds the mess. Stop and
diagnose the *kind* of failure first, then apply the matching remedy.

## The circuit-breaker rule
If the same problem persists after **one** corrective attempt, STOP and run recover. Do not keep
trying variations — that's the spiral.

## Step 1 — classify the failure mode
- **A. Targeted bug.** Code is wrong in a specific, locatable way (a real error/stack trace, a
  failing test, wrong output). *Tell:* you can point at the broken behavior.
- **B. Polluted context.** The agent's working context has gone bad — contradictory instructions,
  stale assumptions accumulated mid-session, edits fighting each other. *Tell:* fixes make new
  problems; the agent "forgets" earlier decisions.
- **C. Wrong earlier assumption.** Something decided upstream (a contract, a schema, an
  architecture choice) was wrong, so downstream work can't succeed. *Tell:* the bug isn't where
  you're looking; the foundation is off.

## Step 2 — apply the matching remedy
- **A → fix it.** Reproduce from the **exact** error/log (never paraphrased), find root cause, fix,
  add a regression test. This is the normal inner loop.
- **B → reset context.** Re-`restore` from `docs/memory/session-state.md` + the context pack,
  discard the polluted thread, and re-approach the task with a clean, minimal context.
- **C → go up a tier.** Return to `architect` (or the operator): correct the contract/schema/
  decision and record a superseding ADR, then redo the dependent work. Don't patch around a bad
  foundation.

## The golden rule
Feed recover the **raw** terminal logs / error text, not a paraphrase — the exact message is what
pinpoints the root cause in one shot.

## Output
A diagnosis (which mode + evidence) and the corrective action taken or proposed. If mode C, an
escalation to `architect`/operator with the foundation fix. Record the lesson as a harvest/standard
candidate if it's systemic.
