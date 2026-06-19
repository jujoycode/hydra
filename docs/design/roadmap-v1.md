# Hydra 프로젝트 로드맵: v1.0 오픈소스 출시까지

> ⚠️ **이 문서는 장기 비전/참고용이며, 일부 내용이 현실과 어긋난다(작성 시점 기준).**
> v1.0.0 마일스톤의 **기준 문서는 [`docs/project/milestones-v1.md`](../project/milestones-v1.md)** 다.
> 여기 Phase 1~6 중 다수는 이미 구현됐고(2026-06-13 코드 감사 기준), 멀티 DBMS와 인증 재설계는 반영돼 있지 않다.
> "v1.1+ 고려 사항"과 리스크 섹션의 장기 비전은 여전히 참고 가치가 있다.

## Context

Hydra는 현재 약 40-50% 완성도의 Electron 기반 프로젝트 및 이슈 관리 데스크톱 앱이다. 기본 CRUD(프로젝트, 이슈, 멤버, 워크스페이스)와 대시보드는 구현되어 있으나 협업 기능(코멘트, 알림), 고급 뷰(칸반), 외부 연동(GitHub), 테스트 커버리지는 아직 없다. 5-20명 규모 팀을 타깃으로 조만간 오픈소스로 공개하는 것을 목표로 한다.

**차별화 포인트:** 셀프 호스팅, 자체 PostgreSQL, 경량 데스크톱 앱, 데이터 소유권

---

## v1.0 정의

Linear/Plane 대비 **가볍고 심플한 셀프호스팅 이슈 트래커**로서 최소 조건:

1. 이슈 전체 라이프사이클 (생성→코멘트→상태변경→완료) 동작
2. 테이블 뷰 + 칸반 보드 2가지 뷰
3. 리치 텍스트 에디터 (이슈 설명 + 코멘트)
4. 협업 기초: 코멘트, 활동 로그, 내 이슈, 인앱 알림
5. 글로벌 검색 (Cmd+K)
6. 웹훅 시스템 (외부 서비스 연동 기반)
7. 오픈소스 필수: README(스크린샷), CONTRIBUTING.md, LICENSE, 테스트 50%+
8. 플레이스홀더 페이지 제거, 에러 바운더리, 로딩/빈 상태 처리

**v1.0에 포함하지 않는 것:** GitHub/GitLab 연동, Slack 통합, 스프린트, 시간 추적, 오프라인 싱크, 데이터 내보내기

---

## Phase 1: 코어 루프 완성 (3-4주)

**목표:** 모든 기존 페이지가 실제 데이터로 동작하게 한다. UI 데드엔드를 제거하고 리치 텍스트 기반을 마련한다.

### 기능
- **리치 텍스트 에디터** — Tiptap (ProseMirror 기반) 도입. 이슈 설명과 코멘트에 적용. 지원 기능: 마크다운 단축키, 헤딩, 볼드/이탤릭, 코드 블록, 리스트, 링크, 이미지 인라인. DB에는 HTML 또는 JSON(Tiptap native) 형식으로 저장
  - Tiptap 선택 이유: 헤드리스 UI (shadcn/ui와 자연스러운 통합), React 공식 지원, 확장성, 마크다운 입력 호환
  - 신규 atom 컴포넌트: `RichTextEditor.tsx` (편집 모드), `RichTextViewer.tsx` (읽기 모드)
  - 이슈 `description` 컬럼: 기존 text → HTML/JSON 저장으로 전환 (기존 plain text는 마이그레이션 불필요, 그대로 렌더링 가능)
- **코멘트 UI** — IssueDetailPage에 코멘트 리스트/작성/수정/삭제 (백엔드는 이미 구현됨). 리치 텍스트 에디터 사용
- **내 이슈 페이지** — `/my-issues` 라우트 구현. 현재 사용자에게 할당된 이슈를 프로젝트별로 표시
- **CreateIssueDialog API 연결** — 폼은 있으나 `window.callApi` 연결 필요. 설명 필드에 리치 텍스트 에디터 적용
- **프로젝트 설정 페이지** — `/projects/$projectId/settings` 구현 (이름/설명 수정, 삭제)

