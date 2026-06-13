# Hydra Design System — 토큰 정비안 (v1.0 OSS 출시 기준)

## Context

Hydra는 "가볍고 심플한" 셀프호스팅 이슈 트래커다(Linear/Plane 지향, 미니멀). 디자인 토큰은 `src/renderer/src/index.css` 한 파일에 OKLCH 기반으로 정의되어 있고, Tailwind CSS v4의 `@theme inline` 블록을 통해 유틸리티 클래스로 노출된다.

이 문서는 4개 렌즈(색·대비 / 시맨틱 토큰 / 스케일·테마 구조 / 토큰 우회 컴플라이언스)의 감사 결과를 단일 보이스로 통합한 **디자인 시스템 정비안**이다. 토큰의 OKLCH 권장값, `@theme inline` 노출 방식, 스케일 표준, `.nord` 처리 결정, 그리고 가이드 #3(인라인 색 금지·토큰으로 조율) 위반 핫스팟의 마이그레이션 체크리스트를 담는다.

> **이 문서의 범위**: 설계 전용. 실제 `.ts/.tsx/.css` 소스는 수정하지 않는다. 모든 코드 변경은 '제안'/diff 스니펫으로만 기술한다. 토큰 전체 표와 복붙용 `@theme inline` 최종본은 동반 문서 [`design-tokens-spec.md`](./design-tokens-spec.md)를 참조.

---

## 1. 디자인 원칙

