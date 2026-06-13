# Configuration

## 환경 변수 (`.env`)

`.env`는 **drizzle CLI 전용**입니다 (`pnpm db:push`, `pnpm db:generate`, `pnpm db:studio`).
**앱 런타임의 DB 접속과는 분리**되어 있습니다 — 런타임 접속 정보는 앱 UI의 워크스페이스 연결 화면에서
입력하고 safeStorage에 암호화 저장됩니다.

`.env.example`을 복사해서 시작하세요:

```bash
cp .env.example .env
```

로컬 개발용 포트 변경 시:
- PostgreSQL: `docker-compose.yml`의 포트와 `.env`의 `DB_PORT`를 함께 수정 (예: `'15432:5432'`).
- MySQL: `docker-compose.yml`에 mysql 서비스를 추가하고 `MYSQL_PORT` 등으로 호스트 포트 조정 (예: `'3307:3306'`).

## 워크스페이스 설정

- 워크스페이스 = 하나의 DB 연결. `WorkspaceConfig`에 `dbms`(`postgres`/`mysql`), host, port, dbName,
  자격증명 등이 담깁니다.
- safeStorage로 암호화 저장되며, 앱은 여러 워크스페이스를 저장하고 전환할 수 있습니다.
- DBMS를 바꾸면 폼의 기본 포트/계정이 자동 전환됩니다 (PG 5432 / MySQL 3306).

## 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm install` | 의존성 설치 |
| `pnpm hot` / `pnpm dev` | 개발 서버 (hot reload 유/무) |
| `pnpm build` | 타입체크 + 프로덕션 빌드 |
| `pnpm typecheck` / `:node` / `:web` | 타입체크 (전체 / main / renderer) |
| `pnpm lint` / `pnpm format` | Biome lint / format |
| `pnpm test` / `:watch` / `:coverage` | Vitest |
| `pnpm docker:up` / `pnpm docker:down` | 로컬 PostgreSQL 컨테이너 |
| `pnpm db:push` | 스키마 DB 반영 (로컬 개발) |
| `pnpm db:generate` / `pnpm db:generate:mysql` | 마이그레이션 생성 (PG / MySQL) |
| `pnpm db:studio` | Drizzle Studio (DB GUI) |
| `pnpm package` / `pnpm make` | Electron Forge 패키징 / 설치파일 |

## 패키징 주의

생성된 마이그레이션(`drizzle/`)은 패키징 빌드의 `extraResource`로 포함됩니다 — 배포된 앱이 연결 시
마이그레이션을 적용할 수 있도록 하기 위함입니다.
