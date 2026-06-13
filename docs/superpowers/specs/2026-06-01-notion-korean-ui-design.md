# Hydra UI 재설계 — Notion 스타일 · 한국형 (디자인 시스템 우선)

- 작성일: 2026-06-01
- 상태: 설계 확정(구현 계획 대기)
- 방향: **B (Notion 제품/앱 감성)** · 접근 **①(기존 토큰 이름 유지 + 값 재매핑)** · 범위 **디자인 시스템 먼저**
- 선행 작업 관계: 기존 OKLCH 토큰/접근성 감사(`docs/design/design-system.md`, `design-tokens-spec.md`)의 **대비(AA) 기준은 계승**하되, 팔레트 값은 본 Notion warm-gray 체계로 **대체**한다. 미리보기용 mock/인증 우회(`preload/mockApi.ts`, `stores/auth.ts` TEMP)는 그대로 둔다.

---

## 1. 목표 & 원칙

- Hydra는 마케팅 사이트가 아니라 **워크스페이스 앱**(사이드바 + 콘텐츠). DESIGN.md(Notion)의 마케팅 토큰이 아니라 **Notion 제품 UI 감성**을 옮긴다: 따뜻한 회색 표면, 얇은 헤어라인, 차분한 잉크 텍스트, 여백·밀도, 잔잔한 인터랙션, 사각 지오메트리.
- **한국형**: ① 한글 우선 타이포·가독성(Pretendard), ② 정보 밀도·명료함(Toss/당근식), ③ 한국 업무 관례(날짜·이름·존댓말).
- **색은 정보로 작동**: 화면 대부분은 중립(warm gray/ink). 색은 분류(라벨·상태·프로젝트·차트)와 **포인트**에만.
- 가이드 #3 유지: 하드코딩 색 금지, 토큰으로 전체 조율.

## 2. 구현 접근 (①)

- `index.css`의 토큰 **이름은 유지**(`--background/--card/--muted-foreground/--border/--primary/--destructive/status-*/priority-*` 등)하고 **값만 Notion warm-gray + 그린 포인트**로 교체 → shadcn/Tailwind 유틸을 쓰는 컴포넌트가 자동으로 새 룩.
- 부족한 토큰만 신설: **그린 램프 100~900**, **멀티컬러 스펙트럼**, spacing/typography 스케일, 헤어라인 단계.
- DESIGN.md 용어(canvas/charcoal/hairline)는 토큰 옆 **매핑 주석**으로 보존.

---

## 3. 색 시스템

### 3.1 표면 / 경계 / 텍스트 (라이트)

| 역할 | 값 | 매핑(기존 토큰) |
|---|---|---|
| Canvas | `#ffffff` | `--background`, `--card`, `--popover` |
| Surface | `#f6f5f4` | `--muted`, `--secondary`, 사이드바 |
| Surface soft | `#fafaf9` | `--accent` (hover면) |
| Hairline | `#e5e3df` | `--border` |
| Hairline soft | `#ede9e4` | 은은한 구분선(테이블 행) |
| Hairline strong | `#c8c4be` | `--input` (입력 경계) |
| Ink | `#1a1a1a` | `--foreground` (제목/본문) |
| Charcoal | `#37352f` | 본문 강조(웜) |
| Slate | `#5d5b54` | 보조 텍스트 |
| Steel | `#787671` | `--muted-foreground` (AA 통과) |
| Stone | `#a4a097` | 희미한 라벨/섹션 헤더 |
| Muted | `#bbb8b1` | 플레이스홀더/비활성 |

### 3.2 Brand Green — 잔잔한 100~900 (포인트 전용)

저채도 그린 풀 램프. **포인트에만 절제**해서 사용(주요 버튼·링크·활성 메뉴 표시·포커스 링·선택 배경). 대부분의 UI는 중립.

| 단계 | 값 | 용도 |
|---|---|---|
| green-50 | `#f1f7f3` | 선택/활성 행 배경 |
| green-100 | `#e3efe8` | 틴트 배경·호버 |
| green-200 | `#c7dfd2` | 옅은 경계 |
| green-300 | `#a3c9b6` | 경계·비활성 점 |
| green-400 | `#6fa98c` | 아이콘·보조 |
| green-500 | `#4a8a6a` | accent 점·강조 |
| **green-600** | **`#3a7457`** | **주요 포인트: 버튼·링크·활성 (흰 글자 AA✅)** → `--primary` |
| green-700 | `#2f5e47` | pressed · 링크 텍스트 |
| green-800 | `#264b3a` | 틴트 위 진한 텍스트 |
| green-900 | `#1e3c2f` | 최강조 · 다크 표면 |

