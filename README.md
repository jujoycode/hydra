# Hydra

Electron 기반 경량 프로젝트/이슈 관리 데스크톱 앱.

- **Tech**: Electron + React 19 + TypeScript, Drizzle ORM + PostgreSQL
- **특징**: 오프라인 우선, 멀티 워크스페이스, 오픈소스

## Requirements

- Node.js 20+
- pnpm 9+
- Docker Desktop (로컬 PostgreSQL용, 직접 설치된 PG를 써도 무방)

## Quick Start

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 복사 (필요 시 값 조정)
cp .env.example .env

# 3. PostgreSQL 컨테이너 기동
pnpm docker:up

# 4. Drizzle 스키마를 DB에 push
pnpm db:push

# 5. Electron 앱 개발 모드 실행 (hot reload)
pnpm hot
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm hot` | 개발 서버 (hot reload) |
| `pnpm dev` | 개발 서버 (hot reload 없음) |
| `pnpm build` | 타입체크 + 프로덕션 빌드 |
| `pnpm typecheck` | 타입체크만 |
| `pnpm lint` | Biome lint + autofix |
| `pnpm format` | Biome format |
| `pnpm test` | Vitest (1회 실행) |
| `pnpm test:watch` | Vitest watch |
| `pnpm docker:up` / `pnpm docker:down` | PostgreSQL 컨테이너 기동/중지 |
| `pnpm db:push` | Drizzle 스키마 DB에 반영 |
| `pnpm db:studio` | Drizzle Studio (DB GUI) |
| `pnpm db:generate` | 마이그레이션 파일 생성 |
| `pnpm package` / `pnpm make` | Electron Forge 패키징 / 설치파일 빌드 |

## 트러블슈팅

- **`pnpm db:push`가 "connection refused"**: 컨테이너가 healthy 상태가 될 때까지 수 초 기다린 뒤 재시도 (`docker ps` 로 `(healthy)` 확인 가능).
- **포트 5432 충돌**: 이미 로컬에 PostgreSQL이 떠 있는 경우. 기존 프로세스를 끄거나 `docker-compose.yml`의 포트를 `'15432:5432'` 등으로 변경 후 `.env`의 `DB_PORT`도 같이 수정.
- **첫 실행 후 워크스페이스 연결 화면**: DB 접속 정보를 앱 UI에서 입력하면 연결 + 초기 사용자 생성. `.env`는 drizzle CLI 전용이고 앱 런타임 접속과는 분리되어 있습니다.

## 프로젝트 구조

- `src/main/` — Electron main process (IPC, DB, workspace)
- `src/preload/` — window.callApi 브리지
- `src/renderer/src/` — React 렌더러 (Atomic Design)
- `docs/` — 설계/백로그/계획 문서 (`docs/design/`, `docs/project/`, `docs/plans/`)

자세한 아키텍처는 `CLAUDE.md`를 참고하세요.
