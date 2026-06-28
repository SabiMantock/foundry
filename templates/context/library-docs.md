# Library Docs — <product>

Project-specific usage patterns for every third-party library in this product. Covers HOW we use
each library here — the rules and constraints that override general knowledge. Read the relevant
section before implementing anything that touches a library.

## Order of authority for library APIs
Library APIs change often and training data goes stale. Resolve API questions in this order:

```
1. Live MCP docs server for that library (if configured) — real-time, authoritative
2. Installed skills — incl. check-latest-versions for the current stable version + breaking changes
3. This file — product-specific patterns that override general usage
4. General training knowledge — LAST resort, assume it may be outdated
```

Never rely on training knowledge alone for a library API. Verify first.

## <library name>
- **Version:** pinned (web-verified stable; see the tech-stack ADR).
- **Check first:** MCP server? installed skill? then this section.
- **How we use it here:** <the canonical pattern / client setup / do's and don'ts for THIS product>.
- **Gotchas:** <anything that differs from the docs or bit us before>.

_(Repeat one section per approved dependency. Add a library here before installing it.)_

## Invariants
- No library is installed without being added to this file first, with a reason.
- Every library section names what to check before coding (MCP / skill / this doc).
- Versions match the tech-stack ADR; bumps are deliberate, web-verified, and recorded.
