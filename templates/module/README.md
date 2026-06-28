# @foundry/example-hello

The **canonical module template**. Every Registry module copies this shape:
a public contract (`src/index.ts` ↔ `contracts/example-hello.v1.yaml`), hidden
internals (`src/greet.ts`), unit tests, a contract test, and `foundry` metadata
in `package.json`.

It exists to prove the factory's gates run green end-to-end (Phase 0). It also
plants the **localization seam** (the `locale` option) so the "abstract first,
localize last" principle is visible from the first line of code.

## Usage

```ts
import { greet } from '@foundry/example-hello';

greet();                              // "Hello, world!"
greet({ name: 'Sabi' });              // "Hello, Sabi!"
greet({ name: 'Sabi', locale: 'es' }); // "Hola, Sabi!"
```

## What it demonstrates
- **Contract-only imports** — consumers use the package entry, never `src/` internals.
- **Contract test** — `contract.test.ts` ties code to the YAML contract (gate G4).
- **Maturity + metadata** — `foundry.tier: stable` in `package.json` (doc 04 §4).

## Don't
Ship product logic from here. It's the template, not a real capability. When you
build a real foundation module (`auth`, `money`, …), copy this structure.
