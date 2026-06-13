# Database & Multi-DBMS

Hydra는 워크스페이스마다 **PostgreSQL** 또는 **MySQL 8.0+**를 선택해 연결할 수 있습니다.
이 멀티 DBMS 지원은 Phase 1~5에 걸쳐 구현되었습니다.

## 어댑터 계층

- `adapter/DatabaseAdapter.ts` — 공통 인터페이스.
- `adapter/PostgresAdapter.ts` — Drizzle + `pg`. 에러는 `wrapPgError()`로 `DatabaseError`에 매핑
  (28P01/28000→AUTH, 3D000→NOT_FOUND, 42501→PERMISSION, ECONNREFUSED/ENOTFOUND/…→NETWORK).
- `adapter/MySqlAdapter.ts` — Drizzle + `mysql2`. `wrapMySqlError()`가 `DrizzleQueryError`의 cause
  체인을 언랩해 원본 errno를 매핑. UTC/`utf8mb4`/SSL 풀, READ COMMITTED.
- `adapter/createAdapter.ts` — `dbms` 값 → 어댑터 팩토리. 알 수 없는 값은 조용히 PG로 폴백하지 않고
  `VALIDATION_ERROR`로 fail-fast.

## 듀얼 스키마 전략

`schema.mysql.ts`는 `schema.pg.ts`의 단순 복사가 아니라 타입 이식 규칙을 따릅니다.

| 개념 | PostgreSQL | MySQL 8 |
|------|------------|---------|
| UUID PK | `uuid` | `char(36)` + `ascii_bin` collation (customType) |
| 타임스탬프 | `timestamp(3)` | `datetime(3)` |
| TEXT UNIQUE | `text` + unique | `varchar` (TEXT는 인덱스 길이 제약) |

- PK는 **UUIDv7** 생성(`CoreUtil.getUuid()`)으로 시간 정렬 → InnoDB/PG 인덱스 지역성 향상. 기존 v4 id는 공존.
- FK/필터 컬럼에 보조 인덱스를 추가했습니다 (MySQL clustered-PK 대비, PG에선 무해).

## 이식 가능한 쿼리 의미

- 단일 리포지토리 셋이 PG/MySQL을 모두 서빙 — 스키마를 생성자 주입으로 받습니다.
- pg 전용 `ilike` 대신 `lower(col) LIKE lower(?)` 헬퍼 사용 (와일드카드 이스케이프 포함; MySQL 구문
  호환을 위해 `ESCAPE` 표기를 조정).
- MySQL은 `RETURNING`을 지원하지 않으므로, 모든 쓰기는 `.returning()`을 제거하고 앱 생성 PK로 재조회
  (read-after-write)합니다.

## 마이그레이션 전략

- 생성된 마이그레이션은 `drizzle/pg`, `drizzle/mysql`로 분리됩니다 (듀얼 drizzle config).
- 연결 시 멱등 실행. 스키마가 최신이면 마이그레이터를 **건너뜁니다** → DML-only 계정 지원.
- 동시 마이그레이션은 락으로 가드: PG `pg_advisory_lock`, MySQL DB-스코프 `GET_LOCK`.
- 마이그레이션 실패 시 에러에 맥락을 추가해 자격증명 문제와 DDL 권한 문제를 구분합니다.

### DDL vs DML 권한

- **런타임(정상 동작)**: DML만 (`SELECT/INSERT/UPDATE/DELETE`).
- **첫 연결 / 앱 업그레이드 후**: 대기 중인 마이그레이션 적용을 위해 DDL 권한
  (`CREATE, ALTER, INDEX, REFERENCES`) 필요 → 해당 1회만 admin/DDL 계정으로 연결.

> MySQL 워크스페이스에는 절대 `drizzle-kit push`를 쓰지 마세요. collation은 스키마 custom type이
> 소유하므로, 생성된 마이그레이션만 사용해야 합니다.

## 백업 / 롤백 주의

일부 마이그레이션은 **비가역**입니다(예: `user_db_role` 컬럼 드랍 — PG 0004 / MySQL 0001). 비가역
마이그레이션 SQL에는 첫 줄에 백업 권고 주석이 있습니다. 운영 DB에 적용 전 백업하세요.

## 테이블 (15개)

`users`, `projects`, `users_projects_link`, `milestones`, `issues`, `files`, `issues_files_link`,
`comments`, `labels`, `issues_labels_link`, `tasks`, `issue_relations`, `notifications`,
`integrations`, `invite_codes`. 네이밍 규칙은 `docs/design/convention-db.md` 참고
(snake_case, 테이블 복수형, 컬럼 단수형).
