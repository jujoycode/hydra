# Hydra

> **[English](./README.en.md)** · 한국어

Electron 기반 경량 프로젝트/이슈 관리 데스크톱 앱. 오프라인 우선, 멀티 워크스페이스, 오픈소스.
사용자가 **자신의 PostgreSQL 또는 MySQL 8 데이터베이스**를 직접 연결해서 사용합니다.

- **Tech**: Electron + React 19 + TypeScript · shadcn/ui + Tailwind CSS v4 · Zustand v5 · Drizzle ORM (PostgreSQL / MySQL 8) · TanStack Router/Table/Form · Tiptap · Recharts · i18next
- **특징**: 오프라인 우선, 멀티 워크스페이스, BYO-Database(PostgreSQL·MySQL), 2단계 인증

> 📖 더 깊은 설계/운영 문서는 [`wiki/`](./wiki) 디렉터리(또는 GitHub Wiki)를 참고하세요.
> 아키텍처 요약은 [`CLAUDE.md`](./CLAUDE.md)에 있습니다.

## Requirements

- Node.js 20+
- pnpm 9+
- 연결할 데이터베이스: PostgreSQL 또는 MySQL 8.0+
  - 로컬 개발용 PostgreSQL은 `pnpm docker:up`으로 컨테이너 기동 가능 (Docker Desktop 필요)

## Quick Start

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 복사 (drizzle CLI 전용 — 앱 런타임 접속과는 분리)
cp .env.example .env

# 3. 로컬 PostgreSQL 컨테이너 기동 (선택)
pnpm docker:up

# 4. Drizzle 스키마를 DB에 push (로컬 개발용)
pnpm db:push

# 5. Electron 앱 개발 모드 실행 (hot reload)
pnpm hot
```

앱을 처음 실행하면 **워크스페이스 연결 화면**이 뜹니다. DB 접속 정보를 입력해 연결하면, 빈 DB인 경우
**관리자 셋업 화면**으로 이동합니다. 자세한 첫 실행 흐름은 [Getting Started](./wiki/Getting-Started.md)를 참고하세요.

## 인증 모델 (2단계)

Hydra는 "DB 연결 = 인증"이 아니라 **워크스페이스 연결과 앱 로그인을 분리**합니다.

1. **워크스페이스 연결** — 공유 서비스 계정으로 DB에 접속 (host/port/dbName/dbms + 자격증명)
2. **앱 로그인** — 개인 계정(`user_sn` + scrypt 해시 비밀번호 + 세션)으로 로그인

빈 DB에 처음 연결하면 관리자 셋업 화면이 표시되고, 관리자가 앱 내에서 멤버를 생성합니다(DB ROLE 사용 안 함).
세션은 Electron safeStorage로 영속화되며 "remember me"로 만료를 연장할 수 있습니다.
자세한 내용은 [Authentication](./wiki/Authentication.md) 참고.

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm hot` | 개발 서버 (hot reload) |
| `pnpm dev` | 개발 서버 (hot reload 없음) |
| `pnpm build` | 타입체크 + 프로덕션 빌드 |
| `pnpm typecheck` | 타입체크 (`:node` / `:web` 분리 가능) |
| `pnpm lint` | Biome lint + autofix |
| `pnpm format` | Biome format |
| `pnpm test` | Vitest (1회 실행) — `:watch` / `:coverage` |
| `pnpm docker:up` / `pnpm docker:down` | 로컬 PostgreSQL 컨테이너 기동/중지 |
| `pnpm db:push` | Drizzle 스키마 DB에 반영 (로컬 개발용) |
| `pnpm db:generate` / `pnpm db:generate:mysql` | 마이그레이션 파일 생성 (PG / MySQL) |
| `pnpm db:studio` | Drizzle Studio (DB GUI) |
| `pnpm package` / `pnpm make` | Electron Forge 패키징 / 설치파일 빌드 |

## 데이터베이스 (PostgreSQL / MySQL 8)

워크스페이스 추가 시 DBMS를 선택합니다. 런타임 서비스 계정은 **DML 권한만** 필요합니다(`ALL PRIVILEGES` 금지).

```sql
-- MySQL 8 예시
CREATE USER 'hydra_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hydra.* TO 'hydra_app'@'%';
```

스키마 마이그레이션은 연결 시 자동 실행됩니다. 스키마가 최신이면 마이그레이터를 건너뛰므로 DML-only
계정으로 정상 동작합니다. **첫 연결 및 앱 업그레이드 후**(대기 중인 마이그레이션이 있을 때)는 DDL 권한
(`CREATE, ALTER, INDEX, REFERENCES`)이 있는 계정으로 한 번 연결해야 합니다. MySQL은 `utf8mb4` charset 필수.

> MySQL 워크스페이스에는 절대 `drizzle-kit push`를 쓰지 마세요 — 생성된 마이그레이션만 사용합니다
> (collation은 스키마 custom type이 소유).

멀티 DBMS 아키텍처(어댑터, 듀얼 스키마, 마이그레이션 전략)는 [Database & Multi-DBMS](./wiki/Database-and-Multi-DBMS.md) 참고.

## 주요 기능

이슈/프로젝트 관리, 마일스톤, 라벨, 체크리스트(Tasks), 이슈 간 관계(blocks/is_blocked_by/relates_to),
스레드 댓글, 인앱 알림, Slack/GitHub 인테그레이션, Tiptap 리치 텍스트 에디터, 다크모드.
전체 목록은 [Features](./wiki/Features.md) 참고.

## 프로젝트 구조

- `src/main/` — Electron main process (IPC 핸들러, DB 어댑터/리포지토리, 워크스페이스)
- `src/preload/` — `window.callApi` 타입 IPC 브리지
- `src/renderer/src/` — React 렌더러 (Atomic Design: atoms → molecules → organisms → templates → pages → layouts)
- `docs/` — 설계/백로그/계획 문서 (`docs/design/`, `docs/project/`, `docs/plans/`)
- `wiki/` — 사용자/개발자 위키 문서
- `drizzle/` — 생성된 마이그레이션 (PG: `drizzle/pg`, MySQL: `drizzle/mysql`)

## 브랜치 모델

- 활성 개발의 기준 브랜치는 **`main`** 입니다.
- 과거 갈래(`main`의 옛 상태, `ui-v2`, `develop`, `docs`)는 역사 보존을 위해 **`legacy/*`** 네임스페이스로 아카이브되어 있습니다.
- 작업 브랜치 컨벤션: `feature/*`, `bugfix/*`, `hotfix/*`.

자세한 내용은 [Branching & Releases](./wiki/Branching-and-Releases.md) 참고.

## Contributing

기여 가이드는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)를, 행동 강령은 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)를 참고하세요. 코드 스타일/컨벤션 상세는 [Contributing wiki](./wiki/Contributing.md)와 [`CLAUDE.md`](./CLAUDE.md)에 있습니다.

## License

[MIT](./LICENSE) © jujoycode
