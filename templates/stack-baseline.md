# Stack Baseline — verified stable versions

**Verified: 2026-06-28.** These are the latest *stable* (GA) versions at that date, for the
default TypeScript profile. They are a **starting point, not gospel** — the constitution
requires agents to re-verify with the `check-latest-versions` skill before pinning in a real
product, because versions move and the operator may pick a different stack.

> Rule: pin to the latest **stable** release. Never adopt RC/beta/alpha (e.g. TypeScript 7.0
> RC, PostgreSQL 19 beta) unless the operator explicitly opts in. Avoid EOL versions.

## Default TypeScript profile (as pinned in `templates/workspace/`)

| Tool             | Stable (2026-06-28) | Pin       | Notes |
| ---------------- | ------------------- | --------- | ----- |
| Node.js          | 24 LTS              | `>=24`    | 26 is *Current*, becomes LTS Oct 2026; stay on 24 LTS for prod. |
| pnpm             | 11.9.0              | `11.9.0`  | pnpm 11 is pure ESM, needs Node 22+. |
| Turborepo        | 2.10.0              | `^2.10`   | |
| TypeScript       | 6.0.3               | `^6.0`    | **7.0 is RC only** (Go-native compiler, ~10x faster) — do not adopt until GA. |
| ESLint           | 10.6.0              | `^10.6`   | **Flat config only** — legacy `.eslintrc` removed. Template uses `eslint.config.mjs`. |
| typescript-eslint| 8.46.x              | `^8.46`   | ⚠️ Verify it formally supports TS 6.0 before relying on it (tooling often lags new TS majors). |
| Prettier         | 3.9.1               | `^3.9`    | |
| Vitest           | 4.1.9               | `^4.1`    | |
| PostgreSQL       | 18.4                | `18`      | 19 is beta (GA ~Sept 2026); stay on 18 for prod. |

## Web/mobile profile additions

| Tool         | Stable (2026-06-28) | Notes |
| ------------ | ------------------- | ----- |
| React        | 19.2.7              | |
| Next.js      | 16.2.x (16.2.9 LTS) | Next 16 GA since Oct 2025. |
| React Native | 0.86.0 (0.85 = New Architecture default) | |
| Expo SDK     | 56 (bundles RN 0.85, React 19.2) | |

## Python profile additions (compute/ML modules behind a service contract)

| Tool    | Stable (2026-06-28) | Notes |
| ------- | ------------------- | ----- |
| Python  | 3.12+ recommended   | |
| FastAPI | ~0.135.x            | Requires Python 3.10+. |

## ⚠️ Live flags from this verification
- **TypeScript 6 + typescript-eslint:** confirm compatibility at build time; if the linter
  errors on TS 6 syntax, pin TS to the latest 5.x the linter supports, or wait for the
  typescript-eslint release that declares TS 6 support. This is exactly the kind of thing the
  freshness skill catches.
- **TypeScript 7.0 RC** and **PostgreSQL 19 beta** are on the horizon — track them, don't
  adopt them, until GA.

## Sources
- Node.js — https://nodejs.org/en/blog/release/v26.0.0 · https://endoflife.date/nodejs
- TypeScript — https://github.com/microsoft/typescript/releases · https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/
- React — https://react.dev/versions
- Next.js — https://endoflife.date/nextjs · https://www.npmjs.com/package/next
- pnpm — https://www.npmjs.com/package/pnpm · https://pnpm.io/blog/releases/11.0
- Turborepo — https://www.npmjs.com/package/turbo
- ESLint — https://eslint.org/blog/2026/02/eslint-v10.0.0-released/ · https://www.npmjs.com/package/eslint
- Prettier — https://github.com/prettier/prettier/releases
- Vitest — https://www.npmjs.com/package/vitest
- Expo / React Native — https://expo.dev/changelog/sdk-56 · https://reactnative.dev/versions
- PostgreSQL — https://www.postgresql.org/about/news/postgresql-184-1710-1614-1518-and-1423-released-3297/
- FastAPI — https://fastapi.tiangolo.com/release-notes/
