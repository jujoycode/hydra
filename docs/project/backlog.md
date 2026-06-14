# Hydra Backlog Tickets

> ⚠️ **개별 티켓의 완료 상태는 대부분 낡았다.** 2026-06-14 코드 감사 결과, 아래 Critical/High 다수
> (HYDRA-002·004·005·006·008·014·023·028 등)는 **이미 구현 완료**이며, M1·M2·M3 마일스톤도 모두 완료됐다.
> 남은 v1.0.0 작업은 **M4(OSS 출시 & 릴리즈)뿐**이다. 현재 작업의 단일 기준은
> **[`docs/project/milestones-v1.md`](./milestones-v1.md)** (v1.0.0 마일스톤)이며, 이 백로그는 개별 아이디어
> 참고용으로 남긴다. 실제 미완료 갭은 milestones-v1.md의 "현황" 섹션과 아래 **🆕 신규 발견** 섹션을 신뢰할 것.

> 생성일: 2026-04-01 | 기준 브랜치: `v3`
> 비용 기준: S(1~2일), M(3~5일), L(1~2주), XL(2주+)

## 범례

| 우선순위 | 의미 |
|---------|------|
| 🔴 Critical | 앱 핵심 기능, 즉시 필요 |
| 🟠 High | 사용성에 큰 영향, 조기 구현 권장 |
| 🟡 Medium | 있으면 좋은 기능, 중기 계획 |
| 🟢 Low | 고도화/편의, 장기 계획 |

---

## 🔴 Critical

### ~~HYDRA-001: SelectIssueHandler / SelectProjectHandler 구현~~ ✅ 완료

- **비용**: S
- **우선순위**: 🔴 Critical
- **상태**: ✅ 완료 (2026-04-02, commit 30d0a11)
- **설명**: SELECT 채널을 LIST/GET으로 분리 완료. 5개 신규 핸들러 구현됨.
- **구현 결과**:
  - `src/main/handler/issues/ListIssueHandler.ts` + `GetIssueHandler.ts`
  - `src/main/handler/projects/ListProjectHandler.ts` + `GetProjectHandler.ts`
  - `src/main/handler/auth/ListUsersHandler.ts`

### HYDRA-002: CreateIssueDialog API 연결

- **비용**: S
- **우선순위**: 🔴 Critical
- **설명**: `CreateIssueDialog.tsx:76`에 TODO — 폼은 완성되었으나 실제 API 호출 미연결. 담당자 선택 시 프로젝트 멤버 목록 표시도 미구현 (line 166).
- **관련 파일**:
  - `src/renderer/src/components/organisms/dialogs/CreateIssueDialog.tsx`
- **선행 작업**: ~~HYDRA-001~~ ✅
- **완료 조건**: 이슈 생성 시 DB 저장 확인, 담당자 드롭다운에 프로젝트 멤버 표시

### ~~HYDRA-003: Issue Store (Zustand) 생성~~ ✅ 완료

- **비용**: S
- **우선순위**: 🔴 Critical
- **상태**: ✅ 완료
- **설명**: Issue 스토어 구현 완료. issues 목록, selectedIssueId, isLoading, error 상태 관리.
- **구현 결과**:
  - `src/renderer/src/stores/issue.ts` (Zustand + localStorage persistence)
  - 추가: `src/renderer/src/stores/panel.ts` (디테일 패널 상태)
  - 추가: `src/renderer/src/stores/sidebar.ts` (사이드바 토글 상태)

### HYDRA-004: 홈페이지 실데이터 연동

- **비용**: M
- **우선순위**: 🔴 Critical
- **설명**: `HomePage.tsx`가 `dummy/issues.json` 및 하드코딩된 배열 사용 중. 실제 DB 데이터 기반 대시보드로 전환 필요.
- **관련 파일**:
  - `src/renderer/src/components/pages/HomePage.tsx`
