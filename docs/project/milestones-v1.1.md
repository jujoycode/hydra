# Hydra 마일스톤: v1.1.0 — "살아나고 빨라진다"

> 수립: 2026-06-15 | 기준 브랜치: `main` | 선행: v1.0.0 출시(M4 완료) | 테마: **알림 중심(notifications-led)** — 조용하던 트래커가 *말을 걸고*, 키보드로 *빠르게* 움직이는 데스크톱 앱이 된다.
> 이 문서는 **v1.1.0 마일스톤의 단일 기준(canonical)** 이다. v1.0.0 기준은 [`milestones-v1.md`](./milestones-v1.md), 개별 티켓 참고는 [`backlog.md`](./backlog.md).
>
> **선행 조건: 본 마일스톤은 v1.0.0(`v1.0.0` 태그)이 출시된 뒤 착수한다.** 통합 지점은 2026-06-15 HEAD `3e2bee7` 기준 소스 감사로 검증됨.

## 배경 — 왜 알림 중심인가 (키스톤)

코드 감사로 드러난 단일 사실: **알림 영속 계층은 다 만들어졌는데 호출이 0건이다.**

- `notifications` 테이블(PG/MySQL 듀얼) · `NotificationRepository.create()` · 읽기 UI · 안 읽음 배지가 모두 존재.
- 그러나 **`notifications.create`를 호출하는 producer가 코드 어디에도 없다** → 알림이 생성되지 않음.
- `NOTIFICATION_COUNT_UNREAD` 채널은 서버에 있으나 **렌더러가 한 번도 쿼리하지 않음**. 사이드바 배지는 하드코딩 `0`(`AppSidebar.tsx:36`).
- **main→renderer 푸시 경로 전무** — preload는 `invoke`(요청/응답) 전용. 70+ 채널 전부 `ipcMain.handle`.

즉 알림 엔진은 *새 서브시스템*이 아니라 **이미 깔린 배관에 물을 흘리는 일**이다. 그리고 이 한 seam이 @멘션·워처·네이티브 OS 알림·트레이 배지를 연쇄로 열어준다 — v1.1 전체에서 레버리지가 가장 큰 작업.

## v1.1.0 정의 (확정)

v1.0.0(가볍고 심플한 셀프호스팅 이슈 트래커) 위에, **데스크톱 앱인 이유를 증명하는** 계층을 얹는다:

1. **알림이 실제로 생성된다** — 배정/상태변경/댓글/멘션 시 인앱 알림 + 배지가 진짜로 동작
2. **데스크톱 존재감** — 네이티브 OS 알림 + 트레이 + 작업표시줄 배지(앱이 최소화돼도 알림이 온다)
3. **@멘션** — 댓글/설명에서 멤버 멘션 + 멘션 알림
4. **워처/구독** — 이슈 단위 구독으로 관심 이슈 변경을 추적 *(스트레치)*
5. **빠름** — Cmd+K 커맨드 팔레트 + 전역 검색 + 최근 본 항목 + 전역 단축키
6. **미완 UI 마감** — 라벨 관리 UI, 이슈별 체크리스트 섹션

**v1.1.0에 포함하지 않음 (→ v1.2+):** 간트/타임라인 뷰, GitHub/GitLab 양방향 동기화, Slack 이벤트 디스패치, 이슈 마감일/캘린더, `milestone_due` 리마인더, 워크스페이스 내보내기/가져오기, PG↔MySQL 마이그레이션, 서버사이드 페이지네이션(검색에 필요한 최소분만 선택적 포함).

---

## 핵심 기술 결정 (확정 — 구현 플랜의 입력)

소스 감사 후 확정한 설계 결정. 구현 시작 전 바뀔 수 있으나, 기본값은 아래로 고정한다.

