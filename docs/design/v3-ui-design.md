# Hydra v3 UI Design Spec

## Context

Hydra v3는 기존 UI를 Linear 스타일로 전면 리뉴얼하는 프로젝트이다.
미니멀하고 빠른 네비게이션, 키보드 중심 조작, 인라인 디테일 패널을 핵심으로 한다.
신규 기능(Kanban 보드, 타임라인, 멤버 관리, 실시간 알림)을 추가하고,
한글 최적화와 일관된 디자인 시스템을 적용한다.

## Design Principles

- **Linear-inspired**: 미니멀, 빠른 네비게이션, 키보드 친화적
- **Light mode first**: 라이트 모드 기본, 다크 모드는 CSS-only로 처리 (JS 분기 없이 CSS 변수 + `dark:` 클래스로 전환. CSS로 해결 불가한 케이스 발생 시 사용자와 협의 후 대책 수립)
- **Inline over dialog**: 이슈 상세는 슬라이드인 패널, 다이얼로그 최소화
- **Korean-optimized**: 한글 타이포그래피 최적화 (자간, 행간, 폰트)

## Tech Stack (UI)

| Category | Library |
|----------|---------|
| Design System | **shadcn/ui** (모든 컴포넌트 기반) |
| CSS | Tailwind CSS v4 |
| Table | TanStack Table + shadcn `Table` (DataTable 패턴) |
| Form | TanStack Form + shadcn `Form` |
| Router | TanStack Router (HashRouter) |
| State | Zustand v5 |
| Icons | **Lucide React** (모노크롬 UI 아이콘) |
| Custom SVG | 상태 원, 우선순위 아이콘, 프로젝트 뱃지, 이슈 유형 등 색상/독립 아이콘 |
| Emoji | **tossface** (플랫폼 간 일관된 이모지) |
| Hangul Utils | **es-hangul** (조사 처리, 초성 검색) |
| Drag & Drop | dnd-kit (Kanban 보드) |
| Charts | Recharts (대시보드) |
| Font | Pretendard → Noto Sans KR fallback |

## shadcn/ui Component Mapping

| UI Element | shadcn Component |
|------------|-----------------|
| Sidebar | `Sidebar` (collapsible, icon/offcanvas variants) |
| Issue Table | `Table` + TanStack Table `ColumnDef[]` |
| Detail Panel | `ResizablePanel` (3-panel layout: sidebar + content + detail) |
| Filter Dropdowns | `Popover` + `Command` |
| Issue Properties | `Badge`, `Avatar`, `Select` |
| Dialogs | `Dialog`, `AlertDialog` |
| Tabs (List/Board/Timeline) | `Tabs` |
| Kanban Cards | `Card` |
| Notifications | `Sonner` (toast), `DropdownMenu` |
| Search | `Command` (cmdk) |
| Forms | `Form`, `Input`, `Textarea`, `Select` |

## Typography (Korean Optimization)

```css
font-family: 'Pretendard Variable', 'Pretendard', -apple-system, 'Noto Sans KR', sans-serif;
letter-spacing: -0.2px;    /* 한글 자간 최적화 */
line-height: 1.5;          /* 한글 행간 */
```

- UI 라벨 한글화: 홈, 내 이슈, 알림, 멤버, 설정, 이슈, 목록, 보드, 타임라인, 상태, 우선순위, 담당자, 유형
- es-hangul: 조사 처리 ("이슈를/을", "프로젝트가/이"), 초성 검색
- 한글 이니셜 아바타: 성(姓) 기준 ("최", "김" 등)

## Dark Mode Strategy (CSS-only)

다크모드는 **JS 분기 없이 CSS만으로** 처리한다. 컴포넌트 코드에 `isDark` 같은 조건부 로직을 넣지 않는다.

### 구현 방식

1. **shadcn/ui CSS 변수**: `globals.css`에서 `:root`(라이트)와 `.dark`(다크) 변수 정의
2. **Tailwind `dark:` variant**: `dark:bg-gray-900`, `dark:text-gray-100` 등 유틸리티 클래스
3. **테마 토글**: `<html>` 요소에 `class="dark"` 추가/제거 (JS는 토글 전환 1줄만)
4. **커스텀 SVG 아이콘**: `currentColor` 또는 CSS 변수로 색상 참조 → 별도 분기 불필요

### CSS로 처리 가능한 영역

- 배경, 텍스트, 보더 색상 → CSS 변수 + `dark:` 클래스
- shadcn 컴포넌트 (Button, Card, Dialog 등) → 이미 CSS 변수 기반
- 사이드바, 테이블, 패널 → Tailwind `dark:` variant
- Lucide 아이콘 → `currentColor` 상속
- 커스텀 SVG (상태 원, 우선순위 등) → CSS 변수 참조 (`var(--status-in-progress)`)
- 의존관계 화살표 → SVG `stroke`/`fill`에 CSS 변수 사용

