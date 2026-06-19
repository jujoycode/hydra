# Architecture

Hydra는 Electron의 3-프로세스 모델을 따릅니다. 세 프로세스는 **Main**, **Preload**, **Renderer**입니다.

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

DB 접근은 **메인 프로세스에서만** 일어납니다. 렌더러는 IPC를 통해서만 접근합니다.

- **IPC 핸들러**(`handler/`): `CoreBaseHandler<C>` 기반 클래스이며, `this.repos` getter가 `RepositoryContainer`를 반환합니다.
  - 도메인별로 `workspace/`, `auth/`, `projects/`, `issues/`, `milestones/`, `labels/`, `comments/`,
    `tasks/`, `issueRelations/`, `notifications/`, `integrations/`, `storage/`, `invite/`, `system/`이 있습니다.
- **DB 추상화**(`core/database/`)
  - `adapter/DatabaseAdapter.ts` — 멀티 DBMS 인터페이스
  - `adapter/PostgresAdapter.ts` — Drizzle와 pg 기반, `wrapPgError()`로 에러를 래핑
  - `adapter/MySqlAdapter.ts` — Drizzle와 mysql2 기반(`wrapMySqlError()`)
  - `adapter/createAdapter.ts` — dbms 값을 어댑터로 매핑하는 팩토리. 알 수 없는 값은 `VALIDATION_ERROR`로 처리
  - `repository/interfaces/`와 `repository/drizzle/` — 리포지토리. 스키마를 생성자로 주입받아 PG와 MySQL에서 함께 쓰입니다.
  - `schema/drizzle/schema.ts` — Drizzle 테이블 정의(15개 테이블)
  - `RepositoryContainer.ts` — 싱글톤 DI 컨테이너
- **워크스페이스**(`core/workspace/WorkspaceManager.ts`): Electron safeStorage로 설정을 암호화해 저장합니다.

## Preload (`src/preload/`)

`window.callApi`를 노출하는 타입 안전 IPC 브리지입니다. 렌더러는 이 통로로만 메인과 통신합니다.

## Renderer (`src/renderer/src/`)

- **라우팅**(`routers/routes.tsx`): TanStack Router(HashHistory)
  - Public: `/workspace`, `/login`, `/setup`
  - Authenticated(`MainLayout`): `/`, `/projects`, `/my-issues`, `/notifications`, `/members`
    - `/projects/$projectId`(`ProjectLayout`): `/issues`, `/issues/$issueId`, `/tasks`, `/settings`
    - `/settings`(`SettingsLayout`): account, members, notifications, integrations
- **컴포넌트**: Atomic Design을 따라 `atoms/`(shadcn/ui), `molecules/`, `organisms/`, `templates/`, `pages/`, `layouts/` 순으로 쌓습니다.
- **상태 관리**(`stores/`, Zustand): `auth.ts`(연결과 세션, `bootstrap()`), `workspace.ts`, `project.ts`, `issue.ts`, `panel.ts`, `sidebar.ts`
- **리치 텍스트**는 Tiptap, **토스트**는 sonner, **리사이즈 패널**은 react-resizable-panels를 사용합니다.

## Bootstrap & Auth Guard

메인 프로세스가 hot-reload로 재시작되면 `RepositoryContainer`는 빈 싱글톤이 되지만 렌더러의 persist된
연결 상태(`isConnected`)는 유지되어 불일치가 생길 수 있습니다. 이를 막기 위해 auth store의
`bootstrap()`이 앱 마운트 시 `WORKSPACE_STATUS` IPC로 메인의 실제 상태를 조회해 동기화합니다.
인증 가드는 JWT가 아니라 연결 상태(`isConnected`) + 세션(`isAuthenticated`) 기반입니다.

## Path Aliases

`electron.vite.config.ts`에 정의되어 있습니다. Main은 `@/handler`, `@/database` 등을, Preload는 `@/interface`를,
Renderer는 `@/components`, `@/atoms`, `@/stores` 등을 사용하며, `@/interface`는 main과 renderer가 공유합니다.
