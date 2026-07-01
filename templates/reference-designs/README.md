# Reference Designs — the factory's blueprints

Index for `architect.md` step 1 ("pick the closest blueprint"). Each blueprint is a lightweight
**C4-style** doc (context + container diagram, per the [C4 model](https://c4model.com)) plus the
layering/dependency rules that make `eslint-plugin-boundaries` and `gate-architecture`
enforceable. Blueprints are a starting shape, not a cage — the architect adapts them and records
any deviation in the ADR.

| Blueprint | Use when |
| --- | --- |
| `crud-service.md` | The product is primarily create/read/update/delete over a data model (most backend/API work). |
| `dashboard.md` | The product's primary interface is data visualization/monitoring over existing services. |
| `mobile-field-app.md` | Primary interface is a mobile app used by field/offline workers. |
| `event-integration.md` | The work connects systems via events/webhooks rather than serving a UI. |

## Shared rules (all blueprints)
- **Dependency direction:** `apps/*` → `packages/*` (modules) only; modules never import an app;
  modules only depend on other modules through contracts (enforced by `eslint-plugin-boundaries`
  + `gate-architecture`).
- **Layering inside a module:** `domain/` (pure business logic, no I/O) → `application/`
  (use-cases, orchestrates domain + ports) → `infrastructure/` (adapters: DB, HTTP, queue).
  Domain never imports infrastructure; infrastructure implements ports domain/application
  define. `gate-architecture` checks this on every PR.
- **Every module has exactly one contract** (`contracts/<name>.vN.yaml`) and one registry entry
  (`registry/index/<name>.yaml`) — `gate-architecture` fails a PR that adds a module without both.

## Why this exists
`architect.md` used to say "pick the closest blueprint" with nothing to point at — every product
reinvented its own shape. These docs make the reference design real: a diagram + rules an
architect can hand to `build-lead`, and a shape `gate-architecture` can mechanically check.