### CSS로 해결 불가 시 대책

아래 케이스 발생 시 구현 전에 **반드시 사용자와 협의**:
- 외부 라이브러리가 인라인 스타일을 강제하는 경우 (Recharts 차트 색상 등)
- Canvas/WebGL 기반 렌더링이 필요한 경우
- 이미지/에셋이 테마별로 달라야 하는 경우 (로고 등)
- third-party 위젯이 자체 테마 API만 제공하는 경우

```css
/* globals.css 예시 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --status-backlog: #d1d5db;
  --status-in-progress: #f59e0b;
  --status-done: #10b981;
  --arrow-blocks: #ef4444;
  --arrow-related: #2563eb;
  --arrow-parent: #8b5cf6;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --status-backlog: #6b7280;
  --status-in-progress: #fbbf24;
  --status-done: #34d399;
  --arrow-blocks: #f87171;
  --arrow-related: #60a5fa;
  --arrow-parent: #a78bfa;
}
```

---

## Layout Architecture

**Type C: Full Sidebar + Panel Detail**

```
┌─────────────────────────────────────────────────────┐
│ Sidebar (220px / 56px)  │  Content Area  │  Detail  │
│                         │                │  Panel   │
│ [Workspace]             │  Sub Nav       │  (340px) │
│ ├ Home                  │  (Tabs/Filter) │          │
│ ├ My Issues             │                │  Props   │
│ ├ Notifications         │  List / Board  │  Desc    │
│ ├──────────             │  / Timeline    │  Activity│
│ ├ Projects              │                │          │
│ │ ├ Alpha               │                │          │
│ │ └ Beta                │                │          │
│ ├──────────             │                │          │
│ ├ Members               │                │          │
│ └ Settings              │                │          │
│ [User Profile]          │  Status Bar    │          │
└─────────────────────────────────────────────────────┘
```

### Sidebar

- **Expanded (220px)**: 아이콘 + 텍스트, Lucide 아이콘 사용
- **Collapsed (56px)**: 아이콘만, 프로젝트는 색상 이니셜 뱃지
- **Toggle**: `◀` / `▶` 버튼 또는 `Cmd/Ctrl+B` 단축키
- **shadcn**: 기존 `Sidebar` 컴포넌트 활용 (collapsible 지원)
- **구조**:
  - 상단: 워크스페이스 이름 + 전환 드롭다운
  - 중단: Home, My Issues, Notifications (뱃지)
  - 구분선
  - 중단: Projects 섹션 (접을 수 있는 목록 + "+" 생성 버튼)
  - 하단: Members, Settings, User Profile (아바타 + 이름 + 역할)

### Detail Panel (340px)

- 이슈 클릭 시 오른쪽에서 슬라이드인
- **Header**: 이슈 키 + Edit/Fullscreen/Close 버튼
- **Body**: 제목 → 속성 그리드 → 설명 → 활동 타임라인
- **속성 그리드**: Status, Priority, Type, Assignee, Reporter, Created, Updated
- **활동**: 변경 이력 (상태 변경, 배정, 생성 등) 타임라인

---

## Screens

### 1. Workspace Page (Public)

- 저장된 워크스페이스 목록 (카드 형태)
- DB 연결 폼: host, port, database, username, SSL cert
- 초대 코드 입력 폼
- 워크스페이스 삭제 (확인 다이얼로그)
- 비밀번호 인증 후 연결

### 2. Home (Dashboard)

**3개 탭**: 대시보드 / 내 이슈 / 활동

#### Dashboard Tab
- 이슈 통계 카드 4개: 전체, 진행 중, 완료, 차단
- 상태 도넛 차트 (Recharts)
- 트렌드 차트: 생성 vs 완료 추이
- 프로젝트별 진행률 바

#### My Issues Tab
- 나에게 할당된 이슈 목록 (TanStack Table)
- 상태별 필터 탭
- 인라인 상태 변경 (클릭으로 상태 전환)

#### Activity Feed Tab (NEW)
- 최근 활동 타임라인
- 이슈 변경, 댓글, 멤버 변경 등
- 아바타 + 액션 + 대상 + 시간 형태

### 3. Projects Page

- 프로젝트 목록 (TanStack Table + shadcn Table)
- 검색 & 필터
- 프로젝트 생성 다이얼로그 (shadcn Dialog)
  - 이름, 키 (3-5자 대문자, 실시간 검증), 설명

### 4. Project Detail

사이드바에서 프로젝트 선택 시 서브 네비게이션 표시:

