# Hydra UI 디자인 표준 "Lovable-lite" 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 합의된 디자인 표준(`docs/superpowers/specs/2026-06-14-ui-design-standard-design.md`)을 `index.css` 토큰 정비 + 컴포넌트 리팩터링으로 전 화면에 일관 적용한다.

**Architecture:** 컴포넌트는 Tailwind v4 유틸(`rounded-md`, `shadow-card`, `bg-card`, `glass`)로 토큰을 소비한다. 따라서 1차 레버리지는 **`src/renderer/src/index.css`의 토큰 값 변경**(radius·spacing·shadow·glass)이고, 이것만으로 전 화면이 부드러워진다. 이어서 토큰만으로 표현되지 않는 요소(그라데이션 Primary 버튼, pill 배지, 그라데이션 아바타, 단일 glass 목록 컨테이너, raw 스페이싱→토큰)를 atoms→고빈도 화면→나머지 순으로 리팩터링한다.

**Tech Stack:** Electron + React 19 + TypeScript, Tailwind CSS v4(`@theme inline`), shadcn/ui, class-variance-authority, Biome, Vitest(백엔드 전용).

---

## 검증 방식에 대한 주의 (Non-TDD)

이 작업은 **시각/CSS 리팩터링**이며 렌더러에는 컴포넌트 테스트 인프라가 없다(모든 Vitest 스위트는 `src/main/` 백엔드 전용). 따라서 단위 TDD 대신 각 태스크는 다음으로 검증한다:

- `pnpm typecheck` → **에러 0**
- `pnpm exec biome check .` → **새 위반 0** (⚠️ `pnpm lint`는 `biome check --write`라 파일을 덮어씀 — 읽기 전용 확인은 반드시 `pnpm exec biome check .` 사용)
- **시각 확인**: `pnpm dev`로 앱 실행 후 해당 화면을 라이트/다크 양쪽에서 육안 확인 (회귀·대비 점검)
- 기존 백엔드 테스트는 영향받지 않아야 함: 의심 시 `pnpm test` → 전부 통과

각 태스크 끝에서 커밋한다. 브랜치는 현재 워크트리(`feature/phase5-cleanup`)를 사용한다.

---

## File Structure

**핵심 단일 소스 (대부분의 변경):**
- `src/renderer/src/index.css` — 토큰 값(radius/spacing/shadow), glass 유틸 약화, 신규 유틸(`glass-soft`, `gradient-primary`, `hover-lift`)

**Atoms (표준 표현 형태):**
- `src/renderer/src/components/atoms/Button.tsx` — default 변형 그린 그라데이션 + glow
- `src/renderer/src/components/atoms/Badge.tsx` — pill(`rounded-full`)
- `src/renderer/src/components/atoms/Avatar.tsx` — fallback 그린 그라데이션
- `src/renderer/src/components/atoms/Card.tsx` — radius 토큰 자동 반영(확인만)

**고빈도 화면 (Phase 2):**
- `src/renderer/src/components/organisms/sidebars/Sidebar.tsx`, `AppSidebar.tsx`
- `src/renderer/src/components/organisms/issues/IssueTable.tsx`, `src/renderer/src/components/pages/IssuePage.tsx`, `ProjectDetailPage.tsx`
- `src/renderer/src/components/organisms/panels/DetailPanel.tsx`, `src/renderer/src/components/pages/IssueDetailPage.tsx`
- `src/renderer/src/components/pages/HomePage.tsx`, `src/renderer/src/components/organisms/tabs/DashboardTab.tsx`

**나머지 화면 (Phase 3):**
- `src/renderer/src/components/pages/MembersPage.tsx`, `NotificationsPage.tsx`, `MyIssuesPage.tsx`, `TasksPage.tsx`
- `src/renderer/src/components/pages/settings/*.tsx`, `ProjectSettingsPage.tsx`, `WorkspacePage.tsx`, `LoginPage.tsx`, `AdminSetupPage.tsx`
- 오버레이 atoms: `Dialog.tsx`, `Popover.tsx`, `DropdownMenu.tsx`, `Sheet.tsx` (glass 약화는 Task 1에서 전파되므로 확인 위주)

