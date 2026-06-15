# Hydra UI 디자인 표준 — "Lovable-lite" 정비안

> 작성일: 2026-06-14 · 상태: 합의 완료(설계) · 후속: 구현 계획(writing-plans)

## 1. 배경과 목표

Hydra는 라이트 우선·그린 브랜드의 셀프호스팅 이슈 트래커다. 디자인 토큰(`src/renderer/src/index.css`)과 감사 문서(`docs/design/design-system.md`)에 표준의 "정의"는 상당 부분 존재하지만, 컴포넌트가 이를 일관되게 소비하지 않는다. 페이지들이 표준 스페이싱 토큰(`p-page` 등) 대신 raw `p-6`/`p-4`/`pt-8`을 39곳에서 제각각 사용하는 등 정의와 적용 사이에 간극이 있다.

이 작업의 목표는 두 가지다:

1. **표준 통일 + 적용**(접근 A) — 흩어진 값을 확정된 스케일로 수렴시키고, 컴포넌트가 토큰을 일관 소비하도록 정리한다.
2. **시각 기준을 Lovable-lite로 이동** — 토큰이 향하는 룩앤필 기준을 현재의 Notion/Linear풍에서 **Lovable의 부드러움**으로 옮긴다. 단 **Hydra 그린 브랜드 정체성은 유지**한다.

비목표(Non-goals): 기능 추가, 정보 구조(IA)/라우팅 변경, 신규 화면 설계. 이번 작업은 **시각 표준의 정의와 일관 적용**에 한정한다.

## 2. 방향 결정 (브레인스토밍 합의)

| 결정 | 선택 | 비고 |
|---|---|---|
| 작업 성격 | **A. 표준 통일 + 적용** | 룩앤필 기준은 Lovable-lite로 이동 |
| 시각 소스 | **lovable.dev 제품 UI** | 그라데이션·glass·둥근 카드·넉넉한 여백·floating·마이크로 인터랙션 |
| 룩앤필 강도 | **B. Lovable-lite (그린 유지)** | C(바이올렛/핑크 그라데이션 브랜드)는 기각 — 그린 정체성 유지 |
| 데이터 목록 표현 | **단일 glass 컨테이너 + 밀집 행** | floating 카드는 보드·대시보드에 한정 |
| glass 강도 | **약하게** (불투명도↑·blur↓) | 가독성 우선 |
| radius | **축소** (아래 스케일) | 과한 둥글기 지양 |
| 롤아웃 범위 | **(b) 컴포넌트 전체 리팩터링 포함** | 점진 적용 (3단계, §11) |

**핵심 원칙**: Lovable의 부드러움은 **크롬·컨테이너·패널·카드**에서 살리고, **데이터 밀집 표면(목록/테이블 행)**과 **장문 읽기 영역**은 밀집·불투명을 유지해 스캔성·가독성·성능을 지킨다.

## 3. Radius 스케일

현재 4/6/8/10 → 전반적으로 부드럽게, 단 v2 조정으로 과하지 않게 축소.

| 토큰 | 값 | 적용 |
|---|---|---|
| `--radius-sm` | 5px | 인풋 내부 칩, 작은 요소 |
| `--radius-md` | 8px | **버튼, 인풋, 셀렉트** |
| `--radius-lg` | 12px | 카드, 팝오버, 드롭다운 |
| `--radius-xl` | 14px | **패널, 목록 컨테이너, 다이얼로그** |
| `--radius-pill` | 9999px | **상태/우선순위 배지, 아바타, 필터 칩** |

## 4. Spacing / Gap 스케일

| 토큰 | 값 | 적용 |
|---|---|---|
| `--spacing-page` | 24px | 페이지 외곽 패딩 (밀도 유지) |
| `--spacing-section` | 20px | 섹션 간 수직 간격 (현재 16 → 20) |
| `--spacing-card` | 16px | 카드 내부 패딩 |
| `--spacing-card-gap` | 12px | 카드 사이 그리드 갭 |
| `--spacing-inline` | 6–8px | 아이콘-텍스트 등 인라인 |
| (목록 행) | 10px · 16px | 밀집 행 패딩 (세로 10 / 가로 16) |

## 5. Sizing (컨트롤 높이)

- **버튼**: sm 28 / **md 34** / lg 40
- **인풋·셀렉트**: 36
- **목록 행 높이**: ~38 (밀집)
- **아바타**: xs 16 / sm 20 / md 28 / lg 36 (목록 행 인라인은 ~22)

## 6. Elevation (부드러운 floating 그림자)

glass를 약화한 만큼 그림자로 떠 있는 느낌을 준다.

| 토큰 | 값 | 적용 |
|---|---|---|
| `--shadow-xs` | `0 1px 2px -1px rgb(17 24 39 / .06)` | 헤어라인 분리 |
| `--shadow-card` | `0 4px 16px -8px rgb(17 24 39 / .12), 0 1px 3px rgb(17 24 39 / .05)` | 떠 있는 카드 |
| `--shadow-pop` | `0 10px 30px -12px rgb(17 24 39 / .16)` | 팝오버/드롭다운 |
| `--shadow-panel` | `0 16px 40px -14px rgb(17 24 39 / .18)` | 다이얼로그/상세 패널 |
| `--glow-primary` | `0 6px 16px -6px rgb(58 116 87 / .45)` | 그린 Primary 버튼 |

