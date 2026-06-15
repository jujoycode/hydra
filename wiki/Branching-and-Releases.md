# Branching & Releases

> 워크플로 규칙의 공식 결정은 [`docs/adr/0001-adopt-github-flow.md`](../docs/adr/0001-adopt-github-flow.md)에 있습니다.

## 워크플로 — GitHub Flow

- **`main`** 이 유일한 장수 브랜치이며 항상 릴리즈 가능합니다(protected).
- 모든 작업은 최신 `main`에서 분기한 **짧은 브랜치**에서 진행하고, **PR로만** 병합합니다 (CI green + 승인 1).
- 병합 후 소스 브랜치는 삭제합니다. 기본 병합 방식은 squash.
- 릴리즈는 `main`에서 SemVer 태그(`vMAJOR.MINOR.PATCH`)로 만들며, 태그 push가 릴리즈 빌드를 트리거합니다.

멀티 DBMS 지원 + 인증 모델 재설계 작업(`v3`, Phase 1~5, PR #27~#31)이 `main`으로 승격되었습니다(PR #32).

## Legacy 아카이브

과거 갈래들은 역사 보존을 위해 **`legacy/*`** 네임스페이스로 아카이브되어 있습니다. 삭제하지 않고
그대로 보존되므로 언제든 참조할 수 있습니다.

| 아카이브 브랜치 | 원래 브랜치 | 비고 |
|----------------|------------|------|
| `legacy/main` | `main`의 옛 상태 (`2b230bb`) | 승격 전 기준선. 현재 `main` 히스토리의 조상이기도 함 |
| `legacy/ui-v2` | `ui-v2` | 갈라진 옛 UI 작업(v2) |
| `legacy/develop` | `develop` | 갈라진 옛 개발 라인 |
| `legacy/docs` | `docs` | 갈라진 옛 문서 라인 |

## 작업 브랜치 네이밍 (의도별 접두사)

- `feature/*` — 신규 기능
- `bugfix/*` — 버그 수정
- `hotfix/*` — 긴급 수정
- `docs/*` — 문서
- `chore/*` · `refactor/*` · `test/*` — 잡무 / 리팩터링 / 테스트

## 정리 완료 (2026-06-13)

`v3` 승격 후, 머지된 `feature/*`(phase1~5)와 갈라진 원본(`ui-v2`/`develop`/`docs`)은 모두 삭제되었습니다.
현재 원격에는 **`main` + `legacy/{main,ui-v2,develop,docs}`** 만 남아 있습니다.

> `legacy/*`는 불변 아카이브 — 삭제하거나 그 위에서 새 작업을 시작하지 않습니다.
