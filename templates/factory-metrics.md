# Factory Metrics — the scoreboard

Measures the **factory itself**, not any one product. The single sentence that says it's
working: **"feature N cost less than feature N-1, and I touched it less."**

Copy this into the factory's operating notes (or a product's `docs/context/` if you track it
per-product). `ops-analyst` keeps it current at each G6 watch and each `/postmortem`;
`orchestrator` records the per-commission rows at close-out. Reviewed by the operator when
tuning standards (`/standards`).

## Per-commission log (one row per shipped commission)

| Commission | Shipped | Reuse ratio¹ | Time-to-first-increment² | Gate first-pass %³ | Operator touches⁴ | Escalations | Harvest candidates |
| ---------- | ------- | ------------ | ------------------------ | ------------------ | ----------------- | ----------- | ------------------ |
|            |         |              |                          |                    |                   |             |                    |

¹ % of units satisfied by REUSE/COMPOSE (from `reuse-search` decisions in output envelopes)
² commission approved (G0) → first increment through G2–G4
³ gates passed first-time / total gate runs
⁴ operator interventions beyond G0/G1/G5 sign-offs + curation (should trend to zero)

## Trend lines (update per commission; direction matters more than the number)

- **Reuse ratio** — should RISE. Falling = the catalog isn't compounding; check harvest flow.
- **Marginal build cost** (time/tokens per shipped feature) — should FALL.
- **Catalog growth** — count of `stable`/`core` modules; harvest rate per product.
- **Quality:** defect escape rate to production, change-failure rate, MTTR, coverage trend.
- **Flow:** cycle time per stage, % time blocked, where the critical path bottleneck sits.
- **Human-touch ratio** — operator interventions per shipped feature; should FALL as the
  factory matures.
- **Cost:** infra + AI-token spend per product and per shipped feature.

## Reading the scoreboard

- Reuse ratio flat/falling → run `/harvest` review; check `registry/index/` for rot; ask
  `registry-librarian` for BUILD-NEW decisions that never got harvested.
- Gate first-pass % falling → a standard is unclear or a worker prompt is drifting; fix the
  factory (`/standards`), not the symptom.
- Operator touches rising → an agent, module, or skill is missing. Add it to the factory
  rather than absorbing the work — that's the whole thesis.
