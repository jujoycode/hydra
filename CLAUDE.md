# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hydra is a lightweight Electron desktop app for project/issue management. Offline-first, multi-workspace, open-source. Users connect their own PostgreSQL database.

**Tech Stack**: Electron + React 19 + TypeScript, shadcn/ui + Tailwind CSS v4, Zustand v5, Drizzle ORM + PostgreSQL, TanStack Router + Table + Form, Recharts, lucide-react.

## Commands

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Dev (hot reload) | `pnpm hot` |
| Dev (no hot reload) | `pnpm dev` |
| Build (with typecheck) | `pnpm build` |
| Typecheck all | `pnpm typecheck` |
| Typecheck main only | `pnpm typecheck:node` |
| Typecheck renderer only | `pnpm typecheck:web` |
| Lint (Biome) | `pnpm lint` |
| Format (Biome) | `pnpm format` |
| Package (Electron Forge) | `pnpm package` |
| Make installer | `pnpm make` |
| Start PostgreSQL | `pnpm docker:up` |
| Stop PostgreSQL | `pnpm docker:down` |
| Drizzle push schema | `pnpm db:push` |
| Drizzle generate migration | `pnpm db:generate` |

Package manager is **pnpm**.

## Architecture

Electron three-process model:

### Main Process (`src/main/`)
- **IPC Handlers** (`handler/`): `CoreBaseHandler<C>` base class with `this.repos` getter → `RepositoryContainer`
  - `workspace/` — Connect, Disconnect, List, Save, Delete, Status
  - `auth/` — CreateMember, UpdateUser, DeleteUser, ListUsers
  - `projects/` — List, Get, Create, Update, Delete
  - `issues/` — List, Get, Create, Update, Delete
  - `storage/`, `invite/`, `system/`
- **DB Abstraction** (`core/database/`):
  - `adapter/DatabaseAdapter.ts` — Interface for multi-DBMS support
  - `adapter/PostgresAdapter.ts` — Drizzle + pg implementation
  - `repository/interfaces/` — UserRepository, ProjectRepository, IssueRepository, FileRepository
  - `repository/drizzle/` — PostgreSQL implementations
  - `schema/drizzle/schema.ts` — Drizzle table definitions
  - `RepositoryContainer.ts` — Singleton DI container
- **Workspace** (`core/workspace/WorkspaceManager.ts`): Encrypted config storage via Electron safeStorage

### Preload (`src/preload/`)
Bridge exposing `window.callApi` for typed IPC communication.

### Renderer (`src/renderer/src/`)
- **Routing** (`routers/`): TanStack Router (HashHistory). `/workspace` (public), `/` (protected dashboard), `/projects/$projectId/issues`, `/settings`
- **Components**: Atomic Design — `atoms/` (shadcn/ui), `molecules/`, `organisms/`, `templates/`, `pages/`, `layouts/`
- **Stores** (`stores/`): `auth.ts` (connection state), `workspace.ts` (workspace list), `project.ts`, `issue.ts`, `panel.ts` (detail panel), `sidebar.ts` (sidebar toggle)
- **Auth Guard**: Connection-based (`isConnected` from auth store), no JWT

### Auth Model
- No login/signup screen. DB connection = authentication.
- Admin creates members via app → PostgreSQL ROLE created automatically
- Invite system: base64 encoded non-sensitive workspace info

## Path Aliases (electron.vite.config.ts)

**Main**: `@/base`, `@/constant`, `@/util`, `@/handler`, `@/database`, `@/interface`, `@/lib`, `@/error`, `@/workspace`
**Renderer**: `@/components/*`, `@/pages/*`, `@/hooks/*`, `@/stores/*`, `@/types/*`, `@/lib/*`, `@/interface/*`

## Code Style

- **Biome**: single quotes, no semicolons, 120 char width, 2-space indent, LF
- **Naming**: PascalCase (components/classes), camelCase (functions/variables), UPPER_SNAKE_CASE (constants), `handle` prefix (event handlers)
- **Imports**: external libs → internal modules → constants/types → styles. Use `import type` for type-only.
- **Language**: User-facing text in English. Comments in Korean or English.
- **DB access**: Main process only (via IPC)

## Conventions

- **Branches**: `feature/*`, `bugfix/*`, `hotfix/*`
- **DB naming** (`docs/convention-db.md`): snake_case tables (plural), snake_case columns (singular)
- **Atomic Design**: atoms → molecules → organisms → templates → pages → layouts
- **One file, one component/feature**