| # | 결정 | 내용 | 근거 |
|---|------|------|------|
| **D1** | 알림 환경설정 저장 | 전용 `notification_preferences` 테이블(타입별 boolean), **fan-out seam(main)에서 강제 적용**(렌더러 필터링이 아니라 발신 단계에서 차단). `SettingsLayout` 탭 내비(HYDRA-027) 신설 — 현재 `/settings/*`는 URL 직접 접근만 가능 | 쿼리 용이 + 단일 진실 공급원. prefs를 main에서 적용해야 OS 알림까지 일관 |
| **D2** | 워처 자동 구독 | 이슈 배정/댓글/생성 시 **암묵 자동 watch** + 명시적 watch/unwatch 버튼. 수신자 = `(watchers ∪ {assignee, mentioned}) − {actor}` (자기 행동엔 알림 없음) | 표준 트래커 동작. 행위자 제외로 노이즈 방지 |
| **D3** | @멘션 파싱 | 렌더러가 `mentionedUserIds: string[]`를 `commentContent`와 함께 전송. v1.1엔 멘션 저장 테이블 없음(필요 시 v1.2 `comment_mentions`) | 댓글은 Tiptap HTML로 저장(`dangerouslySetInnerHTML`). 클라이언트가 사용자 본인 앱이라 신뢰 가능 + Mention 확장이 ID를 자연 산출 |
| **D4** | 푸시 채널 | 단일 푸시 채널 `NOTIFICATION_PUSH`를 기존 `IpcChannel` enum에 추가(preload 가드 통과) + 신규 `onApiEvent`(ipcRenderer.on) 브리지 | 단순성. v1.1엔 푸시 1종(알림 도착 → 무효화/내비)으로 충분 |
| **D5** | 네이티브 알림 발화 + 배지 SoT | `NotificationService`가 단일 초크포인트: `create` 후 (a) `countUnread` 재조회로 배지 갱신, (b) **창 비활성 && pref on**일 때만 네이티브 `Notification` 발화 | 중복/스팸 방지. 배지의 단일 진실 = DB 재조회(인메모리 카운터 불일치 회피) |
| **D6** | 링크/수신자 규약 | 딥링크 포맷 `/projects/${projectId}/issues/${issueId}`(HashHistory). 수신자 키 = `user_sn`. 담당자는 단일(`issue_assigned_to: string | null`) | 인앱 리스트 클릭과 네이티브 알림 클릭이 동일 경로로 resolve |
| **D7** | 배지 크로스플랫폼 | mac/Linux: `app.setBadgeCount(n)` · **Windows: `mainWindow.setOverlayIcon`**(숫자 이미지). AUMID `'com.electron'` → 인스톨러 일치 AUMID로 수정 | Windows는 `setBadgeCount`가 숫자 배지를 렌더하지 않음(점만 표시) |

---

## W0 — 릴리스 선행 + 정리

> **목표:** v1.0.0 출시 게이트와 겹치는 잔여 갭을 닫고 깨끗한 출발선 확보.
> **규모:** S · **선행:** 없음 (v1.0.0 M4와 공유 — 먼저 처리)

### 범위
- **HYDRA-030** 🐛 프로젝트 설명 저장 누락(데이터 손실) — `UpdateProjectHandler`에 `projectDesc` 전달(한 줄) + 회귀 테스트
- **HYDRA-031** dead code `stores/issue.ts` 삭제 + 미사용 `types/issue.ts`/localStorage 키 정리
- **HYDRA-032** `CreateIssueDialog` 평문 Textarea → Tiptap `RichTextEditor` 통일, stale 안내문 제거
- **HYDRA-033** GitHub 카드 과장 카피 정정(v1.0 분량 — 실제 동기화는 v1.2)
- **HYDRA-029** Biome lint 경고 27 → ≤10 (`pnpm exec biome check .` 기준; `pnpm lint`는 파일 자동 수정이므로 읽기 검증은 전자)

### 완료 조건
- HYDRA-030/031/032/033/029 처리, 빌드·테스트·typecheck 통과

