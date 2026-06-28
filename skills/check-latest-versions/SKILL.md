---
name: check-latest-versions
description: >
  Web-verify the latest STABLE version of libraries/tools before pinning them, plus breaking
  changes, EOL, and security advisories. Use before scaffolding a stack, adding any dependency,
  or at gate G3. Keeps the factory current instead of frozen at training-cutoff versions.
---

# Skill: check-latest-versions (dependency freshness)

An agent's built-in knowledge of versions is stale by definition. Before pinning anything,
verify against the live web. This skill is mandatory whenever versions are chosen.

## When to run
- Choosing/recording a stack (`/stack`, `init-product-workspace`, architect at G1).
- Adding a new dependency in any build task (`module-builder`, `backend-worker`, etc.).
- Gate G3 (`security-worker`): confirm nothing pinned is EOL or has a known advisory.

## Procedure (per package)
1. **Find the latest stable.** Web-search the official source / registry (npm, PyPI, the
   project's releases page, or endoflife.date). Prefer authoritative sources.
2. **Reject non-stable.** Ignore alpha/beta/RC unless the operator explicitly opted in. A
   "latest" that is an RC (e.g. TypeScript 7.0 RC) is NOT the pin — use the latest GA.
3. **Check lifecycle.** Is the current pin EOL or near it (endoflife.date)? Prefer a supported
   major.
4. **Check breaking changes.** Skim the release notes between the old and new major for
   migration cost (e.g. ESLint 10 flat-config-only, pnpm 11 ESM/Node-22 requirement).
5. **Check compatibility.** Verify peer tools agree — especially linters/type-tooling vs. a new
   language major (typescript-eslint vs. a new TypeScript major is a classic lag).
6. **Check advisories.** Note any known CVEs for the version you're about to pin.

## Output
```yaml
verified_on: 2026-06-28
packages:
  - name: typescript
    latest_stable: 6.0.3
    pin: "^6.0"
    rc_or_beta_ignored: "7.0 RC (Go-native) — not GA"
    eol: false
    breaking_notes: "6.x is the last JS-based compiler"
    compat_flag: "confirm typescript-eslint supports TS 6 before relying on lint"
    advisories: none
```
Record this in the task output and (for a stack decision) in the tech-stack ADR.

## Guardrails
- **Stable only.** Latest ≠ newest tag; latest = newest *GA*.
- Don't silently bump a major mid-product; a major upgrade is an architect/operator decision.
- Cache the result in the task/ADR with the date so the whole commission uses one consistent,
  verified set rather than re-checking per file.
- If the web can't be reached, do NOT guess versions — flag it and ask the operator.
