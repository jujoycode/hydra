# Hydra Design Tokens — 전체 토큰 표 & 구현 스니펫

> 동반 문서 [`design-system.md`](./design-system.md)의 근거·진단·마이그레이션을 전제로 한다. 이 문서는 **복붙 가능한 최종 토큰 정의**와 **전체 토큰 표**만 담는다.
> **소스/CSS는 수정하지 않는다.** 아래는 합성/리뷰 단계에서 `src/renderer/src/index.css`에 반영할 제안 스니펫이다.

---

## 1. 권장 `:root` (라이트) — 신설·변경분 포함

```css
:root {
  --radius: 0.625rem;

  /* base */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.49 0 0);        /* CHANGED 0.556 → 0.49  (A-1) */
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0); /* NEW                   (A-2) */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --input-strong: oklch(0.80 0 0);            /* NEW (옵션) 폼 식별성   (A-8) */
  --ring: oklch(0.60 0 0);                    /* CHANGED 0.708 → 0.60  (A-3) */

  /* chart — hue 라/다크 공통 고정 (Okabe-Ito) */
  --chart-1: oklch(0.55 0.13 250);   /* blue   */
  --chart-2: oklch(0.70 0.16 55);    /* orange */
  --chart-3: oklch(0.62 0.12 165);   /* teal   */
  --chart-4: oklch(0.82 0.15 95);    /* yellow */
  --chart-5: oklch(0.58 0.15 330);   /* purple */

  /* sidebar (base 미러 — ring만 A-3 연동) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.60 0 0);            /* CHANGED 0.708 → 0.60 */

  /* status (순서 통일: backlog→todo→in-progress→review→done→blocked) */
  --status-backlog: oklch(0.87 0.01 260);
  --status-todo: oklch(0.62 0.19 250);
  --status-in-progress: oklch(0.77 0.15 85);
  --status-review: oklch(0.59 0.2 293);
  --status-done: oklch(0.65 0.17 162);
  --status-blocked: oklch(0.55 0.22 27);      /* NEW                   (D-5) */

  /* priority (urgent/high 분리) */
  --priority-urgent: oklch(0.55 0.24 25);     /* CHANGED red           (D-4) */
  --priority-high: oklch(0.66 0.19 45);       /* CHANGED → orange      (D-4) */
  --priority-medium: oklch(0.77 0.15 85);
  --priority-low: oklch(0.62 0.04 250);       /* CHANGED 회청 보정 */

  /* arrow (relation_type 정합, blocks hue 분리) */
  --arrow-blocks: oklch(0.6 0.2 350);         /* CHANGED 27 → 350      (A-5) */
  --arrow-is-blocked-by: oklch(0.7 0.18 55);  /* RENAMED blocked-by    (B-1) */
  --arrow-relates-to: oklch(0.55 0.19 255);   /* RENAMED related       (B-1) */
  --arrow-duplicate: oklch(0.55 0.02 260);    /* 보류 (미사용) */
  --arrow-parent: oklch(0.55 0.2 293);        /* 보류 (미사용) */

  /* feedback (status 색 승격) */
  --success: oklch(0.65 0.17 162);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.77 0.15 85);
  --warning-foreground: oklch(0.20 0 0);
  --info: oklch(0.62 0.19 250);
  --info-foreground: oklch(0.985 0 0);

  /* on-color (배지 전경 — 계열 단일화, §design-system 4.4) */
  --on-accent-light: oklch(0.985 0 0);  /* 진한 배지 위 밝은 텍스트 */
  --on-accent-dark: oklch(0.20 0 0);    /* 밝은 배지 위 어두운 텍스트 */
}
```

## 2. 권장 `.dark` (다크) — 신설·변경분 포함

