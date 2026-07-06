# 04 — Reusable Modules & the Registry

The catalog that lets the factory *assemble* instead of *hand-build*. This is the Foundry's
Huaqiangbei: a curated market of proven, versioned components with fixed interfaces. It is the
single most important compounding asset in the ecosystem — guard it accordingly.

---

## 1. What a "module" is

A module is a self-contained unit of capability with a **public contract** and a **hidden
implementation**. Consumers wire to the contract; they never reach inside. A module ships with:

- a **contract** (its API surface — functions/types, or events, or schema, or UI props);
- an **implementation** that satisfies the contract;
- **tests** (unit + contract tests proving it meets its spec);
- **docs** (what it does, how to use it, examples, limits);
- **metadata** (version, maturity tier, owner, dependencies).

If any of those five is missing, it isn't a module — it's just code, and it doesn't belong in
the Registry.

---

## 2. Module categories (the aisles of the market)

Like a component market organized by part type, the Registry is organized by layer so agents
can find things fast.

### Foundation modules (used by nearly every product)
- `auth` — identity, sessions, RBAC, API keys.
- `audit-log` — tamper-evident activity trail.
- `notifications` — channel-agnostic send (email/SMS/push/webhook) with provider adapters.
- `money` — currency-safe amounts, rounding, multi-currency (GHS/GBP-ready).
- `config` — typed feature flags + environment config.
- `i18n` — translation + locale formatting (dates, numbers, addresses).
- `observability` — structured logging, metrics, tracing helpers.

### Data & integration modules
- `entity-store` — CRUD + query + soft-delete + audit over an entity.
- `offline-sync` — offline-first cache with conflict resolution and replay.
- `event-bus` — publish/subscribe with at-least-once delivery.
- `webhook-intake` — verified inbound webhook → queue → processor.
- `file-store` — upload/download with signed URLs and lifecycle rules.
- `import-export` — CSV/Excel/JSON ingest and emit with validation.

### Domain modules (logistics-flavored, harvested from Relay first)
- `geo` — geocoding, distance, geofencing, map-tile adapters.
- `routing` — route optimization and ETA estimation.
- `pricing` — rate cards, zones, surcharges, quotes.
- `tracking` — shipment state machine + public tracking links.
- `proof-of-delivery` — photo/signature/recipient capture (offline-capable).
- `dispatch` — job assignment to couriers (manual + auto).

### Experience modules (frontend / mobile)
- `design-system` — tokens, primitives, accessible components.
- `data-table` — sortable/filterable/paginated list with bulk actions.
- `dashboard-kit` — KPI cards, charts, real-time updates.
- `form-kit` — schema-driven forms with validation.
- `mobile-shell` — offline-first app skeleton with sync + auth wired in.

### Payment & locale-adapter modules (edge, market-specific)
- `payments` — provider-agnostic charge/refund/payout interface…
  - …with adapters: `payments-stripe` (UK/cards), `payments-momo` (Ghana mobile money), etc.
- `messaging-adapters` — `sms-twilio`, `sms-local-gh`, `ussd`, `whatsapp`.
- `address` — pluggable address model + validators per market (UK postcodes, GH GhanaPostGPS).

The adapter pattern is how the factory honors *"abstract first, localize last"* — the core
`payments` contract is generic; Ghana and UK are swappable adapters behind it.

---

## 3. Interface contracts (the standardized packaging)

Contracts are the whole reason reuse is safe. A contract is a versioned, machine-checkable
declaration of a module's public surface. Three contract styles cover everything:

**API contract** (for service/library modules):

```yaml
# contracts/pricing.v1.yaml
module: pricing
version: 1.2.0
provides:
  - quote(shipment, rate_card) -> Quote     # Quote = {amount: Money, breakdown: Line[]}
  - list_zones(country) -> Zone[]
depends_on:
  - money ^2
  - geo ^1
events_emitted: []
stability: stable
```

**Event contract** (for event-driven modules): the event names, payload schemas, and delivery
guarantees a module publishes/consumes.

**Component contract** (for UI modules): the props, slots, events, and accessibility guarantees
a component exposes.