- **선행 작업**: ~~HYDRA-001~~ ✅
- **완료 조건**: 모든 차트(상태 도넛, 트렌드, 프로젝트 진행률)가 실데이터 반영

---

## 🟠 High

### HYDRA-005: 프로젝트 상세 페이지 구현

- **비용**: M
- **우선순위**: 🟠 High
- **설명**: `/projects/$projectId` 라우트가 TempComponent 상태 (routes.tsx:78). 프로젝트 개요, 이슈 요약, 멤버 목록 표시.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx:78`
  - 신규: `src/renderer/src/components/pages/ProjectDetailPage.tsx`
- **선행 작업**: ~~HYDRA-001~~ ✅
- **완료 조건**: 프로젝트 정보, 이슈 통계, 멤버 리스트 렌더링

### HYDRA-006: 이슈 상세 페이지 구현

- **비용**: M
- **우선순위**: 🟠 High
- **설명**: `/projects/$projectId/issues/$issueId` 라우트가 TempComponent 상태 (routes.tsx:91). 이슈 전체 정보, 상태 변경, 담당자 변경 등.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx:91`
  - 참고: `src/renderer/src/components/organisms/dialogs/IssueDetailsDialog.tsx`
  - 신규: `src/renderer/src/components/pages/IssueDetailPage.tsx`
- **선행 작업**: ~~HYDRA-001~~ ✅, ~~HYDRA-003~~ ✅
- **완료 조건**: 이슈 상세 표시, 인라인 편집, 상태/담당자 변경 가능

### ~~HYDRA-007: 댓글/활동 로그 시스템~~ ✅ 완료

- **비용**: L
- **우선순위**: 🟠 High
- **상태**: ✅ 완료 (commit 62b9393 — `comments` 테이블 + CRUD 핸들러 4개 + 이슈 상세 페이지 댓글 UI 구현)
- **설명**: DB에 comments 테이블 없음. 이슈별 댓글 작성/수정/삭제 + 활동 로그(상태 변경, 담당자 변경 등 자동 기록).
- **관련 파일**:
  - `src/main/core/database/schema/drizzle/schema.ts` (테이블 추가)
  - 신규: Repository, Handler, UI 컴포넌트
- **선행 작업**: HYDRA-006
- **완료 조건**: 이슈 상세에서 댓글 CRUD, 활동 이력 타임라인 표시

### HYDRA-008: 멤버 관리 UI

- **비용**: M
- **우선순위**: 🟠 High
- **설명**: 백엔드 핸들러(CreateMember, Invite)는 구현 완료지만 프론트엔드 UI 없음. 멤버 목록, 역할 관리, 초대 링크 생성 화면 필요.
- **관련 파일**:
  - `src/main/handler/auth/CreateMemberHandler.ts`
  - `src/main/handler/invite/`
  - 신규: 멤버 관리 페이지/다이얼로그
- **완료 조건**: 멤버 초대/삭제/역할변경 UI, 초대 코드 생성 및 복사

### HYDRA-009: 이슈 파일 첨부 UI

- **비용**: S
- **우선순위**: 🟠 High
- **설명**: UploadFileHandler 동작 중, issuesFilesLink 테이블 존재. 이슈에 파일 첨부/다운로드 UI만 연결하면 됨.
- **관련 파일**:
  - `src/main/handler/storage/UploadFileHandler.ts`
  - `src/main/core/database/schema/drizzle/schema.ts` (issuesFilesLink)
  - 이슈 상세 다이얼로그/페이지
- **선행 작업**: HYDRA-006
- **완료 조건**: 이슈에 파일 드래그앤드롭 업로드, 첨부 파일 목록 및 다운로드

---

## 🟡 Medium

### ~~HYDRA-010: 라벨/태그 시스템~~ ✅ 완료

