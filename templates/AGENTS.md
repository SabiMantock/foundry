# <product> — Agent Entry Point

The first file any coding agent reads in this product, every session. (Open-standard name:
`AGENTS.md`. Claude Code also reads `CLAUDE.md` — keep one as the source and symlink/copy the other.
The factory constitution is installed at `.claude/CLAUDE.md`; this file points to the PRODUCT context.)

## Read before implementing or making any decision
Read these in order before touching code:

1. `docs/specs/<active-unit>.md` — the unit spec you're implementing (if any)
2. `docs/context/project-overview` (the product spec) — product definition, goals, scope
3. `docs/decisions/` — ADRs: stack (0001), design system (0002), architecture choices + invariants
4. `docs/context/ui-rules.md` + `docs/context/ui-registry.md` — visual language + component patterns
5. `docs/context/library-docs.md` — per-library usage + the API order-of-authority
6. `docs/context/ai-workflow-rules.md` — scoping, protected files, verification discipline
7. `docs/context/progress-tracker.md` — current phase, done, in progress, next
8. `docs/memory/session-state.md` — if continuing a prior session (`/remember restore`)

## Standing instructions
- Update `docs/context/progress-tracker.md` after each meaningful change.
- If implementation changes architecture, scope, or standards, update the relevant context file (or
  record an ADR) before continuing.
- Honor every **Invariants** section — they are hard rules.
- Continuing a build? `/remember restore` first. Stuck after one fix? `/recover`. Built UI? `/imprint`.

> The factory constitution (`.claude/CLAUDE.md`) governs HOW the workforce operates; this file points
> agents at WHAT this specific product is. Read both.