---

## W1 — 알림 생성 엔진 ★ 키스톤

> **목표:** "생성 0건" 상태를 끝내고 배지를 실제로 켠다. 이후 W2~W4·W7의 토대.
> **규모:** M (코어는 S) · **선행:** W0

### 범위
- **`NotificationService`(신규, main)** — `RepositoryContainer.getInstance()`로 구성. 책임: `CoreUtil.getUuid()` 발급, 수신자 de-dup, 행위자 제외(D2), 워처 조회(W7 연동), 배지/네이티브 발화 트리거(D5). 핸들러는 `notificationService.notifyIssueAssigned(...)` 한 메서드만 호출
- **Producer seam 연결** (성공 mutation 직후 best-effort try/catch — 활동로그와 동일 패턴, 실패해도 mutation은 성공):
  - 이슈 배정 변경: `UpdateIssueHandler` (`before.issue_assigned_to !== issue.issue_assigned_to` 분기)
  - 상태 변경: `UpdateIssueHandler` (`before.issue_status !== issue.issue_status` 분기)
  - 신규 이슈 배정: `CreateIssueHandler` (try/catch 신규 추가)
  - 댓글 생성: `CreateCommentHandler` (기존 try 블록, `activityLogs.create` 직후. 담당자/제목 위해 `issues.findById` 추가)
- **배지 실제 작동** — `use-notifications.ts`에 `useUnreadCount(userId)` 추가(`NOTIFICATION_COUNT_UNREAD` 쿼리), `AppSidebar.tsx:36`의 하드코딩 `0` 교체. 기존 뮤테이션이 무효화하는 `queryKeys.notifications.unreadCount`는 이미 존재(쿼리만 없었음)
- `notification_type`는 `varchar(50)` — 타입 문자열(`issue_assigned`/`status_changed`/`comment_added`/`mention` 등) ≤50자 준수

### 완료 조건
- 배정/상태변경/신규배정/댓글 시 수신자에게 알림 row 생성(행위자 제외)
- 사이드바 배지가 실제 안 읽음 수를 반영, 읽음 처리 시 감소
- 통합 테스트(핸들러→알림 생성) + 배지 훅 테스트

---

## W2 — 데스크톱 존재감 ★ (트레이 · 네이티브 알림 · 배지)

> **목표:** 앱이 최소화돼도 알림이 온다 — 브라우저 탭이 구조적으로 못 하는 것. ①의 헤드라인.
> **규모:** M · **선행:** W1 (배지/네이티브가 엔진에 의존)

### 범위
- **윈도우 보존** — `src/main/index.ts`의 지역 `main`을 모듈 스코프 `let mainWindow`로 승격, `'closed'`에서 해제 (모든 외부 코드가 `webContents.send`/`focus` 가능하도록)
- **푸시 브리지(D4)** — preload에 `onApiEvent(channel, cb)` 두 번째 브리지 추가(`ipcRenderer.on` + 해제 함수), `index.d.ts` 타입 확장, `NOTIFICATION_PUSH`를 `IpcChannel`에 추가. 렌더러는 `main.tsx`의 `InnerApp` 마운트 seam에서 구독 → 알림 무효화 + `router.navigate(link)`
- **네이티브 OS 알림** — `NotificationService`에서 창 비활성 && pref on일 때 `new Notification(...).show()`. `'click'` → `mainWindow.show()/.focus()` + `NOTIFICATION_PUSH`(딥링크)
- **트레이** — 트레이 아이콘 + 클릭 시 창 포커스 (안 읽음 수 표시는 선택)
- **작업표시줄/독 배지(D7)** — mac/Linux `setBadgeCount`, Windows `setOverlayIcon`(플랫폼 분기, `CoreConstant.OS_TYPE` 활용)
- **AUMID 수정** — `setAppUserModelId('com.electron')`를 인스톨러 일치 ID로 (Windows 토스트/오버레이 표시 전제)

