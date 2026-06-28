# Commission Runbook — <product>

The operator's step-by-step for taking a product from nothing to shipped on the Foundry. Copy this
into a product as `docs/commission-runbook.md` and fill the placeholders. The only steps that need
**you** are the decisions: stack, design, the G1 sign-off, and the G5 release — everything between is
the workforce.

> Prereqs: the plugin is installed and up to date (`claude plugin list` shows the current version),
> and you are **in the folder where the product should live** (the root). Commands are namespaced
> `/foundry:<command>`.

---

## 1. Scaffold the product (in the current folder)
Runs stack → design → seeds the context pack + `AGENTS.md`, and leaves the gates green. You're already
in the root, so no path is needed (it scaffolds in place).
```
/foundry:new-product <product-name>
```

## 2. Choose the stack (records `docs/decisions/0001-tech-stack.md`)
Pick a profile from the stack profiles; versions are web-verified to latest stable.
```
/foundry:stack <product-name> <A|B|C|D>

<one-paragraph rationale: which profile and why, key tools, and any "generic core only / localize
later" constraint>
```

## 3. Choose the design system (records `docs/decisions/0002-design-system.md`)
Pick a profile from the design profiles; tokens seeded, UI libs web-verified.
```
/foundry:design <product-name> <1-5>

<aesthetic + theme(s), accessibility target (WCAG 2.1 AA default), web↔mobile parity note, or a
Figma source if importing>
```

## 4. Commission the build (gate G0)
Paste the full brief — what / why / users / scope / **non-scope** / acceptance criteria /
constraints / success. A complete brief clears G0 without back-and-forth.
```
/foundry:commission <the product brief — see "Brief checklist" below>
```

## 5. Approve the architecture (gate G1 — your highest-leverage decision)
Review the build plan, module reuse vs. build-new, contracts, and the ADR before approving.
```
/foundry:gate G1
```

## 6. Let it build
Workers implement units against their specs; G2–G4 (code, security, integration) run in CI. Check in:
```
/foundry:status
```

## 7. Continuity & exceptions (use as needed)
```
/foundry:remember save          # end of each work session
/foundry:remember restore       # start of the next session
/foundry:imprint                # after building any UI component
/foundry:recover <paste raw error>   # if a problem persists after one fix attempt
/foundry:review <observation>   # on-demand check of a built feature
```

## 8. Ship (gate G5 — release sign-off)
```
/foundry:gate G5
```

---

## Brief checklist (for step 4)
A G0-ready brief includes: **WHAT** (one product, in a sentence), **WHY** (the pain), **USERS**,
**SCOPE** (this commission), **NON-SCOPE** (design for, build later — incl. any market/locale
specifics), **ACCEPTANCE CRITERIA** (numbered, testable), **CONSTRAINTS** (stack/discipline,
adapter seams), **SUCCESS** (what a real day on it looks like).

## Operator touch points
Stack (2) · Design (3) · Architecture sign-off (5) · Release (8). That's it — the rest is delegated.

---

## Worked example — Relay (logistics ops for independent couriers)
- **Step 1 (from the product root):** `/foundry:new-product relay`
- **Step 2 — stack:** Profile A (TypeScript everywhere). Logistics is orchestration/state/IO-heavy,
  not compute-heavy → one TS language maximizes reuse. Next.js web ops dashboard; React Native (Expo)
  courier app, offline-first; Node API; PostgreSQL + PostGIS; Redis. **Generic core only — no Ghana/UK
  adapters yet, just clean seams.**
- **Step 3 — design:** Profile 1 (Tailwind + shadcn/ui). Operational dashboard aesthetic, light theme
  first, WCAG 2.1 AA, web↔mobile token parity via NativeWind.
- **Step 4 — commission scope:** orders & booking, dispatch & routing (manual + AI auto-dispatch,
  multi-stop optimization, live ETAs), tracking + offline proof-of-delivery, pricing/billing
  (provider-agnostic payments contract), reporting, AI ops copilot ("what's late and why?").
  **Non-scope (build later):** Ghana/UK localization — mobile money, GhanaPostGPS/UK postcodes,
  SMS/USSD/WhatsApp, GHS/GBP, VAT, GDPR/Ghana DPA, deep offline-hardening.
- **Harvest target:** `tracking`, `pricing`, `dispatch`, `routing`, `proof-of-delivery`, `geo` back
  into the Registry for the next product.
