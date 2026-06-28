# AI Workflow Rules — <product>

How agents behave while building THIS product. Product-specific build discipline that complements
the factory constitution. Written as rules, not suggestions.

## Approach
Build incrementally, spec-driven. The context pack + unit specs define what to build, how, and the
current state. Implement against the specs — do not infer or invent behavior from scratch.

## Scoping
- One unit at a time (see `docs/specs/00-build-plan.md`). One visible result, one system boundary.
- Prefer small, verifiable increments over large speculative changes.
- Don't combine unrelated boundaries (UI + schema + background work) in a single step.
- If a change can't be verified end-to-end quickly, it's too broad — split it.

## Handling missing / ambiguous requirements
- Don't invent product behavior not defined in the context files or unit spec.
- If a requirement is ambiguous, resolve it in the relevant context file (or escalate) BEFORE coding.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected files (do not modify without explicit instruction)
- `components/ui/*` — generated design-system / UI-library components.
- Generated clients, lockfiles, and third-party internals.
- `<add product-specific protected paths>`

## Keep docs in sync
Update the relevant context file whenever implementation changes architecture/boundaries, the storage
model, conventions, or scope. Update `progress-tracker.md` after every unit.

## Before moving to the next unit
1. The unit works end-to-end within its scope (Verify-when-done checklist passes).
2. No invariant (architecture/spec/context) was violated.
3. `progress-tracker.md` reflects the completed work.
4. `pnpm build` passes.

## Invariants
- Never exceed the scope of the current unit.
- Never modify a protected file without explicit instruction.
- Never leave `progress-tracker.md` stale after completing a unit.