### 완료 조건
- 창이 비활성일 때 배정/멘션 시 OS 알림 표시, 클릭 시 해당 이슈로 이동
- 안 읽음 수가 트레이/작업표시줄 배지에 3-플랫폼 모두 반영
- pref off 타입은 OS 알림이 뜨지 않음

---

## W3 — 알림 환경설정 토글

> **목표:** 읽기 전용으로 재사용 중인 `/settings/notifications`를 실제 설정 화면으로.
> **규모:** M · **선행:** W1 (강제 적용이 엔진 seam에 의존)

### 범위
- **`notification_preferences` 테이블(신규)** — `user_id` FK + 타입별 boolean(`pref_issue_assigned`/`pref_comment`/`pref_mention`/`pref_status_changed`/`pref_native_os` 등). **PG+MySQL 듀얼 스키마 + 마이그레이션 + `schema.parity.test.ts` 통과**(컬럼명 동일 필수)
- **IPC** — `NOTIFICATION_PREF_GET`/`NOTIFICATION_PREF_SET` 채널 + 핸들러 + `ipc.ts` 페이로드 타입 + `mockApi.ts` 케이스(빌드 게이트)
- **설정 페이지** — `routes.tsx`의 `settingsNotificationsRoute`를 신규 `NotificationSettingsPage`로 repoint(현재 읽기 전용 `NotificationsPage` 재사용 중). `AccountPage`의 `SettingCard` 패턴 차용
- **SettingsLayout 탭 내비(HYDRA-027)** — 현재 `SettingsLayout`은 빈 `<Outlet/>`. account/members/notifications/integrations 탭 스트립 신설(활성 하이라이팅)
- **강제 적용(D1)** — `NotificationService` fan-out에서 수신자 pref 확인 후 생성/발화 결정

### 완료 조건
- 타입별 토글 + 네이티브 OS 알림 on/off가 저장되고 실제 발신에 반영
- `/settings/*` 탭 내비로 4개 화면 이동 가능

---

## W4 — @멘션

> **목표:** 댓글/설명에서 멤버 멘션 → 멘션 대상에게 알림.
> **규모:** M · **선행:** W1 (멘션 알림이 엔진에 의존)

### 범위
- **Tiptap Mention** — `@tiptap/extension-mention` 설치(미설치). `RichTextEditor.tsx`(이슈 설명 + 댓글 공용 단일 에디터)에 `Mention.configure({ suggestion })` 추가. 멤버 후보는 신규 옵셔널 prop으로 주입(`IssueDetailPage`는 이미 `useUsers()`로 멤버 보유)
- **멘션 전송(D3)** — 댓글 생성 시 `mentionedUserIds: string[]`를 `commentContent`와 함께 전송
- **멘션 알림** — `CreateCommentHandler` seam에서 멘션 대상에게 `mention` 타입 알림(행위자 제외)

### 완료 조건
- 댓글 에디터에서 `@` 입력 시 멤버 자동완성, 선택 시 멘션 마크업
- 멘션된 멤버에게 알림 생성 + (창 비활성 시) OS 알림

---

## W5 — Cmd+K + 빠른 이동 (잔잔한 승리)

> **목표:** 키보드로 어디로든 즉시. "가벼운 Linear" 체감의 핵심 상호작용.
> **규모:** M · **선행:** 없음 (독립 — 병렬 가능)

### 범위
- **커맨드 팔레트** — shadcn `Command` atom + 전역 키 리스너(`MainLayout`). 프로젝트/이슈/멤버 전역 검색(기존 `findByUserProjects`로 fan-out) + 이동
- **최근 본 항목** — `stores/recent.ts`(Zustand+localStorage, `panel.ts`/`sidebar.ts` 패턴), 이슈 상세 마운트 시 기록. Cmd+K 빈 상태로 표출
- **전역 단축키 + `?` 치트시트** — `useGlobalHotkeys` 훅(기존 뮤테이션/라우터로 디스패치). Tiptap 에디터 내부에서 단축키 오발화 방지
- *(선택)* 서버사이드 필터/정렬(HYDRA-011) — 검색이 대용량에서 필요해지면 최소분만. 기본은 로드된 데이터 검색

