---
name: scaffold-module
description: >
  Reference design for a new Registry module. Generates the canonical module skeleton from
  the module template (templates/module). Use when build-new is justified and a fresh module is needed.
---

# Skill: scaffold-module

The *gongban* (reference design) for a module. Produces the standard shape so every module in
the catalog looks the same and passes the gates.

## Generates
```
packages/<name>/
├── package.json          # name @foundry/<name>, type module, foundry metadata, scripts
├── tsconfig.json         # extends ../../tsconfig.base.json
├── src/
│   ├── index.ts          # PUBLIC contract surface (only this is importable)
│   ├── <impl>.ts         # hidden internals
│   ├── <impl>.test.ts    # unit tests
│   └── contract.test.ts  # asserts surface == contracts/<name>.vN.yaml
└── README.md
contracts/<name>.v1.yaml  # the published contract
registry/index/<name>.yaml# the catalog entry
```

## Steps
1. Copy the `templates/module` structure; rename to `<name>`.
2. Set `foundry.tier` (`experimental` for net-new), `foundry.category`, `foundry.contract`.
3. Write the contract YAML; make `src/index.ts` export exactly that surface.
4. Replace example logic; keep internals out of `index.ts`.
5. Write unit + contract tests; meet the coverage floor.
6. Add the catalog entry.
7. Verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm test:contract`.

## Guardrails
- One capability per module. Plant a config seam for any future localization rather than
  branching on market inside logic.
- Public surface only via `index.ts`.