## 7. Surface & Glass 규칙 (약화 버전)

glass는 **반투명을 약하게**(불투명도↑·blur↓) 적용해 가독성을 우선한다.

| 레이어 | 처리 | 값 가이드 |
|---|---|---|
| 페이지 본문 | 불투명 `--background` | 비침 없음 |
| 크롬 (사이드바·상단바) | `glass-panel` | 불투명도 ~.88, `blur(10px) saturate(140%)` |
| 컨테이너/카드 (목록 래퍼·대시보드 카드) | `glass-soft` | 불투명도 ~.90, `blur(8px)` |
| 오버레이 (팝오버·드롭다운·다이얼로그) | `glass` + shadow-pop/panel | 불투명도 ~.85–.90 |
| 장문 읽기 영역 (이슈 설명 본문) | **glass 금지**, 불투명 유지 | 가독성 |

> 현재 `index.css`의 `.glass`(72%/blur16)·`.glass-panel`(60%/blur18)은 위 약화 값으로 갱신한다.

## 8. 표현 형태 (Expression Forms)

- **Primary 버튼**: 그린 그라데이션 `linear-gradient(135deg, green-500, green-700)`, radius md(8), `--glow-primary`, hover 시 `translateY(-1px)` + 살짝 밝아짐
- **Secondary 버튼**: solid `secondary` + 얇은 border, radius md(8)
- **배지(상태/우선순위)**: pill, tint 배경 + tint-text 토큰, **border 없음** (기존 `--status-*` / `--mc-*` 토큰 소비)
- **카드**: `glass-soft`, radius lg(12), `--shadow-card`, 패딩 16
- **목록 컨테이너**: 단일 `glass-soft` 컨테이너, radius xl(14), 밀집 행, 행 hover 시 그린 tint 배경, 헤어라인 구분선
- **아바타**: 그린 그라데이션 fallback, pill
- **인풋**: solid 배경, `--input-strong` border, radius md(8), focus 시 그린 `--ring`
- **필터 칩**: pill, 비활성 `secondary`/border, 활성 그린 tint

## 9. Motion

- ease: `--ease-spring`, `--ease-out-soft` (유지)
- duration: fast 120ms(hover) / base 180ms(pop) / slow 240ms(panel)
- hover: 버튼·카드 `translateY(-1px)` + 그림자 확대, 목록 행은 배경 tint
- `prefers-reduced-motion: reduce` 존중 — transform/transition 제거

## 10. Dark Mode

위 전부를 기존 `.dark` 토큰 오버라이드로 대응한다.

- glass: `--card`/`--sidebar`를 더 낮은 불투명도로 mix (배경이 어두워 비침이 과하지 않게)
- 그라데이션: green-400 → green-600
- 그림자: 더 진하고 넓게 (어두운 배경 위 깊이 확보)
- 대비: 본문 AA(4.5:1) / 비텍스트 UI 3:1 유지

## 11. 토큰 구현 노트

- 단일 소스: `src/renderer/src/index.css`
  - `:root` / `.dark`에 raw 값 정의 → `@theme inline`에 `--color-*`, `--radius-*`, `--spacing-*`, `--shadow-*`로 노출 → 유틸 클래스(`rounded-lg`, `p-card`, `shadow-card`, `bg-status-done` 등)로 소비
- 신규/변경 노출 토큰: `--radius-{sm,md,lg,xl,pill}`, `--spacing-{page,section,card,card-gap}`, `--shadow-{xs,card,pop,panel}`, `--glow-primary`, `glass`/`glass-panel`/`glass-soft` 유틸 갱신
- `design-system.md` 감사가 지적한 미해결 항목(시맨틱 토큰 `@theme inline` 미노출, Badge 팔레트 하드코딩, status 값/토큰 키 정합 등)은 본 적용 작업에서 함께 정리한다.

## 12. 롤아웃 계획 (점진, 3단계)

1. **기반 정비** — `index.css` 토큰/유틸 확정(radius·spacing·shadow·glass 갱신), 공용 유틸 클래스 정리. 기존 화면이 깨지지 않는 선에서 토큰 값만 이동.
2. **고빈도 화면 적용** — 사이드바(크롬 glass) → 이슈 목록(단일 glass 컨테이너 + 밀집 행 + pill 배지) → 이슈 상세 패널 → 홈/대시보드 카드. raw `p-6` 등을 토큰 유틸로 치환.
3. **나머지 화면** — 멤버·알림·설정·워크스페이스·다이얼로그 전반. Badge/버튼/인풋 등 atoms를 표준 표현 형태로 통일.

각 단계는 라이트/다크 동시 검증, 대비(AA) 확인을 포함한다.

## 13. 미해결/후속 고려

- `design-system.md`의 status 값 표준화(open 흡수 여부)·토큰 키 정합은 별도 정합 작업과 맞물림 — 구현 계획에서 의존성으로 다룬다.
- floating 카드 스타일(보드·대시보드)의 정확한 적용 범위는 해당 화면 작업 시 확정.
