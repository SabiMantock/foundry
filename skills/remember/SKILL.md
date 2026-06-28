---
name: remember
description: >
  Persist and restore working context across sessions. `save` compresses the current session
  (decisions, patterns, progress) into a memory file; `restore` loads it so a new session picks
  up exactly where the last left off. Use at the end of any session with real work, and at the
  start of any session continuing a build.
---

# Skill: remember (cross-session memory)

Agents lose everything between sessions; long product builds drift and contradict themselves.
This skill makes a commission survive across sessions. Two modes.

## `save` — at the end of a working session
Write/refresh `docs/memory/session-state.md` in the product, containing:
- **Status:** current phase, last completed unit, what's next.
- **Decisions made this session** (with the why) — append to the product's ADRs if architectural.
- **Patterns established** — conventions/modules introduced that later work must match.
- **Open threads / gotchas** — anything unfinished, any workaround, anything that differs from
  the context docs.
- **Pointers** — the task graph state and the files touched.
Also update `docs/context/progress-tracker.md` (the living checklist).

## `restore` — at the start of a continuing session
Read `docs/memory/session-state.md` + `progress-tracker.md` first, before anything else.
Reconstruct: where we are, what's decided, what conventions to honor, what's next. This replaces
re-reading everything from scratch and re-asking the operator what was decided.

## Rules
- **Compress, don't dump.** Memory is a briefing, not a transcript — capture decisions and state,
  not blow-by-blow.
- Memory never contradicts the durable context docs (specs/ADRs/standards); if it would, the
  decision belongs in an ADR, not just memory.
- `restore` at the start of a continuing session is the default; a brand-new commission reads the
  context pack instead.
- Keep one canonical `session-state.md`; overwrite it on `save` (history lives in git + ADRs).

## Output
`save`: updated `docs/memory/session-state.md` + `progress-tracker.md`.
`restore`: a short "here's where we are" briefing + the next ready task.
