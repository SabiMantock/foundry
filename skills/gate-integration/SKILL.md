---
name: gate-integration
description: >
  The gate G4 checklist — integration & contracts. Run by qa-lead before merge to main:
  contract tests (every consumer↔provider pair still agrees), e2e on critical paths, and
  the performance budget. Use when verifying an integrated increment is merge-ready.
---

# Skill: gate-integration (G4)

The last automated gate before main. Proves the *assembled* increment works — modules agree
with their contracts, flows work end-to-end, payloads stay within budget. Mirrors
`.github/workflows/gate-integration.yml`.

## Automated (must all pass)
- `pnpm build` — all packages build from a clean install.
- `pnpm test:contract` — **every consumer↔provider pair still agrees.** A provider may not
  merge a change that breaks a consumer's contract test; that's a major-version conversation
  with the `architect`, not a green gate.
- `pnpm gate:integration` — integration + e2e suites green. Critical paths (auth, money,
  anything the spec's Invariants name) must have explicit e2e coverage, not just unit tests.
- **Performance budget** — bundle/payload sizes within the product's budgets (size-limit /
  lighthouse-ci once apps exist). Low-bandwidth targets are a factory default, not an option.

## Judgment (qa-lead pass)
- New/changed contracts have a contract test on BOTH sides (provider honors it, consumers
  consume it) — a one-sided contract test is decoration.
- E2e tests exercise the acceptance criteria of the units in this increment, unhappy paths
  included.
- No test was quarantined/skipped to get to green (retry-to-green is forbidden, §2.6).
- Migrations (if any) ran forward cleanly against a realistic dataset — rollback is G5's
  problem, but forward safety is proven here.

## Ruling
- Any red → G4 FAIL; bounce to the owning worker with the failing pair/flow named precisely.
- A contract-test failure caused by an intentional breaking change → escalate to `architect`
  (major bump + consumer migration plan); never "fix" it by loosening the test.
- Second failure on the same task → escalate to `orchestrator` (design smell).
- All green → `handoff_to: platform-lead` for G5. Evidence = command + exit status +
  summary/failing lines (§2.18) — a claim without output does not satisfy the gate. When CI
  ran this gate, adjudicate from the CI results instead of re-running the suite in-session.
