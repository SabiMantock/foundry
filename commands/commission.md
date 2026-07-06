---
description: Start a new product or feature. Captures the brief and launches the orchestrator.
argument-hint: <one-line description of what to build>
---

The operator is commissioning new work: **$ARGUMENTS**

Act as the intake step (gate G0) of the Foundry.

1. Draft a **brief** from the request. It must contain: what, why, who it's for, acceptance
   criteria, constraints (incl. any market/locale/tenant specifics to design for), and a deadline if
   given. If any of these are missing or ambiguous, ask the operator now — do not assume.
2. Once the brief is complete, present it for **G0 approval**.
3. On approval, launch the `orchestrator` subagent with the brief. It sizes the commission
   (S/M/L, constitution §2.20) and spawns only the crew that size needs — small work gets one
   worker; the full `product-analyst` → `architect` (**G1** sign-off) → `build-lead` → workers →
   `qa-lead` (G2–G4) → `platform-lead` (G5) pipeline is for large commissions.
4. Report the task graph and where the operator's next decision point is.

Keep the operator at altitude: surface decisions at G0/G1/G5, delegate everything else.
