# Contributing

## 개발 환경

[Getting Started](./Getting-Started.md)를 따라 설치/실행하세요. 변경 전후로 다음을 통과시키는 것을 권장합니다.

```bash
pnpm typecheck   # 타입체크 (node + web)
pnpm lint        # Biome lint
pnpm test        # Vitest
pnpm build       # 빌드까지 확인
```

## 코드 스타일 (Biome)

- 작은따옴표, 세미콜론 없음, 120자 너비, 2-space 들여쓰기, LF.
- `pnpm lint` / `pnpm format`으로 자동 정리.

## 네이밍

- PascalCase — 컴포넌트/클래스
- camelCase — 함수/변수
- UPPER_SNAKE_CASE — 상수
- `handle` 접두사 — 이벤트 핸들러

## 임포트 순서

외부 라이브러리 → 내부 모듈 → 상수/타입 → 스타일. 타입 전용은 `import type` 사용.

## 언어

- 사용자 노출 텍스트는 영어.
- 주석은 한국어 또는 영어.

## 아키텍처 규칙

- **DB 접근은 메인 프로세스에서만** (렌더러는 IPC로만).
- **Atomic Design**: atoms → molecules → organisms → templates → pages → layouts.
- **One file, one component/feature**.
- 자세한 구조는 [Architecture](./Architecture.md)와 `CLAUDE.md` 참고.

## DB 컨벤션

- snake_case 테이블(복수형), snake_case 컬럼(단수형). 상세: `docs/design/convention-db.md`.
- 새 마이그레이션은 `pnpm db:generate`(PG) / `pnpm db:generate:mysql`(MySQL)로 생성.
  MySQL 워크스페이스에 `drizzle-kit push` 금지.
- PG/MySQL 양쪽 스키마(`schema.pg.ts` / `schema.mysql.ts`)의 타입 이식 규칙을 지킬 것
  ([Database & Multi-DBMS](./Database-and-Multi-DBMS.md) 참고).

## 브랜치 / 커밋

- 브랜치: `feature/*`, `bugfix/*`, `hotfix/*` ([Branching & Releases](./Branching-and-Releases.md)).
- 기준 브랜치는 `main`. `legacy/*`는 보존용이므로 건드리지 않습니다.