Rules:
- Consumers depend on a **major version range** (`^1`), never on internals.
- A breaking change = **major bump**, and is a reviewed, deliberate act (operator-curated).
- Contracts are validated in CI; a module whose code drifts from its contract fails the gate.
- **Contract tests** (run by `qa-lead` at G4) assert every consumer ↔ provider pair still
  agrees — this is what lets modules evolve without silent breakage.

---

## 4. Versioning & maturity tiers

Two independent axes govern a module: **how it has changed** (semver) and **how much you trust
it** (maturity).

Semantic versioning — `MAJOR.MINOR.PATCH`:
- MAJOR — breaking contract change.
- MINOR — backward-compatible capability added.
- PATCH — backward-compatible fix.

Maturity tiers — promoted only by the operator (`/harvest`, then curation):

| Tier           | Meaning                                              | Can a product depend on it?         |
| -------------- | ---------------------------------------------------- | ----------------------------------- |
| `experimental` | New, unproven, may change or vanish                  | Spikes only                         |
| `beta`         | Works, used in ≥1 product, contract may still shift  | Yes, with awareness                 |
| `stable`       | Proven in production, contract frozen within major   | Yes — the default to reach for      |
| `core`         | Critical, hardened, owned, SLA'd                     | Yes — foundation everything builds on|

The `registry-librarian` enforces these; the operator decides promotions. Demotion/retirement
is equally deliberate — a `deprecated` flag with a migration note precedes removal.

---

## 5. The reuse-first workflow (how a build task starts)

This is the single behavior that makes the factory economical, encoded as the `reuse-search`
skill and run at the start of every build task:

```
1. Parse the need from the task/contract.
2. registry-librarian searches the catalog by capability + tags.
3. Classify the best match:
     • ≥80% fit, stable/core   → REUSE: configure + extend behind the contract.
     • partial fit             → COMPOSE: combine 2–3 modules into the reference design.
     • <40% fit                → BUILD NEW: justify in the output envelope, design a
                                  contract, and flag as a harvest candidate.
4. Record the decision in the task output (so the outer feedback loop can learn).
```

Net-new code is never forbidden — it's just *accounted for*. Every build-new decision is a
signal about a gap in the catalog.

---

## 6. The Registry catalog (discovery)

Agents and the operator need to *find* modules, or reuse won't happen. The catalog is a
searchable index — one entry per module:

```yaml
# registry/index/pricing.yaml
name: pricing
summary: Rate cards, zones, surcharges, and quoting for shipments.
category: domain/logistics
tier: stable
version: 1.2.0
contract: contracts/pricing.v1.yaml
tags: [quote, rate-card, zone, surcharge, logistics]
used_by: [relay]
owner: architecture-guild
docs: packages/pricing/README.md
```

Surfaced to the operator via `/reuse <need>` and to agents via the `reuse-search` skill. A
module that isn't in the index effectively doesn't exist to the factory.

---

## 7. Harvesting (how the catalog grows)

Modules are born two ways: designed up front (foundation modules) or **harvested** from product
code that proved itself. Harvesting is the outer feedback loop made concrete:

1. During build or operate, an agent flags a net-new pattern as a *harvest candidate*.
2. `/harvest <x>` spawns the `harvester`: it extracts the pattern, generalizes it, defines a
   contract, adds tests + docs, and proposes a catalog entry at `experimental`.
3. The operator reviews and admits it (or not).
4. As it proves out across products, the operator promotes it up the tiers.

Discipline to keep: **harvest the pattern, not the first instance's quirks.** The Ghana-specific
batching that prompted a module should become a *configurable* module, not a Ghana-only one —
otherwise the catalog accumulates liabilities instead of assets.

---

## 8. Anti-patterns to guard against

The Registry is valuable only if it stays trustworthy. Watch for:

- **Catalog rot** — modules with stale docs or drifting contracts. *Fix:* contract tests in CI;
  the librarian audits quarterly.
- **Premature abstraction** — promoting something used once. *Fix:* require ≥2 real consumers
  before `stable`.
- **God modules** — a module that grows to do everything. *Fix:* one capability per module;
  split when the contract bloats.
- **Hidden coupling** — consumers depending on internals "just this once". *Fix:* enforce
  contract-only imports via lint/boundary rules in CI.
- **Localization leakage** — market-specifics baked into core modules. *Fix:* the adapter
  pattern; market logic lives only in adapter modules at the edge.
