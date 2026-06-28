---
description: Show the live task graph, critical path, and which gate work is sitting at.
---

Report the current state of the active commission(s) like a factory floor dashboard:

1. **Task graph** — tasks grouped by stage (spec → design → plan → build → verify → release),
   with status (pending/in_progress/blocked/complete) and owner.
2. **Critical path** — the longest dependency chain to completion; name the current bottleneck.
3. **Gate status** — what is waiting at G0/G1/G2–G4/G5/G6, and specifically anything **awaiting
   operator action**.
4. **Escalations** — any open escalations and what they need.

Be concise; this is a glance, not a report. End with the single most useful next action for the
operator.