### 완료 조건
- Cmd+K로 프로젝트/이슈/멤버 검색·이동
- 최근 본 이슈가 팔레트 빈 상태에 노출, 단축키 치트시트 표시

---

## W6 — 미완 UI 마감 (라벨 · 체크리스트)

> **목표:** main에 핸들러는 있으나 렌더러 표면이 없는 기능을 연결.
> **규모:** M · **선행:** 없음 (독립 — 병렬 가능)

### 범위
- **라벨 관리 UI** — `LABEL_CREATE/UPDATE/DELETE` 핸들러는 등록돼 있으나 렌더러 미참조(현재 link/unlink만 가능). 라벨 정의 생성/이름변경/색상/삭제 화면 신설
- **이슈별 체크리스트** — `IssueDetailPage` 본문에 체크리스트 섹션 추가(현재 `TasksPage`(프로젝트 레벨)만 존재). `queryKeys.tasks.byIssue`는 이미 존재 — `use-tasks.ts`에 `useIssueTasks(issueId)`/뮤테이션 추가, `TasksPage`의 Checkbox+Input 렌더 패턴 재사용

### 완료 조건
- 라벨 정의 CRUD가 UI에서 가능, 이슈에 부착 시 즉시 반영
- 이슈 상세에서 체크리스트 추가/토글/삭제 가능

---

## W7 — 워처 / 구독 *(스트레치 — 시간 빠듯하면 v1.2)*

> **목표:** 이슈 단위 구독으로 관심 이슈 변경을 추적. fan-out 수신자 집합을 풍부하게.
> **규모:** M · **선행:** W1 (워처 fan-out이 엔진에 의존). 엔진은 이것 없이도 배정+멘션으로 동작 → 드롭 가능

### 범위
- **`issue_watchers` 테이블(신규)** — `issue_id` FK + `user_id` FK, 복합 PK, `issue_id`/`user_id` 인덱스. **PG+MySQL 듀얼 + 마이그레이션 + parity 테스트**
- **IPC** — `ISSUE_WATCH`/`ISSUE_UNWATCH`/워처 목록 채널 + 핸들러 + `use-watch(issueId)` 훅
- **UI** — `IssueDetailPage` 사이드바에 watch/unwatch 컨트롤
- **자동 구독(D2)** — 배정/댓글/생성 시 `issue_watchers` 암묵 insert. fan-out 수신자 = `(watchers ∪ {assignee, mentioned}) − {actor}`

### 완료 조건
- 이슈 watch/unwatch 가능, 워처가 상태변경/댓글 알림 수신
- 자기 행동엔 자기 알림 없음(행위자 제외)

---

## 새 DB 표면 (parity 의무)

> 모든 신규 테이블/컬럼은 `schema.ts`(PG) **및** `schema.mysql.ts`(MySQL) 양쪽에 추가하고, 마이그레이션 생성(`pnpm db:generate` + `pnpm db:generate:mysql`) 후 `schema.parity.test.ts`(컬럼명 집합 동일성)를 통과해야 한다.

| 테이블 | 용도 | 도입 스트림 |
|--------|------|-----------|
| `notification_preferences` | 사용자별 알림 타입 on/off | W3 |
| `issue_watchers` | 이슈 단위 구독(워처) | W7 (스트레치) |

`notifications` 테이블 자체는 변경 불필요(type/title/message/link/read/timestamp로 충분). 멘션은 v1.1엔 저장 안 함(파싱만).

## 의존성 흐름

