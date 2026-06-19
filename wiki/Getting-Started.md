# Getting Started

## 사전 준비

- Node.js 20+
- pnpm 9+
- 연결할 데이터베이스: PostgreSQL 또는 MySQL 8.0+
  - 로컬 개발용 PostgreSQL은 `pnpm docker:up`으로 컨테이너를 실행할 수 있습니다(Docker Desktop 필요).

## 설치 & 실행

```bash
pnpm install          # 의존성 설치
cp .env.example .env  # drizzle CLI 전용 환경 변수 (앱 런타임 접속과 분리)
pnpm docker:up        # (선택) 로컬 PostgreSQL 컨테이너 기동
pnpm db:push          # (로컬 개발) Drizzle 스키마를 DB에 반영
pnpm hot              # Electron 앱 개발 모드 (hot reload)
```

hot reload 없이 실행하려면 `pnpm dev`를 사용하세요.

## 첫 실행 흐름

1. **워크스페이스 연결 화면** — 앱을 처음 실행하면 표시됩니다.
   - DBMS(PostgreSQL 또는 MySQL), host, port, database 이름, 서비스 계정 자격증명을 입력하세요.
   - DBMS를 바꾸면 기본 포트와 계정이 자동으로 전환됩니다(PG 5432, MySQL 3306).
2. **마이그레이션 자동 실행** — 연결할 때 스키마 마이그레이션이 자동으로 적용됩니다.
   - 스키마가 이미 최신이면 마이그레이터를 건너뜁니다. 따라서 DML 전용 계정으로도 동작합니다.
   - 첫 연결이나 앱 업그레이드 직후에는 DDL 권한 계정으로 한 번 연결해야 합니다([Database & Multi-DBMS](./Database-and-Multi-DBMS.md) 참고).
3. **관리자 셋업 화면** — 빈 DB라면 첫 관리자 계정을 만드는 화면이 나옵니다.
   - `user_sn`(로그인 아이디)와 초기 비밀번호를 설정하세요.
4. **앱 로그인** — 이후부터는 개인 계정으로 로그인합니다. 관리자는 앱 내 멤버 관리에서 멤버를 추가할 수 있습니다.

## 멤버 초대

초대 코드는 자격증명을 담지 않는 비민감 정보(`host/port/dbName/dbms`)를 base64로 인코딩한 값입니다.
초대를 받은 사용자는 같은 워크스페이스에 연결한 뒤 관리자가 발급한 계정으로 로그인하면 됩니다.
자세한 내용은 [Authentication](./Authentication.md)을 참고하세요.

## 트러블슈팅

- **`pnpm db:push`가 "connection refused"**: 컨테이너가 healthy 상태가 될 때까지 수 초 기다린 뒤 다시 시도하세요(`docker ps`에서 `(healthy)` 확인).
- **포트 충돌(5432/3306)**: 로컬에 이미 DB가 실행 중인 경우입니다. 기존 프로세스를 종료하거나 `docker-compose.yml`의 포트를 변경(예: `'15432:5432'`, `'3307:3306'`)하고 `.env`의 포트도 함께 수정하세요.
- **연결은 되는데 로그인 화면이 나오지 않음**: 빈 DB라면 관리자 셋업 화면이 먼저 나옵니다. 마이그레이션이 적용됐는지 앱 로그나 터미널에서 확인하세요.
- **MySQL 마이그레이션 권한 에러**: 첫 연결이나 업그레이드 시점에는 DDL 권한이 필요합니다. DML 전용 계정으로는 대기 중인 마이그레이션을 적용할 수 없습니다.
