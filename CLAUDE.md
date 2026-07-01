# The Foundry — Factory Constitution

This file is inherited by **every agent at every tier**. It is the standing set of
rules that makes parallel, multi-agent software production safe and high-quality.
If a rule here conflicts with a local instruction, this file wins unless the
operator explicitly overrides it.

> The Foundry is **product-agnostic**. It builds whatever product the operator
> commissions; it contains no product of its own. Reference designs the factory
> stamps into a product live in `templates/`.

---

## 1. What we are
An AI-agent software production ecosystem modeled on China's manufacturing clusters:
specialized agents (guilds) assemble products from a catalog of reusable modules,
using reference designs, passing quality gates, coordinated just-in-time. The factory
is the asset; products are what it produces.

## 2. The standing rules (obey always)
1. **Reuse before build.** Start every build task by querying the Module Registry
   (`/reuse` or the `reuse-search` skill). Justify any net-new code in your output.
2. **Contracts, not internals.** Depend on a module's published contract
   (`contracts/*.yaml` ↔ its package entry). Never import another module's `src/`.
3. **Small context.** Load only the files and contracts your task needs. Do not pull
   the whole product into context.
4. **Escalate, don't guess.** Ambiguity or conflict flows UP the tier pyramid
   (worker → guild lead → orchestrator → operator). Never silently assume.
5. **Definition of Done is non-negotiable.** See §4.
6. **Gates are law.** Nothing advances past a gate it hasn't passed. Don't retry-to-green.
7. **Write the output envelope.** Every task ends with `task-output` (§5) so the next
   agent can pull cleanly.
8. **Harvest as you go.** Flag net-new patterns worth promoting into the Registry.
9. **Abstract first, localize last.** Keep cores generic; push any market, locale, or
   tenant specifics to adapter modules at the edges — never bake them into a core module.
10. **Stay at your tier.** Workers implement; leads plan and integrate; the
    orchestrator decomposes; the operator approves. Don't reach across tiers.
11. **Stack is the operator's choice.** Never assume a stack. Read the product's tech-stack
    ADR (`docs/decisions/0001-tech-stack.md`) and build within it. If none exists, escalate
    to the operator (`/stack`) — don't pick one yourself.
12. **Pin to web-verified latest stable.** Your knowledge of versions is stale by default.
    Before pinning any library/tool, run the `check-latest-versions` skill: use the latest
    *stable* (GA) release, never RC/beta unless the operator opts in, and avoid EOL versions.
13. **Design is the operator's choice; build from the system.** The product's design system is
    chosen via `/design` and recorded in `docs/decisions/0002-design-system.md`. All UI is
    assembled from the `design-system` module + its tokens — never ad-hoc styles or hard-coded
    values. **WCAG 2.1 AA accessibility is mandatory**, enforced by `gate-design` alongside G2.
14. **Read context first; never assume.** Before building, read the product's context pack
    (`docs/context/*`) + relevant spec/ADR. For library APIs, follow the **order of authority**:
    live MCP docs → installed skills (`check-latest-versions`) → product context docs → training
    knowledge (last resort, may be stale). Net-new UI: read `ui-registry.md` and match before inventing.
15. **Persist context across sessions.** End a working session with `/remember save`; begin a
    continuing session with `/remember restore`. Keep `docs/context/progress-tracker.md` current and
    `/imprint` every new component into `ui-registry.md` — done is not done until these are updated.
16. **Circuit breaker.** If the same problem persists after ONE corrective attempt, stop and
    `/recover` — diagnose the failure mode (targeted bug / polluted context / wrong earlier
    assumption) before trying more fixes. Don't spiral.
17. **Invariants are law.** Honor the Invariants sections in the spec and context docs — they are
    hard rules, not suggestions. Promote any recurring mistake into a new invariant.
18. **Evidence over assertion.** Never report a check as passing unless you just ran it in this
    session. `checks: pass` in the output envelope must be backed by the actual command output,
    pasted into `evidence` — a self-report with no output is a claim, not proof. Reviewers and
    gate owners re-run key checks independently rather than trusting the diff or the claim.
    This is how the factory keeps shipping fast without shipping code that breaks.
19. **The reference design is real, not aspirational.** Pick a blueprint from
    `templates/reference-designs/` at G1 and build to its layering; `gate-architecture` checks
    this mechanically on every PR (a fitness function, not a periodic audit). Deviations are
    allowed but must be recorded in the ADR — undocumented drift fails the gate.

## 3. Tiers (who does what)
- **T0 Operator (human):** commissions, standards, gate sign-off (G0/G1/G5), Registry curation.
- **T1 `orchestrator`:** decomposes a commission into a task graph; assigns; integrates.
- **T2 Guild leads:** `product-analyst`, `architect`, `design-lead`, `build-lead`, `qa-lead`,
  `platform-lead`, `ops-analyst` — own a domain, plan it, delegate granular work.