- **비용**: M
- **우선순위**: 🟡 Medium
- **상태**: ✅ 완료 (`labels` 테이블 + `issues_labels_link` 조인 + Label 핸들러 6개(List/Create/Update/Delete/Link/Unlink/ListIssueLabel) 전부 구현)
- **설명**: 현재 `issue_category`(varchar) 하나로 분류. 다중 라벨(색상 포함) 시스템 도입 — labels 테이블 + issues_labels_link 조인 테이블.
- **관련 파일**:
  - `src/main/core/database/schema/drizzle/schema.ts`
  - 신규: Repository, Handler, UI (라벨 관리 + 이슈에 라벨 부착)
- **완료 조건**: 라벨 CRUD, 이슈에 다중 라벨 부착, 라벨별 필터링

### HYDRA-011: 서버사이드 필터링/정렬

- **비용**: M
- **우선순위**: 🟡 Medium
- **설명**: 현재 모든 필터링이 클라이언트 사이드 (TanStack Table의 `getFilteredRowModel`). 데이터 증가 시 성능 문제 예상. 담당자/상태/우선순위/라벨별 서버 쿼리 구현.
- **관련 파일**:
  - `src/renderer/src/hooks/useTable.tsx`
  - `src/main/handler/issues/SelectIssueHandler.ts`
  - Repository 쿼리 확장
- **선행 작업**: ~~HYDRA-001~~ ✅
- **완료 조건**: 페이지네이션 + 서버 필터 쿼리, 프론트 테이블 연동

### HYDRA-012: 테스트 커버리지 확대

- **비용**: L
- **우선순위**: 🟡 Medium
- **설명**: 현재 `ProjectValidator.test.ts` 1개뿐. Vitest + v8 coverage 설정은 완료 상태. 핸들러, 리포지토리, 유틸리티 테스트 추가.
- **대상**:
  - Validator: `IssueValidator.ts`
  - Handler: Create/Update/Delete (Issue, Project)
  - Repository: Drizzle 구현체 (통합 테스트)
  - Utility: `CoreUtil.ts`
- **완료 조건**: 주요 핸들러/리포지토리 테스트 작성, 커버리지 50%+ 달성

### HYDRA-013: Tasks 상세 페이지

- **비용**: S (기존 L → 축소)
- **우선순위**: 🟡 Medium
- **설명**: 태스크 목록/CRUD/체크리스트는 모두 구현 완료 (`TasksPage.tsx`, `tasks` 테이블, 4개 핸들러). 남은 작업은 `/tasks/$taskId` 상세 라우트 placeholder 해소.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx` (taskDetailRoute)
  - 신규: `src/renderer/src/components/pages/TaskDetailPage.tsx`
- **완료 조건**: 태스크 개별 상세 뷰 (제목, 체크리스트, 연결 이슈, 완료 토글)

### HYDRA-014: 프로젝트 설정 페이지

- **비용**: M
- **우선순위**: 🟡 Medium
- **설명**: `/projects/$projectId/settings` 라우트가 TempComponent (routes.tsx:111, 117). 프로젝트명/설명 수정, 멤버 관리, 라벨 관리, 삭제 등.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx:111`
  - 신규: `ProjectSettingsPage.tsx`
- **선행 작업**: HYDRA-005
- **완료 조건**: 프로젝트 정보 수정, 위험 영역(삭제) 확인 다이얼로그

### ~~HYDRA-015: 리치 텍스트 에디터 (EditorJS)~~ ✅ 완료

- **비용**: M
- **우선순위**: 🟡 Medium
- **상태**: ✅ 완료 (Tiptap 통합, `RichTextEditor` 컴포넌트가 이슈 설명/댓글에서 사용 중 — `IssueDetailPage.tsx:288, 335`)
- **설명**: `HomePage.tsx:239`에 "EditorJS 기능은 업데이트 예정" 언급. 이슈 설명, 댓글에 마크다운/리치 텍스트 지원.
- **관련 파일**:
  - 이슈 생성/상세 다이얼로그
  - 댓글 컴포넌트