**스페이싱 토큰 치환 규약 (전 페이지 공통):**
| 현재 raw | 의미 | 치환 |
|---|---|---|
| 페이지 최외곽 `p-6` / `p-4`(페이지 루트) | 페이지 패딩 | `p-page` |
| 섹션 스택 `space-y-4`/`gap-4`(최상위 섹션 간) | 섹션 간격 | `space-y-section` / `gap-section` |
| 카드 내부 `p-4` | 카드 패딩 | `p-card` |
| 카드 그리드 `gap-3`/`gap-4` | 카드 사이 | `gap-card-gap` |

> 규약은 **페이지 루트/섹션/카드 수준에만** 적용한다. 버튼 내부 패딩, 인라인 아이콘 간격 등 의도된 미세 값은 건드리지 않는다.

---

## Phase 1 — 기반 정비

### Task 1: index.css 토큰 값 정비 (radius / spacing / shadow)

**Files:**
- Modify: `src/renderer/src/index.css` (`@theme inline` 블록 — 현재 252–271행 부근)

- [ ] **Step 1: radius 스케일 상향**

`@theme inline` 내 radius 4줄을 교체:

```css
  /* radius — Lovable-lite: 부드럽게(과한 둥글기는 지양) */
  --radius-sm: 5px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 14px;
```

- [ ] **Step 2: spacing 스케일 조정 + card-gap 추가**

spacing 3줄을 교체:

```css
  /* spacing — p-page / gap-section / p-card / gap-card-gap 유틸 생성 */
  --spacing-page: 1.5rem;     /* 24px (밀도 유지) */
  --spacing-section: 1.25rem; /* 20px (16→20) */
  --spacing-card: 1rem;       /* 16px */
  --spacing-card-gap: 0.75rem;/* 12px */
```

- [ ] **Step 3: elevation 토큰 교체/추가**

기존 elevation 블록(`--shadow-card/pop/glass`)을 아래로 교체:

```css
  /* elevation — 부드러운 floating 그림자 (glass 약화 보완) */
  --shadow-xs: 0 1px 2px -1px rgb(17 24 39 / 0.06);
  --shadow-card: 0 4px 16px -8px rgb(17 24 39 / 0.12), 0 1px 3px 0 rgb(17 24 39 / 0.05);
  --shadow-pop: 0 10px 30px -12px rgb(17 24 39 / 0.16);
  --shadow-panel: 0 16px 40px -14px rgb(17 24 39 / 0.18);
  --shadow-glow: 0 6px 16px -6px rgb(58 116 87 / 0.45);
  --shadow-glass: 0 8px 32px -8px rgb(17 24 39 / 0.16), 0 2px 8px -2px rgb(17 24 39 / 0.08);
```

> `--shadow-*` 네임스페이스는 Tailwind v4에서 `shadow-xs`/`shadow-card`/`shadow-pop`/`shadow-panel`/`shadow-glow` 유틸을 생성한다.

- [ ] **Step 4: typecheck + lint + 시각 확인**