- `--primary = green-600`, `--primary-foreground = #ffffff`, pressed = green-700.
- 링크 텍스트 = green-700(`#2f5e47`), 포커스 링 = green-600 + 3px green-600/15% 외곽.
- **완료(Done)는 옅은 민트 배지**(아래 상태 틴트)로 두어 솔리드 그린 버튼과 형태로 구분(의미 충돌 방지).

### 3.3 시맨틱 (Feedback)

| 역할 | 값 | 매핑 |
|---|---|---|
| Success | `#1aae39` | `--success` |
| Warning | `#dd5b00` | `--warning` |
| Error | `#e03131` | `--destructive` |

### 3.4 상태 배지 — Notion 태그식 (옅은 틴트 배경 + 진한 텍스트)

| 상태(코드) | 한국어 라벨 | 배경 | 텍스트 |
|---|---|---|---|
| backlog | 대기 | `#f0eeec` | `#5d5b54` |
| in_progress | 진행 중 | `#dcecfa` | `#0075de` |
| review | 검토 | `#e6e0f5` | `#391c57` |
| done | 완료 | `#d9f3e1` | `#0f7a2a` |
| blocked | 차단 | `#fde0ec` | `#a02e6d` |

(레거시 `open` → `backlog` 별칭 유지. `--status-*` 토큰에 매핑.)

### 3.5 우선순위 (텍스트/아이콘 점 색)

| 우선순위 | 한국어 | 색 |
|---|---|---|
| urgent | 긴급 | `#e03131` |
| high | 높음 | `#dd5b00` |
| medium | 보통 | `#c79100` |
| low | 낮음 | `#5d5b54` |

### 3.6 멀티컬러 스펙트럼 (Figma식) — 라벨·프로젝트·차트·아바타·일러스트

`#e5484d`(red) · `#f76808`(orange) · `#f5a623`(amber) · `#30a46c`(green) · `#0d99ff`(blue) · `#a259ff`(violet) · `#ec4899`(pink).
- 각 색에 틴트 배경/텍스트 페어 정의(라벨 칩·프로젝트 점). 차트는 토큰 `var(--chart-*)`로 공급(다크 자동 추종).
- 라벨 기본 색(사용자 미지정)은 이 스펙트럼에서 순환 배정.

### 3.7 다크 모드

같은 의미를 반전 정의(표면 다크 warm-gray, 텍스트 밝게, 그린 램프는 명도 +보정해 green-400~500을 포인트로). 본 스펙은 토큰 구조까지 정의하고, 구체 다크 값은 구현 단계에서 채운다(라이트와 1:1 키 대칭).

---

## 4. 타이포그래피

- 글꼴 스택: `'Pretendard Variable','Pretendard', Inter, system-ui, sans-serif` (한글 우선, 라틴/숫자 자연).
- 한글 가독성: 본문 **행간 1.6**, 제목 **자간 음수**, 숫자 **tabular-nums**.

| 토큰(유틸) | size / weight / tracking / line-height | 용도 |
|---|---|---|
| `text-title` | 24 / 700 / -0.02em / 1.3 | 페이지 타이틀 |
| `text-section` | 18 / 600 / -0.01em / 1.4 | 섹션 헤더 |
| `text-cardtitle` | 16 / 600 / 1.45 | 카드/이슈 제목 |
| `body-lg` | 16 / 400 / 1.6 | 읽기용 본문(이슈 설명) |
| `body` (기본) | 14 / 400 / 1.6 | 앱 전반 기본 |
| `body-medium` | 14 / 500 | 강조·사이드바 활성·버튼 |
| `caption` | 13 / 400 (steel) | 메타/날짜 |
| `micro` | 12 / 600 (stone) | 섹션 라벨/그룹 헤더 |

## 5. 형태 · 간격 · 깊이