- **T3 Workers:** `module-builder`, `backend-worker`, `frontend-worker`, `mobile-worker`,
  `data-worker`, `test-worker`, `reviewer`, `security-worker`, `docs-worker`, `harvester`.
- **Cross-cutting:** `registry-librarian` guards the catalog and runs reuse search.

## 4. Definition of Done
A unit of work is done ONLY when all hold:
- meets its acceptance criteria;
- compiles & type-checks (`pnpm typecheck`);
- lint/format clean, zero warnings (`pnpm lint`, `pnpm format:check`);
- tests written and green, coverage floor met (`pnpm test`);
- contract honored + contract test green if it's a module (`pnpm test:contract`);
- security checks pass (no high/critical findings);
- docs/README updated;
- observability hooks present (structured logs on state changes);
- dependencies pinned to web-verified latest **stable** (no RC/beta/EOL) per §2.12;
- for UI work: built from the `design-system` + tokens, and `gate-design` (WCAG 2.1 AA +
  token adherence) passes;
- **every claimed-passing check has pasted evidence** (real command output), not just a status
  word (§2.18); a claim without output does not satisfy the gate;
- built to its reference-design blueprint's layering, or a recorded ADR deviation
  (§2.19); `gate-architecture` is clean;
- the output envelope (§5) is written.

## 5. The output envelope (write at task completion)
```yaml
task_id: <id>
agent: <agent-name>
status: complete | blocked | escalated
produced:
  - path: <path>
    kind: module | endpoint | screen | test | doc | contract | adr
    contract: <contracts/...yaml if applicable>
checks: { tests: pass|fail, lint: pass|fail, types: pass|fail, contract: pass|fail|n/a }
evidence: <pasted, just-run command output proving each claimed check actually ran — required,
  not optional (§2.18)>
handoff_to: <next-agent>
notes: <what you reused, what was net-new, harvest candidates>
escalation: null | { reason, question, blocking: true|false }
```

## 6. The gates (where work is checked)
G0 brief (operator) · G1 architecture (operator) · G2 code (CI) · G3 security (CI) ·
G4 integration/contract (CI) · G5 release (operator) · G6 post-release (ops).
Skills `gate-code`, `gate-security`, `gate-release` encode the checklists; the CI
workflow templates live in `templates/ci/`. For UI work, `gate-design` (WCAG 2.1 AA +
design-system/token adherence) runs alongside G2. `gate-architecture` — a continuous fitness
function checking contract/registry drift, layering, and dependency cycles against the chosen
`templates/reference-designs/` blueprint — also runs alongside G2, on every PR, not as a
periodic audit.

## 7. Tech stack (operator-chosen, per product)
There is **no mandated stack**. The operator selects one per product via `/stack`, recorded as
`docs/decisions/0001-tech-stack.md`; every agent reads it and builds within it. Profiles are in
`templates/stack-profiles.md` (default recommendation: TypeScript-everywhere, but that is a
suggestion, not a rule). Whatever the stack, agents pin **web-verified latest stable** versions
via `check-latest-versions` (§2.12); the last verification is in `templates/stack-baseline.md`.
The factory's machinery (agents, gates, contracts, reuse, harvest) is stack-agnostic — only the
implementation tooling changes.

## 8. Operator commands
Setup: `/new-product` `/stack` `/design`. Build: `/commission` `/status` `/gate` `/reuse`
`/review`. Continuity: `/remember` (save·restore) `/imprint` `/recover`. Improve: `/harvest`
`/postmortem`. These are your control surface; the workforce does the rest.

## 9. The product context pack
Every product carries a living context pack so agents have complete system knowledge (seeded from
`templates/context/`): `docs/context/` (library-docs, ui-rules, ui-registry, ai-workflow-rules,
progress-tracker) + `docs/memory/session-state.md`, alongside the spec and ADRs. A product
`AGENTS.md` at the root is the entry point that lists the read-order. Agents read it at task start
and keep it current as part of done. Full map: `templates/context/README.md`.

## 10. Spec-driven build
After G1, `build-lead` produces a **build plan** (`docs/specs/00-build-plan.md`) — units ordered by
the heuristics (dependencies first, security before functionality, backend before frontend wiring,
UI shells before real data, deps just-in-time). Each unit gets a **unit spec**
(`templates/unit-spec-template.md`) with a **Verify-when-done** checklist. A worker implements exactly
one unit — one visible result, one system boundary — and a unit isn't done until its checklist passes
and `progress-tracker.md` is updated. Respect `ai-workflow-rules.md`, including its **Protected
Files**.
