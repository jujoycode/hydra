# Bug Tracker

Known bugs to be fixed. Checked items are resolved.

## Critical

- [x] **BUG-001: 홈에서 새로고침 시 RepositoryContainer 미초기화 에러** ✅ 해결 (commit 72aec70)
  - **재현**: 홈페이지에서 브라우저 새로고침 (Ctrl+R)
  - **에러**: `RepositoryContainer is not initialized. Call initialize() first.`
  - **경로**: `ListProjectHandler.handler` → `RepositoryContainer.projects` getter
  - **원인**: main 프로세스 hot-reload 재시작 시 RepositoryContainer는 빈 싱글톤이지만, renderer Zustand persist는 `isConnected=true` 유지 → 불일치. 새로고침 직후 IPC가 빈 컨테이너에 부딪힘.
  - **해결**: auth store에 `bootstrap()` 추가. 앱 마운트 시 `WORKSPACE_STATUS` IPC로 main 실제 상태 조회 후 persist된 상태 동기화. `main.tsx`에서 bootstrap 완료 전까지 `EmptyPage` splash 렌더 후 RouterProvider 마운트.

## High

- [x] **BUG-002: 워크스페이스 연결 시 PostgreSQL 인증 실패 에러 처리 미흡** ✅ 해결 (commit a85d066)
  - **재현**: 잘못된 비밀번호로 워크스페이스 연결 시도
  - **에러**: `password authentication failed for user "postgres"` (pg error code `28P01`)
  - **경로**: `ConnectWorkspaceHandler.handler` → `PostgresAdapter.connect`
  - **해결**: 신규 `DatabaseError` 클래스 + `wrapPgError()` 헬퍼로 pg 코드 매핑(28P01/28000→AUTH, 3D000→NOT_FOUND, 42501→PERMISSION, ECONNREFUSED/ENOTFOUND/EAI_AGAIN/ETIMEDOUT/ECONNRESET→NETWORK). leaked pool 정리 포함. ConnectWorkspaceHandler의 46줄 inline try/catch 제거.

## Medium

- [ ] **SYS-001: subagent 편집이 선택적으로 원복되는 현상**
  - **재현**: Agent 도구로 기존 파일 수정 후 subagent가 성공 리포트. 수십 초~수 분 후 `git diff`에서 해당 수정분이 사라짐.
  - **패턴**: 새 파일 생성(`?? untracked`)은 유지되나 기존 파일 수정만 선택적으로 원복 — 마치 `git restore <existing files>` 실행된 효과.
  - **발생 사례**: BUG-002 1차 시도, HYDRA-002 1차 시도, HYDRA-008 1차 시도, `backlog.md` 1차 시도, Docker 온보딩 세팅 전체(README / docker-compose / .gitignore), CLAUDE.md v3 sync.
  - **영향**: subagent 리포트를 신뢰하면 실제 디스크 상태와 불일치. 백로그 subagent는 자체 재시도 로직으로 회복.
  - **원인 후보**: Cursor/IDE 외부 변경 감지 후 자동 reload, file watcher 캐시, git hook, Biome format 사이드 이펙트 등 — 미확인.
  - **임시 대응**: subagent 프롬프트에 "작업 후 `git diff`로 자체 검증, 없으면 재시도" 지침을 포함하거나 Claude가 직접 편집 후 즉시 Grep 검증.

## Low