- **Radius**: 버튼/입력 8px(`md`), 카드/다이얼로그/패널 12px(`lg`), 태그/배지 6px(`sm`), 아바타/점 full. (Notion식 사각 지오메트리 — 버튼은 pill 아님.)
- **Spacing 토큰**: `--spacing-page:1.5rem`, `--spacing-section:1rem`, `--spacing-card:1rem` → `p-page` 등으로 통일(현재 `ProjectsPage`의 `p-12` outlier 교정).
- **Elevation**: 기본 카드=그림자 없음 + 헤어라인. 드롭다운/모달만 옅은 그림자(`rgba(15,15,15,.08) 0 4px 12px`). 무거운 그림자 금지.

## 6. 기초 컴포넌트

- **Button**: primary(green-600 솔리드/흰 글자), secondary(흰 + hairline-strong 경계), ghost(투명), destructive(흰 + 레드 경계/레드 텍스트), link(green-700 텍스트). 8px, `body-medium`, padding ~`8px 14px`. `text-white` 하드코딩 제거 → `--primary-foreground`.
- **Badge/Tag**: 상태=§3.4 틴트, 라벨=§3.6 멀티컬러 틴트+점, 우선순위=점 색. `bg-opacity-*`(v4 제거) 사용 금지 → 토큰/슬래시 불투명도.
- **Card**: 흰 배경 + hairline 경계 + 12px, 패딩 `spacing-card`. 그림자 없음.
- **Input**: 높이 40px, hairline-strong 경계, 포커스 시 green-600 1.5px + 외곽 ring.
- **Table**: 헤더 `micro`/stone + hairline 하단, 행 구분 hairline-soft, 호버 surface, **선택행 green-50**, 키/숫자 tabular-nums, 행 패딩 ~9px(밀도).
- **Sidebar item**: 기본 steel, 활성 = green-50 배경 + green-600 좌측 보더 + green-700 텍스트.

## 7. 한국화 규칙

- 기본 로케일 **ko**, 사용자 노출 텍스트 한국어 우선.
- **상태/라벨 한국어 표기**: 대기·진행 중·검토·완료·차단 / 버그·기능·UI·백엔드. (영문 유지로 변경 가능 — 미해결 시 한국어 채택)
- 톤: 공손한 존댓말("저장/삭제/취소", "삭제할까요?", "저장되었습니다").
- **날짜 `yyyy.MM.dd (요일)`** 예: `2026.05.25 (월)`. 목록 보조로 상대시간("3일 전") 허용. 시간 24h `14:30`.
- 숫자 천단위 콤마 + tabular-nums.
- 이름: 한국식(성+이름 붙임), 아바타 폴백=이름 첫 글자. 라벨 "담당/보고자".
- 밀도: 테이블 촘촘(행 ~9px), 페이지 패딩 `p-page` 통일.

## 8. 구현 범위 & 순서 (디자인 시스템 우선)

1. **토큰 레이어**(`index.css`): §3 값 재매핑, 그린 램프·멀티컬러·spacing·typography 유틸 신설, `@theme inline` 노출, `.nord` 제거(이미 됨).
2. **기초 컴포넌트**(atoms/molecules): Button, Badge/IssueBadge, Card, Input(InputField), Table 계열, Sidebar item을 토큰 기반으로 치환(하드코딩 색 제거).
3. **한국화**: 로케일 ko 기본화, 상태/라벨 한국어, 날짜 포맷 유틸(`yyyy.MM.dd (요일)`), 톤 문구 정리.
4. 화면(페이지)은 위가 끝나면 대체로 자동 정렬 — 잔여 하드코딩(IssueColumns, ProjectDetailPage, 차트, 다이얼로그)만 표적 정리.

## 9. 범위 밖(YAGNI/추후)

- 페이지별 픽셀 단위 레이아웃 리디자인(기초 시스템 적용 후 별도 단계).
- 다크 모드 정밀 튜닝(토큰 구조만 정의, 값은 구현 시).
- 미리보기용 mock/인증 우회 제거(실데이터 연결 복구 시 별도).
- 회귀 방지 lint 규칙(팔레트/하드코딩 색 차단)은 추후 권고.

## 10. 성공 기준

- 라이트 모드에서 본문/보조 텍스트·버튼·포커스 AA(4.5:1 본문, 3:1 UI) 충족.
- 시맨틱 색(상태/우선순위/라벨)이 토큰으로만 표현(하드코딩 hex/팔레트 0).
- 한국어 기본 + `yyyy.MM.dd (요일)` 날짜 + 존댓말 톤 적용.
- `pnpm typecheck`·`pnpm lint` 통과, 앱 빌드/기동 정상.