#### 4.1 Overview
- 프로젝트 요약: 이슈 수, 진행률
- 최근 활동
- 멤버 목록

#### 4.2 Issues — List View
- TanStack Table + shadcn Table
- **행 구성**: 우선순위 커스텀SVG + 체크박스 + 상태 원(커스텀SVG) + 키 + 제목 + 담당자 아바타
- **필터 바**: 상태, 우선순위, 담당자, 유형 (Popover + Command)
- **서브 탭**: 목록 / 보드 / 타임라인 (shadcn Tabs)
- 행 클릭 → 오른쪽 디테일 패널 열림
- 선택된 행: 파란 배경 + 왼쪽 보더
- 완료된 이슈: 취소선 + 회색 텍스트
- 하단 상태 바: "N개 이슈 · 진행 중 N · 완료 N"

#### 4.3 Issues — Board View (Kanban) (NEW)
- **칼럼**: 백로그 → 진행 중 → 리뷰 → 완료 (커스터마이징 가능)
- **카드 (shadcn Card)**: 이슈 키 + 우선순위 아이콘 | 제목 | 담당자 아바타 + 유형 뱃지
- **드래그 & 드롭**: dnd-kit, 칼럼 간 이동 시 상태 자동 변경
- **칼럼 헤더**: 상태 원 + 이름 + 카운트 뱃지
- **진행 중 칼럼**: 카드에 왼쪽 상태 색상 보더
- **완료 칼럼**: opacity 0.7로 시각적 구분
- **빈 칼럼**: "+ 이슈 추가" 점선 버튼
- **그룹핑 옵션**: 상태별 / 담당자별 / 우선순위별

#### 4.4 Issues — Timeline View (NEW)
- **Gantt 스타일** 타임라인
- **좌측 패널 (220px)**: 이슈 라벨 (우선순위 + 키 + 제목 + 관계 뱃지)
- **우측 그리드**: 주 단위 날짜 헤더 + 이슈 바
- **오늘 마커**: 파란 세로선
- **바 색상**: 상태별 색상 코딩
- **Epic 바**: gradient 배경 + 하위 이슈 수 뱃지
- **완료 바**: ✓ 표시 + 연한 색상
- **네비게이션**: 이전/다음/오늘 버튼

##### 의존관계 화살표 (SVG)

| Type | Arrow Style | Color | Use Case |
|------|------------|-------|----------|
| **Blocks** | 점선 + 화살촉 | `--arrow-blocks` 마젠타 | A 완료 → B 시작 가능 |
| **Blocked by** | 점선 + 화살촉 | `--arrow-is-blocked-by` 주황 | Blocks의 역방향 |
| **Related** | 실선 + 화살촉 | `--arrow-relates-to` 파랑 | 서로 관련된 이슈 (양방향) |
| **Duplicate** | 점선 + 화살촉 | `--arrow-duplicate` 회색 | 동일 이슈 중복 |
| **Parent → Child** | 실선 + 화살촉 | `--arrow-parent` 보라 | 상위/하위 이슈 관계 |

- **구현**: SVG `<path>` + bezier curve overlay (xyflow 미사용)
- **SVG marker**: `<marker>` 요소로 화살촉 정의
- **관계 라벨**: 화살표 중간에 작은 뱃지 (차단, 관련, 하위 등)
- **인터랙션**:
  - 바 클릭 → 연결된 화살표만 강조, 나머지 dimmed
  - 화살표 hover → 관계 유형 툴팁
  - ⚠ 경고: Blocks 관계에서 선행 미완료 + 후행 진행 중
- **바 인터랙션**: 클릭→디테일 패널, 바 드래그→기간 조절, 끝 드래그→종료일 변경

#### 4.5 Project Settings
- 프로젝트 이름, 키, 설명 수정
- 프로젝트 삭제 (AlertDialog)
- 상태/라벨 커스터마이징

### 5. Settings

#### 5.1 Account
- 프로필: 아바타 (클릭 업로드), 이름 (수정), 이메일 (읽기 전용)
- 테마: 라이트/다크 토글

#### 5.2 Members (NEW)
- 멤버 목록 테이블: 아바타 + 이름 + 이메일 + 역할 (Badge)
- 멤버 초대: 초대 코드 생성 (Dialog)
- 멤버 삭제 (AlertDialog)
- 역할 관리: Admin / Member

#### 5.3 Notifications (NEW)
- 알림 설정: 이슈 할당, 상태 변경, 멘션 등 on/off 토글

### 6. Notification Center (NEW)

- 헤더의 알림 아이콘 클릭 → 드롭다운 또는 사이드바에서 전체 페이지
- 알림 목록: 읽음/안읽음 구분
- 알림 클릭 → 해당 이슈로 이동
- 일괄 읽음 처리 버튼

