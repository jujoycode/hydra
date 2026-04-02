# Hydra Backlog Tickets

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

### HYDRA-007: 댓글/활동 로그 시스템

- **비용**: L
- **우선순위**: 🟠 High
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

### HYDRA-010: 라벨/태그 시스템

- **비용**: M
- **우선순위**: 🟡 Medium
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

### HYDRA-013: Tasks 페이지 구현

- **비용**: L
- **우선순위**: 🟡 Medium
- **설명**: `/projects/$projectId/tasks` 및 `/tasks/$taskId` 라우트가 TempComponent. 이슈 하위 태스크(체크리스트) 또는 독립 태스크 시스템 설계 필요.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx:98, 104`
  - DB 스키마 확장 (tasks 테이블)
  - 신규: 페이지, 핸들러, 리포지토리
- **완료 조건**: 태스크 CRUD, 이슈 연결, 체크리스트 UI

### HYDRA-014: 프로젝트 설정 페이지

- **비용**: M
- **우선순위**: 🟡 Medium
- **설명**: `/projects/$projectId/settings` 라우트가 TempComponent (routes.tsx:111, 117). 프로젝트명/설명 수정, 멤버 관리, 라벨 관리, 삭제 등.
- **관련 파일**:
  - `src/renderer/src/routers/routes.tsx:111`
  - 신규: `ProjectSettingsPage.tsx`
- **선행 작업**: HYDRA-005
- **완료 조건**: 프로젝트 정보 수정, 위험 영역(삭제) 확인 다이얼로그

### HYDRA-015: 리치 텍스트 에디터 (EditorJS)

- **비용**: M
- **우선순위**: 🟡 Medium
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

### HYDRA-017: 이슈 관계 (의존성/블로킹)

- **비용**: M
- **우선순위**: 🟢 Low
- **설명**: 이슈 간 관계 (blocks, is blocked by, relates to) 조인 테이블 + UI.
- **완료 조건**: 이슈 상세에서 관련 이슈 추가/표시, 의존성 그래프

### HYDRA-018: 알림 시스템

- **비용**: L
- **우선순위**: 🟢 Low
- **설명**: 인앱 알림 (담당 이슈 변경, 댓글 멘션, 마감 임박 등). Electron notification API 활용.
- **완료 조건**: 알림 벨 아이콘, 알림 목록, 읽음 처리, OS 네이티브 알림

### HYDRA-019: 서비스 인테그레이션 (GitHub/Slack)

- **비용**: XL
- **우선순위**: 🟢 Low
- **설명**: `IntegrationPage.tsx`에 GitHub/Slack 카드가 disabled 상태. OAuth 연동, 이슈 동기화, 슬랙 알림 등.
- **완료 조건**: GitHub 이슈 양방향 동기화, Slack 웹훅 알림

### HYDRA-020: 벌크 작업

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: 이슈 테이블에서 다중 선택 → 일괄 상태 변경, 담당자 변경, 삭제.
- **관련 파일**:
  - `src/renderer/src/components/organisms/issues/IssueTable.tsx`
- **완료 조건**: 체크박스 다중 선택, 벌크 액션 드롭다운, 확인 다이얼로그

### HYDRA-021: 이슈 Due Date / 시간 추적

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: 이슈 스키마에 `due_date`, `estimated_hours`, `actual_hours` 필드 추가. 캘린더 뷰 고려.
- **완료 조건**: 이슈에 마감일/예상시간 설정, 초과 시 시각적 경고

### HYDRA-022: 다크모드 / 테마 시스템

- **비용**: S
- **우선순위**: 🟢 Low
- **설명**: Tailwind CSS v4 기반 다크/라이트 모드 전환. 사용자 설정 저장.
- **완료 조건**: 테마 토글, 시스템 설정 연동, 전체 컴포넌트 다크모드 대응

---

## 요약 로드맵

| 단계 | 티켓 | 예상 기간 |
|------|------|----------|
| **Phase 1: 핵심 연결** | ~~HYDRA-001~~ ✅ → 002 → ~~003~~ ✅ → 004 | ~2주 (진행 중) |
| **Phase 2: 상세 페이지** | HYDRA-005, 006, 008, 009 | ~2주 |
| **Phase 3: 협업 기능** | HYDRA-007, 010, 012 | ~3주 |
| **Phase 4: 완성도** | HYDRA-011, 013, 014, 015 | ~3주 |
| **Phase 5: 고도화** | HYDRA-016 ~ 022 | 장기 |

---

## 의존성 그래프

```
HYDRA-001 ✅ (List/Get 핸들러) — 완료
├── HYDRA-002 (이슈 생성 API 연결) — 선행 완료, 착수 가능
├── HYDRA-004 (홈페이지 실데이터) — 선행 완료, 착수 가능
├── HYDRA-005 (프로젝트 상세) — 선행 완료, 착수 가능
│   └── HYDRA-014 (프로젝트 설정)
├── HYDRA-006 (이슈 상세) — 선행 완료, 착수 가능
│   ├── HYDRA-007 (댓글/활동 로그)
│   │   └── HYDRA-015 (리치 텍스트 에디터)
│   └── HYDRA-009 (파일 첨부 UI)
└── HYDRA-011 (서버사이드 필터링) — 선행 완료, 착수 가능

HYDRA-003 ✅ (Issue Store) — 완료
└── HYDRA-006 (이슈 상세) — 선행 모두 완료, 착수 가능

독립 작업:
├── HYDRA-008 (멤버 관리 UI)
├── HYDRA-010 (라벨/태그)
├── HYDRA-012 (테스트 커버리지)
├── HYDRA-013 (Tasks 페이지)
└── HYDRA-016 ~ 022 (고도화)
```
