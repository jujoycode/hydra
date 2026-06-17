# Database & Multi-DBMS

Hydra는 워크스페이스마다 **PostgreSQL** 또는 **MySQL 8.0+**를 골라 연결할 수 있습니다.
이 멀티 DBMS 지원은 Phase 1부터 5에 걸쳐 구현되었습니다.

## 어댑터 계층

- `adapter/DatabaseAdapter.ts` — 공통 인터페이스.
- `adapter/PostgresAdapter.ts` — Drizzle와 `pg` 기반. 에러는 `wrapPgError()`로 `DatabaseError`에 매핑됩니다
  (28P01/28000→AUTH, 3D000→NOT_FOUND, 42501→PERMISSION, ECONNREFUSED/ENOTFOUND/…→NETWORK).
- `adapter/MySqlAdapter.ts` — Drizzle와 `mysql2` 기반. `wrapMySqlError()`가 `DrizzleQueryError`의 cause
  체인을 언랩해 원본 errno를 매핑합니다. UTC와 `utf8mb4`, SSL 풀, READ COMMITTED를 사용합니다.
- `adapter/createAdapter.ts` — `dbms` 값을 어댑터로 매핑하는 팩토리. 알 수 없는 값은 조용히 PG로 폴백하지 않고
  `VALIDATION_ERROR`로 fail-fast 합니다.

## 듀얼 스키마 전략

`schema.mysql.ts`는 `schema.pg.ts`의 단순 복사가 아니라 타입 이식 규칙을 따릅니다.

| 개념 | PostgreSQL | MySQL 8 |
|------|------------|---------|
| UUID PK | `uuid` | `char(36)` + `ascii_bin` collation (customType) |
| 타임스탬프 | `timestamp(3)` | `datetime(3)` |
| TEXT UNIQUE | `text` + unique | `varchar` (TEXT는 인덱스 길이 제약) |

- PK는 **UUIDv7**로 생성(`CoreUtil.getUuid()`)해 시간순으로 정렬되며, InnoDB와 PG의 인덱스 지역성을 높입니다. 기존 v4 id와 공존합니다.
- FK와 필터 컬럼에 보조 인덱스를 추가했습니다. MySQL의 clustered-PK에 대비한 것이며, PG에서는 무해합니다.

## 이식 가능한 쿼리 의미

- 단일 리포지토리 셋이 PG와 MySQL을 모두 서빙하며, 스키마는 생성자 주입으로 받습니다.
- pg 전용 `ilike` 대신 `lower(col) LIKE lower(?)` 헬퍼를 사용합니다. 와일드카드 이스케이프를 포함하며, MySQL 구문
  호환을 위해 `ESCAPE` 표기를 조정했습니다.
- MySQL은 `RETURNING`을 지원하지 않으므로, 모든 쓰기는 `.returning()`을 제거하고 앱이 생성한 PK로 다시 조회
  (read-after-write)합니다.

## 마이그레이션 전략

- 생성된 마이그레이션은 듀얼 drizzle config에 따라 `drizzle/pg`와 `drizzle/mysql`로 분리됩니다.
- 연결 시 멱등하게 실행됩니다. 스키마가 최신이면 마이그레이터를 **건너뛰므로** DML 전용 계정도 지원합니다.
- 동시 마이그레이션은 락으로 가드합니다. PG는 `pg_advisory_lock`, MySQL은 DB 스코프 `GET_LOCK`을 사용합니다.
- 마이그레이션이 실패하면 에러에 맥락을 덧붙여 자격증명 문제와 DDL 권한 문제를 구분합니다.

### DDL vs DML 권한

- **런타임(정상 동작)**: DML만 사용합니다(`SELECT, INSERT, UPDATE, DELETE`).
- **첫 연결이나 앱 업그레이드 후**: 대기 중인 마이그레이션을 적용하려면 DDL 권한
  (`CREATE, ALTER, INDEX, REFERENCES`)이 필요합니다. 이때 한 번만 admin이나 DDL 계정으로 연결하세요.

> MySQL 워크스페이스에는 절대 `drizzle-kit push`를 쓰지 마세요. collation은 스키마 custom type이
> 소유하므로, 생성된 마이그레이션만 사용해야 합니다.

## 백업 / 롤백 주의

일부 마이그레이션은 **비가역**입니다(예: `user_db_role` 컬럼 드랍, PG 0004 및 MySQL 0001). 비가역
마이그레이션 SQL에는 첫 줄에 백업 권고 주석이 있습니다. 운영 DB에 적용하기 전에 백업하세요.

## 테이블 (15개)

`users`, `projects`, `users_projects_link`, `milestones`, `issues`, `files`, `issues_files_link`,
`comments`, `labels`, `issues_labels_link`, `tasks`, `issue_relations`, `notifications`,
`integrations`, `invite_codes`. 네이밍 규칙은 `docs/design/convention-db.md`를 참고하세요
(snake_case, 테이블은 복수형, 컬럼은 단수형).