- **선행 작업**: HYDRA-007
- **완료 조건**: EditorJS 또는 Tiptap 통합, 이슈 설명/댓글에서 서식 편집 가능

---

## 🟢 Low

### HYDRA-016: 마일스톤/스프린트

- **비용**: L
- **우선순위**: 🟢 Low
- **설명**: 마일스톤 테이블 생성, 이슈에 마일스톤 연결, 진행률 트래킹 대시보드.
- **완료 조건**: 마일스톤 CRUD, 이슈 연결, 번다운 차트

### ~~HYDRA-017: 이슈 관계 (의존성/블로킹)~~ ✅ 완료

- **비용**: M
- **우선순위**: 🟢 Low
- **상태**: ✅ 완료 (commit 382e9f5 — `issue_relations` 테이블 + 3개 핸들러(List/Create/Delete) + 이슈 상세 페이지 관계 UI(blocks/is_blocked_by/relates_to))
- **설명**: 이슈 간 관계 (blocks, is blocked by, relates to) 조인 테이블 + UI.
- **완료 조건**: 이슈 상세에서 관련 이슈 추가/표시, 의존성 그래프

### ~~HYDRA-018: 알림 시스템~~ ✅ 완료

- **비용**: L
- **우선순위**: 🟢 Low
- **상태**: ✅ 완료 (commit 62b9393 — `notifications` 테이블 + 5개 핸들러 + `NotificationsPage` + 읽음 상태/unread count)
- **설명**: 인앱 알림 (담당 이슈 변경, 댓글 멘션, 마감 임박 등). Electron notification API 활용.
- **완료 조건**: 알림 벨 아이콘, 알림 목록, 읽음 처리, OS 네이티브 알림

### ~~HYDRA-019: 서비스 인테그레이션 (1차)~~ ✅ 부분 완료

- **상태**: ✅ 부분 완료 (commit 90a328f — Slack 웹훅 저장 + 테스트 전송, GitHub 토큰 저장 UI 구현)
- **남은 작업**: HYDRA-019a / 019b 참조.

### HYDRA-019a: Slack 이벤트 훅

- **비용**: M
- **우선순위**: 🟢 Low
- **설명**: 이슈 생성/변경/담당자 변경 등 이벤트를 저장된 Slack 웹훅으로 전송.
- **관련 파일**:
  - `src/main/handler/issues/*Handler.ts` (이벤트 훅 포인트)
  - `src/main/handler/integrations/` (기존 웹훅 저장/테스트)
- **완료 조건**: 설정 가능한 이벤트 필터 + 실제 채널로 전송 확인

### HYDRA-019b: GitHub OAuth 및 양방향 이슈 동기화

- **비용**: XL
- **우선순위**: 🟢 Low
- **설명**: 기존 토큰 저장에서 OAuth로 업그레이드. GitHub 이슈를 Hydra로 import, Hydra 이슈 상태 변경을 GitHub로 반영.
- **완료 조건**: OAuth 플로우, 양방향 동기화, 충돌 해결 정책

### HYDRA-020: 벌크 작업

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: 이슈 테이블에서 다중 선택 → 일괄 상태 변경, 담당자 변경, 삭제.
- **관련 파일**:
  - `src/renderer/src/components/organisms/issues/IssueTable.tsx`
  - `src/main/handler/issues/UpdateIssueHandler.ts`
- **구현 가이드**:
  1. **백엔드**: `ISSUE_BULK_UPDATE` IPC 채널 추가 — `{ issueIds: string[], updates: { issueStatus?, issuePriority?, assignedTo? } }` → `IssueRecord[]`
  2. **핸들러**: `BulkUpdateIssueHandler` — issueIds를 순회하며 repos.issues.update() 호출 (트랜잭션 래핑)
  3. **프론트엔드**: IssueTable에 체크박스 컬럼 추가 (TanStack Table의 `enableRowSelection`), 선택된 행 수 표시
  4. **벌크 액션 바**: 선택 시 상단에 플로팅 바 표시 — "Change Status", "Assign To", "Delete" 드롭다운
  5. **확인 다이얼로그**: 삭제 시 `ISSUE_BULK_DELETE` 채널 별도 생성 (또는 개별 DELETE 순회)