1. **가볍고 심플 / 미니멀** — Linear/Plane 지향. 색·간격·타이포는 최소한의 의미 축만 두고, 장식적 변형을 늘리지 않는다.
2. **토큰 우선 (가이드 #3)** — 컴포넌트가 `text-red-600`, `#dc2626` 같은 팔레트/raw hex를 직접 칠하지 않는다. **시맨틱은 `@theme inline`에 노출해 `bg-status-done` 같은 유틸로 소비**한다. 색을 바꾸려면 토큰을 바꾼다.
3. **라이트·다크 동등 지원** — `next-themes`의 `attribute='class'` + `.dark` 오버라이드. 두 테마 모두 본문 AA(4.5:1) / 비텍스트 UI 3:1을 만족시키고, 한쪽만 여유롭고 한쪽이 빠듯한 비대칭을 제거한다.
4. **데이터 정체성 유지** — 차트 시리즈, 상태/우선순위 색은 테마 전환 시에도 hue가 유지되어 사용자 멘탈 모델이 깨지지 않는다.
5. **단일 소스 (Single Source of Truth)** — 같은 의미(상태·우선순위·차트 색)는 한 곳(토큰)에서 파생한다. 여러 파일이 같은 색을 hex로 중복 정의하지 않는다.

---

## 2. 현황 진단 요약 (우선순위 표)

| # | 심각도 | 영역 | 이슈 | 핵심 조치 |
|---|--------|------|------|-----------|
| D-1 | **High** | 구조 | 시맨틱 토큰(status/priority/arrow)이 `@theme inline`에 미노출 → 유틸 클래스 미생성 → 코드 소비 0건 | `@theme inline`에 `--color-status-*` 등 노출 (모든 토큰화의 선결조건) |
| D-2 | **High** | 컴플라이언스 | `Badge.tsx`가 10개 colorScheme(gray/red/orange/yellow/green/teal/blue/cyan/purple/pink) × 4 variant(solid/subtle/outline/surface) 팔레트 리터럴(compoundVariants 40개, [Badge.tsx:33–234](../../src/renderer/src/components/atoms/Badge.tsx))를 하드코딩. solid variant는 추가로 `text-white` raw 색 사용([Badge.tsx:37,42,…](../../src/renderer/src/components/atoms/Badge.tsx)) | 시맨틱 variant 경로 신설 → 토큰 유틸 치환 |
| D-3 | **High** | 컴플라이언스 | `IssueColumns` / `ProjectDetailPage` / `CreateIssueDialog`가 status·priority 색을 hex/팔레트로 제각각 하드코딩 | 공용 헬퍼가 토큰 유틸 반환하도록 통일 |
| D-4 | **High** | 시맨틱 | `priority-urgent` == `priority-high` (라·다크 모두 동일 OKLCH) → 4단계 구분 불가 | urgent=red 유지, high=주황으로 hue 분리 |
| D-5 | **High** | 정합성 | 토큰 키(backlog/todo/in-progress/review/done)와 런타임 status 값이 불일치. 런타임은 파일마다 다름: `IssueDetailPage.tsx:21` STATUS_OPTIONS=`open/in_progress/review/done/blocked`, `IssueTable.tsx:87` 및 `IssueBadge.tsx:4` IssueState=`in_progress/done/blocked/review`(open 없음), `mapIssue.ts:5` 동일+기본값 `in_progress`. **`backlog`·`todo` 토큰은 런타임 소비 0건**, `blocked` 토큰은 부재. DB `issue_status`는 enum이 아닌 free `varchar(50)`([schema.ts:59](../../src/main/core/database/schema/drizzle/schema.ts)) — 무엇도 강제하지 않음 | status 값 집합 표준화(open 흡수 여부 결정) + 토큰 키 정합(backlog/todo 존속 여부) + 케밥/스네이크 규약 통일 |
| A-1 | **High** | 대비 | 라이트 `muted-foreground`(L0.556) on muted(L0.97) ≈4.34:1 → 본문 AA 미달 | 라이트 muted-foreground L 0.556 → 0.49 |
| A-2 | **High** | 대비 | `--destructive-foreground` 부재 → 파괴 액션 텍스트 대비 미정의 (다크 흰텍스트 ≈2.52:1) | `--destructive-foreground` 신설 (라·다크 대칭) |
| A-3 | Medium | 대비 | 라이트 `--ring`(L0.708) on 흰배경 ≈2.59:1 → 포커스 링 UI 3:1 미달 | 라이트 ring L 0.708 → 0.60 (또는 유채색 ring) |
| A-4 | Medium | 시맨틱 | success/warning/info 색 부재 → 인라인 색 우회 유발 | 기존 status 색을 승격해 `--success/--warning/--info` 신설 |
| A-5 | Medium | 시맨틱 | `arrow-blocks` == priority red → 관계/우선순위 색 혼선 | arrow-blocks hue를 27에서 분리 |
| A-6 | Medium | 차트 | chart-1..5 hue가 라·다크 완전 재배치 → 데이터 정체성 붕괴 | 시리즈별 hue 라·다크 공통 고정, 명도만 보정 |
| A-7 | Medium | 차트 | 색맹(적록) 미고려, 다크 chart-5(빨강)≈destructive | Okabe-Ito 계열로 hue 간격·ΔL≥0.12 확보 |
| S-1 | Medium | 스케일 | spacing 토큰 부재 → 페이지 패딩 p-6/pt-8/p-4 제각각 | `--spacing-page/section/card` 토큰 + 표준 수렴 |
| S-2 | Medium | 스케일 | typography 스케일 부재 → H1 text-2xl/3xl/xl 혼재 | `.text-title/.text-section/.text-caption` 유틸 |
| S-3 | Medium | 테마 | `.nord` 완전한 고아 (dead CSS) | v1.0 스코프에서 **제거** 권장 |
| B-1 | Medium | 정합성 | arrow 토큰명(`--arrow-blocked-by`/`--arrow-related`)이 런타임에서 실제 쓰는 관계 문자열과 불일치. **provenance 정정**: 관계 값은 DB enum이 아니라 렌더러 리터럴 배열 `['blocks','is_blocked_by','relates_to']`([IssueDetailPage.tsx:586](../../src/renderer/src/components/pages/IssueDetailPage.tsx))이며, DB `relation_type`은 free `varchar`/`string`([IssueRelationRepository.ts:12](../../src/main/core/database/repository/interfaces/IssueRelationRepository.ts))이라 어떤 값도 강제하지 않음 | 토큰명을 렌더러 관계 리터럴(`is_blocked_by`/`relates_to`)과 정합 |
| A-8 | Low | 대비 | 라이트 border/input(L0.922) on 흰배경 ≈1.26:1 → 폼 식별성 낮음 | input 전용 경계 토큰 분리 (L≈0.80) |
| S-4 | Low | 스케일 | `Sidebar.tsx:286` `peer-data-[variant=inset]:rounded-xl` (inset 변형의 윈도우 라운딩) | **검증 필요** — 사이드바 카드가 아니라 inset 윈도우 모서리다. 같은 파일 :224 floating 변형은 `rounded-lg`. 컨텍스트가 다르므로 무비판 통일 금지(아래 주석 참조) |

> radius 4단 스케일(`sm/md/lg/xl`)은 이미 일관적이며 `@theme`에 노출되어 정상 동작한다. 손대지 않는다.
>
> **[정정 — S-4 스폿체크]** `Sidebar.tsx:286`의 `rounded-xl`은 `md:peer-data-[variant=inset]:rounded-xl`로, `variant="inset"`일 때 **메인 콘텐츠 inset 패널의 윈도우 모서리**를 둥글리는 값이다. 같은 파일 `:224`는 `variant="floating"`일 때 사이드바 자체에 `rounded-lg`를 준다. 즉 둘은 **서로 다른 변형 컨텍스트**라 "사이드바 카드 lg와 불일치"라는 원래 근거는 성립하지 않는다. shadcn sidebar 원본의 inset 디자인 의도(2px 마진 + xl 라운딩)일 가능성이 높으므로, **맹목적 `rounded-lg` 치환은 보류**하고 inset 변형을 실제 사용하는지부터 확인한다(미사용이면 정리 대상조차 아님).

---

## 3. 색 토큰 레퍼런스

### 3.1 Base 토큰 (현황 + 권장 조정)

| 토큰 | 라이트 (현재) | 다크 (현재) | 용도 | 권장 조정 |
|------|---------------|-------------|------|-----------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | 페이지 배경 | 유지 |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | 본문 텍스트 | 유지 |
| `--card` / `-foreground` | `1 0 0` / `0.145` | `0.205` / `0.985` | 카드 표면 | 유지 |
| `--popover` / `-foreground` | `1 0 0` / `0.145` | `0.205` / `0.985` | 팝오버 | 유지 |
| `--primary` / `-foreground` | `0.205` / `0.985` | `0.922` / `0.205` | 주요 액션 | 유지 |
| `--secondary` / `-foreground` | `0.97` / `0.205` | `0.269` / `0.985` | 보조 표면 | 유지 |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | 음소거 표면 | 유지 |
| `--muted-foreground` | `oklch(0.556 0 0)` ⚠ | `oklch(0.708 0 0)` | 보조 텍스트 | **라이트 → `oklch(0.49 0 0)`** (A-1) |
| `--accent` / `-foreground` | `0.97` / `0.205` | `0.269` / `0.985` | 강조 표면 | 유지 |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` ⚠ | 파괴 액션 | **hue 통일(27.3)**, 다크 L 검토 (A-2/A-5) |
| `--destructive-foreground` | **부재** ⚠ | **부재** ⚠ | 파괴 액션 텍스트 | **신설**: 라이트 `oklch(0.985 0 0)`, 다크 `oklch(0.20 0 0)` (A-2) |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | 경계 | 유지 (장식) |
| `--input` | `oklch(0.922 0 0)` ⚠ | `oklch(1 0 0 / 15%)` | 입력 경계 | **별도 강화 검토** L≈0.80 (A-8) |
| `--ring` | `oklch(0.708 0 0)` ⚠ | `oklch(0.556 0 0)` | 포커스 링 | **라이트 → `oklch(0.60 0 0)`** (A-3) |

⚠ = 대비/일관성 위험 페어.

### 3.2 Sidebar 토큰

사이드바 토큰(`--sidebar`, `--sidebar-foreground`, `--sidebar-primary(-foreground)`, `--sidebar-accent(-foreground)`, `--sidebar-border`, `--sidebar-ring`)은 base 색을 미러링하며 `@theme inline`에 정상 노출되어 있다. **조정 불필요.** 단, `--sidebar-ring`은 base `--ring`과 동일 값이라 A-3 조정 시 함께 검토한다.

### 3.3 Chart 토큰 (라·다크 hue 재배치 문제 + 재설계 방향)

**문제**: 같은 시리즈가 테마 전환 시 전혀 다른 색으로 보인다. 다크 chart-5(hue 16, 빨강)는 destructive(hue 22~27)와 근접해 "오류=빨강"과 혼동된다.

| 시리즈 | 라이트 (현재) | 다크 (현재) | 라이트 hue → 다크 hue |
|--------|---------------|-------------|------------------------|
| chart-1 | `0.646 0.222 41` (주황) | `0.488 0.243 264` (보라) | 41 → 264 ❌ |
| chart-2 | `0.6 0.118 185` (청록) | `0.696 0.17 162` (녹색) | 185 → 162 ❌ |
| chart-3 | `0.398 0.07 227` (파랑) | `0.769 0.188 70` (노랑) | 227 → 70 ❌ |
| chart-4 | `0.828 0.189 84` (노랑) | `0.627 0.265 304` (자홍) | 84 → 304 ❌ |
| chart-5 | `0.769 0.188 70` (노랑) | `0.645 0.246 16` (빨강) | 70 → 16 ❌ |

**재설계 원칙 (A-6/A-7)**:
- 시리즈별 **hue를 라·다크 공통 고정**, 명도만 테마 보정.
- **Okabe-Ito 색맹 안전 팔레트** 계열로 hue 간격 확대 + 시리즈 간 **ΔL≥0.12** 확보.
- chart-5를 destructive hue(22~27)에서 분리.

권장 hue 고정안(Okabe-Ito 매핑, OKLCH 근사):

| 시리즈 | 의미색 | hue(공통) | 라이트 L·C | 다크 L·C |
|--------|--------|-----------|------------|----------|
| chart-1 | 파랑 (Blue) | 250 | `0.55 0.13` | `0.70 0.13` |
| chart-2 | 주황 (Orange) | 55 | `0.70 0.16` | `0.78 0.14` |
| chart-3 | 청록 (Bluish green) | 165 | `0.62 0.12` | `0.74 0.12` |
| chart-4 | 노랑 (Yellow) | 95 | `0.82 0.15` | `0.88 0.13` |
| chart-5 | 자주 (Reddish purple) | 330 | `0.58 0.15` | `0.70 0.14` |

> recharts는 빌드타임 클래스가 아닌 런타임 prop으로 색을 받는다. SVG `fill`에 `oklch()` 문자열을 직접 넣을 때 구형 Chromium/Electron 호환성을 검증해야 한다(open question). 미지원 시 `getComputedStyle`로 토큰값을 읽어 공급하거나 hex/rgb를 병행 노출한다.

---

## 4. 시맨틱 토큰 정비안 (status / priority / arrow)

### 4.1 (a) `@theme inline` 노출 — 모든 토큰화의 선결조건 (D-1)

현재 `--status-*`, `--priority-*`, `--arrow-*`는 `:root`/`.dark`에 정의돼 있으나 `@theme inline` 블록에 매핑이 없어 `bg-status-done` 같은 유틸이 **생성되지 않는다**. 그 결과 코드 소비가 0건이고 모든 상태/우선순위 색이 팔레트로 우회된다. 아래 매핑을 추가하면 즉시 유틸로 사용 가능해진다.

**제안 diff** (`src/renderer/src/index.css`, `@theme inline` 블록 끝에 추가):

```diff
   --color-sidebar-border: var(--sidebar-border);
   --color-sidebar-ring: var(--sidebar-ring);
+
+  /* Semantic: status */
+  --color-status-backlog: var(--status-backlog);
+  --color-status-todo: var(--status-todo);
+  --color-status-in-progress: var(--status-in-progress);
+  --color-status-review: var(--status-review);
+  --color-status-done: var(--status-done);
+  --color-status-blocked: var(--status-blocked);
+
+  /* Semantic: priority */
+  --color-priority-urgent: var(--priority-urgent);
+  --color-priority-high: var(--priority-high);
+  --color-priority-medium: var(--priority-medium);
+  --color-priority-low: var(--priority-low);
+
+  /* Semantic: arrow (issue relations) */
+  --color-arrow-blocks: var(--arrow-blocks);
+  --color-arrow-is-blocked-by: var(--arrow-is-blocked-by);
+  --color-arrow-relates-to: var(--arrow-relates-to);
+  --color-arrow-duplicate: var(--arrow-duplicate);
+  --color-arrow-parent: var(--arrow-parent);
+
+  /* Semantic: feedback (success/warning/info) */
+  --color-success: var(--success);
+  --color-success-foreground: var(--success-foreground);
+  --color-warning: var(--warning);
+  --color-warning-foreground: var(--warning-foreground);
+  --color-info: var(--info);
+  --color-info-foreground: var(--info-foreground);
+  --color-destructive-foreground: var(--destructive-foreground);
```

> 동적 클래스 합성(`bg-status-${value}`)은 Tailwind purge에서 누락될 수 있다. **정적 매핑 객체**(예: `const STATUS_CLASS = { done: 'bg-status-done text-status-done-foreground', ... }`)를 쓰거나 safelist로 보호한다.

### 4.2 (b) urgent/high 분리 + arrow 색 충돌 해소

**urgent == high 문제 (D-4)**: 두 우선순위가 픽셀 단위로 동일하다. urgent는 채도 높은 적색을 유지하고, high를 주황으로 이동해 4단계가 단조 그라데이션을 이루게 한다.

**arrow-blocks == priority red 문제 (A-5)**: 관계 'blocks'와 우선순위가 한 화면(이슈 상세)에 공존할 때 같은 빨강으로 보인다. arrow는 별도 의미축이므로 hue를 분리한다. (또는 관계는 아이콘+방향으로 구분하고 색은 보조 강조로만 쓴다 — open question.)

### 4.3 (c) success / warning / info 신설 (A-4)

상태 표현 색이 destructive(빨강) 하나뿐이라 토스트·검증 경고·정보 배너가 인라인 색으로 우회한다. **기존 status 색을 승격**하면 중복 없이 해결된다:

- `--success` ← `--status-done` (녹색 162h)
- `--warning` ← `--status-in-progress` / `--priority-medium` (노랑 85h)
- `--info` ← `--status-todo` (파랑 250h)

### 4.4 (d) `-foreground` 변형

base 토큰은 모두 `(색 + -foreground)` 쌍을 갖지만 status/priority/arrow는 배경색만 있어, 배지 텍스트 가독성이 토큰으로 보장되지 않는다(컴포넌트가 `text-white` 임의 지정). 미니멀 원칙상 **계열별 단일 on-color 두 개**로 단순화한다:

- `--on-accent-light: oklch(0.985 0 0)` (밝은 텍스트 — 진한 배지 위)
- `--on-accent-dark: oklch(0.20 0 0)` (어두운 텍스트 — 밝은 배지 위)

각 시맨틱 배경의 명도에 따라 둘 중 하나를 매핑한다. `subtle` 배지(연한 배경 + 진한 텍스트)는 같은 hue의 토큰을 `text-*`로 재사용한다.

> **[정합성 — 동반 문서와 일치 필수]** 위 `--on-accent-*` 2-토큰안을 채택할 경우, `@theme inline`에 `--color-on-accent-light: var(--on-accent-light)` / `--color-on-accent-dark: var(--on-accent-dark)`를 **반드시 함께 노출**해야 유틸(`text-on-accent-light`)이 생성된다(동반 spec §3에 누락 시 §4.4와 모순). 또한 동반 문서 §5의 `STATUS_CLASS` 예시가 `text-white`(raw 색, 가이드 #3 위반)를 쓰고 있는데, 이는 본 절의 토큰안과 직접 충돌한다 — `review/blocked`의 on-color도 `text-on-accent-light`(또는 `text-success-foreground` 류 시맨틱 foreground)로 통일한다. 두 토큰안(계열별 단일 on-color) vs. 시맨틱별 `-foreground`(success/warning/info-foreground)는 **하나만** 채택하고 양 문서를 동기화해야 한다(open question — 미니멀 원칙상 2-토큰안 권장).

### 4.5 시맨틱 토큰 OKLCH 권장값 표

#### Status (정의 순서 라·다크 통일: backlog → todo → in-progress → review → done → blocked)

| 토큰 | 라이트 (현재 → 권장) | 다크 (현재 → 권장) | 비고 |
|------|----------------------|---------------------|------|
| `--status-backlog` | `0.87 0.01 260` (유지) | `0.55 0.02 260` (유지) | 회색 |
| `--status-todo` | `0.62 0.19 250` (유지) | `0.7 0.15 250` (유지) | 파랑 → info 승격 |
| `--status-in-progress` | `0.77 0.15 85` (유지) | `0.82 0.12 85` (유지) | 노랑 → warning 승격 |
| `--status-review` | `0.59 0.2 293` (유지) | `0.68 0.17 293` (유지) | 보라 |
| `--status-done` | `0.65 0.17 162` (유지) | `0.72 0.14 162` (유지) | 녹색 → success 승격 |
| `--status-blocked` | **신설 `0.55 0.22 27`** | **신설 `0.68 0.18 27`** | 빨강 (destructive와 구분된 채도) (D-5) |

#### Priority (urgent/high 분리)

| 토큰 | 라이트 (현재 → 권장) | 다크 (현재 → 권장) | 비고 |
|------|----------------------|---------------------|------|
| `--priority-urgent` | `0.58 0.22 27` → **`0.55 0.24 25`** | `0.7 0.18 27` → **`0.65 0.22 25`** | 채도 높은 적색 |
| `--priority-high` | `0.58 0.22 27` → **`0.66 0.19 45`** | `0.7 0.18 27` → **`0.74 0.17 45`** | **주황으로 hue 이동** (D-4) |
| `--priority-medium` | `0.77 0.15 85` (유지) | `0.82 0.12 85` (유지) | 노랑 |
| `--priority-low` | `0.55 0.02 260` → **`0.62 0.04 250`** | `0.62 0.02 260` (유지) | 회청 |

#### Arrow (렌더러 관계 리터럴과 이름 정합 — B-1)

관계 값의 단일 소스는 [IssueDetailPage.tsx:586](../../src/renderer/src/components/pages/IssueDetailPage.tsx)의 `['blocks', 'is_blocked_by', 'relates_to']` 배열이다(DB `relation_type`은 free varchar이라 강제력 없음). 현재 UI는 이 3개만 생성·소비한다.

| 토큰 (구 → 신) | 라이트 권장 | 다크 권장 | 관계 리터럴 |
|----------------|-------------|-----------|----------------|
| `--arrow-blocks` (유지) | **`0.6 0.2 350`** (마젠타) | **`0.7 0.18 350`** | `blocks` |
| `--arrow-blocked-by` → **`--arrow-is-blocked-by`** | `0.7 0.18 55` (유지) | `0.78 0.14 55` (유지) | `is_blocked_by` |
| `--arrow-related` → **`--arrow-relates-to`** | `0.55 0.19 255` (유지) | `0.65 0.15 255` (유지) | `relates_to` |
| `--arrow-duplicate` (유지) | `0.55 0.02 260` (유지) | `0.62 0.02 260` (유지) | (UI 미생성 — 보류) |
| `--arrow-parent` (유지) | `0.55 0.2 293` (유지) | `0.68 0.17 293` (유지) | (UI 미생성 — 보류) |

> `duplicate`/`parent`는 현재 UI(IssueDetailPage 관계 입력)에서 생성·소비되지 않는 고아다. v1.0에서 실제 지원하지 않으면 주석으로 보류 표시하거나 제거한다(open question). arrow-blocks는 27→350으로 옮겨 priority red와 분리한다.

#### Feedback (신설)

| 토큰 | 라이트 | 다크 | 출처 |
|------|--------|------|------|
| `--success` / `-foreground` | `0.65 0.17 162` / `0.985 0 0` | `0.72 0.14 162` / `0.20 0 0` | status-done 승격 |
| `--warning` / `-foreground` | `0.77 0.15 85` / `0.20 0 0` | `0.82 0.12 85` / `0.20 0 0` | status-in-progress 승격 |
| `--info` / `-foreground` | `0.62 0.19 250` / `0.985 0 0` | `0.7 0.15 250` / `0.20 0 0` | status-todo 승격 |
| `--destructive-foreground` | `0.985 0 0` | `0.20 0 0` | 신설 (A-2) |

### 4.6 정합성: status enum 표준화 + 명명 규약 (D-5, B-1)

**[스폿체크 — 실제 런타임 현황]** DB는 `issue_status`를 free `varchar(50)`로 두고 enum을 강제하지 않는다([schema.ts:59](../../src/main/core/database/schema/drizzle/schema.ts)). 따라서 "단일 런타임 enum"은 존재하지 않으며, 파일마다 다른 집합을 쓴다:

| 소비처 | status 값 집합 | 비고 |
|--------|----------------|------|
| `IssueDetailPage.tsx:21` STATUS_OPTIONS | open / in_progress / review / done / blocked | `open` 포함, `setStatus('open')` 기본 |
| `IssueTable.tsx:87` 필터 | in_progress / done / blocked / review | `open` 없음 |
| `IssueBadge.tsx:4` `IssueState` 타입 | in_progress \| done \| blocked \| review | 4값 union |
| `mapIssue.ts:5` `ISSUE_STATES` | in_progress / done / blocked / review | 미지정 시 기본 `in_progress` |
| `ProjectDetailPage.tsx:50–53`, `HomePage.tsx:45` 집계 | open / in_progress / done / blocked / review | `open` 포함 |
| 토큰(`index.css`) | backlog / todo / in-progress / review / done | **backlog·todo는 소비 0건, blocked 토큰 부재** |

→ 핵심 불일치: **(a) `backlog`·`todo` 토큰은 어디서도 쓰이지 않는 고아**, **(b) 코드가 쓰는 `open`·`blocked`에 대응하는 토큰이 없다**(blocked는 D-5에서 신설). `review`/`in_progress`/`done`만 토큰·코드 교집합이다.

- **표준 status 집합 채택안**: 토큰 5개를 코드 기준으로 재정렬한다. 권장: `open(또는 backlog/todo로 흡수) / in_progress / review / done / blocked`. backlog/todo를 정식 채택할지(→ 코드에 도입), 아니면 토큰에서 제거할지를 먼저 결정한다.
- **케밥/스네이크 규약**: 코드 값은 스네이크(`in_progress`), 토큰 키는 케밥(`in-progress`)이라 변환이 필요하다. 단일 변환 헬퍼(`status.replace(/_/g,'-')`)를 한 지점(예: `statusTokens.ts`)에 두거나 §5 STATUS_CLASS 같은 정적 매핑으로 흡수한다. arrow 토큰명은 렌더러 관계 리터럴(`is_blocked_by`, `relates_to`, [IssueDetailPage.tsx:586](../../src/renderer/src/components/pages/IssueDetailPage.tsx))과 정합한다.

> **[정합성 경고 — priority]** 우선순위 토큰은 `urgent/high/medium/low` 4단이지만, 런타임 타입은 `IssuePriority = 'low' | 'medium' | 'high'` 3단뿐이다([types/issue.ts:36,45](../../src/renderer/src/types/issue.ts)); `CreateIssueDialog`에도 urgent 옵션이 없다. 따라서 **D-4의 urgent/high hue 분리는 "urgent를 v1.0 UI에 도입한다"는 전제가 충족돼야 의미가 있다.** urgent를 도입하지 않으면 `--priority-urgent` 토큰은 고아이고, 분리 작업은 보류 대상이다(아래 open question ④).

> **open question (소비처 결정 필요)**: ① v1.0 정식 status 집합(open/backlog/todo 중 무엇을 채택하고 무엇을 토큰에서 제거할지), ② 관계 시각화에서 색을 의미 채널로 쓸지 아이콘만 쓸지, ③ duplicate/parent 지원 여부, ④ **urgent를 우선순위 UI/타입에 도입할지**(미도입이면 urgent 토큰·D-4 분리 보류). 이 결정이 토큰 존속·키 정합의 단일 소스를 정한다.

---

## 5. 스케일 표준

### 5.1 Radius (현 4단 유지)

| 토큰 | 계산 | 값 | 용도 매핑 |
|------|------|-----|-----------|
| `--radius-sm` | `radius - 4px` | 6px | 칩, 메뉴 아이템, Tabs trigger |
| `--radius-md` | `radius - 2px` | 8px | Button, Input, Badge, Select, Tooltip, Textarea, Popover |
| `--radius-lg` | `radius` | 10px | Dialog, StatCard, Sidebar 카드 |
| `--radius-xl` | `radius + 4px` | 14px | Card |
| `rounded-full` | — | — | Avatar, 풀 배지 |

> 규칙 명문화: **카드=lg, 컨트롤=md, 칩/메뉴아이템=sm, 아바타/풀배지=full.** 유일한 이탈 `Sidebar.tsx:286 rounded-xl`을 `rounded-lg`로 통일(S-4).

### 5.2 Spacing (토큰화 — S-1)

페이지 패딩이 제각각이다. 다수파(WorkspacePage, MyIssuesPage, ProjectDetailPage, MembersPage, NotificationsPage 등 10개 페이지)는 `p-6` 계열을 쓰지만, **`ProjectsPage.tsx:29`는 `p-12 pt-8 pb-4`** (좌우 3rem, 상 2rem, 하 1rem)로 크게 이탈하고 내부 `:42`는 다시 `pt-8`을 중복으로 준다. 시맨틱 spacing 별칭을 도입해 조율한다.

> **[정정 — S-1 스폿체크]** 원래 표기 `pt-8 pb-4`는 ProjectsPage 루트의 좌우 `p-12`를 누락한 것이다. 실제 루트는 `p-12 pt-8 pb-4`이며, 표준화 시 `p-12`(과한 좌우 패딩)를 먼저 `p-page`(또는 변수형 `p-(--spacing-page)`)로 끌어내려야 한다.

**제안 스니펫** (`@theme inline`):

```css
@theme inline {
  --spacing-page: 1.5rem;     /* → p-page  (p-6 = 페이지 루트) */
  --spacing-section: 1rem;    /* → gap-section (섹션 간) */
  --spacing-card: 1rem;       /* → p-card  (p-4 = 카드 내부) */
}
```

> **[Tailwind v4]** `--spacing-<key>` 를 등록하면 `p-/px-/m-/gap-/w-/h-` 등 spacing 기반 유틸이 자동 생성된다 → `p-page`, `gap-section`, `p-card`. 변수 임의값 `p-(--spacing-page)`도 유효하나 단축형이 정식.

페이지 루트는 `p-page`(또는 변수형 `p-(--spacing-page)`)(또는 공용 `PageContainer` 템플릿)로 일괄. 우선 `ProjectsPage`(`p-12 pt-8 pb-4` + 내부 중복 `pt-8`)를 표준 `p-6`로 수렴, 카드 내부 `p-3/p-4/p-8` 혼재를 `p-card` 기준으로 정리한다.

### 5.3 Typography (타입 스케일 — S-2)

H1이 `text-2xl/3xl/xl`, 섹션 헤더가 `semibold/medium`으로 혼재한다. 의미 기반 유틸을 도입한다.

**제안 스니펫** (`@layer components`):

```css
/* Tailwind v4: @layer components + @apply 도 동작하지만, v4 권장은 @utility 다.
   @utility 는 유틸 레이어에 등록돼 variant(`md:text-title`, `dark:` 등) 합성이 자연스럽다. */
@utility text-title   { @apply text-2xl font-bold; }       /* 페이지 H1 */
@utility text-section { @apply text-lg font-semibold; }    /* 섹션 H2 */
@utility text-caption { @apply text-xs text-muted-foreground; } /* 캡션/메타 */
```

> 대안(레거시 호환): `@layer components { .text-title { @apply ... } }` — 동작은 하나 variant 합성이 제한적이므로 v4 신규 정의는 `@utility`를 권장.

| 역할 | 유틸 | 적용 대상 (수렴) |
|------|------|------------------|
| 페이지 제목 H1 | `.text-title` | 모든 페이지 (WorkspacePage `text-3xl`, ProjectsPage `text-xl font-semibold` 이탈 흡수) |
| 섹션 제목 H2 | `.text-section` | ProjectDetailPage/ProjectSettingsPage (semibold) + MembersPage/NotificationsPage (medium) 통일 |
| 캡션/메타 | `.text-caption` | 설명문, 메타 라벨 |

> body 타이포(Pretendard, letter-spacing -0.2px, line-height 1.5)는 유지. 상위 원칙: **"시맨틱은 `@theme`에 노출한다"** — 색·간격·타이포를 같은 원칙으로 정리한다.

---

## 6. `.nord` 테마 처리 결정

**결정: v1.0에서 제거 (옵션 A).**

근거:
- `.nord`는 완전한 고아다. `src` 전체에서 `nord` 문자열은 `index.css:117–133` 정의 블록에만 존재하며(Grep `nord` → `index.css` 1건), `.nord` 클래스를 부착하는 코드가 없다.
- **[스폿체크] 블록 자체가 이미 불완전하다**: `--nord3`가 정의돼 있지 않아 nord2 다음 nord4로 건너뛴다(Nord 팔레트 16색 중 15색만). 미완성 + 미사용이라는 점이 제거 근거를 한층 강화한다.
- `next-themes`는 `main.tsx:21`에서 `attribute='class' defaultTheme='light' enableSystem={false}`, `themes` 배열 미지정이라 기본 `['light','dark']`만 인식 — `'nord'`는 `setTheme` 대상조차 아니다.
- `--nord0..15`는 어떤 `--color-*` / 시맨틱에도 `var()`로 참조되지 않아 빌드에 포함돼도 무효 코드(dead CSS)다.
- "가볍고 심플" 컨셉에 군더더기.

**승격(옵션 B)을 택할 경우 필요 작업** (멀티테마 로드맵 확정 시 별도 작업으로 분리):
1. `main.tsx` ThemeProvider에 `themes={['light','dark','nord']}` 추가.
2. `.nord` 블록을 원자값(`--nord0..15`)이 아닌 **시맨틱 토큰 전체**(`--background`~`--status-*`/`--priority-*`/`--arrow-*`) 재정의로 확장.
3. 토글 UI를 2진(dark↔light) → 3진 또는 select로 확장.

> open question: 멀티테마가 v1.0 로드맵에 포함되는가? 단일 light/dark 고정이면 제거가 정답이다.

---

## 7. 토큰 적용 목업 (적용 예시)

### 이슈 카드 (칸반)

```
┌────────────────────────────────────┐
│ HYD-142          [●urgent]         │  ← text-priority-urgent (적색 25h)
│ 로그인 토큰 만료 처리 버그          │
│                                    │
│ [bg-status-in-progress] 진행 중     │  ← bg-status-in-progress (노랑 85h)
│ (최)  Bug                          │
└────────────────────────────────────┘
   ↑ 좌측 보더: border-l-4 border-status-in-progress
```

### Status 배지 범례

```
○ Backlog       text-status-backlog       (회색  260h)
◑ Todo          text-status-todo          (파랑  250h)  → info
◐ In Progress   text-status-in-progress   (노랑   85h)  → warning
◓ Review        text-status-review        (보라  293h)
● Done          text-status-done          (녹색  162h)  → success
▲ Blocked       text-status-blocked       (빨강   27h)  [신설]
```

### Priority 배지 범례 (urgent/high 분리 후)

```
⏶⏶ Urgent   text-priority-urgent   적색  25h  L0.55
⏶  High     text-priority-high     주황  45h  L0.66   ← 분리됨
▪  Medium   text-priority-medium   노랑  85h  L0.77
⏷  Low      text-priority-low      회청 250h  L0.62
```

### 관계 화살표 범례 (arrow, hue 분리 후)

```
blocks         ──▶  text-arrow-blocks        마젠타 350h  (priority red와 분리)
is_blocked_by  ◀──  text-arrow-is-blocked-by  주황   55h
relates_to     ◀─▶  text-arrow-relates-to     파랑  255h
duplicate      ┈┈▶  text-arrow-duplicate      회색  260h  (보류)
parent         ──▶  text-arrow-parent         보라  293h  (보류)
```

---

## 8. 마이그레이션 / 구현 체크리스트

> 가이드 #3 위반 핫스팟을 토큰화로 치환하는 단계. 감사 D의 위반 목록을 우선순위화. **선결조건(8.1)을 먼저** 처리해야 나머지가 가능하다.

### 8.1 선결조건 — 토큰 인프라 (가장 먼저)

- [ ] **[D-1] `@theme inline`에 시맨틱 노출** — `index.css`에 §4.1 diff 적용 (status/priority/arrow/feedback `--color-*` 매핑). *이게 없으면 아래 모든 토큰화 불가.*
- [ ] **[A-2] `--destructive-foreground` 신설** + `@theme` 매핑.
- [ ] **[A-4] success/warning/info 신설** (status 색 승격) + `@theme` 매핑.
- [ ] **[D-4] priority-urgent/high 분리**, **[A-5] arrow-blocks hue 분리**, **[D-5] `--status-blocked` 신설**.
- [ ] **[A-1/A-3] 대비 조정** — 라이트 muted-foreground L0.49, 라이트 ring L0.60.
- [ ] **[A-6/A-7] chart 재설계** — hue 라·다크 고정 + Okabe-Ito.
- [ ] **[B-1/D-5] 정합성** — status 값 집합 표준화(§4.6 표 기준: 코드는 open/in_progress/review/done/blocked 사용, backlog/todo 토큰 존속 여부 결정), arrow 토큰명을 렌더러 관계 리터럴과 정합, 케밥(토큰)/스네이크(코드) 변환 헬퍼 단일화.

### 8.2 컴플라이언스 핫스팟 (High → Low)

| 우선 | 파일 | 현재 위반 | 치환 방향 |
|------|------|-----------|-----------|
| **Top1** | `index.css @theme inline` | 시맨틱 미노출 | §4.1 diff (8.1 완료) |
| **Top2** | `atoms/Badge.tsx` | 10 colorScheme × 4 variant 팔레트 리터럴(compoundVariants 40개) + solid `text-white`. 추가로 base cva가 `bg-opacity-20`(subtle)/`bg-opacity-10`(surface) 사용([Badge.tsx:9,11](../../src/renderer/src/components/atoms/Badge.tsx)) — **Tailwind v4에서 `bg-opacity-*` 유틸은 제거됨**(`bg-{color}/20` 슬래시 문법으로 대체). 즉 subtle/surface 불투명도가 현재 무효일 수 있음 | 시맨틱 variant(status/priority/success/warn/danger/info/neutral) 경로 신설, CVA를 토큰 유틸 기반으로 단일화. `bg-opacity-*`는 `bg-token/NN` 슬래시 문법으로 교체 |
| **Top3** | `molecules/issues/IssueColumns.tsx` | `#dc2626`/`#16a34a` hex + `text-red-600` 등 | 공용 `getPriorityClass()`/`getStatusClass()`가 `text-priority-*`/`bg-status-*` 반환 |
| **Top3** | `pages/ProjectDetailPage.tsx` | statusColorMap/priorityColorMap/StatCard 팔레트 | 동일 공용 헬퍼로 통일, `bg-status-*`/`text-priority-*` |
| **Top3** | `organisms/dialogs/CreateIssueDialog.tsx` | 셀렉트 아이콘 `text-red-500` 등 (IssueColumns와 값 불일치) | 동일 헬퍼로 통합 (red-500/red-600/#dc2626 단일화) |
| **Top4** | `pages/HomePage.tsx` | `STATUS_COLORS` hex 상수([HomePage.tsx:10](../../src/renderer/src/components/pages/HomePage.tsx): in_progress=`#3B82F6` **파랑**). **불일치 증거**: 같은 in_progress를 `ProjectDetailPage.tsx:192`는 **노랑** 팔레트로 칠한다 → 한 상태가 화면마다 다른 색. 토큰 단일화의 직접 근거 | chart/status 토큰에서 파생, `getCssVar()` 헬퍼로 oklch 공급 |
| **Top4** | `organisms/tabs/DashboardTab.tsx` | trendLines hex + iconColor 팔레트 | 동일 — 토큰 파생 |
| **Top4** | `atoms/charts/BubbleChart.tsx`, `HorizontalBarChart.tsx`, `CustomTooltip.tsx` | defaultColors 배열 / `#8884d8` fallback | chart-1..5 토큰 oklch에서 파생 |
| **Top5** | `atoms/TableBase.tsx`, `TableColumn.tsx`, `TableColumnDef.tsx`, `TableColumnHeader.tsx` | blue/gray 상태색 | 기존 base 토큰(`accent`/`primary`/`muted`/`muted-foreground`)으로 치환 — **신규 토큰 불필요, 즉시 가능** |
| **Top6** | `pages/NotificationsPage.tsx` | 알림 타입별 아이콘/도트 팔레트 | status/priority 재사용 또는 `--notification-*` 검토 |
| **Top6** | `molecules/tables/TableSearchBar.tsx`, `organisms/dialogs/IssueDetailsDialog.tsx`, `organisms/projects/ProjectsPageHeader.tsx`, `organisms/dialogs/CreateProjectDialog.tsx` | 단발성 gray/amber/green 팔레트 | `muted`/`muted-foreground` 등으로 일괄 치환 |

### 8.3 토큰화 비대상 (위반으로 분류하지 않음)

- `IssueDetailPage.tsx` `label.label_color` — 사용자가 DB에 지정하는 임의 라벨 색 (정당한 인라인 style).
- `DashboardTab`/`CustomTooltip` `entry.color` — 런타임 차트 데이터 색.
- `IntegrationPage.tsx` Slack `text-purple-600`, GitHub 등 **외부 서비스 브랜드색** — 별도 `--brand-*` 토큰으로 격리하거나 예외 처리 (테마 조율 대상 아님).

### 8.4 스케일·테마

- [ ] **[S-1] spacing 토큰** 추가 + `ProjectsPage` 등 표준 `p-6` 수렴.
- [ ] **[S-2] typography 유틸**(`.text-title/.text-section/.text-caption`) 추가 + 이탈 페이지 수렴.
- [ ] **[S-3] `.nord` 제거** (멀티테마 미채택 확정 시).
- [ ] **[S-4] `Sidebar.tsx:286`** `rounded-xl` → `rounded-lg`.

### 8.5 검증

- [ ] `pnpm typecheck` / `pnpm lint` 통과.
- [ ] 라이트·다크 양 테마에서 status/priority 배지, 차트, 포커스 링 시각 확인.
- [ ] 대비 재측정: muted-foreground on muted ≥4.5:1, ring on bg ≥3:1, destructive 텍스트 ≥4.5:1(본문)/3:1(UI).
- [ ] `grep '--status-\|--priority-\|--arrow-'` 소비처가 0건 → N건으로 증가 확인.
- [ ] recharts oklch 렌더 호환성 검증 (Electron Chromium 버전).

---

## 관련 문서

- [`design-tokens-spec.md`](./design-tokens-spec.md) — 전체 토큰 표 + 복붙용 `@theme inline` 최종본 스니펫.
- [`v3-ui-design.md`](./v3-ui-design.md) — UI 구조·화면·아이콘 전략 (상위 디자인 스펙).
- [`roadmap-v1.md`](./roadmap-v1.md) — v1.0 OSS 출시 로드맵 (Phase 매핑).
