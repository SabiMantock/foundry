---
description: Open a gate for operator review/approval (G0, G1, G5) or report an automated gate.
argument-hint: <gate id, e.g. G1> [task or commission id]
---

Open gate **$ARGUMENTS** for review.

- **G0 (brief):** present the brief; confirm completeness; record approval.
- **G1 (architecture):** present the architecture artifact — reference design chosen, modules
  reused vs. built-new (with justification), net-new contracts, and the ADR. This is the
  operator's highest-leverage decision; surface trade-offs clearly. Record approval or send
  back with notes.
- **G5 (release):** present the release artifact — migration safety, tested rollback,
  changelog, smoke tests, feature-flag plan, data-residency. Require explicit sign-off for
  anything irreversible.
- **G2/G3/G4 (automated):** report the CI gate results (pass/fail + evidence). These don't
  need approval unless a security finding or repeated failure was escalated.

Record the decision and tell the orchestrator to proceed or hold.
