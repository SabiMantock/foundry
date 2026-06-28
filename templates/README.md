# templates/ — the factory's reference-design library

These are the **molds the factory presses into a product**, not part of the factory's own
runtime. The agents and skills copy/adapt them when you `/new-product` and as work proceeds.
Nothing here is product- or market-specific.

```
templates/
├── workspace/         # a fresh product monorepo root
│   ├── package.json   #   pnpm workspace + gate scripts (gate:code, gate:integration, ...)
│   ├── pnpm-workspace.yaml, turbo.json
│   ├── tsconfig.base.json      # strict TS baseline all packages extend
│   ├── .eslintrc.cjs           # standards + CONTRACT-ONLY import enforcement
│   ├── .prettierrc.json, .gitignore, .env.example
├── ci/                # the quality gates as CI (copied to a product's .github/)
│   ├── gate-code.yml        # G2: format, lint, types, unit
│   ├── gate-security.yml    # G3: SCA, secrets, SAST
│   ├── gate-integration.yml # G4: contract + e2e + perf budget
│   ├── gate-release.yml     # G5: operator-approved deploy
│   └── CODEOWNERS           # repo areas → guilds
├── module/            # the canonical module skeleton (copied per new module)
│   ├── package.json (foundry metadata), tsconfig.json, README.md
│   └── src/ index.ts (contract surface) · impl.ts · impl.test.ts · contract.test.ts
├── schemas/           # the shapes contracts and catalog entries follow
│   ├── contract.example.yaml
│   └── registry-index.example.yaml
├── adr-template.md    # architecture decision record (architect writes these at G1)
└── spec-template.md   # product/feature spec (product-analyst writes these at G0)
```

## How they're used
- **`/new-product`** (the `init-product-workspace` skill) copies `workspace/` to a fresh repo,
  copies `ci/*` into `.github/workflows/`, and creates empty `packages/ contracts/
  registry/index/ docs/{decisions,specs}/` so the product is gate-ready on day one.
- **`scaffold-module`** copies `module/` per new module, renamed and wired to a contract.
- **`architect`/`product-analyst`** use `adr-template.md` / `spec-template.md`.

## Editing the templates = setting factory-wide standards
Tighten a rule here (e.g. raise the coverage floor, add a gate step) and every product the
factory stamps from then on inherits it. This is one of the operator's highest-leverage levers.
