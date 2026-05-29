# Hydra 마일스톤: v3 → v1.0 OSS 출시

> 작성일: 2026-05-29 | 기준 브랜치: `v3` | 목표: v1.0 오픈소스 출시
> 구조: 능력 테마형 (작업 성격으로 묶고 의존성 순서대로 배치)
> 이 문서는 실제 구현 상태 감사(2026-05-29)를 기준으로 `roadmap-v1.md`/`backlog.md`를 재정비한 결과다.

## 현황 요약 (감사 기준 ground truth)

### ✅ 완료 (18)
이슈 CRUD·상세·인라인편집, 홈 대시보드(실데이터), 프로젝트 상세/설정, 댓글, 라벨,
파일 첨부, 멤버 관리 + 초대, 서버사이드 필터/정렬/페이지네이션, 리치 텍스트(Tiptap),
인앱 알림, 이슈 관계(blocks/blocked_by/relates_to), 마일스톤 기능, 태스크/체크리스트,
다크모드, i18n(한/영), 스켈레톤/빈 상태(부분)

### 🟡 부분 완료 (4)
| 항목 | 상태 |
|------|------|
| 서비스 인테그레이션 | Slack 저장/테스트 ✅ / GitHub 폼만 있고 저장 미연결 |
| My Issues 페이지 | UI 있으나 더미 JSON 사용, 실 API 미연결 |
| 에러 처리 | 스켈레톤·빈 상태 ○ / 레이아웃 ErrorBoundary 없음 |
| 테스트 | validator/util 3개 파일뿐 (UI/핸들러/리포지토리 미커버) |

### ❌ 미착수 (6)
활동 로그/타임라인, 글로벌 검색(Cmd+K), 칸반 보드 + 뷰 토글, 벌크 작업,
이슈 마감일/시간추적, 웹훅 디스패처(HMAC/재시도)

### 🧹 데드엔드 (TempComponent 4곳)
`/tasks/$taskId`, `/settings/$settingId`, `/settings/members`, `/settings/notifications`

---

## v1.0 정의 (재정비)

Linear/Plane 대비 **가볍고 심플한 셀프호스팅 이슈 트래커**로서 최소 조건:

1. 이슈 전체 라이프사이클 (생성→코멘트→상태변경→완료) — ✅
2. 테이블 뷰 + **칸반 보드** 2가지 뷰 — 칸반 ❌ (M2)
3. 리치 텍스트 에디터 — ✅
4. 협업 기초: 코멘트 ✅, 알림 ✅, **활동 로그** ❌ (M2), **My Issues 실데이터** 🟡 (M1)
5. 글로벌 검색 (Cmd+K) — ❌ (M3)
6. GitHub 연동 마무리 — 🟡 (M3)
7. OSS 필수: README/CONTRIBUTING/LICENSE, 테스트 50%+ — (M4/M5)
8. 플레이스홀더 제거, ErrorBoundary, 로딩/빈 상태 — 🟡 (M1/M4)

**v1.0에 포함하지 않음 (→ v1.1+):** 웹훅 디스패처, 벌크 작업, 마감일/시간추적,
GitHub 양방향 동기화 심화, Slack 고도화, 스프린트, 오프라인 싱크, 데이터 내보내기

---

## M1 — 데드엔드 제거 & 안정화

> **목표:** 사용자가 막다른 길을 만나지 않는다. 클릭하면 다 동작한다.
> **규모:** S~M

### 범위
- TempComponent 4곳 처리: 실 페이지 연결 또는 라우트 제거
  - `/settings/members`, `/settings/notifications` → 기존 `MembersPage`·`NotificationsPage` 재사용 검토
  - `/tasks/$taskId`, `/settings/$settingId` → 필요성 판단 후 구현 또는 제거
- **My Issues** 더미 JSON → 실 IPC(`ISSUE_LIST`, assignee 필터) 연결
- 레이아웃 레벨 **ErrorBoundary** 추가

### 완료 조건
- placeholder 라우트 0개
- My Issues가 실데이터 렌더 (현재 사용자 할당 이슈, 프로젝트별)
- 렌더 에러 시 폴백 UI 표시

---

## M2 — 협업 뷰 완성

> **목표:** 변경 이력 추적 + 가장 임팩트 큰 시각적 기능.
> **규모:** M~L

### 범위
- **활동 로그/타임라인**
  - `activity_log` 테이블: `log_id(uuid PK)`, `entity_type`, `entity_id`, `action`, `actor_id(FK)`, `metadata(jsonb)`, `created_at`
  - 이슈 상태/담당자 변경·댓글 생성 시 자동 기록
  - IssueDetailPage에 타임라인 표시
  - (칸반/알림의 이벤트 소스 역할 → 선행)
