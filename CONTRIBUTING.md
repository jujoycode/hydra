# Contributing to Hydra

> **[English](./CONTRIBUTING.en.md)** · 한국어

Hydra에 기여해 주셔서 감사합니다! 이 문서는 개발 환경, 워크플로, 코드 규약을 요약합니다.

## 개발 환경

```bash
pnpm install          # 의존성 설치
cp .env.example .env  # drizzle CLI 전용 (앱 런타임 접속과 분리)
pnpm docker:up        # (선택) 로컬 PostgreSQL
pnpm hot              # Electron 앱 개발 모드 (hot reload)
```

자세한 시작 가이드는 [`README.md`](./README.md)와 [`wiki/Getting-Started.md`](./wiki/Getting-Started.md)를 참고하세요.

## 변경 전 확인 (로컬 게이트)

PR을 올리기 전에 다음을 통과시켜 주세요:

```bash
pnpm typecheck   # 타입체크 (node + web)
pnpm lint        # Biome lint (autofix)
pnpm test        # Vitest
pnpm build       # 빌드까지 확인
```

UI 컴포넌트를 만들면 `pnpm storybook`으로 스토리도 확인하세요.

## 워크플로 (GitHub Flow)

- 기준 브랜치는 **`main`**(항상 릴리즈 가능, protected).
- 최신 `main`에서 **짧은 브랜치**를 떠서 작업하고 **PR로만** 병합합니다 (CI green + 승인 1, 자가 승인 불가).
- 브랜치 네이밍(의도별): `feature/*`, `bugfix/*`, `hotfix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*`.
- 기본 병합은 **squash**, 병합 후 브랜치 삭제.
- 자세한 규칙: [`docs/adr/0001-adopt-github-flow.md`](./docs/adr/0001-adopt-github-flow.md).

## 코드 규약

- **Biome**: 작은따옴표, 세미콜론 없음, 120자, 2-space, LF.
- **네이밍**: PascalCase(컴포넌트/클래스), camelCase(함수/변수), UPPER_SNAKE_CASE(상수), `handle` 접두사(이벤트 핸들러).
- **DB 접근은 메인 프로세스에서만** (렌더러는 IPC `window.callApi`로).
- **렌더러 데이터 패칭**: 도메인 훅 + `useApiQuery`/`useApiMutation` ([`docs/adr/0002`](./docs/adr/0002-renderer-data-fetching.md)).
- **컴포넌트 폴더 구조**: `atoms/Button/{ index.ts, Button.tsx, Button.stories.tsx, Button.test.tsx }`.
- **테스트**: 레이어드(단위/통합(DB)/플로우/UI) ([`docs/adr/0003`](./docs/adr/0003-test-architecture.md)).
- 커밋 접두사: `feat`/`fix`/`docs`/`test`/`ci`/`refactor`/`style`/`chore`.

## PR 가이드

- 한 PR은 하나의 논리적 변경으로 작게 유지합니다.
- 설명에 변경 요약 + 검증 결과를 적습니다.
- CI(typecheck/lint/test/build)가 green이어야 머지됩니다.

## 행동 강령

모든 참여자는 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)를 준수합니다.
