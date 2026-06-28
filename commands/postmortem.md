---
description: Turn an incident into a blameless postmortem plus Registry harvest candidates.
argument-hint: <incident description or link>
---

Run an incident postmortem for: **$ARGUMENTS**

Have `ops-analyst` produce a **blameless** writeup:
1. **Timeline** — what happened, when, detection → resolution.
2. **Impact** — users/SLOs affected, error-budget burn.
3. **Root cause** — technical + systemic (why our process let it through).
4. **Fix** — what was done; confirm rollback/forward-fix.
5. **Prevention** — systemic changes: a better module, a tighter standard, a new gate check.
   Convert these into **harvest candidates** or new commissions.

Prefer fixing the class over the instance — that's how operating a product makes the next one
cheaper. File prevention items so they actually happen; don't let them evaporate.