#### 알림 인프라: PostgreSQL LISTEN/NOTIFY

Hydra는 설치형이며 별도 서버 없이 각 클라이언트가 직접 PostgreSQL에 연결한다.
실시간 알림은 **PostgreSQL 내장 LISTEN/NOTIFY** 메커니즘으로 구현한다.

**동작 방식:**
1. Main 프로세스에서 DB 연결 시 `LISTEN hydra_notifications` 채널 구독
2. 이슈 상태 변경, 배정, 댓글 등 이벤트 발생 시 `notifications` 테이블에 INSERT + `NOTIFY hydra_notifications` 실행
3. 구독 중인 다른 클라이언트가 실시간으로 알림 수신
4. Main → Renderer로 IPC 이벤트 전달 → UI 업데이트 (Sonner toast + 뱃지 카운트)

**제약 사항:**
- DB 연결 중일 때만 실시간 수신 가능
- 오프라인/미연결 시 알림 누락 → 앱 시작 시 `notifications` 테이블에서 미읽은 알림 조회로 보완
- NOTIFY payload 크기 제한 8000 bytes → 알림 ID만 전달하고 상세는 DB 조회

**notifications 테이블 구조:**
- `id`, `user_id` (수신자), `type` (issue_assigned, status_changed, mentioned 등)
- `title`, `body`, `reference_id` (이슈 ID 등), `is_read`, `created_at`

---

## Icon Strategy

### Lucide React (기본)
모노크롬 UI 아이콘. 사이드바, 액션 버튼, 필터, 테이블 헤더 등.

```
Home, ListChecks, Bell, FolderKanban, Settings, Users, Plus,
Search, Filter, ChevronLeft, ChevronRight, Edit, Maximize2, X,
ArrowUpRight, Bug, Sparkles, Calendar, Clock, ...
```

### Custom SVG (색상/독립)
- **이슈 상태 원**: Backlog(회색 빈 원), Todo(파랑 반 원), In Progress(노랑 반 원), Review(보라), Done(초록 채운 원)
- **우선순위**: Urgent(빨강 ▲▲), High(빨강 ▲), Medium(노랑 ■), Low(회색 ▼), None(회색 —)
- **이슈 유형**: Bug(빨강 원 + 벌레), Feature(보라 ◆), Improvement(파랑), Task(회색)
- **프로젝트 뱃지**: 색상 이니셜 사각 뱃지 (collapsed sidebar)

---

## Route Structure

```
Root
├── /workspace (public)
│   └── WorkspacePage
│
└── / (authenticated — redirect to /workspace if not connected)
    ├── / → HomePage (Dashboard / My Issues / Activity)
    ├── /my-issues → MyIssuesPage
    ├── /notifications → NotificationPage
    │
    ├── /projects → ProjectsPage
    ├── /projects/:projectId
    │   ├── / → OverviewPage
    │   ├── /issues → IssuePage (List/Board/Timeline tabs)
    │   ├── /tasks → TasksPage
    │   └── /settings → ProjectSettingsPage
    │
    ├── /settings
    │   ├── / → AccountPage
    │   ├── /members → MembersPage
    │   ├── /notifications → NotificationSettingsPage
    │   └── /integrations → IntegrationPage
    │
    └── /members → MembersPage
```

---

## Verification Plan

1. **Visual**: 각 화면이 목업과 일치하는지 확인
2. **Sidebar**: Expanded/Collapsed 전환, Cmd/Ctrl+B 단축키 동작
3. **Issue List**: TanStack Table 정렬/필터/페이지네이션, 행 클릭 → 디테일 패널
4. **Kanban Board**: dnd-kit 드래그&드롭, 칼럼 간 이동 시 상태 변경
5. **Timeline**: 바 표시, 의존관계 화살표 렌더링, 바 클릭 → 관련 화살표 강조
6. **Korean**: 한글 타이포그래피, es-hangul 조사 처리, tossface 이모지
7. **Responsive**: 사이드바 접기, 패널 닫기 시 콘텐츠 확장
8. **Theme**: 라이트/다크 전환

---

## Mockup References

목업 파일은 `.superpowers/brainstorm/` 디렉토리에 저장됨:
- `layout-approach.html` — 레이아웃 접근법 3종 비교 (C 선택)
- `sitemap.html` — 전체 화면 구조
- `main-issues-v2.html` — 이슈 리스트 + 사이드바 (Expanded/Collapsed 비교)
- `kanban-board.html` — 칸반 보드 뷰
- `timeline-with-deps.html` — 타임라인 + 의존관계 화살표 통합 뷰
- `dependency-types.html` — 의존관계 유형 5종 프리뷰
