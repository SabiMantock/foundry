# 05 — Relay: The Logistics Operations Platform

The Foundry's first product line. **Relay** is an AI-powered logistics operations system for
**independent courier companies** — the small and mid-size operators who run local and
last-mile delivery but can't afford the platforms the big carriers build in-house.

Per the chosen approach: **build a strong generic core first; treat Ghana and UK specifics as a
documented localization phase**, plugged in at the edges via adapter modules (never baked into
the core).

---

## 1. The problem & the user

Independent couriers run on spreadsheets, WhatsApp, and phone calls. They lose money to
inefficient routing, miss deliveries with no proof, can't tell customers where parcels are, and
can't see their own operations clearly. They are too small for SAP/Oracle-grade TMS and too
operationally complex for a generic delivery app.

**Primary users:**
- *Operations manager / dispatcher* — assigns jobs, monitors the day, handles exceptions.
- *Courier / driver* — receives jobs, navigates, captures proof of delivery, often offline.
- *Owner* — wants visibility, margins, and growth.
- *Customer / shipper* — wants to book, pay, and track.

**The AI angle** (what makes it more than another TMS): agents and models embedded in the
product itself — smart dispatch and route optimization, ETA prediction, exception detection
("this parcel is stuck"), demand forecasting, and a natural-language ops copilot the dispatcher
can ask "what's late and why?". The same agent ecosystem that *builds* Relay also informs how
AI is *used inside* it.

---

## 2. Recommended technology stack (and why)

The brief asked me to choose. Recommendation, optimized for the Foundry's reuse goals **and**
the Ghana+UK operating reality (variable connectivity, mobile-first couriers, cost-sensitivity,
two currencies, two regulatory regimes).

| Layer            | Choice                                              | Why (esp. for Ghana + UK)                                                                 |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Language**     | **TypeScript** everywhere                           | One language across web/API/mobile → maximum module reuse in the factory; large talent pool|
| **Web (ops/admin)** | **Next.js + React**                              | Mature, SSR for fast first loads on slow networks, great ecosystem                        |
| **Mobile (courier)** | **React Native (Expo)**                         | One codebase iOS+Android; Android dominates Ghana; OTA updates; reuses TS modules         |
| **Customer tracking** | Lightweight server-rendered pages + **PWA**    | No app install needed; works on low-end phones; cheap to deliver over CDN                 |
| **API**          | **Node + tRPC/REST**, contract-typed                | Shared types with frontend; fits the contract-driven module model                         |
| **Database**     | **PostgreSQL + PostGIS**                             | Strong consistency for logistics state; PostGIS for geo/routing; managed = low ops        |
| **Cache/queue**  | **Redis**                                           | Job queues for dispatch/sync, caching tracking reads                                      |
| **Realtime**     | WebSockets / SSE                                     | Live dispatch board + tracking updates                                                    |
| **Offline**      | **`offline-sync` module** (SQLite on device)        | Couriers frequently lose signal; offline-first is non-negotiable                          |
| **Optimization** | Routing service (TS first; **Python** if ML-heavy)  | Heavy route/ML compute allowed behind a service contract per the standards                |
| **Payments**     | `payments` contract + adapters                       | Generic core; **`payments-momo`** (Ghana MoMo) + **`payments-stripe`** (UK cards) plug in |
| **Messaging**    | `notifications` + adapters                            | SMS/USSD/WhatsApp adapters for GH; email/SMS for UK                                       |
| **Hosting**      | Containers on a portable platform; region-flexible   | Lets you meet UK data-residency (GDPR) without lock-in; keep latency low for GH users     |

**Why TypeScript-first over Python-backend:** the factory's central asset is the reusable
module catalog, and reuse is highest when web, mobile, and API speak the same language and share
types and contracts. Logistics is mostly orchestration, state, and I/O — not heavy computation —
so a TS core is the right default. Where computation *is* heavy (route optimization at scale,
demand ML), that single module is implemented in Python behind a service contract, exactly as
the standards allow. This gives you the reuse benefits of one language and the compute benefits
of Python precisely where it pays off, without splitting the whole platform.

---

## 3. Architecture (generic core, market adapters at the edge)