### 인프라
- 레이아웃 레벨 에러 바운더리 추가
- **UI 텍스트 영문 통일** (사이드바 한국어 → 영어, 차트 라벨 등)
- `use-comments.ts` 훅 (기존 `use-project.ts` 패턴 따름)

### 핵심 파일
- 신규: `components/atoms/editor/RichTextEditor.tsx`, `RichTextViewer.tsx`
- 신규: `components/organisms/comments/CommentList.tsx`, `CommentForm.tsx`
- 신규: `hooks/use-comments.ts`
- 수정: `pages/IssueDetailPage.tsx` (리치 텍스트 + 코멘트 섹션)
- 수정: `pages/IssuePage.tsx` (CreateIssueDialog 연결)
- 수정: `routers/routes.tsx`, `organisms/sidebars/AppSidebar.tsx`

### 패키지 추가
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-code-block-lowlight`

---

## Phase 2: 라벨, 필터링, 활동 로그 (2-3주)

**목표:** 이슈 분류 체계와 변경 이력 추적을 갖춘다. 알림과 웹훅의 전제 조건을 구축한다.

### 기능
- **라벨 시스템** — `labels` + `issues_labels_link` 테이블, CRUD, 프로젝트별 라벨 관리, 이슈에 다중 라벨
- **활동 로그** — `activity_log` 테이블 (entity_type, action, actor_id, metadata jsonb). 이슈 상태/담당자 변경, 코멘트 생성 시 자동 기록. IssueDetailPage에 타임라인 표시
- **서버사이드 필터링** — IssueRepository에 필터 파라미터 (status, priority, assignee, label) 확장

### 인프라
- 테스트 커버리지 30% 달성: 밸리데이터, 핵심 핸들러, 레포지토리 테스트
- CI에 coverage threshold 추가
- Drizzle 마이그레이션 워크플로 문서화

### 스키마 추가
```
labels: label_id(uuid PK), project_id(FK), label_name, label_color, created_at
issues_labels_link: link_id(uuid PK), issue_id(FK), label_id(FK)
activity_log: log_id(uuid PK), entity_type, entity_id, action, actor_id(FK), metadata(jsonb), created_at
```

---

## Phase 3: 칸반 보드 & 알림 (2-3주)

**목표:** 가장 눈에 띄는 시각적 기능인 칸반과 협업 백본인 알림을 구현한다.

### 기능
- **칸반 보드** — 프로젝트 이슈 뷰에 상태별 컬럼, 드래그&드롭으로 상태 변경 (`@dnd-kit/core` 사용). 기존 `ISSUE_UPDATE` IPC 재활용
- **인앱 알림** — `notifications` 테이블. 이슈 할당/코멘트/상태변경 시 생성. 사이드바 벨 아이콘 + 알림 페이지
- **뷰 토글** — 테이블/칸반 전환, localStorage에 선호도 저장

### 인프라
- Electron 네이티브 알림 연동
- 테스트 커버리지 40%
- 키보드 단축키 기반 구축 (Cmd+K placeholder, Escape)

---

## Phase 4: 검색, 이슈 관계, 웹훅 (3-4주)

**목표:** 파워유저 기능과 외부 연동 기반을 마련한다. 10명 이상 팀에서도 효율적으로 쓸 수 있게 한다.

### 기능
- **글로벌 검색 (Cmd+K)** — shadcn/ui Command 컴포넌트 기반. 프로젝트+이슈 통합 검색. `SEARCH_GLOBAL` IPC 채널
- **이슈 관계** — `issue_relations` 테이블 (blocks/blocked_by/relates_to). IssueDetailPage에 관련 이슈 표시/추가
- **벌크 작업** — 이슈 테이블 체크박스 선택, 일괄 상태/담당자 변경, 삭제. `ISSUE_BULK_UPDATE` IPC
- **이슈 마감일** — `issue_due_date` 컬럼, 날짜 선택기, 초과 시각적 표시
- **웹훅 시스템** — 외부 서비스에 이벤트 알림을 전송하는 기반 구축
  - `webhooks` 테이블: webhook_id, project_id(FK), webhook_url, webhook_secret(HMAC 서명용), events(jsonb — 구독할 이벤트 목록), is_active, created_at, updated_at
  - `webhook_logs` 테이블: log_id, webhook_id(FK), event_type, payload(jsonb), response_status, response_body, delivered_at
  - 지원 이벤트: `issue.created`, `issue.updated`, `issue.deleted`, `issue.status_changed`, `comment.created`, `project.created`, `project.updated`
  - 활동 로그(Phase 2)를 이벤트 소스로 활용 — 활동 기록 시 등록된 웹훅에 HTTP POST 전송
  - Main process에 `WebhookDispatcher` 서비스: 이벤트 큐잉, 재시도 (3회, exponential backoff), HMAC-SHA256 서명 (`X-Hydra-Signature` 헤더)
  - 프로젝트 설정 페이지에 웹훅 관리 UI: URL 등록, 이벤트 선택, 시크릿 키 생성, 활성화/비활성화, 최근 전송 로그 확인
  - IPC 채널: `WEBHOOK_CREATE`, `WEBHOOK_LIST`, `WEBHOOK_UPDATE`, `WEBHOOK_DELETE`, `WEBHOOK_TEST` (테스트 ping 전송), `WEBHOOK_LOGS`

### 인프라
- 구조화된 로깅 (main process)
- 테스트 커버리지 50%
- CONTRIBUTING.md, CODE_OF_CONDUCT.md 초안

### 스키마 추가
```
issue_relations: relation_id(uuid PK), source_issue_id(FK), target_issue_id(FK), relation_type(varchar), created_at
issues: + issue_due_date(timestamp nullable)
webhooks: webhook_id(uuid PK), project_id(FK), webhook_url, webhook_secret, events(jsonb), is_active(boolean), created_at, updated_at
webhook_logs: log_id(uuid PK), webhook_id(FK), event_type, payload(jsonb), response_status(int), response_body(text), delivered_at
```

### 핵심 파일
- 신규: `src/main/core/webhook/WebhookDispatcher.ts` — 이벤트 수신, 큐잉, HTTP 전송, 재시도
- 신규: `src/main/handler/webhook/` — CRUD + Test + Logs 핸들러
- 신규: `src/main/core/database/repository/interfaces/WebhookRepository.ts`
- 신규: `src/main/core/database/repository/drizzle/DrizzleWebhookRepository.ts`
- 신규: `src/renderer/src/components/organisms/settings/WebhookSettings.tsx`
- 수정: `src/main/core/database/RepositoryContainer.ts` — webhookRepo 추가

---

## Phase 5: 오픈소스 출시 준비 (2-3주)

**목표:** 공개 배포에 필요한 문서와 패키징, 잔여 페이지를 완성한다.

### 기능
- **마일스톤** — `milestones` 테이블, 이슈→마일스톤 연결, 프로젝트 상세에 진행률 바
- **설정 페이지 완성** — 알림 설정, 멤버 관리 설정
- **태스크 결정** — 이슈 내 서브태스크(체크리스트)로 구현 or 독립 라우트 제거

### 인프라
- README 리라이트: 스크린샷/GIF, 기능 목록, Quick Start, 아키텍처
- CONTRIBUTING.md 완성, LICENSE (MIT 추천)
- GitHub Actions 릴리즈 워크플로 (tag push → Electron Forge → 3 플랫폼 인스톨러)
- Docker compose 개선 (개발 환경 포함)
- UI 문자열 영문 최종 감사

---

## Phase 6: 폴리시 & v1.0 태그 (2주)

**목표:** 버그 없고 쾌적한 경험을 만든다. v1.0.0를 릴리즈한다.

### 기능
- 키보드 단축키 완성 (Cmd+K, Cmd+N, Escape, 칸반 화살표)
- 모든 뷰에 의미 있는 빈 상태 + CTA
- 스켈레톤 로더 통일
- 토스트/피드백 일관성 감사

### 인프라
- **HomePage N+1 쿼리 해결** — 대시보드 전용 집계 IPC 채널
- 통합 테스트 (워크스페이스 연결 → 이슈 CRUD 플로우)
- Electron auto-updater 설정
- **v1.0.0 태그, GitHub Release 생성**

---

## 의존성 흐름

```
Phase 1 (코어 루프 + 리치 텍스트)
  └─ 리치 텍스트 에디터, 코멘트 UI, 내 이슈, 프로젝트 설정, 영문 통일
      │
