# Bug Tracker

Known bugs to be fixed. Checked items are resolved.

## Critical

- [ ] **BUG-001: 홈에서 새로고침 시 RepositoryContainer 미초기화 에러**
  - **재현**: 홈페이지에서 브라우저 새로고침 (Ctrl+R)
  - **에러**: `RepositoryContainer is not initialized. Call initialize() first.`
  - **경로**: `ListProjectHandler.handler` → `RepositoryContainer.projects` getter
  - **원인 추정**: 새로고침 시 renderer가 IPC 요청을 보내는 시점에 main 프로세스의 RepositoryContainer가 아직 초기화되지 않은 상태
  - **관련 파일**: `src/main/core/database/RepositoryContainer.ts`, `src/main/handler/projects/ListProjectHandler.ts`

## High

- [ ] **BUG-002: 워크스페이스 연결 시 PostgreSQL 인증 실패 에러 처리 미흡**
  - **재현**: 잘못된 비밀번호로 워크스페이스 연결 시도
  - **에러**: `password authentication failed for user "postgres"` (pg error code `28P01`)
  - **경로**: `ConnectWorkspaceHandler.handler` → `PostgresAdapter.connect`
  - **원인 추정**: 인증 실패 시 사용자에게 명확한 에러 메시지를 전달하지 못하거나, 에러 처리가 불충분하여 raw DB 에러가 노출됨
  - **관련 파일**: `src/main/core/database/adapter/PostgresAdapter.ts`, `src/main/handler/workspace/ConnectWorkspaceHandler.ts`

## Medium

## Low