```
            ┌──────────────────────────────────────────────────────────┐
            │                     RELAY (generic core)                   │
            │                                                            │
  Ops Web ──┤  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
 (Next.js)  │  │ Orders  │  │ Dispatch │  │ Tracking │  │  Pricing   │  │
            │  │ & Book  │  │ & Routing│  │  & POD   │  │ & Billing  │  │
 Courier ───┤  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │
 App (RN)   │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
            │  │Couriers │  │  Geo /   │  │ AI Ops   │  │ Reporting/ │  │
 Tracking ──┤  │& Fleet  │  │ Map      │  │ Copilot  │  │ Analytics  │  │
 PWA        │  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │
            │                                                            │
            │  shared: auth · audit · notifications · offline-sync ·     │
            │          money · file-store · event-bus · config          │
            └───────────────┬───────────────────────┬──────────────────┘
                            │ contracts             │ contracts
                ┌───────────▼──────────┐ ┌──────────▼───────────────┐
                │  PAYMENT ADAPTERS     │ │  LOCALE / MARKET ADAPTERS │
                │  payments-momo (GH)   │ │  address-gh (GhanaPostGPS)│
                │  payments-stripe (UK) │ │  address-uk (postcodes)   │
                │  payments-cash        │ │  sms-local-gh / ussd      │
                └───────────────────────┘ │  tax-uk (VAT) / tax-gh    │
                                          └───────────────────────────┘
```

Everything inside the box is market-neutral. Ghana and the UK exist only as **adapter modules**
selected by `config` per tenant. Adding a third market later means writing adapters, not
touching the core — this is the payoff of *"abstract first, localize last."*

---

## 4. Functional modules (what Relay does)

Each maps to Registry modules (`04`) — many are harvested back for future products.

1. **Orders & Booking** — create/import shipments (single + bulk CSV), customer/shipper records,
   service levels. *Reuses `entity-store`, `import-export`, `form-kit`.*
2. **Couriers & Fleet** — driver onboarding, vehicles, shifts, availability, capacity.
3. **Dispatch & Routing** — assign jobs (manual + **AI auto-dispatch**), optimize multi-stop
   routes, live ETAs, re-optimize on disruption. *Reuses/seeds `dispatch`, `routing`, `geo`.*
4. **Tracking & Proof of Delivery** — shipment state machine, public tracking links, **offline
   photo/signature/recipient capture**. *Seeds `tracking`, `proof-of-delivery`.*
5. **Pricing & Billing** — rate cards by zone/weight/service, quotes, invoices, payments,
   payouts to couriers. *Seeds `pricing`; uses `money` + payment adapters.*
6. **AI Ops Copilot** — natural-language interface for the dispatcher ("what's late and why?",
   "rebalance the afternoon"), exception detection, demand forecasting, daily ops briefing.
7. **Reporting & Analytics** — operational dashboard (on-time %, cost/delivery, courier
   utilization), owner KPIs. *Reuses `dashboard-kit`, `data-table`.*
8. **Notifications** — booking confirmations, dispatch alerts, "out for delivery", delivered —
   over the right channel per market. *Uses `notifications` + messaging adapters.*

### The embedded AI (product-level, distinct from the factory agents)
- **Smart dispatch** — assignment that balances distance, capacity, priority, and courier load.
- **Route optimization + ETA prediction** — multi-stop sequencing; ETAs that learn from history.
- **Exception detection** — flags stuck/at-risk parcels before the customer complains.
- **Demand forecasting** — staffing and capacity planning.
- **Ops copilot** — the dispatcher's natural-language command line over their own operation.

---

## 5. Data model (core entities, market-neutral)

```
Tenant ──< Courier ──< Shift
   │           │
   │           └──< Assignment >── Shipment ──< TrackingEvent
   │                                  │   │
   └──< Customer ──< Shipment         │   └──< ProofOfDelivery (photo/sig/recipient)
                          │           │
                          └── Quote ──┴── Invoice ──< Payment (via adapter)
   Address (pluggable shape per market)   RateCard ──< Zone
```

Notes:
- `Address` is an interface satisfied by market adapters (UK postcode model vs. GhanaPostGPS) —
  the core stores a normalized shape + the raw market-specific form.
