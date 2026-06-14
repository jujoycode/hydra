# Hydra

> English · **[한국어](./README.md)**

A lightweight Electron desktop app for project/issue management. Offline-first, multi-workspace, open source.
You connect **your own PostgreSQL or MySQL 8 database**.

- **Tech**: Electron + React 19 + TypeScript · shadcn/ui + Tailwind CSS v4 · Zustand v5 · Drizzle ORM (PostgreSQL / MySQL 8) · TanStack Router/Table/Form · Tiptap · Recharts · i18next
- **Highlights**: offline-first, multi-workspace, BYO-Database (PostgreSQL/MySQL), two-step auth

> 📖 Deeper design/ops docs live in [`wiki/`](./wiki). Architecture summary is in [`CLAUDE.md`](./CLAUDE.md).

## Requirements

- Node.js 20+
- pnpm 9+
- A database to connect to: PostgreSQL or MySQL 8.0+
  - For local dev, PostgreSQL can be started with `pnpm docker:up` (Docker Desktop required)

## Quick Start

```bash
pnpm install            # 1. install dependencies
cp .env.example .env    # 2. copy env (drizzle CLI only — separate from app runtime)
pnpm docker:up          # 3. (optional) start local PostgreSQL
pnpm db:push            # 4. push Drizzle schema to the DB (local dev)
pnpm hot                # 5. run the Electron app in dev mode (hot reload)
```

On first launch a **workspace connection screen** appears. After connecting with DB credentials, an empty DB
routes you to the **admin setup screen**. See [Getting Started](./wiki/Getting-Started.md) for the full flow.

## Authentication (two-step)

Hydra separates **workspace connection** from **app login** (not "DB connection = auth").

1. **Workspace connection** — connect to the DB with a shared service account (host/port/dbName/dbms + credentials)
2. **App login** — sign in with a personal account (`user_sn` + scrypt-hashed password + session)

Connecting to an empty DB shows the admin setup screen; the admin then creates members in-app (no DB ROLEs).
Sessions are persisted via Electron safeStorage ("remember me" extends expiry). See [Authentication](./wiki/Authentication.md).

## Commands

| Command | Description |
|---------|-------------|
| `pnpm hot` / `pnpm dev` | dev server (with / without hot reload) |
| `pnpm build` | type-check + production build |
| `pnpm typecheck` | type-check (`:node` / `:web`) |
| `pnpm lint` / `pnpm format` | Biome lint / format |
| `pnpm test` | Vitest (`:watch` / `:coverage`) |
| `pnpm docker:up` / `pnpm docker:down` | local PostgreSQL container |
| `pnpm db:push` / `pnpm db:generate` / `pnpm db:generate:mysql` | Drizzle schema push / migration generate (PG / MySQL) |
| `pnpm storybook` / `pnpm build-storybook` | Storybook dev / build |
| `pnpm package` / `pnpm make` | Electron Forge package / installer |

## Database (PostgreSQL / MySQL 8)

Choose the DBMS when adding a workspace. The runtime service account needs **DML privileges only** (no `ALL PRIVILEGES`).

```sql
-- MySQL 8 example
CREATE USER 'hydra_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hydra.* TO 'hydra_app'@'%';
```

Migrations run automatically on connect; if the schema is current the migrator is skipped (so a DML-only account
works). **On first connect and after an app upgrade** (pending migrations), connect once with a DDL-capable account
(`CREATE, ALTER, INDEX, REFERENCES`). MySQL requires the `utf8mb4` charset.

> Never run `drizzle-kit push` against a MySQL workspace — use the generated migrations only (collation is owned by schema custom types).

See [Database & Multi-DBMS](./wiki/Database-and-Multi-DBMS.md) for the multi-DBMS architecture.

## Features

Issue/project management, milestones, labels, checklists (Tasks), issue relations (blocks/is_blocked_by/relates_to),
threaded comments, in-app notifications, activity log timeline, kanban board, Slack/GitHub integrations,
Tiptap rich-text editor, dark mode. See [Features](./wiki/Features.md).

## Project structure

- `src/main/` — Electron main process (IPC handlers, DB adapters/repositories, workspace)
- `src/preload/` — typed IPC bridge (`window.callApi`)
- `src/renderer/src/` — React renderer (Atomic Design)
- `docs/` — design/backlog/plan docs · `wiki/` — user/dev wiki · `drizzle/` — generated migrations (PG/MySQL)

## Branching model

- The base branch for active development is **`main`**.
- Past lines (the old `main`, `ui-v2`, `develop`, `docs`) are archived under the **`legacy/*`** namespace for history.
- Working-branch convention: `feature/*`, `bugfix/*`, `hotfix/*`. See [Branching & Releases](./wiki/Branching-and-Releases.md).

## Contributing

See [`CONTRIBUTING.en.md`](./CONTRIBUTING.en.md) and the [`CODE_OF_CONDUCT.en.md`](./CODE_OF_CONDUCT.en.md).

## License

[MIT](./LICENSE) © jujoycode