```css
.dark {
  /* base */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);       /* 유지 (이미 여유) */
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 27.325);   /* CHANGED 22.216 → 27.325: 라이트(27.325)와 hue 통일 (A-2) */
  --destructive-foreground: oklch(0.20 0 0);  /* NEW 어두운 전경 (흰텍스트 2.52 회피) (A-2) */
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --input-strong: oklch(1 0 0 / 30%);         /* NEW (옵션) */
  --ring: oklch(0.556 0 0);                   /* 유지 (4.18:1 통과) */

  /* chart — hue 공통 고정, 명도만 +보정 */
  --chart-1: oklch(0.70 0.13 250);   /* blue   */
  --chart-2: oklch(0.78 0.14 55);    /* orange */
  --chart-3: oklch(0.74 0.12 165);   /* teal   */
  --chart-4: oklch(0.88 0.13 95);    /* yellow */
  --chart-5: oklch(0.70 0.14 330);   /* purple */

  /* sidebar */
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.70 0.13 250);    /* chart-1 정렬 (구 264h 보라) */
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);

  /* status */
  --status-backlog: oklch(0.55 0.02 260);
  --status-todo: oklch(0.7 0.15 250);
  --status-in-progress: oklch(0.82 0.12 85);
  --status-review: oklch(0.68 0.17 293);
  --status-done: oklch(0.72 0.14 162);
  --status-blocked: oklch(0.68 0.18 27);      /* NEW */

  /* priority */
  --priority-urgent: oklch(0.65 0.22 25);
  --priority-high: oklch(0.74 0.17 45);       /* orange */
  --priority-medium: oklch(0.82 0.12 85);
  --priority-low: oklch(0.62 0.02 260);

  /* arrow */
  --arrow-blocks: oklch(0.7 0.18 350);        /* magenta */
  --arrow-is-blocked-by: oklch(0.78 0.14 55);
  --arrow-relates-to: oklch(0.65 0.15 255);
  --arrow-duplicate: oklch(0.62 0.02 260);
  --arrow-parent: oklch(0.68 0.17 293);

  /* feedback */
  --success: oklch(0.72 0.14 162);
  --success-foreground: oklch(0.20 0 0);
  --warning: oklch(0.82 0.12 85);
  --warning-foreground: oklch(0.20 0 0);
  --info: oklch(0.7 0.15 250);
  --info-foreground: oklch(0.20 0 0);

  /* on-color (다크에서도 동일 의미 유지) */
  --on-accent-light: oklch(0.985 0 0);
  --on-accent-dark: oklch(0.20 0 0);
}
```

---

## 3. 최종 `@theme inline` (복붙용)

```css
@theme inline {
  /* radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* spacing (NEW — S-1)
     주의(Tailwind v4): --spacing-<key> 를 @theme 에 등록하면 패딩/마진/갭/사이즈 유틸이
     자동 생성된다 → p-page / px-section / gap-card / m-page 등으로 쓴다.
     (theme key 'page' → 'p-page'. CSS 변수 임의값 `p-(--spacing-page)` 도 동작하지만
      등록한 토큰은 'p-page' 단축형이 정식이다.) */
  --spacing-page: 1.5rem;
  --spacing-section: 1rem;
  --spacing-card: 1rem;

  /* base */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground); /* NEW */
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-strong: var(--input-strong);                     /* NEW (옵션) */
  --color-ring: var(--ring);

  /* chart */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* status (NEW 노출 — D-1) */
  --color-status-backlog: var(--status-backlog);
  --color-status-todo: var(--status-todo);
  --color-status-in-progress: var(--status-in-progress);
  --color-status-review: var(--status-review);
  --color-status-done: var(--status-done);
  --color-status-blocked: var(--status-blocked);

  /* priority (NEW 노출 — D-1) */
  --color-priority-urgent: var(--priority-urgent);
  --color-priority-high: var(--priority-high);
  --color-priority-medium: var(--priority-medium);
  --color-priority-low: var(--priority-low);

  /* arrow (NEW 노출 — D-1, 이름 relation_type 정합) */
  --color-arrow-blocks: var(--arrow-blocks);
  --color-arrow-is-blocked-by: var(--arrow-is-blocked-by);
  --color-arrow-relates-to: var(--arrow-relates-to);
  --color-arrow-duplicate: var(--arrow-duplicate);
  --color-arrow-parent: var(--arrow-parent);

  /* feedback (NEW — A-4) */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);

  /* on-color (NEW — §4.4 배지 전경) */
  --color-on-accent-light: var(--on-accent-light);
  --color-on-accent-dark: var(--on-accent-dark);
}
```

> 노출 후 생성되는 유틸 예시: `bg-status-done`, `text-priority-high`, `border-status-blocked`, `text-arrow-blocks`, `bg-success`, `text-warning-foreground`, `text-on-accent-light`, `p-(--spacing-page)`.

---

## 4. typography 유틸 (NEW — S-2)

```css
/* Tailwind v4 권장: @utility (variant 합성 자연스러움). @layer components + @apply 도 호환. */
@utility text-title   { @apply text-2xl font-bold; }
@utility text-section { @apply text-lg font-semibold; }
@utility text-caption { @apply text-xs text-muted-foreground; }
```

> **[Tailwind v4 주의 — 네임스페이스 그림자]** `text-*`는 폰트 크기·텍스트 색 양쪽이 쓰는 네임스페이스다. `text-title`/`text-section`/`text-caption`은 Tailwind 빌트인과 충돌하지 않는 새 이름이라 안전하다. 다만 의미가 색이 아니라 "타입 역할(크기+굵기)"임을 이름으로 분명히 하려면 `type-title` 등 별도 접두사도 고려할 수 있다(취향 — 강제 아님). 색 유틸(`text-muted-foreground` 등)과 한 클래스에 섞여도 CSS 우선순위상 정상 동작한다.

---

## 5. 정적 매핑 객체 (purge 보호 — 권장 패턴)

