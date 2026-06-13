# Branching & Releases

## 기준 브랜치

활성 개발의 기준 브랜치는 **`main`** 입니다. 멀티 DBMS 지원 + 인증 모델 재설계 작업(`v3`, Phase 1~5,
PR #27~#31)이 `main`으로 승격되었습니다(PR #32).

## Legacy 아카이브

과거 갈래들은 역사 보존을 위해 **`legacy/*`** 네임스페이스로 아카이브되어 있습니다. 삭제하지 않고
그대로 보존되므로 언제든 참조할 수 있습니다.

| 아카이브 브랜치 | 원래 브랜치 | 비고 |
|----------------|------------|------|
| `legacy/main` | `main`의 옛 상태 (`2b230bb`) | 승격 전 기준선. 현재 `main` 히스토리의 조상이기도 함 |
| `legacy/ui-v2` | `ui-v2` | 갈라진 옛 UI 작업(v2) |
| `legacy/develop` | `develop` | 갈라진 옛 개발 라인 |
| `legacy/docs` | `docs` | 갈라진 옛 문서 라인 |

## 작업 브랜치 컨벤션

- `feature/*` — 신규 기능
- `bugfix/*` — 버그 수정
- `hotfix/*` — 긴급 수정

## 정리 대기 항목

다음 브랜치들은 `main`(또는 `legacy/*`)에 내용이 모두 보존되어 있어 삭제 후보입니다. 환경 제약으로
자동 삭제가 막혀 있어, 저장소 관리자가 GitHub UI 또는 로컬에서 정리합니다.

```bash
# 이미 main에 머지된 작업 브랜치 + legacy로 아카이브된 원본
git push origin --delete v3 \
  feature/mysql-multidbms-phase1 feature/mysql-multidbms-phase2 \
  feature/mysql-multidbms-phase3 feature/mysql-multidbms-phase4 \
  feature/phase5-cleanup \
  ui-v2 develop docs
```

> `legacy/*`는 보존 대상이므로 삭제하지 않습니다.