- **완료 조건**: 체크박스 다중 선택, 벌크 액션 드롭다운, 확인 다이얼로그

### HYDRA-021: 이슈 Due Date / 시간 추적

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: 이슈 스키마에 `due_date`, `estimated_hours`, `actual_hours` 필드 추가. 캘린더 뷰 고려.
- **관련 파일**:
  - `src/main/core/database/schema/drizzle/schema.ts` (issues 테이블 컬럼 추가)
  - `src/main/core/database/repository/interfaces/IssueRepository.ts` (IssueRecord 타입 확장)
  - `src/renderer/src/components/pages/IssueDetailPage.tsx` (사이드바에 필드 추가)
- **구현 가이드**:
  1. **스키마**: issues 테이블에 `issue_due_date: timestamp`, `issue_estimated_hours: integer`, `issue_actual_hours: integer` 컬럼 추가
  2. **타입 확장**: IssueRecord, CreateIssueData, UpdateIssueData에 새 필드 추가. CreateIssueParams, UpdateIssueParams도 확장
  3. **리포지토리**: DrizzleIssueRepository의 create/update에서 새 필드 매핑
  4. **프론트엔드 (IssueDetailPage)**: 사이드바에 Due Date (date input), Estimated Hours (number input), Actual Hours (number input) 필드 추가
  5. **시각적 경고**: due_date가 지났으면 빨간색 배지 표시, 3일 이내면 노란색
  6. **이슈 테이블**: due_date 컬럼 추가, 마감 임박/초과 시 색상 표시
- **완료 조건**: 이슈에 마감일/예상시간 설정, 초과 시 시각적 경고

### HYDRA-022: 다크모드 / 테마 시스템

- **비용**: S
- **우선순위**: 🟢 Low
- **상태**: ✅ 부분 완료 (commit 3457003 — next-themes + CSS 변수 기반 토글 구현됨)
- **설명**: Tailwind CSS v4 기반 다크/라이트 모드 전환. 사용자 설정 저장.
- **남은 작업**:
  1. 전체 컴포넌트 다크모드 감사 — `dark:` variant 누락된 컴포넌트 확인 및 수정
  2. 차트 컴포넌트 (Recharts) 다크모드 색상 대응
  3. RichTextEditor (Tiptap) prose 스타일 다크모드 검증
  4. Dialog/Sheet 오버레이 색상 다크모드 확인
- **완료 조건**: 테마 토글, 시스템 설정 연동, 전체 컴포넌트 다크모드 대응

### HYDRA-023: /my-issues 페이지 구현

- **비용**: S
- **우선순위**: 🟠 High
- **설명**: 현재 `/my-issues` 라우트가 TempComponent placeholder. 로그인 사용자에게 할당된 이슈 목록 표시.
- **관련 파일**: `src/renderer/src/routers/routes.tsx:124`, 신규 `MyIssuesPage`
- **완료 조건**: 담당 이슈 목록 + 상태별 그룹핑 + 이슈 상세로 이동

### HYDRA-024: 알림 환경설정 UI

- **비용**: S
- **우선순위**: 🟡 Medium
- **설명**: `/settings/notifications` placeholder. 알림 카테고리별 on/off 토글, 데스크톱 알림 활성화 여부.
- **관련 파일**: `src/renderer/src/routers/routes.tsx:163`

### HYDRA-025: 프로젝트 설정 상세 서브라우트 정리

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: `/projects/$projectId/settings/$settingId` placeholder. ProjectSettingsPage 내부 탭으로 충분한지부터 판단 후, 불필요하면 라우트 제거, 필요하면 페이지 신설.
- **관련 파일**: `src/renderer/src/routers/routes.tsx:117`