- **칸반 보드 + 뷰 토글**
  - 상태별 컬럼, `@dnd-kit/core` 드래그&드롭으로 상태 변경 (기존 `ISSUE_UPDATE` IPC 재활용)
  - 테이블 ↔ 칸반 토글, localStorage에 선호도 저장

### 완료 조건
- 이슈 변경 시 타임라인 자동 기록
- 칸반에서 드래그로 상태 변경 동작
- 뷰 선호도 유지

---

## M3 — 검색 & 외부 연동

> **목표:** 파워유저 탐색 + 외부 서비스 연결 마무리.
> **규모:** M

### 범위
- **글로벌 검색 (Cmd+K)**: shadcn/ui Command 컴포넌트 기반, 프로젝트+이슈 통합, `SEARCH_GLOBAL` IPC 채널
- **GitHub 연동 마무리**: 폼 저장 연결, 토큰 검증/테스트, 연결 상태 표시 (기존 `INTEGRATION_SAVE`/`integrations` 테이블 활용)

### 완료 조건
- Cmd+K로 프로젝트/이슈 통합 탐색
- GitHub 토큰 저장·검증 동작, 연결 상태 표시

> M3는 M2와 일부 병행 가능 (검색은 활동 로그에 비의존).

---

## M4 — 품질 게이트

> **목표:** 회귀 안전망 + 마감 다듬기. 기능 동결.
> **규모:** L

### 범위
- **테스트 50%**: 핸들러·Drizzle 리포지토리(통합 테스트)·핵심 플로우, CI에 coverage threshold 추가
- **폴리시**: 모든 뷰에 의미 있는 빈 상태 + CTA, 스켈레톤 로더 통일, 키보드 단축키(Cmd+K / Cmd+N / Esc)
- **HomePage N+1 쿼리** 해소 — 대시보드 전용 집계 IPC 채널

### 완료 조건
- 커버리지 50%+ 달성
- 모든 뷰 빈 상태/로딩 일관성 확보
- HomePage 단일 집계 쿼리

---

## M5 — OSS 출시

> **목표:** 공개 배포 + v1.0.0 태그.
> **규모:** M

### 범위
- README 리라이트: 스크린샷/GIF, 기능 목록, Quick Start, 아키텍처
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE(MIT 추천)
- GitHub Actions 릴리즈 워크플로: tag push → Electron Forge → 3플랫폼 인스톨러
- Electron auto-updater 설정
- UI 문자열 영문 최종 감사

### 완료 조건
- 문서 완비 (README/CONTRIBUTING/CODE_OF_CONDUCT/LICENSE)
- 태그 push 시 자동 빌드 → 인스톨러 생성
- `v1.0.0` 태그 + GitHub Release 생성

---

## 의존성 흐름

```
M1 (데드엔드 제거)  ← 독립, 즉시 착수 가능
  │
M2 (협업 뷰)  ← 활동 로그 → 칸반 (활동 로그가 변경 이벤트 소스)
  │
M3 (검색 & 연동)  ← M2와 일부 병행 가능 (검색은 활동 로그 비의존)
  │
M4 (품질 게이트)  ← M1~M3 기능 동결 후
  │
M5 (OSS 출시)  ← M4 완료 후 마지막 다듬기 → v1.0.0
```

## 마일스톤 요약

| 마일스톤 | 주제 | 핵심 산출물 | 규모 |
|---------|------|-----------|------|
| M1 | 데드엔드 제거 & 안정화 | placeholder 제거, My Issues 실데이터, ErrorBoundary | S~M |
| M2 | 협업 뷰 완성 | 활동 로그/타임라인, 칸반 보드 + 뷰 토글 | M~L |
| M3 | 검색 & 외부 연동 | 글로벌 검색(Cmd+K), GitHub 연동 마무리 | M |
| M4 | 품질 게이트 | 테스트 50%, 폴리시, N+1 해소 | L |
| M5 | OSS 출시 | 문서, 릴리즈 자동화, v1.0.0 태그 | M |

## v1.1+ 보류 항목

웹훅 디스패처(HMAC/재시도), 벌크 작업, 이슈 마감일/시간추적,
GitHub 양방향 동기화 심화, Slack 고도화, 고급 권한, 스프린트/시간추적,
오프라인 퍼스트, 데이터 내보내기(CSV/JSON), 플러그인 시스템, i18n 확장
