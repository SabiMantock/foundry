# templates/context/ — the per-product context pack

A standardized set of living context files the factory seeds into every product so agents have
**complete knowledge of the system** and stop guessing. Guessing is the root cause of drift and
contradictions across sessions; a good context pack is the cure.

The pack (created under the product's `docs/context/` + `docs/memory/`):

| File                  | Purpose                                                                 | Kept current by |
| --------------------- | ----------------------------------------------------------------------- | --------------- |
| `project-overview`*   | What the product is, users, scope/non-scope, success criteria           | product-analyst (spec) |
| `architecture`*       | Stack, folders, boundaries, data flow, schema, invariants               | architect (ADRs) |
| `code-standards`      | Conventions all code follows (extends the factory `CLAUDE.md`)          | operator |
| `library-docs.md`     | Per-library usage patterns + the **order of authority** for APIs        | build agents |
| `ui-rules.md`         | Concrete UI patterns/constraints (layout, type, color discipline)       | design-lead |
| `ui-registry.md`      | Living component registry — read before building UI, imprint after      | frontend-worker (`/imprint`) |
| `ai-workflow-rules.md`| Build discipline: scoping, missing-reqs, **protected files**, verify    | operator / build agents |
| `progress-tracker.md` | Living status: phase, done, in-progress, next                           | `/remember` |
| `memory/session-state.md` | Cross-session memory briefing                                       | `/remember save` |

A product `AGENTS.md` at the repo root (from `templates/AGENTS.md`) is the **entry point** that lists
the read-order above. Per-build, `build-lead` produces a **build plan** (`docs/specs/00-build-plan.md`)
and a **unit spec** per unit (`templates/unit-spec-template.md`) with a Verify-when-done checklist.

\* `project-overview` and `architecture` are produced as the product's **spec**
(`templates/spec-template.md`) and **ADRs** (`templates/adr-template.md`) — the factory already
owns those, so the context pack references them rather than duplicating.

## The two rules this pack encodes
1. **Read context first, never assume.** Agents read the relevant context file before building; the
   spec/architecture/standards are the source of truth.
2. **Order of authority for library APIs:** live MCP docs → installed skills (`check-latest-versions`)
   → these product context docs → general training knowledge (last resort, often stale).

## Invariants
Every context doc and spec ends with an **Invariants** section: hard rules the agent must never
violate. Invariants are the cheapest, highest-leverage way to prevent recurring mistakes — promote a
repeated bug into an invariant and it stops happening.