### HYDRA-026: 마일스톤 진행률 위젯

- **비용**: M
- **우선순위**: 🟡 Medium
- **설명**: `milestones` 테이블 + CRUD는 있으나 진행률 시각화 없음. ProjectDetailPage 또는 HomePage에 번다운/진행률 차트.
- **관련 파일**: `src/renderer/src/components/pages/ProjectDetailPage.tsx`, `HomePage.tsx`

### HYDRA-027: SettingsLayout 네비게이션 구현

- **비용**: S
- **우선순위**: 🟠 High
- **설명**: `/settings/*` 하위 라우트(account, members, notifications, integrations)가 직접 URL로만 접근 가능. 사이드바/탭 내비게이션 추가.
- **관련 파일**: `src/renderer/src/components/layouts/SettingsLayout.tsx`
- **완료 조건**: 활성 라우트 하이라이팅, 4개 링크 렌더

### HYDRA-028: 프로젝트 스코프 멤버 조회 IPC 핸들러

- **비용**: S
- **우선순위**: 🟠 High
- **설명**: 현재 `CreateIssueDialog` 등 여러 곳에서 전역 `AUTH_LIST_USERS`를 사용 중. 프로젝트 멤버만 필터링해야 정확한 담당자 드롭다운이 된다. `users_projects_link` 기반 `ListProjectMembersHandler` 추가.
- **관련 파일**:
  - 신규: `src/main/handler/projects/ListProjectMembersHandler.ts`
  - 수정: `CreateIssueDialog.tsx`의 TODO 주석 해소
- **완료 조건**: `ISSUE_CREATE` / `ISSUE_UPDATE` 담당자 드롭다운이 프로젝트 멤버만 표시

### HYDRA-029: Biome lint 일괄 청소

- **비용**: S
- **우선순위**: 🟡 Medium
- **설명**: (2026-06-14 갱신) `pnpm lint`(=`biome check --write`) 자동 수정 후 **0 error / 27 warning** 잔존. 주 대상: `useExhaustiveDependencies`(CreateIssueDialog/IssueDetailsDialog 등), 배열 index key, renderer a11y. 진짜 미해결은 이 27 warning이다.
- **⚠️ 주의**: `pnpm lint`는 `--write`라 **파일을 자동 수정**한다(읽기 전용 확인은 `pnpm exec biome check .`). read-only 모드는 줄바꿈(CRLF↔LF) 불일치 때문에 다수 "error"를 보고하나 이는 자동 수정 대상 아티팩트로 27 warning과 별개다.
- **관련 파일**: 다수 — `pnpm exec biome check .` 리포트 기준
- **완료 조건**: 경고 10건 이하 (auto-fixable 포맷/줄바꿈은 `pnpm lint`가 처리)

---

## 🆕 신규 발견 (2026-06-14 코드 감사)

> 직접 코드 확인으로 검증된 미기록 항목. M4(출시) 전 처리 권장 순.

### HYDRA-030: 🐛 [데이터 손실] 프로젝트 설명 저장 누락

- **비용**: S (한 줄)
- **우선순위**: 🟠 High
- **설명**: `UpdateProjectHandler.handler`가 `repos.projects.update`에 `projectName`/`modifiedBy`만 전달, **`projectDesc`를 누락**(`UpdateProjectHandler.ts:15-18`). `ProjectSettingsPage`는 `projectDesc`를 전송하고(`ProjectSettingsPage.tsx:30`), `UpdateProjectParams`·`DrizzleProjectRepository.update`(`project_desc` 세팅)는 모두 지원하므로, 핸들러에서 `projectDesc: params.projectDesc`만 넘기면 해결. 현재는 "Project updated" toast가 떠도 설명이 저장되지 않는 사일런트 실패.
- **완료 조건**: 프로젝트 설명 수정이 DB에 반영, 회귀 테스트 추가

