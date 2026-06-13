# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hydra is a lightweight Electron desktop app for project/issue management. Offline-first, multi-workspace, open-source. Users connect their own PostgreSQL or MySQL 8 database.

**Tech Stack**: Electron + React 19 + TypeScript, shadcn/ui + Tailwind CSS v4, Zustand v5, Drizzle ORM + PostgreSQL/MySQL, TanStack Router + Table + Form, Tiptap (rich text), Recharts, lucide-react, i18next (+ react-i18next), sonner (toast), next-themes, react-resizable-panels, Vitest.

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
| Drizzle generate MySQL migration | `pnpm db:generate:mysql` |
| Drizzle Studio (DB GUI) | `pnpm db:studio` |
| Test (once) | `pnpm test` |
| Test (watch) | `pnpm test:watch` |
| Test coverage | `pnpm test:coverage` |

Package manager is **pnpm**.

## Architecture

Electron three-process model:

### Main Process (`src/main/`)
- **IPC Handlers** (`handler/`): `CoreBaseHandler<C>` base class with `this.repos` getter → `RepositoryContainer`
  - `workspace/` — Connect, Disconnect, List, Save, Delete, Status
  - `auth/` — CreateMember, UpdateUser, DeleteUser, ListUsers
  - `projects/` — List, Get, Create, Update, Delete
  - `issues/` — List, Get, Create, Update, Delete
  - `milestones/` — List, Create, Update, Delete
  - `labels/` — List, Create, Update, Delete, Link, Unlink, ListIssueLabel
  - `comments/` — List, Create, Update, Delete
  - `tasks/` — List, Create, Update, Delete (checklist items)
  - `issueRelations/` — List, Create, Delete (blocks / is_blocked_by / relates_to)
  - `notifications/` — List, MarkRead, MarkAllRead, Delete, CountUnread
  - `integrations/` — List, Save, Delete, TestSlackWebhook
  - `storage/`, `invite/`, `system/`
- **DB Abstraction** (`core/database/`):
  - `adapter/DatabaseAdapter.ts` — Interface for multi-DBMS support
  - `adapter/PostgresAdapter.ts` — Drizzle + pg implementation (errors wrapped by `DatabaseError` via `wrapPgError()`)
  - `adapter/MySqlAdapter.ts` — Drizzle + mysql2 implementation (workspace `dbms: 'mysql'`)
  - `adapter/createAdapter.ts` — dbms → adapter factory
  - `repository/interfaces/` — UserRepository, ProjectRepository, IssueRepository, FileRepository, ...
  - `repository/drizzle/` — PostgreSQL implementations
  - `schema/drizzle/schema.ts` — Drizzle table definitions. Tables (15): `users`, `projects`, `users_projects_link`, `milestones`, `issues`, `files`, `issues_files_link`, `comments`, `labels`, `issues_labels_link`, `tasks`, `issue_relations`, `notifications`, `integrations`, `invite_codes`. Naming rules: see `docs/design/convention-db.md`.
  - `RepositoryContainer.ts` — Singleton DI container
- **Workspace** (`core/workspace/WorkspaceManager.ts`): Encrypted config storage via Electron safeStorage

### Preload (`src/preload/`)
Bridge exposing `window.callApi` for typed IPC communication.

### Renderer (`src/renderer/src/`)
- **Routing** (`routers/routes.tsx`): TanStack Router (HashHistory). Route tree:
  - Public: `/workspace` (workspace selection/connection)
  - Authenticated (`MainLayout`):
    - `/` — Home, `/projects`, `/my-issues` *(placeholder)*, `/notifications`, `/members`
    - `/projects/$projectId` (`ProjectLayout`) → `/`, `/issues`, `/issues/$issueId`, `/tasks`, `/tasks/$taskId` *(placeholder)*, `/settings`, `/settings/$settingId` *(placeholder)*
    - `/settings` (`SettingsLayout`) → `/` (account), `/members`, `/notifications` *(placeholder)*, `/integrations`
- **Components**: Atomic Design — `atoms/` (shadcn/ui), `molecules/`, `organisms/`, `templates/`, `pages/`, `layouts/` (MainLayout, ProjectLayout, SettingsLayout)
- **Rich text**: Tiptap (issue descriptions, comments). **Toasts**: sonner. **Resizable panels**: react-resizable-panels.
- **Stores** (`stores/`): `auth.ts` (connection state + `bootstrap()`), `workspace.ts`, `project.ts`, `issue.ts`, `panel.ts` (detail panel), `sidebar.ts` (sidebar toggle). Notifications are fetched via direct IPC (no dedicated store).
- **Auth Guard**: Connection-based (`isConnected` from auth store), no JWT. `bootstrap()` syncs with main via `WORKSPACE_STATUS` IPC on app mount so that persisted state never diverges from main process state.

### Auth Model
- Two-step: workspace DB connection (shared service account) → app-level login (`user_sn` + scrypt password)
- First connect to an empty DB shows an admin setup screen; admins create members in-app (no DB ROLEs)
- Session persisted via Electron safeStorage ("remember me" extends expiry); re-verified on bootstrap
- Invite system: base64 encoded non-sensitive workspace info (`host/port/dbName/dbms` — no credentials)

## Path Aliases (electron.vite.config.ts)

**Main**: `@/base`, `@/constant`, `@/util`, `@/handler`, `@/database`, `@/interface`, `@/lib`, `@/error`, `@/workspace`
**Preload**: `@/interface`
**Renderer**: `@/components`, `@/atoms`, `@/molecules`, `@/organisms`, `@/pages`, `@/layouts`, `@/templates`, `@/routers`, `@/lib`, `@/hooks`, `@/types`, `@/stores`, `@/utils`, `@/constants`, `@/interface` (shared with main)

## Code Style

- **Biome**: single quotes, no semicolons, 120 char width, 2-space indent, LF
- **Naming**: PascalCase (components/classes), camelCase (functions/variables), UPPER_SNAKE_CASE (constants), `handle` prefix (event handlers)
- **Imports**: external libs → internal modules → constants/types → styles. Use `import type` for type-only.
- **Language**: User-facing text in English. Comments in Korean or English.
- **DB access**: Main process only (via IPC)

## Conventions

- **Branches**: `feature/*`, `bugfix/*`, `hotfix/*`
- **DB naming** (`docs/design/convention-db.md`): snake_case tables (plural), snake_case columns (singular)
- **Atomic Design**: atoms → molecules → organisms → templates → pages → layouts
- **One file, one component/feature**

## V3 Features

- **Notifications** — CRUD handlers + `notifications` table + `NotificationsPage`. Read status, unread count badge.
- **Issue Relations** — `issue_relations` table expresses `blocks` / `is_blocked_by` / `relates_to` between issues.
- **Service Integrations** — Slack webhook (with test-send) and GitHub token stored via `integrations` table; managed in `/settings/integrations`.
- **Rich Text Editor** — Tiptap-powered editor for issue descriptions and comments.
- **Labels / Milestones / Tasks** — Issue classification, scheduling, and per-issue checklist items.
- **Comments** — Threaded comments per issue with full CRUD.

## Documentation

```
docs/
  design/
    convention-db.md     — DB naming rules
    table-erd.md         — Entity relationship diagram
    v3-ui-design.md      — UI design spec (v3)
    roadmap-v1.md        — v1 roadmap
  plans/
    v3-phase1-foundation.md — v3 Phase 1 plan
  project/
    backlog.md    — Product backlog
    bugs.md       — Known bugs
    kick-off.md   — Kick-off notes
```
