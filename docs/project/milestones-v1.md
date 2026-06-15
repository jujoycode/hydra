# Hydra 마일스톤: v1.0.0 OSS 출시

> 최종 재정립: 2026-06-13 · 현행화: 2026-06-15 | 기준 브랜치: `main` | 목표: v1.0.0 오픈소스 출시(+ 인스톨러 릴리즈)
> 이 문서는 **v1.0.0 마일스톤의 단일 기준(canonical)** 이다.
> `docs/design/roadmap-v1.md`(장기 비전)와 `docs/project/backlog.md`(티켓)는 이 문서에 종속된다.
> **다음 버전(v1.1.0)의 기준은 [`docs/project/milestones-v1.1.md`](./milestones-v1.1.md)** 이다.
>
> **2026-06-15 현황 요약: M1·M2·M3 완료(코드 확인). 남은 마일스톤은 M4(OSS 출시 & 릴리즈)뿐이며, 릴리즈 인프라도 대부분 완성 — 남은 디자인 디테일 마감, E2E 스모크 테스트, README 스크린샷/GIF, UI 영문 최종 감사, `v1.0.0` 태그/Release 발행이 출시 게이트(현재 git 태그 0개).**

## 배경 — 왜 재정립했나

2026-06 멀티 DBMS + 인증 재설계 작업(Phase 1~5, PR #27~#32)이 `main`으로 승격되면서, 기존 로드맵
문서들(`roadmap-v1.md`, 직전 `milestones-v1.md`)이 현실과 크게 어긋났다. 2026-06-13 **실제 코드 감사**로
ground truth를 확정한 결과, 프로젝트는 문서가 기술하던 것보다 훨씬 앞서 있었다.

## 현황 — 코드 감사 ground truth (2026-06-14 갱신)

### ✅ 완료 (코드 확인)
- **기반**: 멀티 DBMS(PostgreSQL + MySQL 8), 2단계 인증(워크스페이스 연결 + scrypt 로그인 + 세션), 실제 마이그레이터, 트랜잭션 무결성
- **코어 루프 (M1)**: 이슈/프로젝트 CRUD, 홈 대시보드(실데이터), 프로젝트 상세/설정, My Issues(실 API) — **`IssuePage`도 `ISSUE_LIST` 실 API로 전환 완료(더미 제거)**, 담당자 드롭다운은 `ListProjectMembersHandler` 기반 **프로젝트 멤버**로 한정됨
- **이슈 상세**: 댓글, 이슈 관계(blocks/is_blocked_by/relates_to), 라벨, 파일 첨부, 리치 텍스트(Tiptap) — 전부 동작
- **협업 뷰 (M3)**: `activity_logs` 테이블 + `ListActivityHandler` + `ActivityTimeline`(자동 기록), **칸반 보드 + 테이블↔칸반 토글**(드래그로 상태 변경, localStorage 뷰 선호 저장)
- **테스트 (M2)**: 백엔드 17개 → **~30개 파일로 확장**(핸들러·리포지토리·플로우 `issueLifecycle.flow` + 렌더러 UI/훅 테스트 + 전 스토리 자동 스모크). 인프라 회귀(마이그레이션 멱등성·어댑터 에러 매핑·트랜잭션 원자성·크로스 엔진 read-after-write) 커버
- **렌더러 현대화 (2026-06, M1~M3 이후)**: 전 페이지 데이터 패칭을 **Zustand → TanStack Query 도메인 훅으로 이관 완료**(PR #71~#81, ADR 0002), React 19 관용구 정리, Atomic Design 컴포넌트 폴더 구조 전환
- **부가**: 마일스톤, 태스크/체크리스트, 인앱 알림, 다크모드, i18n(한/영)
- **인테그레이션**: Slack 웹훅(테스트 전송), GitHub 토큰 저장/검증 — 동작
- **위생**: 레이아웃 ErrorBoundary, placeholder(TempComponent) 라우트 **0개**
- **출시 인프라 (M4 일부)**: LICENSE/CONTRIBUTING.md/CODE_OF_CONDUCT.md, `release.yml`(tag push → 3플랫폼 인스톨러), `update-electron-app` auto-updater 배선 완료

### ❌ 미구현 (전부 v1.1+ 또는 비-v1.0 범위)
글로벌 검색(Cmd+K), 벌크 작업, 이슈 마감일/시간추적, Timeline/Gantt 뷰(의존성 화살표), 슬라이드인 이슈 Detail Panel(현재 `DetailPanel`은 "Phase 2에서 구현" placeholder, 이슈는 여전히 Dialog로 열림), GitHub 양방향 동기화(현재 토큰 저장만)

### 🩹 잔여 갭 (코드는 됐으나 정리 필요 — 출시 전 처리 권장)
- **🐛 [데이터 손실] 프로젝트 설명 저장 누락**: `UpdateProjectHandler`가 `projectName`/`modifiedBy`만 repo로 전달, `projectDesc`를 누락(`UpdateProjectHandler.ts:15-18`). UI는 설명을 보내고 toast는 성공처럼 보이나 저장 안 됨. 핸들러 한 줄 수정으로 해결(repo·params·UI 계층은 이미 지원)
- **dead code**: `stores/issue.ts`가 React Query 이관 후 어디서도 import되지 않음(`stores/project.ts`처럼 삭제 대상)
- **stale 안내문**: `CreateIssueDialog`는 평문 Textarea + "EditorJS 기능 업데이트 예정" 문구 유지 중 — 나머지 앱은 Tiptap `RichTextEditor` 사용. 일관성 정리 필요
- **lint**: `pnpm lint`(=`biome check --write`) 자동 수정 후 **0 error / 27 warning** 잔존(HYDRA-029)

---

## v1.0.0 정의 (확정)

Linear/Plane 대비 **가볍고 심플한 셀프호스팅 이슈 트래커**. 출시 기준:

1. 이슈 전체 라이프사이클(생성→댓글→상태변경→완료) — ✅
2. **테이블 + 칸반 2가지 뷰** — ✅ (M3 완료, 토글 + 드래그 상태변경)
3. 리치 텍스트 에디터(이슈/댓글) — ✅
4. 협업 기초: 댓글 ✅, 알림 ✅, **활동 로그** ✅ (M3 완료), My Issues ✅
5. 모든 목록이 실데이터(IssuePage 더미 제거) — ✅ (M1 완료)
6. 회귀 안전망: TDD 기반 테스트 아키텍처 — ✅ (M2 완료, ~30개 테스트 파일)
7. OSS 출시물: LICENSE/CONTRIBUTING/CoC, README 스크린샷, 릴리즈 자동화 — 🚧 **M4** (인프라 ✅, README 스크린샷 + 영문 감사 + `v1.0.0` 태그 남음)
8. placeholder 제거, ErrorBoundary, 로딩/빈 상태 — ✅ (placeholder/ErrorBoundary, 빈 상태 일관성 모두 완료)

**v1.0.0에 포함하지 않음 (→ v1.1+):** 글로벌 검색(Cmd+K), 벌크 작업, 이슈 마감일/시간추적,
GitHub 양방향 동기화, Slack 이벤트 훅, 최초 로그인 비번 강제 변경, 자가 비번 재설정,
integrations 시크릿 at-rest 암호화, 스프린트, 오프라인 싱크, 데이터 내보내기.

---

## M1 — 코어 루프 마감 ✅ 완료 (2026-06)

> **목표:** 모든 화면이 실데이터로 막힘없이 동작. 출시 직전까지 남은 코어 갭 제거.
> **규모:** S~M · **선행:** 없음 (즉시 착수)
> **결과:** IssuePage `ISSUE_LIST` 실 API 전환(더미 제거), `ListProjectMembersHandler`로 담당자 드롭다운 프로젝트 멤버화, 로딩/빈 상태 일관화 — 전부 완료.

### 범위
- **IssuePage 더미 → 실 API** — `dummy/issues.json` 제거, `ISSUE_LIST`(프로젝트 스코프) 연결 + 로딩/빈/에러 상태
- **담당자 드롭다운 프로젝트 멤버화** — `ListProjectMembersHandler` 신규(`users_projects_link` 기반), `CreateIssueDialog`/이슈 편집에서 전역 사용자 대신 프로젝트 멤버만 표시
- **빈 상태/스켈레톤 일관성 감사** — 목록/상세 전반의 로딩·빈 상태 통일

### 완료 조건
- 더미 데이터 사용 페이지 0개
- 담당자 드롭다운이 프로젝트 멤버만 노출
- 모든 주요 뷰에 일관된 로딩/빈 상태

---

## M2 — 테스트 아키텍처 재정립 (TDD 토대) ✅ 완료 (2026-06)

> **목표:** 기존 테스트를 걷어내고, 의도적으로 설계한 TDD 기반 테스트 아키텍처를 세운다.
> 이후 신규 기능(M3)을 test-first로 개발할 토대를 마련한다.
> **규모:** M~L · **선행:** M1
> **결과:** "전면 삭제 후 재설계"가 아니라 **확장**으로 수렴 — 백엔드 17개 → ~30개 파일(핸들러·리포지토리 통합, `issueLifecycle.flow`, 렌더러 UI/훅, 전 스토리 자동 스모크 + 커넥티드용 프로바이더 하니스). 인프라 회귀(마이그레이션 멱등성·어댑터 에러 매핑·트랜잭션 원자성·크로스 엔진 read-after-write) 재커버 완료. 테스트 계층은 `docs/adr/0003-test-architecture.md` 참조.

### 범위
- **기존 테스트 17개 전면 삭제** 후 백지에서 테스트 전략 재설계
- **테스트 레이어 정의 (TDD 지향)**:
  - 단위: validator, util (순수 로직)
  - 통합: 핸들러 + Drizzle 리포지토리 (PostgreSQL/MySQL 양 엔진)
  - 핵심 플로우: 워크스페이스 연결 → 인증/세션 → 이슈 CRUD end-to-end
  - UI: 핵심 컴포넌트/페이지 렌더·상호작용 (최소 핵심 경로)
- **CI coverage 게이트 재설정** + 픽스처/테스트 DB 하니스 정비
- **품질 검토**: 회귀 안전망 점검

### ⚠️ 트레이드오프 (의사결정 기록)
기존 17개에는 멀티 DBMS·인증 마이그레이션/어댑터 회귀 테스트가 포함된다. 전면 삭제 시 **이미 출시된
인프라의 회귀 커버리지가 일시적으로 사라진다.** 재설계 스위트는 이 인프라(마이그레이션 멱등성, 어댑터
에러 매핑, 트랜잭션 원자성, 크로스 엔진 read-after-write)를 **반드시 재커버**해야 한다.

### 완료 조건
- 재설계된 테스트 스위트 정의·통과, CI 게이트 동작
- 핵심 플로우 + 인프라 회귀 커버
- M3 기능을 test-first로 시작할 수 있는 하니스 완비

---

## M3 — 협업 뷰 (test-first) ✅ 완료 (2026-06)

> **목표:** 변경 이력 추적 + 가장 임팩트 큰 시각적 기능. M2 하니스 위에서 TDD로 구현.
> **규모:** M~L · **선행:** M2 (테스트 토대), 내부 의존: 활동 로그 → 칸반
> **결과:** `activity_logs` 테이블(PG/MySQL 듀얼) + `DrizzleActivityLogRepository` + `ListActivityHandler`, 이슈 변경/댓글 시 자동 기록, `ActivityTimeline` 렌더. `KanbanBoard`(`@dnd-kit`) + 테이블↔칸반 토글(localStorage `VIEW_KEY`), 드래그로 `ISSUE_UPDATE`. 양쪽 다 테스트 보유.

### 범위
- **활동 로그 / 타임라인** *(선행 — 이벤트 소스)*
  - `activity_log` 테이블: `log_id(uuid PK)`, `entity_type`, `entity_id`, `action`, `actor_id(FK)`, `metadata(jsonb)`, `created_at` (PG/MySQL 듀얼 스키마 규칙 준수)
  - 이슈 상태/담당자 변경·댓글 생성 시 자동 기록
  - IssueDetailPage에 타임라인 섹션
- **칸반 보드 + 뷰 토글**
  - 상태별 컬럼 + 드래그&드롭(`@dnd-kit/core`), 기존 `ISSUE_UPDATE` IPC 재활용 (상태 변경 시 활동 로그 기록)
  - 테이블 ↔ 칸반 토글, localStorage에 뷰 선호 저장

### 완료 조건
- 이슈 변경/댓글 시 타임라인 자동 기록
- 칸반에서 드래그로 상태 변경 동작, 활동 로그에 반영
- 뷰 선호 유지
- 신규 코드 test-first 커버

---

## M4 — OSS 출시 패키징 & 릴리즈 🚧 진행 중 (유일한 잔여 마일스톤)

> **목표:** 공개 배포 + 인스톨러 릴리즈 + v1.0.0 태그.
> **규모:** M · **선행:** M1~M3 기능 동결 (✅ 충족)

### 범위
- ✅ **문서**: LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md 존재 (저장소 루트)
- ✅ **릴리즈 자동화**: `.github/workflows/release.yml` — tag push → 3플랫폼(Win/macOS/Linux) 인스톨러
- ✅ **Electron auto-updater**: `update-electron-app` 배선 완료(`src/main/index.ts`)
- ⬜ **남은 디자인 디테일 마감** — 출시 전 UI 디테일 정리(잔여 갭 HYDRA-030 `projectDesc` 버그, HYDRA-031 `stores/issue.ts` 삭제, HYDRA-032 `CreateIssueDialog`→Tiptap 일관화, HYDRA-033 GitHub 카피 정정, HYDRA-029 lint 경고 ≤10)
- ⬜ **E2E 스모크 테스트** — 핵심 사용자 여정(워크스페이스 연결 → 로그인 → 프로젝트/이슈 생성 → 상태 변경 → 댓글)을 패키징된 앱 기준으로 검증. Electron E2E 러너(Playwright `_electron` 또는 WebdriverIO) 신규 도입. *출시 직전 회귀 게이트*
- ⬜ **README 스크린샷/GIF 추가** (현재 이미지 0개)
- ⬜ **UI 문자열 영문 최종 감사**
- ⬜ **최종 품질 검토** + `v1.0.0` 태그 + GitHub Release (**현재 git 태그 0개 — 미발행**)

### 완료 조건
- 남은 디자인 디테일 마감 + 잔여 갭(HYDRA-030/031/032/033/029) 처리
- E2E 스모크가 핵심 여정을 패키징 빌드에서 통과(CI 게이트)
- 문서 완비(LICENSE/CONTRIBUTING/CoC + README 스크린샷)
- 태그 push 시 자동 빌드 → 3플랫폼 인스톨러 생성
- `v1.0.0` 태그 + GitHub Release 게시

---

## 의존성 흐름

```
M1 (코어 루프 마감)        ← 독립, 즉시 착수
  │
M2 (테스트 아키텍처 재정립) ← M1 후. TDD 토대 — M3를 test-first로 만들기 위해 선행
  │
M3 (협업 뷰: 활동 로그 → 칸반) ← M2 하니스 위에서 TDD 구현
  │
M4 (OSS 출시 & 릴리즈)      ← M1~M3 동결 후 → v1.0.0 태그
```

## 마일스톤 요약

| 마일스톤 | 주제 | 핵심 산출물 | 규모 | 상태 |
|---------|------|-----------|------|------|
| M1 | 코어 루프 마감 | IssuePage 실데이터, 담당자 프로젝트멤버화, 빈 상태 일관성 | S~M | ✅ 완료 |
| M2 | 테스트 아키텍처 재정립 | 17개 → ~30개 확장, 인프라/플로우 재커버 + 스토리 스모크 | M~L | ✅ 완료 |
| M3 | 협업 뷰 | 활동 로그/타임라인, 칸반 + 뷰 토글 (test-first) | M~L | ✅ 완료 |
| M4 | OSS 출시 & 릴리즈 | 디자인 디테일 마감, E2E 스모크, README 스크린샷, 릴리즈 자동화, v1.0.0 태그 | M | 🚧 진행 중 |

## v1.1+ 보류 항목

글로벌 검색(Cmd+K), 벌크 작업, 이슈 마감일/시간추적, GitHub 양방향 동기화, Slack 이벤트 훅,
최초 로그인 비번 강제 변경, 자가 비번 재설정, integrations 시크릿 at-rest 암호화,
고급 권한, 스프린트, 오프라인 퍼스트, 데이터 내보내기(CSV/JSON), 플러그인 시스템.