Phase 2 (라벨 + 활동 로그)  ← Phase 1 필요 (코멘트가 활동 로그의 주요 이벤트)
  └─ 라벨, 활동 로그, 서버사이드 필터링
      │
Phase 3 (칸반 + 알림)  ← Phase 2 필요 (활동 로그가 알림의 기반)
  └─ 칸반 보드, 알림, 뷰 토글
      │
Phase 4 (검색 + 관계 + 웹훅)  ← Phase 2 필요 (활동 로그가 웹훅 이벤트 소스)
  └─ 글로벌 검색, 이슈 관계, 벌크 작업, 마감일, 웹훅
      │
Phase 5 (OSS 준비)  ← Phase 4 완료 후 기능 동결
  └─ 마일스톤, 설정 완성, 문서, 릴리즈 자동화
      │
Phase 6 (폴리시)  ← Phase 5 완료 후 마지막 다듬기
  └─ 단축키, 빈 상태, 성능, v1.0.0 태그
```

---

## v1.0 이후 (v1.1+) 고려 사항

- **GitHub/GitLab 연동** — 이슈 동기화, 커밋/PR 연결 (웹훅 인프라 활용)
- **Slack 통합** — 웹훅 기반 Slack 알림 또는 Slack Incoming Webhook 연동
- **고급 권한** — 프로젝트별 역할, 커스텀 권한
- **오프라인 퍼스트** — CRDT 또는 이벤트 소싱 기반 오프라인 동기화
- **스프린트/시간 추적** — 본격적인 프로젝트 관리
- **데이터 내보내기** — CSV, JSON 백업
- **i18n** — 다국어 지원 (한국어, 일본어 등)
- **플러그인 시스템** — 커스텀 필드, 커스텀 워크플로
- **웹훅 확장** — Incoming 웹훅 (외부→Hydra), OAuth2 인증, 웹훅 템플릿

---

## 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| HomePage N+1 쿼리 | 20+ 프로젝트에서 성능 저하 | Phase 6에서 집계 쿼리로 전환 |
| "오프라인 퍼스트" 표현 | README와 실제 불일치 | v1.0에서 "셀프호스팅 데스크톱 앱"으로 변경 |
| 한/영 혼재 UI | OSS 기여자 혼란 | Phase 1에서 영문 통일 |
| 테스트 1개 | 회귀 버그 위험 | 매 Phase마다 커버리지 게이트 |
| 태스크 라우트 미구현 | 사용자 데드엔드 | Phase 5에서 서브태스크 or 라우트 제거 결정 |
| 리치 텍스트 복잡도 | Tiptap 학습곡선 + 번들 크기 증가 | starter-kit 기반 최소 확장, 필요시 lazy load |
| 웹훅 보안 | 외부 URL 호출 시 SSRF 위험 | private IP 차단, URL 검증, HMAC 서명 필수 |

---

## 예상 일정

| Phase | 기간 | 누적 |
|-------|------|------|
| Phase 1: 코어 루프 + 리치 텍스트 | 3-4주 | 4주 |
| Phase 2: 라벨 + 활동 로그 | 2-3주 | 7주 |
| Phase 3: 칸반 + 알림 | 2-3주 | 10주 |
| Phase 4: 검색 + 관계 + 웹훅 | 3-4주 | 14주 |
| Phase 5: OSS 준비 | 2-3주 | 17주 |
| Phase 6: 폴리시 + v1.0 | 2주 | 19주 |

**총 약 5개월** (솔로 개발자 기준, 풀타임이 아닌 경우 7-9개월)
