# Blueprint: Dashboard

**Use when** the primary interface is data visualization/monitoring over existing services —
metrics dashboards, admin overviews, ops consoles.

## Context (C4 level 1)
```mermaid
graph TD
  User[Viewer] -->|HTTPS| Web[Dashboard app]
  Web -->|reads contract| API1[Service A]
  Web -->|reads contract| API2[Service B]
  Web -->|auth| Auth[auth module]
```

## Containers (C4 level 2)
```mermaid
graph TD
  subgraph apps/web
    Screens[Screens: design-system components] --> ViewModels[View-models: shape data for display]
    ViewModels --> DataClients[Data clients: typed fetchers per contract]
  end
  DataClients --> API1[Service A contract]
  DataClients --> API2[Service B contract]
  Screens --> DesignSystem[design-system module + tokens]
```

## Layering & dependency rules
- `screens/` — composition + layout only, built from `design-system`; no data-fetching logic.
- `view-models/` — pure functions that shape raw contract responses into what a screen renders
  (aggregation, formatting, empty/loading/error mapping). No I/O.
- `data-clients/` — the only layer that calls out (via typed contract clients); no UI concerns.
- Every screen handles loading/empty/error/success explicitly (WCAG + `gate-design`).

## Module shape
Dashboards are thin by design: reuse `data-table`, `dashboard-kit`, `design-system` before
building any new chart/table primitive. A new visualization primitive is a harvest candidate,
not a one-off.

## Anti-patterns this blueprint forbids
- A screen component calling `fetch`/an SDK directly (bypasses `data-clients`, breaks
  testability).
- Business aggregation logic duplicated per-screen instead of living once in a view-model.
- Hard-coded thresholds/colors instead of design tokens.