- `Payment` references a provider-agnostic record; the adapter holds provider detail.
- `Money` is always currency-tagged (GHS or GBP); no bare numbers for money, ever.

---

## 6. Build roadmap (phased, factory-style: prototype → harden → productionize → operate)

**Phase 0 — Foundry readiness (prerequisite).** Stand up the substrate and hire the agents:
monorepo, CI/gates, foundation modules (`auth`, `entity-store`, `notifications`, `money`,
`offline-sync`, `design-system`), and the `.claude/` agent + skill files. *Outcome: the factory
can build.*

**Phase 1 — Generic MVP (the proving run).** Orders, Couriers, manual Dispatch, Tracking + POD,
basic Pricing, ops dashboard. Single currency, generic addresses, email/SMS notifications, one
payment adapter (cards). *Outcome: a working courier ops system + the first harvested domain
modules (`tracking`, `pricing`, `dispatch`).*

**Phase 2 — AI layer.** Auto-dispatch, route optimization + ETAs, exception detection, the ops
copilot. *Outcome: the differentiator; seeds `routing` and AI-pattern modules.*

**Phase 3 — UK localization.** `address-uk`, `tax-uk` (VAT), `payments-stripe`, GDPR posture
(data residency, DSARs via the `audit-log`/data tooling), UK courier workflow nuances.
*Outcome: UK-ready, core untouched.*

**Phase 4 — Ghana localization.** `payments-momo` (mobile money), `address-gh` (GhanaPostGPS),
`sms-local-gh` + `ussd` + WhatsApp, offline-hardening for patchy connectivity, GHS, Ghana Data
Protection Act posture. *Outcome: Ghana-ready; offline + MoMo + USSD prove the adapter model.*

**Phase 5 — Operate & compound.** `ops-analyst` runs Relay; incidents and recurring patterns
harvest into the Registry, making product #2 cheaper. *Outcome: the ecosystem flywheel turns.*

Sequencing note: UK before Ghana is a deliberate *de-risking* choice — the UK's mature payment/
address/compliance rails let you validate the adapter architecture before tackling Ghana's
harder offline/MoMo/USSD constraints. Reorder if your go-to-market says otherwise.

---

## 7. Localization requirements captured now (built later)

Documented so the generic core is designed to *accommodate* them without rework:

**Ghana**
- **Payments:** Mobile money (MTN MoMo, Telecel, AirtelTigo) is primary; cash-on-delivery
  common. Cards are secondary.
- **Addressing:** Informal/landmark-based addresses; GhanaPostGPS digital addresses; geocoding
  is unreliable → support landmark + map-pin capture.
- **Connectivity:** Intermittent mobile data → offline-first is essential; SMS/USSD fallback for
  notifications and even booking.
- **Comms:** WhatsApp and SMS dominate over email.
- **Currency/regulatory:** GHS; Ghana Data Protection Act (2012); Bank of Ghana rules around
  mobile-money handling.

**UK**
- **Payments:** Cards + bank transfer (Stripe/Open Banking); direct debit for B2B.
- **Addressing:** Structured postcodes; reliable geocoding (PAF/Ordnance Survey).
- **Connectivity:** Generally reliable; offline still useful for rural/underground but not the
  default constraint.
- **Comms:** Email + SMS; push.
- **Currency/regulatory:** GBP; UK GDPR + Data Protection Act 2018 (lawful basis, DSARs,
  retention, data residency); VAT on invoices; worker-status considerations for couriers.

These belong in the spec at design time (G1) so the core's seams land in the right places —
even though the adapters themselves are Phase 3–4 work.

---

## 8. Success metrics

- **For courier operators:** on-time delivery %, cost per delivery, courier utilization,
  failed-delivery rate, time-to-dispatch.
- **For the product:** activation (operator runs a real day on Relay), retention, deliveries
  processed, tracking-link engagement.
- **For the factory:** % of Relay built from reused modules, number of modules harvested from
  Relay, and build cost of feature N vs. feature 1 (should fall as the catalog grows) — the real
  proof that the ecosystem, not just the product, is working.
