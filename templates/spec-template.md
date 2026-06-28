# Spec — <product / feature name>

- **Status:** draft | approved (G0)
- **Author:** product-analyst
- **Date:** YYYY-MM-DD

## Problem
The user pain, in one paragraph. Why this is worth building now.

## Users
Who they are and their job-to-be-done.

## Scope
What this includes. Be concrete.

## Non-scope
What this deliberately does NOT include. As important as scope.

## Acceptance criteria
Numbered, testable, each verifiable by a test or a gate.
1.
2.

## Success metrics
How we'll know it worked in production.

## Constraints & assumptions
Tech constraints, deadlines, and any market/locale/tenant specifics to design the
generic core's seams for now (adapters built later).

## Invariants
Hard rules the agents must never violate while building this — the cheapest way to prevent
recurring mistakes. Promote any repeated bug into an invariant here. Examples:
- Always scope data queries to the current user/tenant.
- Never expose raw errors to users; never log secrets.
- <product-specific rules…>
