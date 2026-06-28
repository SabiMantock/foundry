---
description: On-demand review of a built feature against its plan, by severity. Never auto-fixes.
argument-hint: [optional: a specific observation about what feels wrong]
---

Run an operator-requested review: **$ARGUMENTS**

Have `qa-lead`/`reviewer` check the latest work — independent of the full gate run — and report
issues by severity. Check that the implementation:
- matched its plan/spec and acceptance criteria;
- respects architecture boundaries + contracts (no deep imports, no off-tier calls);
- is production-ready (error handling, all states, security smells, tests).

Return findings as **critical / important / minor**. Do **not** auto-fix — the operator decides what
to act on. A plain `/review` is good; a `/review` with a specific observation ("the High Match filter
shows all jobs") is sharper — the more specific the input, the more targeted the diagnosis.