```bash
pnpm typecheck
pnpm exec biome check .
```
Expected: 에러/위반 0. 이어서 `pnpm dev` 실행 → 임의 화면에서 카드·버튼·다이얼로그 모서리가 더 둥글고 그림자가 부드러워졌는지, 라이트/다크 모두 깨짐 없는지 확인.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/src/index.css
git commit -m "style(ui): radius·spacing·elevation 토큰 Lovable-lite 기준으로 정비"
```

---

### Task 2: glass 유틸 약화 + 신규 유틸(glass-soft / gradient-primary / hover-lift)

**Files:**
- Modify: `src/renderer/src/index.css` (`@utility glass`, `@utility glass-panel` — 현재 434–443행 부근, 및 `:root`/`.dark`)

- [ ] **Step 1: gradient-primary 토큰을 :root와 .dark에 추가**

`:root` 블록 끝(hairline 보조 근처)에 추가:

```css
  /* Primary 그라데이션 (라이트) */
  --gradient-primary: linear-gradient(135deg, #4a8a6a, #2f5e47);
```

`.dark` 블록 끝에 추가:

```css
  /* Primary 그라데이션 (다크 — 중간 그린, 너무 밝지 않게) */
  --gradient-primary: linear-gradient(135deg, #3a7457, #6fa98c);
```

- [ ] **Step 2: glass / glass-panel 약화 + glass-soft 신설**

기존 `@utility glass`, `@utility glass-panel`를 아래로 교체하고 `glass-soft` 추가:

```css
/* glassmorphism — 약화 버전(불투명도↑·blur↓)으로 가독성 우선 */
/* 오버레이(팝오버·드롭다운·다이얼로그·시트) */
@utility glass {
  background-color: color-mix(in srgb, var(--card) 88%, transparent);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
}
/* 크롬(사이드바·상단바) */
@utility glass-panel {
  background-color: color-mix(in srgb, var(--sidebar) 88%, transparent);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
}
/* 컨테이너/카드(목록 래퍼·대시보드 카드) — 가장 약한 glass */
@utility glass-soft {
  background-color: color-mix(in srgb, var(--card) 90%, transparent);
  -webkit-backdrop-filter: blur(8px) saturate(130%);
  backdrop-filter: blur(8px) saturate(130%);
}
```

- [ ] **Step 3: gradient-primary / hover-lift 유틸 추가**

`@utility animate-pop` 부근에 추가:

```css
/* Primary 그라데이션 배경 */
@utility gradient-primary {
  background-image: var(--gradient-primary);
}
/* hover 시 살짝 떠오름 (버튼·카드) */
@utility hover-lift {
  transition: transform 0.15s var(--ease-out-soft), box-shadow 0.15s var(--ease-out-soft);
}
@utility hover-lift {
  &:hover { transform: translateY(-1px); }
}
@media (prefers-reduced-motion: reduce) {
  .hover-lift { transition: none; }
  .hover-lift:hover { transform: none; }
}
```

- [ ] **Step 4: typecheck + lint + 시각 확인**

```bash
pnpm typecheck
pnpm exec biome check .
```
Expected: 0. `pnpm dev`로 다이얼로그/팝오버/사이드바를 열어 glass 비침이 약해지고 글자가 더 또렷한지, 라이트/다크 확인.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/src/index.css
git commit -m "style(ui): glass 약화 + glass-soft·gradient-primary·hover-lift 유틸 추가"
```

---

## Phase 1 — Atoms

### Task 3: Button default 변형을 그린 그라데이션 + glow로

**Files:**
- Modify: `src/renderer/src/components/atoms/Button.tsx:12` (`default` 변형)

- [ ] **Step 1: default 변형 className 교체**

`buttonVariants`의 `variant.default`를 교체:

```ts
        default: 'gradient-primary text-primary-foreground shadow-glow hover:brightness-105 hover:-translate-y-px',
```

> 베이스 cva 문자열에 이미 `transition-all duration-150 ease-out active:scale-[0.98]`이 있어 hover/active 모션이 적용된다. `gradient-primary`·`shadow-glow`는 Task 1–2에서 정의된 유틸.

- [ ] **Step 2: typecheck + lint**

```bash
pnpm typecheck
pnpm exec biome check .
```
Expected: 0.

- [ ] **Step 3: 시각 확인**

`pnpm dev` → 아무 Primary 버튼(예: "새 이슈")이 그린 그라데이션 + 은은한 glow, hover 시 살짝 밝아지고 떠오르는지, 다크에서도 텍스트 대비가 충분한지 확인.

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/atoms/Button.tsx
git commit -m "style(ui): Primary 버튼 그린 그라데이션 + glow"
```

---

### Task 4: Badge를 pill로 + 상태/우선순위 표현 정리

**Files:**
- Modify: `src/renderer/src/components/atoms/Badge.tsx:5`

- [ ] **Step 1: 베이스 radius를 pill로**

`badgeVariants` 첫 인자(베이스 클래스)에서 `rounded-sm` → `rounded-full`:

```ts
export const badgeVariants = cva('inline-flex items-center rounded-full font-medium transition-colors', {
```

- [ ] **Step 2: typecheck + lint**

```bash
pnpm typecheck
pnpm exec biome check .
```
Expected: 0.

- [ ] **Step 3: 시각 확인**

`pnpm dev` → 상태/우선순위 배지가 pill 형태인지, tint 배경+텍스트 대비(AA) 유지되는지 라이트/다크 확인.

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/atoms/Badge.tsx
git commit -m "style(ui): 배지 pill 형태로 통일"
```

---

### Task 5: Avatar fallback 그린 그라데이션

**Files:**
- Modify: `src/renderer/src/components/atoms/Avatar.tsx` (`AvatarFallback`)

- [ ] **Step 1: fallback 배경을 그라데이션으로**

`AvatarFallback`의 className에서 `bg-muted` → 그라데이션 + 흰 텍스트:

```ts
      className={cn(
        'gradient-primary text-primary-foreground flex size-full items-center justify-center rounded-full text-xs font-semibold',
        className
      )}
```

- [ ] **Step 2: typecheck + lint**

```bash
pnpm typecheck
pnpm exec biome check .
```
Expected: 0.

- [ ] **Step 3: 시각 확인**

`pnpm dev` → 이미지 없는 아바타(이니셜)가 그린 그라데이션 원형으로 표시되는지 확인. 멤버/이슈 목록에서 점검.

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/components/atoms/Avatar.tsx
git commit -m "style(ui): 아바타 fallback 그린 그라데이션"
```

---

## Phase 2 — 고빈도 화면

> 각 태스크 공통: 파일을 열어 **스페이싱 토큰 치환 규약**(상단 표)을 적용하고, 명시된 구조 변경을 수행한 뒤, `pnpm typecheck` → `pnpm exec biome check .` → `pnpm dev` 시각 확인(라이트/다크) → 커밋.

### Task 6: 사이드바 — glass 크롬 확정

**Files:**
- Modify: `src/renderer/src/components/organisms/sidebars/Sidebar.tsx`, `AppSidebar.tsx`

- [ ] **Step 1: 사이드바 표면이 glass-panel인지 확인/적용**

`Sidebar.tsx`에서 사이드바 컨테이너에 `glass-panel`이 적용돼 있는지 확인한다(Task 2로 값은 이미 약화됨). 불투명 `bg-sidebar`로 칠해진 경우 `glass-panel`로 교체. 활성 nav 아이템은 `bg-sidebar-accent text-sidebar-accent-foreground rounded-md`(그린 tint) 패턴을 사용한다.

- [ ] **Step 2: AppSidebar nav 아이템 radius/간격 정리**

`AppSidebar.tsx`의 nav 아이템 컨테이너 패딩/갭을 규약대로 정리(아이템 radius는 토큰 `rounded-md`로 8px 자동 반영). 로고 블록이 있으면 `gradient-primary rounded-md`로.

- [ ] **Step 3: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev`로 사이드바 glass·활성 강조·로고 확인 후:
```bash
git add src/renderer/src/components/organisms/sidebars/Sidebar.tsx src/renderer/src/components/organisms/sidebars/AppSidebar.tsx
git commit -m "style(ui): 사이드바 glass 크롬 + 그린 강조 정리"
```

---

### Task 7: 이슈 목록 — 단일 glass-soft 컨테이너 + 밀집 행

**Files:**
- Modify: `src/renderer/src/components/organisms/issues/IssueTable.tsx`, `src/renderer/src/components/pages/IssuePage.tsx`, `ProjectDetailPage.tsx`

- [ ] **Step 1: 목록을 단일 glass-soft 컨테이너로 감싸기**

테이블/리스트 루트 래퍼를 다음 패턴으로:

```tsx
<div className="glass-soft border-border/70 rounded-xl shadow-card overflow-hidden">
  {/* table rows */}
</div>
```

- [ ] **Step 2: 행 밀도·hover·구분선**

각 행(`tr`/row)에 밀집 패딩과 hover tint, 헤어라인 구분선을 적용:
- 행: `px-4 py-2.5`(≈10·16) · `hover:bg-primary/5` · `border-b border-border/60` · 마지막 행 `border-b-0`
- 상태/우선순위 셀은 `Badge`(이미 pill) 사용, 담당자는 `Avatar`(이미 그라데이션)

- [ ] **Step 3: 페이지 스페이싱 토큰 치환**

`IssuePage.tsx`/`ProjectDetailPage.tsx`의 페이지 루트 패딩 → `p-page`, 헤더/툴바/목록 섹션 간 → `space-y-section`. (규약 표 적용)

- [ ] **Step 4: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev` → 이슈 목록이 하나의 부드러운 glass 카드 안에 밀집 행으로 보이고, 행 hover tint·pill 배지·그라데이션 아바타가 정상인지 라이트/다크 확인.
```bash
git add src/renderer/src/components/organisms/issues/IssueTable.tsx src/renderer/src/components/pages/IssuePage.tsx src/renderer/src/components/pages/ProjectDetailPage.tsx
git commit -m "style(ui): 이슈 목록 단일 glass 컨테이너 + 밀집 행"
```

---

### Task 8: 이슈 상세 패널

**Files:**
- Modify: `src/renderer/src/components/organisms/panels/DetailPanel.tsx`, `src/renderer/src/components/pages/IssueDetailPage.tsx`

- [ ] **Step 1: 패널 표면·radius·그림자**

DetailPanel 컨테이너: 오버레이/슬라이드인 표면은 `glass shadow-panel rounded-xl`(또는 시트 좌측 경계). 패널 내부 **본문(이슈 설명 Tiptap 영역)은 glass 금지** — `bg-background` 불투명 유지(가독성).

- [ ] **Step 2: 메타 영역 표현 정리**

상태/우선순위/담당자/라벨 칩은 `Badge`(pill) 사용. 속성 행 간격은 `space-y-section`/`gap-card-gap` 규약 적용. 섹션 구분선은 `border-border/60`.

- [ ] **Step 3: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev` → 이슈 클릭 시 상세 패널의 glass·그림자·pill 메타가 정상이고 **설명 본문은 또렷이(불투명)** 보이는지 확인.
```bash
git add src/renderer/src/components/organisms/panels/DetailPanel.tsx src/renderer/src/components/pages/IssueDetailPage.tsx
git commit -m "style(ui): 이슈 상세 패널 glass·pill 정리(본문 가독성 유지)"
```

---

### Task 9: 홈 / 대시보드 — floating stat 카드

**Files:**
- Modify: `src/renderer/src/components/pages/HomePage.tsx`, `src/renderer/src/components/organisms/tabs/DashboardTab.tsx`

- [ ] **Step 1: stat 카드를 floating glass-soft 카드로**

요약 지표 카드를 다음 패턴으로(보드/대시보드는 floating 허용):

```tsx
<div className="glass-soft hover-lift rounded-lg shadow-card p-card border-border/70">
  <div className="text-title">{count}</div>
  <div className="text-caption text-muted-foreground">{label}</div>
</div>
```

카드 그리드 간격은 `gap-card-gap`.

- [ ] **Step 2: 페이지 스페이싱 토큰 치환**

페이지 루트 → `p-page`, 섹션 간 → `space-y-section` (규약 표).

- [ ] **Step 3: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev` → 홈/대시보드 지표 카드가 떠 있는 카드로 보이고 hover 시 살짝 떠오르는지, 차트 카드도 정렬되는지 확인.
```bash
git add src/renderer/src/components/pages/HomePage.tsx src/renderer/src/components/organisms/tabs/DashboardTab.tsx
git commit -m "style(ui): 홈/대시보드 floating stat 카드"
```

---

## Phase 3 — 나머지 화면

### Task 10: 멤버 · 알림 · 내 이슈 · 태스크

**Files:**
- Modify: `src/renderer/src/components/pages/MembersPage.tsx`, `NotificationsPage.tsx`, `MyIssuesPage.tsx`, `TasksPage.tsx`

- [ ] **Step 1: 규약 적용**

각 페이지에 스페이싱 토큰 치환 규약(루트 `p-page`, 섹션 `space-y-section`, 카드 `p-card`)을 적용. 목록형 화면(멤버·알림)은 Task 7 패턴(단일 `glass-soft` 컨테이너 + 밀집 행)을 따르고, 배지/아바타는 표준 atoms 사용.

- [ ] **Step 2: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev` → 4개 화면 라이트/다크 확인 후:
```bash
git add src/renderer/src/components/pages/MembersPage.tsx src/renderer/src/components/pages/NotificationsPage.tsx src/renderer/src/components/pages/MyIssuesPage.tsx src/renderer/src/components/pages/TasksPage.tsx
git commit -m "style(ui): 멤버·알림·내이슈·태스크 표준 적용"
```

---

### Task 11: 설정 · 워크스페이스 · 로그인 · 관리자 설정

**Files:**
- Modify: `src/renderer/src/components/pages/settings/AccountPage.tsx`, `settings/IntegrationPage.tsx`, `ProjectSettingsPage.tsx`, `WorkspacePage.tsx`, `LoginPage.tsx`, `AdminSetupPage.tsx`

- [ ] **Step 1: 규약 적용 + 폼 표현**

스페이싱 토큰 치환 규약 적용. 폼 카드는 `glass-soft rounded-lg shadow-card p-card`. 인풋은 표준 `Input`(radius md·input-strong border·그린 ring 유지). 인증 화면(Login/AdminSetup/Workspace)의 카드도 동일 패턴.

- [ ] **Step 2: 검증 + 커밋**

```bash
pnpm typecheck && pnpm exec biome check .
```
`pnpm dev` → 설정/워크스페이스/로그인 화면 라이트/다크 확인 후:
```bash
git add src/renderer/src/components/pages/settings/AccountPage.tsx src/renderer/src/components/pages/settings/IntegrationPage.tsx src/renderer/src/components/pages/ProjectSettingsPage.tsx src/renderer/src/components/pages/WorkspacePage.tsx src/renderer/src/components/pages/LoginPage.tsx src/renderer/src/components/pages/AdminSetupPage.tsx
git commit -m "style(ui): 설정·워크스페이스·인증 화면 표준 적용"
```

---

### Task 12: 최종 스윕 — 잔여 raw 스페이싱 + 대비/다크 검수 + 빌드

**Files:**
- Modify: grep로 발견되는 잔여 페이지/조직 컴포넌트

- [ ] **Step 1: 잔여 raw 스페이싱 탐색**

```bash
grep -rn "p-6\|pt-8\|p-page" src/renderer/src/components/pages
```
페이지 루트/섹션 수준의 raw `p-6`/`pt-8`이 남아 있으면 규약대로 `p-page`/`space-y-section`으로 치환. (의도된 내부 미세 값은 제외)

- [ ] **Step 2: 대비/다크 검수**

`pnpm dev` 라이트/다크 전환하며 주요 화면(이슈 목록·상세·홈·멤버·설정)에서 본문 텍스트 AA(4.5:1), 배지/링 비텍스트 3:1, glass 위 가독성 회귀 없는지 확인. 문제 발견 시 해당 토큰(`muted-foreground`, `ring`, glass 불투명도)만 조정.

- [ ] **Step 3: 전체 빌드 + 백엔드 테스트 회귀 확인**

```bash
pnpm build
pnpm test
```
Expected: 빌드 성공(타입체크 포함), 백엔드 테스트 전부 통과(영향 없음).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "style(ui): 잔여 스페이싱 토큰 스윕 + 대비/다크 검수"
```

---

## Self-Review (작성자 점검 결과)

- **Spec 커버리지**: radius(T1)·spacing(T1)·sizing(행 밀도 T7·버튼 T3)·elevation(T1)·glass 규칙(T2,T6,T8)·표현 형태(버튼 T3·배지 T4·아바타 T5·목록 T7·카드 T9·인풋 T11)·motion(hover-lift T2,T9)·dark mode(전 태스크 시각 확인 + T12 검수)·토큰 구현 노트(T1,T2)·3단계 롤아웃(Phase 1/2/3) 모두 태스크에 매핑됨.
- **플레이스홀더**: 코드가 필요한 스텝은 실제 코드 블록 제공. 페이지별 스페이싱 치환은 상단 **규약 표**로 구체화(맹목적 일괄 치환 금지 규칙 포함).
- **타입/네이밍 일관성**: 신규 유틸명(`glass-soft`, `gradient-primary`, `hover-lift`, `shadow-glow`, `shadow-panel`)을 T1–T2에서 정의하고 이후 태스크에서 동일 명칭으로 소비. `gradient-primary`는 `:root`/`.dark` 양쪽 `--gradient-primary`로 분기.
- **검증**: 렌더러 테스트 부재를 명시하고 typecheck·read-only biome·시각 확인·빌드·백엔드 회귀로 대체.
