<p align="center">
  <img src="./docs/assets/readme/hero-banner.svg" alt="Hydra" width="100%" />
</p>

<p align="center">
  <b>오프라인 우선 · 멀티 워크스페이스 · 내 데이터베이스로 쓰는 경량 프로젝트/이슈 관리 데스크톱 앱</b>
</p>

<p align="center">
  <a href="./README.en.md">English</a> · 한국어
</p>

<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-06B6D4.svg" /></a>
  <img alt="Electron" src="https://img.shields.io/badge/Electron-2C2E3B?logo=electron&logoColor=9FEAF9" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=fff" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff" />
  <img alt="MySQL 8" src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=fff" />
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=000" />
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-6366F1.svg" />
</p>

<p align="center">
  <a href="#-quick-start">시작하기</a> ·
  <a href="#-아키텍처">아키텍처</a> ·
  <a href="#-인증-모델-2단계">인증</a> ·
  <a href="#-데이터베이스-postgresql--mysql-8">데이터베이스</a> ·
  <a href="#-주요-기능">기능</a> ·
  <a href="#-contributing">기여</a>
</p>

---

**Hydra**는 Electron 기반 경량 프로젝트/이슈 관리 데스크톱 앱입니다. **오프라인 우선**, **멀티 워크스페이스**, **오픈소스**이며, 남의 클라우드가 아니라 **자신의 PostgreSQL 또는 MySQL 8 데이터베이스**를 직접 연결해서 사용합니다.

- **Tech** — Electron + React 19 + TypeScript · shadcn/ui + Tailwind CSS v4 · Zustand v5 · Drizzle ORM (PostgreSQL / MySQL 8) · TanStack Router/Table/Form · Tiptap · Recharts · i18next
- **특징** — 오프라인 우선 · 멀티 워크스페이스 · BYO-Database(PostgreSQL·MySQL) · 2단계 인증

> 📖 더 깊은 설계/운영 문서는 [`wiki/`](./wiki) 디렉터리(또는 GitHub Wiki)를, 아키텍처 요약은 [`CLAUDE.md`](./CLAUDE.md)를 참고하세요.

## 🚀 Quick Start

**요구 사항** — Node.js 20+ · pnpm 9+ · 연결할 PostgreSQL 또는 MySQL 8.0+ 데이터베이스. 로컬 개발용 PostgreSQL은 `pnpm docker:up`으로 컨테이너를 기동할 수 있습니다(Docker Desktop 필요).

```bash
pnpm install            # 1. 의존성 설치
cp .env.example .env    # 2. 환경 변수 복사 (drizzle CLI 전용 — 앱 런타임 접속과 분리)
pnpm docker:up          # 3. 로컬 PostgreSQL 컨테이너 기동 (선택)
pnpm db:push            # 4. Drizzle 스키마를 DB에 push (로컬 개발용)
pnpm hot                # 5. Electron 앱 개발 모드 실행 (hot reload)
```

앱을 처음 실행하면 **워크스페이스 연결 화면**이 뜹니다. DB 접속 정보를 입력해 연결하면, 빈 DB인 경우 **관리자 셋업 화면**으로 이동합니다. 자세한 첫 실행 흐름은 [Getting Started](./wiki/Getting-Started.md)를 참고하세요.

## 🏗 아키텍처

Hydra는 Electron의 3-프로세스 모델을 따릅니다. 렌더러는 DB를 직접 건드리지 않습니다 — 모든 호출은 **타입 IPC 브리지**를 거쳐 메인 프로세스로 전달되고, 데이터 접근은 전부 메인이 담당합니다.

<p align="center">
  <img src="./docs/assets/readme/arch-pipeline.svg" alt="Renderer → Preload → Main → Database" width="100%" />
</p>

- **Renderer** (`src/renderer/src/`) — Atomic Design(atoms → molecules → organisms → templates → pages → layouts) 기반 React 19 UI. 서버 데이터는 TanStack Query 훅, UI 상태는 Zustand로 관리합니다.
- **Preload** (`src/preload/`) — `window.callApi`로 타입 안전한 context-isolated IPC를 노출합니다.
- **Main** (`src/main/`) — IPC 핸들러(`CoreBaseHandler`), 싱글톤 `RepositoryContainer`, Drizzle 리포지토리, DB 어댑터, 암호화된 `WorkspaceManager`.

## 🔐 인증 모델 (2단계)

Hydra는 "DB 연결 = 인증"이 아니라 **워크스페이스 연결과 앱 로그인을 분리**합니다.

<p align="center">
  <img src="./docs/assets/readme/auth-2step.svg" alt="2단계 인증: 워크스페이스 연결 후 앱 로그인" width="95%" />
</p>

1. **워크스페이스 연결** — 공유 서비스 계정으로 DB에 접속(host/port/dbName/dbms + 자격증명). Electron safeStorage로 암호화 저장됩니다.
2. **앱 로그인** — 개인 계정(`user_sn` + scrypt 해시 비밀번호 + 세션)으로 로그인합니다.

빈 DB에 처음 연결하면 관리자 셋업 화면이 표시되고, 관리자가 앱 내에서 멤버를 생성합니다(DB ROLE 사용 안 함). 세션은 safeStorage로 영속화되며("remember me"로 만료 연장), bootstrap 시 재검증됩니다. 자세한 내용은 [Authentication](./wiki/Authentication.md) 참고.

## 🗄 데이터베이스 (PostgreSQL / MySQL 8)

워크스페이스 추가 시 DBMS를 선택합니다. 하나의 리포지토리 인터페이스를 DBMS별 어댑터가 구현하고, 연결 시 팩토리가 적절한 어댑터를 선택합니다.

