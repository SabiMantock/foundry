# Unit NN: <feature/unit name>

A **unit** is a single, scoped, verifiable piece of work — small enough to build in one focused
pass, concrete enough that "done" is unambiguous. `build-lead` writes one of these per node in the
task graph; a worker implements it exactly, no more. Lives in `docs/specs/NN-<name>.md`.

> Rule: a unit produces ONE visible/verifiable result and stays within ONE system boundary
> (don't mix UI + schema + background work in one unit).

## Goal
One or two sentences. The concrete output when this unit is complete. Specific, not vague.
- Bad: "Create the auth pages."
- Good: "Sign-in + sign-up pages using <lib> components, two-panel on desktop, form-only on mobile;
  route protection via <x>, not middleware."

## Design
Visual/structural decisions specific to this unit. Reference the design system + `ui-rules.md` /
`ui-registry.md` tokens — no visual guesses. Layout, component choices, responsiveness, states.

## Implementation
Broken into sub-sections, one per component or boundary. Enough detail that there's no ambiguity.

### <component / sub-section>
What to build and how.

## Dependencies
- `<package>` — reason. (Install just-in-time, in the unit that first needs it. Web-verify the
  version via `check-latest-versions`.)
- Upstream units/contracts that must already exist.

## Verify when done
- [ ] Meets the Goal + acceptance criteria
- [ ] No type errors (`pnpm typecheck`)
- [ ] Lint/format clean (`pnpm lint`, `pnpm format:check`)
- [ ] Tests written and green (`pnpm test`); contract test if a module (`pnpm test:contract`)
- [ ] No console/runtime errors; all states handled (loading/empty/error/success)
- [ ] UI built from the design system; `gate-design` passes (if UI); component imprinted
- [ ] No invariant (spec/architecture/context) violated
- [ ] `progress-tracker.md` updated; output envelope written
- [ ] Build passes (`pnpm build`)