### HYDRA-031: dead code — `stores/issue.ts` 삭제

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: React Query 이관(PR #79) 후 `stores/issue.ts`(`useIssueStore`)를 import하는 컴포넌트가 0개. `stores/project.ts`가 #81에서 삭제된 것과 동일하게 정리 대상. localStorage 잔존 키도 함께 정리.
- **완료 조건**: 파일 삭제 + 미사용 `types/issue.ts` 항목 정리, 빌드/테스트 통과

### HYDRA-032: CreateIssueDialog 리치 텍스트 일관화 + stale 문구 제거

- **비용**: S
- **우선순위**: 🟡 Medium
- **설명**: `CreateIssueDialog`는 평문 `Textarea` + "EditorJS 기능 업데이트 예정"(i18n `issue.help.editorNote`) 유지 중. `IssueDetailPage`는 이미 Tiptap `RichTextEditor` 사용. 생성 플로우도 `RichTextEditor`로 통일하거나 최소한 오해 소지 있는 안내문 제거.
- **관련 파일**: `CreateIssueDialog.tsx:254-261`, `locales/{en,ko}/issue.json:29`
- **완료 조건**: 생성/상세 에디터 일관, stale 문구 제거

### HYDRA-033: GitHub 인테그레이션 — sync 로직 부재 (토큰만 저장)

- **비용**: L · **우선순위**: 🟢 Low (v1.1+, HYDRA-019b와 연계)
- **설명**: `IntegrationPage`가 GitHub 토큰 + `owner/repo`를 저장하고 카드에 "issue synchronization"이라 광고하지만, `src/main`에 동기화 핸들러/클라이언트/잡이 전무. 저장만 되고 사용되지 않는 stub. v1.0.0에서는 UI 문구를 실제 범위에 맞게 조정(또는 "coming soon" 표기)하고, 실제 동기화는 v1.1+로.
- **완료 조건**: (v1.0) 과장된 카피 정정 / (v1.1) GitHub API 클라이언트 + 이슈 매핑 + 동기화 트리거

---

## 요약 로드맵

| 단계 | 티켓 | 예상 기간 |
|------|------|----------|
| **Phase 1: 크리티컬 버그** | BUG-001, BUG-002 | ~2일 |
| **Phase 2: 핵심 연결** | HYDRA-002, 004, 028 | ~1주 |
| **Phase 3: 상세 페이지/접근성** | HYDRA-005, 006, 008b, 023, 027 | ~2주 |
| **Phase 4: 협업/테스트** | HYDRA-009, 011, 012, 029 | ~3주 |
| **Phase 5: 완성도** | HYDRA-013, 014, 024, 026 | ~2주 |
| **Phase 6: 고도화** | HYDRA-016, 019a/b, 020, 021, 022, 025 | 장기 |

---

## 의존성 그래프

```
BUG-001, BUG-002 — 모든 기능 작업의 사전 조건 (새로고침 에러 / 접속 에러 처리)

HYDRA-002 (이슈 생성 API) — 착수 가능
HYDRA-004 (홈 실데이터) — 착수 가능
HYDRA-005 (프로젝트 상세 감사) → HYDRA-014 (프로젝트 설정)
HYDRA-006 (이슈 상세 감사) → HYDRA-009 (파일 첨부 UI)
HYDRA-011 (서버 필터) — 착수 가능
HYDRA-023 (/my-issues) — 착수 가능
HYDRA-027 (SettingsLayout 네비) → 기존 /settings/* 라우트들의 접근성 개선
HYDRA-002 → HYDRA-028 (프로젝트 멤버 IPC; 담당자 드롭다운 품질 개선)

독립:
- HYDRA-008b, 012, 013, 016, 019a/b, 020, 021, 022, 024, 025, 026, 029
```
