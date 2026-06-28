---
name: gate-security
description: >
  The gate G3 checklist — security. Run by security-worker/qa-lead on every change. Use when
  verifying a change is safe to advance toward release.
---

# Skill: gate-security (G3)

Mirrors `.github/workflows/gate-security.yml`. Findings above threshold BLOCK and escalate.

## Automated
- **SCA:** `pnpm audit --audit-level high` — no high/critical advisories.
- **Secrets:** scan the diff (gitleaks); zero committed secrets.
- **SAST:** CodeQL/static review — injection, XSS, SSRF, insecure deserialization, broken
  access control.

## Judgment
- **AuthZ:** every new endpoint declares + enforces a permission via the `auth` module; no
  bespoke auth; least-privilege data access.
- **Data protection:** PII tagged + access-logged; encryption in transit & at rest; retention
  consistent with whatever data-protection regulation applies.
- **Input/output:** validation at every trust boundary; output encoding.

## Ruling
- High/critical finding → G3 FAIL, **escalate to the operator** (constitution: gates are law).
- Prefer fixing the class (shared validator/standard) over the instance; flag as harvest
  candidate.
- All clear → advance to G4 (integration).

## Lifecycle & freshness (added)
- Run `check-latest-versions`: no **EOL** or known-vulnerable dependency may ship; no RC/beta
  pin unless the operator opted in. Prefer a supported major. EOL/known-vuln = high finding → block.
