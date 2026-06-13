# 0001. GitHub Flow 채택 (브랜치 & Git 워크플로)

- Status: Accepted
- Date: 2026-06-13

## Context

프로젝트에는 오랫동안 갈라진 장수(long-lived) 브랜치가 여럿 있었다 — `main`(낡음), `v3`(실질 활성),
`ui-v2`, `develop`, `docs`. 이 때문에 어디가 "진실"인지 모호했고 히스토리가 분산됐다.

2026-06-13에 이를 정리했다:
- `v3`(멀티 DBMS + 인증 재설계, Phase 1~5)를 `main`으로 승격(fast-forward, PR #32).
- 갈라진 옛 브랜치들을 `legacy/*` 네임스페이스로 아카이브(무손실 보존).
- 머지 완료된 `feature/*`와 `v3`를 삭제.
- 결과적으로 `main` 단일 기준 + `legacy/{main,ui-v2,develop,docs}` 아카이브만 남김.

앞으로는 단순하고 일관된 브랜치 모델이 필요하다. 데스크톱 앱을 태그 기반으로 릴리즈하는 흐름에
**GitHub Flow**가 적합하다고 판단했다(단순함, 항상 릴리즈 가능한 `main`, 짧은 브랜치 + PR 리뷰).

## Decision

**GitHub Flow를 채택한다.** 구체 규칙은 다음과 같다.

1. **`main`은 유일한 장수 브랜치이며 항상 릴리즈 가능(deployable)** 해야 한다. `main`은 protected.
2. **모든 작업은 최신 `main`에서 분기한 짧은 브랜치**에서 한다. 작업 브랜치는 오래 끌지 않는다.
3. **브랜치 네이밍은 의도별 접두사**를 쓴다:
   `feature/<slug>`, `bugfix/<slug>`, `hotfix/<slug>`, `docs/<slug>`, `chore/<slug>`,
   `refactor/<slug>`, `test/<slug>`. slug는 kebab-case.
4. **PR은 작고 한 가지 논리 변경**으로 유지하고, 일찍 연다.
5. **`main` 병합은 오직 PR로만.** 병합 조건: **CI green + 쓰기 권한자 1명 이상의 승인 리뷰**.
   (PR 작성자는 자기 PR을 승인할 수 없다.)
6. **병합 방식 기본값은 Squash and merge** — `main` 히스토리를 선형·가독성 있게 유지한다.
   (`hotfix`는 상황에 따라 일반 merge 허용.)
7. **병합 후 소스 브랜치는 삭제**한다.
8. **`main`에 직접 push 금지**(보호 규칙으로 강제). `main`/`legacy/*`에 force-push 금지.
9. **릴리즈는 `main`에서 SemVer 태그**로 만든다: `vMAJOR.MINOR.PATCH`(예: `v1.0.0`).
   태그 push가 CI 릴리즈 워크플로(빌드 → 인스톨러 → GitHub Release)를 트리거한다.
10. **핫픽스**는 `main`에서 `hotfix/*`로 분기 → PR로 `main` 병합 → 패치 버전 태그.
11. **`legacy/*`는 불변 아카이브** — 삭제하지 않고, 그 위에서 새 작업을 시작하지 않는다.
12. **커밋 메시지 접두사**는 기존 관례를 유지한다:
    `feat` / `fix` / `docs` / `test` / `ci` / `refactor` / `style` / `chore`.

## Consequences

**좋은 점**
- 멘탈 모델이 단순하다(브랜치 → PR → 리뷰 → 병합 → 삭제, `main`은 늘 출하 가능).
- Squash 병합으로 `main` 히스토리가 깔끔해진다.
- `legacy/*` 아카이브로 과거 이력을 안전하게 보존한다.

**유의할 점 / 비용**
- protected `main`은 **리뷰어가 필요**하다. 1인/작성자 단독으로는 자기 PR을 승인할 수 없다
  → 두 번째 계정으로 승인하거나, 단독 작업 구간에서는 소유자가 보호 규칙을 일시 완화/직접 병합해야 한다.
  (2026-06-13 실제로 자동화 계정이 자기 PR을 승인하지 못해 소유자가 직접 병합한 사례가 있다.)
- 자동화(에이전트)는 PR 생성까지만 가능하고, 승인/병합은 사람이 수행한다.
- 일부 실행 환경에서는 브랜치 삭제(delete push)가 막힐 수 있어, 정리는 GitHub UI 또는 권한 있는 로컬에서 수행한다.

## 부록 — Legacy 아카이브 매핑

| 아카이브 | 원래 브랜치 | 내용 |
|----------|------------|------|
| `legacy/main` | `main`(승격 전, `2b230bb`) | 승격 전 기준선 |
| `legacy/ui-v2` | `ui-v2` | 옛 UI 작업(v2) |
| `legacy/develop` | `develop` | 옛 개발 라인 |
| `legacy/docs` | `docs` | 옛 문서 라인 |
