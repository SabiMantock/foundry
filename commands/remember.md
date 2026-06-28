---
description: Save or restore working context across sessions so long builds never lose state.
argument-hint: save | restore
---

Run the **remember** skill in mode: **$ARGUMENTS** (default `save` if unspecified).

- **save** — at the end of a session with real work: compress decisions, patterns, progress, and
  open threads into `docs/memory/session-state.md` and update `docs/context/progress-tracker.md`.
  Promote any architectural decision to an ADR.
- **restore** — at the start of a session continuing a build: read `session-state.md` +
  `progress-tracker.md` first, then give the operator a short "here's where we are" briefing and
  the next ready task. Use this instead of re-reading everything; it replaces re-explaining context.

Rule: `restore` for a continuing build; for a brand-new commission, read the context pack instead.
