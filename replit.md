# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### FinTrack Finance Dashboard (`artifacts/fintrack`)
- Frontend-only React + Vite app at `/`
- Finance dashboard with 4 tabs: Dashboard, Transactions, Budgets, Insights
- Uses Chart.js (CDN) for balance trend line chart and spending doughnut chart
- Role-based UI (Admin/Viewer toggle) — Admin can add/edit/delete transactions
- Dark/light theme toggle with localStorage persistence
- CSV export, animated number counters, stagger animations
- State managed with React Context + localStorage (`fintrack_v2`)
- Structure: `src/context/`, `src/components/`, `src/data/`, `src/hooks/`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
