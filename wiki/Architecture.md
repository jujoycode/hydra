# Architecture

Hydra는 Electron의 3-프로세스 모델을 따릅니다: **Main**, **Preload**, **Renderer**.

```
┌─────────────┐   IPC    ┌──────────────┐   contextBridge   ┌──────────────┐
│  Renderer   │ <──────> │   Preload    │ <───────────────> │     Main     │
│ (React UI)  │          │ window.callApi│                   │ (IPC/DB/WS)  │
└─────────────┘          └──────────────┘                   └──────┬───────┘
                                                                    │
                                                          ┌─────────▼─────────┐
                                                          │ PostgreSQL / MySQL │
                                                          └────────────────────┘
```

## Main Process (`src/main/`)

DB 접근은 **메인 프로세스에서만** 일어납니다 (렌더러는 IPC로만 접근).

- **IPC 핸들러** (`handler/`): `CoreBaseHandler<C>` 기반 클래스, `this.repos` getter → `RepositoryContainer`
  - 도메인별: `workspace/`, `auth/`, `projects/`, `issues/`, `milestones/`, `labels/`, `comments/`,
    `tasks/`, `issueRelations/`, `notifications/`, `integrations/`, `storage/`, `invite/`, `system/`
- **DB 추상화** (`core/database/`):
  - `adapter/DatabaseAdapter.ts` — 멀티 DBMS 인터페이스
  - `adapter/PostgresAdapter.ts` — Drizzle + pg (`wrapPgError()`로 에러 래핑)
  - `adapter/MySqlAdapter.ts` — Drizzle + mysql2 (`wrapMySqlError()`)
  - `adapter/createAdapter.ts` — dbms → 어댑터 팩토리 (알 수 없는 값은 `VALIDATION_ERROR`)
  - `repository/interfaces/` + `repository/drizzle/` — 리포지토리 (스키마 생성자 주입으로 PG/MySQL 공용)
  - `schema/drizzle/schema.ts` — Drizzle 테이블 정의 (16개 테이블)
  - `RepositoryContainer.ts` — 싱글톤 DI 컨테이너
- **워크스페이스** (`core/workspace/WorkspaceManager.ts`): Electron safeStorage로 암호화 설정 저장

## Preload (`src/preload/`)

`window.callApi`를 노출하는 타입 IPC 브리지. 렌더러는 이 통로로만 메인과 통신합니다.

## Renderer (`src/renderer/src/`)

- **라우팅** (`routers/routes.tsx`): TanStack Router (HashHistory)
  - Public: `/workspace`, `/login`, `/setup`
  - Authenticated (`MainLayout`): `/`, `/projects`, `/my-issues`, `/notifications`, `/members`
    - `/projects/$projectId` (`ProjectLayout`): `/issues`, `/issues/$issueId`, `/tasks`, `/settings`
    - `/settings` (`SettingsLayout`): account, members, notifications, integrations
- **컴포넌트**: Atomic Design — `atoms/`(shadcn/ui) → `molecules/` → `organisms/` → `templates/` → `pages/` → `layouts/`
- **상태 관리** (`stores/`, Zustand): `auth.ts`(연결/세션 + `bootstrap()`), `workspace.ts`, `project.ts`, `issue.ts`, `panel.ts`, `sidebar.ts`
- **리치 텍스트**: Tiptap · **토스트**: sonner · **리사이즈 패널**: react-resizable-panels

## Bootstrap & Auth Guard

메인 프로세스가 hot-reload로 재시작되면 `RepositoryContainer`는 빈 싱글톤이 되지만 렌더러의 persist된
연결 상태(`isConnected`)는 유지되어 불일치가 생길 수 있습니다. 이를 막기 위해 auth store의
`bootstrap()`이 앱 마운트 시 `WORKSPACE_STATUS` IPC로 메인의 실제 상태를 조회해 동기화합니다.
인증 가드는 JWT가 아니라 연결 상태(`isConnected`) + 세션(`isAuthenticated`) 기반입니다.

## Path Aliases

`electron.vite.config.ts`에 정의 — Main(`@/handler`, `@/database`, …), Preload(`@/interface`),
Renderer(`@/components`, `@/atoms`, `@/stores`, …). `@/interface`는 main/renderer가 공유합니다.