<p align="center">
  <img src="./docs/assets/readme/multi-dbms.svg" alt="하나의 어댑터 인터페이스로 멀티 DBMS 지원" width="100%" />
</p>

런타임 서비스 계정은 **DML 권한만** 필요합니다(`ALL PRIVILEGES` 금지). 스키마 마이그레이션은 연결 시 자동 실행되며, 스키마가 최신이면 마이그레이터를 건너뛰므로 DML-only 계정으로도 정상 동작합니다.

<details>
<summary><b>데이터베이스 설정 &amp; 권한</b></summary>

```sql
-- MySQL 8 예시
CREATE USER 'hydra_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hydra.* TO 'hydra_app'@'%';
```

**첫 연결 및 앱 업그레이드 후**(대기 중인 마이그레이션이 있을 때)는 DDL 권한(`CREATE, ALTER, INDEX, REFERENCES`)이 있는 계정으로 한 번 연결해야 합니다. MySQL은 `utf8mb4` charset이 필수입니다.

> ⚠️ MySQL 워크스페이스에는 절대 `drizzle-kit push`를 쓰지 마세요 — 생성된 마이그레이션만 사용합니다(collation은 스키마 custom type이 소유).

멀티 DBMS 아키텍처(어댑터, 듀얼 스키마, 마이그레이션 전략)는 [Database & Multi-DBMS](./wiki/Database-and-Multi-DBMS.md) 참고.

</details>

## ✨ 주요 기능

이슈/프로젝트 관리, 마일스톤, 라벨, 체크리스트(Tasks), 이슈 간 관계(blocks / is_blocked_by / relates_to), 스레드 댓글, 인앱 알림, 활동 로그 타임라인, 칸반 보드, Slack/GitHub 인테그레이션, Tiptap 리치 텍스트 에디터, 다크모드.

<details>
<summary><b>기능 상세</b></summary>

| 영역 | 내용 |
|------|------|
| **프로젝트 & 이슈** | 전체 CRUD, 프로젝트 멤버, 프로젝트별 설정 |
| **마일스톤 & 라벨** | 이슈 스케줄링과 분류 |
| **Tasks** | 이슈별 체크리스트 항목 |
| **이슈 관계** | 이슈 간 `blocks` / `is_blocked_by` / `relates_to` |
| **댓글** | 이슈별 스레드 댓글 전체 CRUD |
| **알림** | 인앱 알림 + 미읽음 카운트 배지 |
| **인테그레이션** | Slack 웹훅(테스트 전송 포함), GitHub 토큰 |
| **리치 텍스트** | 설명·댓글용 Tiptap 에디터 |
| **워크스페이스** | 다중 암호화 워크스페이스, BYO PostgreSQL/MySQL |
| **UX** | 다크모드, i18n(i18next), 리사이즈 패널, 토스트 |

전체 목록은 [Features](./wiki/Features.md) 참고.

</details>

## 🧰 주요 명령어

<details>
<summary><b>전체 pnpm 스크립트</b></summary>

| 명령어 | 설명 |
|--------|------|
| `pnpm hot` / `pnpm dev` | 개발 서버 (hot reload 있음 / 없음) |
| `pnpm build` | 타입체크 + 프로덕션 빌드 |
| `pnpm typecheck` | 타입체크 (`:node` / `:web` 분리 가능) |
| `pnpm lint` / `pnpm format` | Biome lint / format |
| `pnpm test` | Vitest (`:watch` / `:coverage`) |
| `pnpm docker:up` / `pnpm docker:down` | 로컬 PostgreSQL 컨테이너 기동/중지 |
| `pnpm db:push` / `pnpm db:generate` / `pnpm db:generate:mysql` | Drizzle 스키마 push / 마이그레이션 생성 (PG / MySQL) |
| `pnpm db:studio` | Drizzle Studio (DB GUI) |
| `pnpm storybook` / `pnpm build-storybook` | Storybook dev / build |
| `pnpm package` / `pnpm make` | Electron Forge 패키징 / 설치파일 빌드 |

</details>

## 📂 프로젝트 구조

- `src/main/` — Electron main process (IPC 핸들러, DB 어댑터/리포지토리, 워크스페이스)
- `src/preload/` — `window.callApi` 타입 IPC 브리지
- `src/renderer/src/` — React 렌더러 (Atomic Design)
- `docs/` — 설계/백로그/계획 문서 · `wiki/` — 사용자/개발자 위키 · `drizzle/` — 생성된 마이그레이션 (PG/MySQL)

## 🌿 브랜치 모델

- 활성 개발의 기준 브랜치는 **`main`** 입니다.
- 과거 갈래(`main`의 옛 상태, `ui-v2`, `develop`, `docs`)는 역사 보존을 위해 **`legacy/*`** 네임스페이스로 아카이브되어 있습니다.
- 작업 브랜치 컨벤션: `feature/*`, `bugfix/*`, `hotfix/*`. 자세한 내용은 [Branching & Releases](./wiki/Branching-and-Releases.md) 참고.

## 🤝 Contributing

기여는 언제나 환영합니다! 기여 가이드는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)를, 행동 강령은 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)를 참고하세요. 코드 스타일/컨벤션 상세는 [Contributing wiki](./wiki/Contributing.md)와 [`CLAUDE.md`](./CLAUDE.md)에 있습니다.

## 📄 License

[MIT](./LICENSE) © jujoycode

<p align="center">
  <sub>Electron · React 19 · Drizzle ORM 으로 제작 — 데이터는 당신의 데이터베이스에 남습니다.</sub>
</p>
