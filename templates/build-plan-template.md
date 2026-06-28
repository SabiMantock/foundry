# Build Plan — <product / feature>

The ordered list of **units** for this build, produced by `build-lead` after G1 and reviewed by the
operator. It proves the system was designed before the first line was written, and it drives the
task graph. Lives in `docs/specs/00-build-plan.md`.

## Ordering heuristics (apply in this order)
1. **Dependencies first.** If B needs A, A comes first. Never build on something that doesn't exist.
2. **Security before functionality.** Auth/access control before the features they protect.
3. **Backend before frontend wiring.** Build the API/contract, then wire the UI to it (separate units).
4. **UI shells before real data.** Build the component structure with mock data, verify it, then
   connect real data.
5. **Install dependencies just-in-time.** Add a package only in the unit that first needs it.
6. **Merge / split.** Merge units always done together with no standalone result; split any unit
   trying to cross more than one system boundary.

## Validate the order
For each unit, confirm everything it depends on exists in an earlier unit. If not, reorder. If two
adjacent units are always done together with nothing verifiable between them, merge.

## Units

| # | Unit name | Builds (one visible result) | System boundary | Depends on | Spec |
| - | --------- | --------------------------- | --------------- | ---------- | ---- |
| 01 | … | … | ui \| api \| data \| agent | — | `docs/specs/01-….md` |
| 02 | … | … | … | 01 | `docs/specs/02-….md` |

Each unit gets its own spec from `templates/unit-spec-template.md`, with a Verify-when-done checklist.
