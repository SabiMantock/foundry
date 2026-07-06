# <product> — Agent Entry Point

The first file any coding agent reads in this product, every session. (Open-standard name:
`AGENTS.md`. Claude Code also reads `CLAUDE.md` — keep one as the source and symlink/copy the other.
The factory constitution is installed at `.claude/CLAUDE.md`; this file points to the PRODUCT context.)

## Read what your task touches — not the whole pack (constitution §2.3, §2.20)
**Everyone, always:**

1. `docs/specs/<active-unit>.md` — the unit spec you're implementing (if any)
2. `docs/context/ai-workflow-rules.md` — scoping, protected files, verification discipline
3. The **Invariants** sections of the spec/ADRs your task falls under

**Then only what applies to YOUR task:**

- Building UI → `docs/context/ui-rules.md` + `docs/context/ui-registry.md`
- Touching a library's API or adding a dependency → `docs/context/library-docs.md` + stack ADR (0001)
- Making/receiving a design decision → the relevant ADRs in `docs/decisions/`
- UI styling questions → design ADR (0002) + tokens

**Session boundaries only (not per task):**

- Start of a continuing session → `docs/memory/session-state.md` (`/remember restore`) +
  `docs/context/progress-tracker.md`
- Guild leads & orchestrator planning a commission → `docs/context/project-overview` (the
  product spec) and the full pack as needed — workers get their slice from the task assignment

## Standing instructions
- Update `docs/context/progress-tracker.md` after each meaningful change.
- If implementation changes architecture, scope, or standards, update the relevant context file (or
  record an ADR) before continuing.
- Honor every **Invariants** section — they are hard rules.
- Continuing a build? `/remember restore` first. Stuck after one fix? `/recover`. Built UI? `/imprint`.

> The factory constitution (`.claude/CLAUDE.md`) governs HOW the workforce operates; this file points
> agents at WHAT this specific product is. Read both.