동적 `bg-status-${value}` 합성은 Tailwind purge에서 누락되므로 **정적 매핑**을 단일 지점에 둔다(코드는 제안 수준).

```ts
// 예: src/renderer/src/lib/statusTokens.ts (제안)
// NOTE: on-color는 토큰 유틸만 사용한다(가이드 #3). `text-white` 같은 raw 색 금지.
// 진한 배지 = 밝은 전경, 밝은 배지(in_progress=노랑) = 어두운 전경.
//
// [중요] 키는 *런타임 status 값*과 정확히 일치해야 한다(design-system §4.6 표 참조).
// 코드는 스네이크 `in_progress`를 쓰므로 키도 스네이크. 동적 합성 대신 정적 매핑이라 purge 안전.
// 현재 코드가 실제로 보내는 값: open / in_progress / review / done / blocked.
// `backlog`/`todo`는 코드 소비 0건 — open question ①(토큰 존속 결정) 전까지는 도입하지 않는다.
export const STATUS_CLASS = {
  open:          'bg-status-backlog text-foreground',          // open→backlog 토큰 임시 매핑(결정 전)
  in_progress:   'bg-status-in-progress text-on-accent-dark',  // 노랑(밝음) → 어두운 전경
  review:        'bg-status-review text-on-accent-light',
  done:          'bg-status-done text-on-accent-light',
  blocked:       'bg-status-blocked text-on-accent-light',
  // backlog / todo: open question ① 결정 후 추가(현재 미사용)
} as const

// 주의: 런타임 IssuePriority 타입은 'low' | 'medium' | 'high' 3단뿐(types/issue.ts:36).
// urgent는 UI/타입에 아직 없다 → open question ④ 결정 전에는 urgent 키가 dead entry다.
export const PRIORITY_CLASS = {
  high:   'text-priority-high',
  medium: 'text-priority-medium',
  low:    'text-priority-low',
  // urgent: 'text-priority-urgent',  // open question ④ — urgent 도입 시 활성화
} as const
```

> 차트처럼 런타임 prop으로 색을 넘겨야 하는 곳은 `getComputedStyle(document.documentElement).getPropertyValue('--chart-1')` 형태의 `getCssVar()` 헬퍼로 토큰값을 읽어 공급한다(라·다크/테마 자동 추종).

---

## 6. 전체 토큰 변경 요약 표

| 토큰 | 분류 | 변경 | 사유 |
|------|------|------|------|
| `--muted-foreground` (light) | base | 0.556 → 0.49 | A-1 본문 AA |
| `--ring` / `--sidebar-ring` (light) | base | 0.708 → 0.60 | A-3 포커스 3:1 |
| `--destructive-foreground` | base | **신설** (L 0.985 / D 0.20) | A-2 |
| `--destructive` (dark) | base | hue 22.216 → 27.325 (라이트와 통일) | A-2 hue 정합 |
| `--on-accent-light` / `--on-accent-dark` | feedback | **신설** (배지 on-color 단일화) | §4.4 |
| `--color-on-accent-*` (2) | @theme | **신설 노출** | §4.4 |
| `--input-strong` | base | **신설(옵션)** | A-8 폼 식별성 |
| `--chart-1..5` (양 테마) | chart | hue 공통 고정 + Okabe-Ito | A-6/A-7 |
| `--status-blocked` | status | **신설** | D-5 |
| status 정의 순서 | status | done↔review 정렬 통일 | B (유지보수) |
| `--priority-urgent` | priority | red 채도↑ (25h) | D-4 |
| `--priority-high` | priority | red → **orange (45h)** | D-4 |
| `--priority-low` | priority | 회청 보정 (250h) | 가독성 |
| `--arrow-blocks` | arrow | 27h → **350h (magenta)** | A-5 |
| `--arrow-blocked-by` | arrow | → `--arrow-is-blocked-by` | B-1 |
| `--arrow-related` | arrow | → `--arrow-relates-to` | B-1 |
| `--success(-foreground)` | feedback | **신설** (status-done 승격) | A-4 |
| `--warning(-foreground)` | feedback | **신설** (status-in-progress 승격) | A-4 |
| `--info(-foreground)` | feedback | **신설** (status-todo 승격) | A-4 |
| `--color-status-*` (6) | @theme | **신설 노출** | D-1 |
| `--color-priority-*` (4) | @theme | **신설 노출** | D-1 |
| `--color-arrow-*` (5) | @theme | **신설 노출** | D-1 |
| `--color-*-foreground` feedback (4) | @theme | **신설 노출** | A-2/A-4 |
| `--spacing-page/section/card` | @theme | **신설** | S-1 |
| `.text-title/.text-section/.text-caption` | components | **신설** | S-2 |
| `--nord0..15` | theme | **제거** | S-3 (dead CSS) |

---

## 관련 문서

- [`design-system.md`](./design-system.md) — 진단·원칙·마이그레이션 체크리스트(상위 문서).