```
W0 (릴리스 선행/정리)        ← 먼저, 독립 (v1.0.0 M4와 공유)
  │
W1 (알림 생성 엔진) ★ 키스톤  ← W0 후
  ├─> W2 (데스크톱 존재감: 배지·네이티브·트레이·푸시 브리지)
  ├─> W3 (환경설정 토글: fan-out 강제 적용)
  ├─> W4 (@멘션 알림)
  └─> W7 (워처 fan-out) ← 스트레치
W5 (Cmd+K + 빠른 이동)        ← 독립, 병렬 가능
W6 (라벨 관리 UI + 체크리스트)  ← 독립, 병렬 가능
```

## 마일스톤 요약

| 스트림 | 주제 | 핵심 산출물 | 규모 | 비고 |
|--------|------|-----------|------|------|
| W0 | 릴리스 선행/정리 | HYDRA-030/031/032/033/029 | S | v1.0.0 게이트 공유 |
| W1 | 알림 생성 엔진 ★ | `NotificationService`, producer seam, 실제 배지 | M(코어 S) | 키스톤 |
| W2 | 데스크톱 존재감 ★ | 트레이·네이티브 알림·3플랫폼 배지·푸시 브리지·AUMID | M | ①의 헤드라인 |
| W3 | 알림 환경설정 | `notification_preferences`, 설정 페이지, SettingsLayout 탭 | M | HYDRA-024/027 |
| W4 | @멘션 | Tiptap Mention, 멘션 알림 | M | |
| W5 | Cmd+K + 빠른 이동 | 팔레트·전역검색·최근본·단축키 | M | 독립 |
| W6 | 미완 UI 마감 | 라벨 관리 UI, 이슈별 체크리스트 | M | HYDRA-010/013 |
| W7 | 워처/구독 | `issue_watchers`, watch UI, 워처 fan-out | M | **스트레치** |

**코어 스파인:** W0 → W1 → (W2·W3·W4 병렬) + (W5·W6 병렬). **스트레치:** W7(시간 빠듯하면 v1.2로 이월).

---

## 다음을 내다보기: v1.2

v1.1이 "살아나고 빨라진" 뒤, v1.2의 두 축:

### 1) 간트 / 타임라인 뷰
- 이슈 마감일(`issue_due_date`) 컬럼 도입 — create/update/record/handler/IPC 전 체인 + PG/MySQL 듀얼 스키마 마이그레이션 (L, 여러 시각화의 선행 의존)
- 타임라인/간트 + **의존성 화살표**(`issue_relations`의 blocks/is_blocked_by 활용), 마일스톤 번다운/진행률 위젯(HYDRA-026), 캘린더 뷰
- `milestone_due` 리마인더 — 메인 프로세스 `setInterval`(updateElectronApp 패턴) + 멱등성 키(마일스톤 핸들러엔 seam 없음 → 타이머 모델)

### 2) GitHub / GitLab 연동
- 저장만 하던 `integrations`를 실제 동작으로: 이벤트 디스패치(Slack 웹훅 HYDRA-019a 포함) + **GitHub/GitLab 양방향 이슈 동기화**(HYDRA-019b)
- OAuth 플로우, 이슈 매핑/충돌 해결, 멱등성. v1.1 알림 엔진의 이벤트 seam을 디스패처와 공유
- integrations 시크릿 at-rest 암호화(현재 평문) 동반 권장

> v1.2는 본 문서 범위 밖이며, 착수 시 별도 `milestones-v1.2.md`로 상세화한다.

## v1.2+ 보류 항목

워크스페이스 내보내기/가져오기(CSV·JSON), PG↔MySQL 마이그레이션, 스프린트, 오프라인 퍼스트 싱크(CRDT/이벤트 소싱), 플러그인 시스템, 고급/프로젝트별 권한, 최초 로그인 비번 강제 변경·자가 비번 재설정, 공개 공유 링크(서버 부재로 축소/재구성 필요).
