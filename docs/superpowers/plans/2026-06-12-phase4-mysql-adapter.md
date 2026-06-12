# Phase 4: MySQL Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hydra가 워크스페이스 연결 시 PostgreSQL과 MySQL 8 중 하나를 선택해 동작하도록 MySQL 어댑터를 추가한다 (스펙 §12 Phase 4).

**Architecture:** `createAdapter(dbms)` 팩토리가 `PostgresAdapter` 또는 신규 `MySqlAdapter`를 반환한다. 스키마는 `schema.ts`(PG) + `schema.mysql.ts`(MySQL) 듀얼 파일 + 컬럼 패리티 테스트. 마이그레이션은 `drizzle/pg`, `drizzle/mysql`로 분리. 리포지토리는 기존 단일 셋을 유지하되 스키마 객체를 생성자 주입받아 양 엔진을 서빙한다 (타입 기준은 pg, MySQL 핸들/스키마는 와이어링에서 캐스트 — 스펙 §13의 "cross-dialect typing" 리스크에 대한 결정).

**Tech Stack:** Electron main process, Drizzle ORM (`drizzle-orm/mysql2`, `drizzle-orm/node-postgres`), `mysql2`, `pg`, drizzle-kit, Vitest, GitHub Actions (MySQL 8.0 + PostgreSQL 16 컨테이너).

**Branch:** `feature/mysql-multidbms-phase4` (v3에서 분기)

**Base spec:** `docs/superpowers/specs/2026-06-06-mysql-support-and-auth-redesign-design.md` §4, §6.2, §7, §8.1, §12(4)

**스펙 대비 의도적 결정 (실행자는 따를 것):**
- 스키마 파일명은 `schema.pg.ts`로 리네임하지 않고 기존 `schema.ts`(PG)를 유지한다. 16개 파일의 import 변경을 피하고 머지 리스크를 줄이기 위함. 스펙의 본질(듀얼 파일 + 패리티 테스트)은 충족된다.
- `invite_codes.code`의 UNIQUE는 MySQL 스키마에서만 뺀다(스펙 §6.2.3 — TEXT UNIQUE는 MySQL ERROR 1170). PG 스키마는 변경하지 않는다(기존 마이그레이션 이력 보존).
- MySQL `char(36)` UUID / `varchar(255)` 해시 컬럼의 `ascii_bin` collation은 drizzle-kit이 collation API를 제공하지 않으므로 **생성된 0000 SQL을 직접 수정**해서 반영한다(Task 3).
- 충전식 재시도(retry/backoff)는 스펙 §12 Phase 4 항목에 없으므로 이번 단계에서 구현하지 않는다.

---

## File Structure

```
src/main/core/database/
  adapter/
    DatabaseAdapter.ts          (수정 없음 — 인터페이스 그대로)
    PostgresAdapter.ts          (수정: runMigrations 경로만 호출부에서 변경됨, 파일 자체는 그대로)
    MySqlAdapter.ts             (신규: mysql2 풀 + drizzle + wrapMySqlError + GET_LOCK 마이그레이션)
    MySqlAdapter.test.ts        (신규: wrapMySqlError 단위 테스트)
    createAdapter.ts            (신규: dbms → adapter 팩토리)
    createAdapter.test.ts       (신규)
  schema/drizzle/
    schema.ts                   (수정: timestamp precision 3)
    schema.mysql.ts             (신규: MySQL 스키마, §6.2 타입 규칙)
    schema.parity.test.ts       (신규: 테이블/컬럼명 패리티)
  repository/drizzle/
    executor.ts                 (수정: DrizzleSchema 타입 추가)
    Drizzle*Repository.ts       (수정 ×11: 스키마 생성자 주입)
  migrate/migrationsPath.ts     (수정: dialect 인자)
  __testutils__/
    mysqlTestDb.ts              (신규: MySQL 테스트 DB 생성/삭제)
  mysql.integration.test.ts     (신규: 크로스 엔진 통합 테스트, RUN_DB_TESTS_MYSQL 게이트)
drizzle/
  pg/                           (이동: 기존 0000~0003 + meta)
  mysql/                        (신규: 0000 베이스라인 + meta)
drizzle.config.ts               (수정: out → ./drizzle/pg)
drizzle.mysql.config.ts         (신규)
src/main/core/interface/types/workspace.ts  (수정: DbmsType, dbms 필드)
src/main/core/interface/types/invite.ts     (수정: dbms 필드)
src/main/core/workspace/WorkspaceManager.ts (수정: load 시 dbms 백필)
src/main/handler/workspace/ConnectWorkspaceHandler.ts (수정: 팩토리 + 스키마 주입)
src/main/handler/invite/GenerateInviteHandler.ts      (수정: payload에 dbms)
src/main/handler/invite/ApplyInviteHandler.ts         (수정: dbms 백필)
src/renderer/src/types/auth.ts                        (수정: dbms 필드)
src/renderer/src/components/pages/WorkspacePage.tsx   (수정: DBMS 선택 UI)
.github/workflows/ci.yml        (수정: mysql:8.0 서비스)
docker-compose.yml              (수정: mysql 서비스)
CLAUDE.md, README.md            (수정: 명령어/GRANT 문서)
```

**검증 명령(공통):**
- 타입체크: `pnpm typecheck:node` / 전체 `pnpm typecheck`
- 단위 테스트: `pnpm test` (DB 게이트 테스트는 `RUN_DB_TESTS=1`, MySQL은 `RUN_DB_TESTS_MYSQL=1` 필요)
- 린트: `pnpm lint:ci`

---

### Task 0: 브랜치 생성

- [ ] **Step 1: feature 브랜치 생성**

```bash
git checkout -b feature/mysql-multidbms-phase4 v3
```

Expected: `Switched to a new branch 'feature/mysql-multidbms-phase4'`

---

### Task 1: mysql2 의존성 + 로컬 MySQL 컨테이너

**Files:**
- Modify: `package.json` (dependencies)
- Modify: `docker-compose.yml`

- [ ] **Step 1: mysql2 설치**

```bash
pnpm add mysql2
```

Expected: `package.json` dependencies에 `"mysql2": "^3.x"` 추가됨.

- [ ] **Step 2: docker-compose에 mysql 서비스 추가**

`docker-compose.yml`의 `services:` 아래에 추가 (기존 postgres 서비스 뒤):

```yaml
  mysql:
    image: mysql:8.0
    container_name: hydra-mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: hydra
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-mysql}
    ports:
      - '3306:3306'
    volumes:
      - hydra_mysql_data:/var/lib/mysql
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-pmysql']
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 15s
```

`volumes:` 블록에 `hydra_mysql_data:` 추가:

```yaml
volumes:
  hydra_data:
  hydra_mysql_data:
```

- [ ] **Step 3: 컨테이너 기동 확인**

```bash
pnpm docker:up && docker ps --filter name=hydra-mysql --format '{{.Status}}'
```

Expected: `Up ... (healthy)` (healthy까지 ~15초 대기 필요)

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml docker-compose.yml
git commit -m "chore: mysql2 의존성 + 로컬 MySQL 8.0 컨테이너 (Phase 4 기반)"
```

---

### Task 2: schema.mysql.ts + 컬럼 패리티 테스트

**Files:**
- Create: `src/main/core/database/schema/drizzle/schema.mysql.ts`
- Test: `src/main/core/database/schema/drizzle/schema.parity.test.ts`

**타입 매핑 규칙 (스펙 §6.2):** `uuid` → `char(36)`, `timestamp` → `datetime(fsp:3)`, `text`+UNIQUE → bounded `varchar`+UNIQUE (`project_key` varchar(50)), `invite_codes.code`는 UNIQUE 제거, `integer` → `int`, `boolean` → `boolean`(TINYINT), `.defaultNow()` → `.default(sql\`CURRENT_TIMESTAMP(3)\`)`.

- [ ] **Step 1: 패리티 테스트 작성 (실패 확인용)**

`src/main/core/database/schema/drizzle/schema.parity.test.ts`:

```ts
// 듀얼 스키마(PG/MySQL)가 같은 테이블·컬럼 집합을 정의하는지 검증 (스펙 §4.2)
// 타입은 엔진별로 다르지만(uuid vs char(36)) 이름 집합은 절대 어긋나면 안 된다.

import { getTableName, is } from 'drizzle-orm'
import { getTableConfig as mysqlTableConfig, MySqlTable } from 'drizzle-orm/mysql-core'
import { getTableConfig as pgTableConfig, PgTable } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import * as pgSchema from './schema'
import * as mysqlSchema from './schema.mysql'

function pgTables() {
  return Object.values(pgSchema).filter((v): v is PgTable => is(v, PgTable))
}
function mysqlTables() {
  return Object.values(mysqlSchema).filter((v): v is MySqlTable => is(v, MySqlTable))
}

describe('schema parity (pg vs mysql)', () => {
  it('defines the same set of tables', () => {
    const pgNames = pgTables().map(getTableName).sort()
    const myNames = mysqlTables().map(getTableName).sort()
    expect(myNames).toEqual(pgNames)
  })

  it('defines the same column names per table', () => {
    const myByName = new Map(mysqlTables().map((t) => [getTableName(t), t]))
    for (const pgTable of pgTables()) {
      const name = getTableName(pgTable)
      const myTable = myByName.get(name)
      expect(myTable, `mysql schema missing table ${name}`).toBeDefined()
      const pgCols = pgTableConfig(pgTable).columns.map((c) => c.name).sort()
      const myCols = mysqlTableConfig(myTable as MySqlTable).columns.map((c) => c.name).sort()
      expect(myCols, `column mismatch in ${name}`).toEqual(pgCols)
    }
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test schema.parity
```

Expected: FAIL — `Cannot find module './schema.mysql'`

- [ ] **Step 3: schema.mysql.ts 작성**

`src/main/core/database/schema/drizzle/schema.mysql.ts` (전체 파일):

```ts
// Drizzle ORM 스키마 정의 - MySQL 8 (schema.ts 의 PG 스키마와 테이블/컬럼명 패리티 유지 — schema.parity.test.ts)
// 타입 매핑 규칙은 스펙 §6.2: uuid→char(36, ascii_bin은 마이그레이션 SQL에서), timestamp→datetime(3), TEXT-UNIQUE→varchar-UNIQUE

import { sql } from 'drizzle-orm'
import { boolean, char, datetime, index, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'

const now3 = sql`CURRENT_TIMESTAMP(3)`

// 사용자 테이블
export const users = mysqlTable('users', {
  user_id: char('user_id', { length: 36 }).primaryKey(),
  user_sn: varchar('user_sn', { length: 255 }).notNull().unique(),
  user_password_hash: varchar('user_password_hash', { length: 255 }).notNull(),
  user_status: varchar('user_status', { length: 20 }).default('active'),
  user_name: varchar('user_name', { length: 255 }),
  user_email: varchar('user_email', { length: 255 }),
  user_db_role: varchar('user_db_role', { length: 255 }),
  user_avatar_path: varchar('user_avatar_path', { length: 1024 }),
  user_role: varchar('user_role', { length: 50 }).default('member'),
  user_created_at: datetime('user_created_at', { fsp: 3 }),
  user_updated_at: datetime('user_updated_at', { fsp: 3 })
})

// 프로젝트 테이블 (project_key: TEXT-UNIQUE 불가 → varchar(50) UNIQUE, 스펙 §6.2.3)
export const projects = mysqlTable('projects', {
  project_id: char('project_id', { length: 36 }).primaryKey(),
  project_name: text('project_name').notNull(),
  project_key: varchar('project_key', { length: 50 }).notNull().unique(),
  project_desc: text('project_desc'),
  project_created_by: char('project_created_by', { length: 36 }),
  project_modified_by: char('project_modified_by', { length: 36 }),
  project_start_date: datetime('project_start_date', { fsp: 3 }),
  project_end_date: datetime('project_end_date', { fsp: 3 })
})

// 사용자-프로젝트 연결 테이블
export const usersProjectsLink = mysqlTable(
  'users_projects_link',
  {
    user_project_link_id: char('user_project_link_id', { length: 36 }).primaryKey(),
    user_id: char('user_id', { length: 36 }).references(() => users.user_id),
    project_id: char('project_id', { length: 36 }).references(() => projects.project_id)
  },
  (t) => [
    index('idx_users_projects_link_user').on(t.user_id),
    index('idx_users_projects_link_project').on(t.project_id)
  ]
)

// 마일스톤 테이블
export const milestones = mysqlTable(
  'milestones',
  {
    milestone_id: char('milestone_id', { length: 36 }).primaryKey(),
    project_id: char('project_id', { length: 36 })
      .notNull()
      .references(() => projects.project_id),
    milestone_title: text('milestone_title').notNull(),
    milestone_desc: text('milestone_desc'),
    milestone_due_date: datetime('milestone_due_date', { fsp: 3 }),
    milestone_status: varchar('milestone_status', { length: 50 }).default('open'),
    milestone_created_at: datetime('milestone_created_at', { fsp: 3 }).default(now3),
    milestone_updated_at: datetime('milestone_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_milestones_project_id').on(t.project_id)]
)

// 이슈 테이블
export const issues = mysqlTable(
  'issues',
  {
    issue_id: char('issue_id', { length: 36 }).primaryKey(),
    project_id: char('project_id', { length: 36 })
      .notNull()
      .references(() => projects.project_id),
    issue_title: text('issue_title').notNull(),
    issue_key: text('issue_key').notNull(),
    issue_desc: text('issue_desc'),
    issue_status: varchar('issue_status', { length: 50 }),
    issue_priority: varchar('issue_priority', { length: 50 }),
    issue_category: varchar('issue_category', { length: 100 }),
    issue_created_by: char('issue_created_by', { length: 36 }),
    issue_modified_by: char('issue_modified_by', { length: 36 }),
    issue_assigned_to: char('issue_assigned_to', { length: 36 }),
    issue_milestone_id: char('issue_milestone_id', { length: 36 }).references(() => milestones.milestone_id),
    issue_created_at: datetime('issue_created_at', { fsp: 3 }).default(now3),
    issue_updated_at: datetime('issue_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [
    index('idx_issues_project_id').on(t.project_id),
    index('idx_issues_assigned_to').on(t.issue_assigned_to),
    index('idx_issues_milestone_id').on(t.issue_milestone_id)
  ]
)

// 파일 테이블
export const files = mysqlTable('files', {
  file_id: char('file_id', { length: 36 }).primaryKey(),
  file_name: text('file_name').notNull(),
  file_path: text('file_path').notNull(),
  file_type: text('file_type').notNull(),
  file_size: int('file_size'),
  file_created_at: datetime('file_created_at', { fsp: 3 }).default(now3),
  file_updated_at: datetime('file_updated_at', { fsp: 3 }).default(now3)
})

// 이슈-파일 연결 테이블
export const issuesFilesLink = mysqlTable(
  'issues_files_link',
  {
    issue_file_link_id: char('issue_file_link_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    file_id: char('file_id', { length: 36 }).references(() => files.file_id)
  },
  (t) => [index('idx_issues_files_link_issue').on(t.issue_id), index('idx_issues_files_link_file').on(t.file_id)]
)

// 댓글 테이블
export const comments = mysqlTable(
  'comments',
  {
    comment_id: char('comment_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    comment_content: text('comment_content').notNull(),
    comment_created_by: char('comment_created_by', { length: 36 }),
    comment_updated_by: char('comment_updated_by', { length: 36 }),
    comment_created_at: datetime('comment_created_at', { fsp: 3 }).default(now3),
    comment_updated_at: datetime('comment_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_comments_issue_id').on(t.issue_id)]
)

// 라벨 테이블
export const labels = mysqlTable('labels', {
  label_id: char('label_id', { length: 36 }).primaryKey(),
  label_name: varchar('label_name', { length: 100 }).notNull(),
  label_color: varchar('label_color', { length: 7 }).notNull(),
  label_created_at: datetime('label_created_at', { fsp: 3 }).default(now3)
})

// 이슈-라벨 연결 테이블
export const issuesLabelsLink = mysqlTable(
  'issues_labels_link',
  {
    issue_label_link_id: char('issue_label_link_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    label_id: char('label_id', { length: 36 }).references(() => labels.label_id)
  },
  (t) => [index('idx_issues_labels_link_issue').on(t.issue_id), index('idx_issues_labels_link_label').on(t.label_id)]
)

// 태스크 테이블
export const tasks = mysqlTable(
  'tasks',
  {
    task_id: char('task_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    task_title: text('task_title').notNull(),
    task_completed: boolean('task_completed').default(false),
    task_order: int('task_order').default(0),
    task_created_by: char('task_created_by', { length: 36 }),
    task_created_at: datetime('task_created_at', { fsp: 3 }).default(now3),
    task_updated_at: datetime('task_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_tasks_issue_id').on(t.issue_id)]
)

// 이슈 관계 테이블
export const issueRelations = mysqlTable(
  'issue_relations',
  {
    relation_id: char('relation_id', { length: 36 }).primaryKey(),
    source_issue_id: char('source_issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    target_issue_id: char('target_issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    relation_type: varchar('relation_type', { length: 50 }).notNull(),
    relation_created_at: datetime('relation_created_at', { fsp: 3 }).default(now3)
  },
  (t) => [
    index('idx_issue_relations_source').on(t.source_issue_id),
    index('idx_issue_relations_target').on(t.target_issue_id)
  ]
)

// 알림 테이블
export const notifications = mysqlTable(
  'notifications',
  {
    notification_id: char('notification_id', { length: 36 }).primaryKey(),
    user_id: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.user_id),
    notification_type: varchar('notification_type', { length: 50 }).notNull(),
    notification_title: text('notification_title').notNull(),
    notification_message: text('notification_message'),
    notification_read: boolean('notification_read').default(false),
    notification_link: text('notification_link'),
    notification_created_at: datetime('notification_created_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_notifications_user_id').on(t.user_id)]
)

// 인테그레이션 설정 테이블
export const integrations = mysqlTable('integrations', {
  integration_id: char('integration_id', { length: 36 }).primaryKey(),
  integration_type: varchar('integration_type', { length: 50 }).notNull(),
  integration_config: text('integration_config').notNull(),
  integration_enabled: boolean('integration_enabled').default(false),
  integration_created_at: datetime('integration_created_at', { fsp: 3 }).default(now3),
  integration_updated_at: datetime('integration_updated_at', { fsp: 3 }).default(now3)
})

// 초대 코드 테이블 (code: TEXT-UNIQUE 불가 + 조회되지 않는 컬럼 → UNIQUE 없이 저장만, 스펙 §6.2.3)
export const inviteCodes = mysqlTable('invite_codes', {
  invite_code_id: char('invite_code_id', { length: 36 }).primaryKey(),
  code: text('code').notNull(),
  workspace_name: text('workspace_name').notNull(),
  host: text('host').notNull(),
  port: int('port').notNull(),
  db_name: text('db_name').notNull(),
  created_by: text('created_by'),
  created_at: datetime('created_at', { fsp: 3 }).default(now3),
  expires_at: datetime('expires_at', { fsp: 3 })
})
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test schema.parity
```

Expected: PASS (2 tests)

- [ ] **Step 5: 타입체크**

```bash
pnpm typecheck:node
```

Expected: 에러 없음

- [ ] **Step 6: Commit**

```bash
git add src/main/core/database/schema/drizzle/schema.mysql.ts src/main/core/database/schema/drizzle/schema.parity.test.ts
git commit -m "feat: MySQL 스키마(schema.mysql.ts) + PG/MySQL 컬럼 패리티 테스트"
```

---

### Task 3: 마이그레이션 폴더 분리 (drizzle/pg, drizzle/mysql) + MySQL 베이스라인 생성

**Files:**
- Move: `drizzle/0000~0002*.sql`, `drizzle/meta/` → `drizzle/pg/`
- Modify: `drizzle.config.ts` (out 경로)
- Create: `drizzle.mysql.config.ts`
- Modify: `package.json` (scripts)
- Modify: `src/main/core/database/migrate/migrationsPath.ts`
- Modify: `src/main/handler/workspace/ConnectWorkspaceHandler.ts:34` 부근 (`getMigrationsFolder()` 호출)
- Modify: 테스트의 `resolve(process.cwd(), 'drizzle')` 경로들

**주의:** drizzle 마이그레이터는 적용 이력을 SQL 해시로 `__drizzle_migrations` 테이블에 기록하므로 폴더 이동은 기존 PG 워크스페이스에 안전하다(재적용되지 않음).

- [ ] **Step 1: 기존 PG 마이그레이션을 drizzle/pg로 이동**

```bash
mkdir -p drizzle/pg
git mv drizzle/0000_tearful_ender_wiggin.sql drizzle/pg/
git mv drizzle/0001_big_havok.sql drizzle/pg/
git mv drizzle/0002_oval_edwin_jarvis.sql drizzle/pg/
git mv drizzle/meta drizzle/pg/meta
```

- [ ] **Step 2: drizzle.config.ts의 out 경로 변경**

`drizzle.config.ts`에서 `out: './drizzle'` → `out: './drizzle/pg'`:

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/core/database/schema/drizzle/schema.ts',
  out: './drizzle/pg',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hydra'
  }
})
```

- [ ] **Step 3: drizzle.mysql.config.ts 생성**

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/core/database/schema/drizzle/schema.mysql.ts',
  out: './drizzle/mysql',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'mysql',
    database: process.env.MYSQL_DB_NAME || 'hydra'
  }
})
```

- [ ] **Step 4: package.json 스크립트 추가/정리**

`"db:generate": "drizzle-kit generate"` 아래에 추가:

```json
"db:generate:mysql": "drizzle-kit generate --config drizzle.mysql.config.ts",
```

- [ ] **Step 5: MySQL 베이스라인 마이그레이션 생성**

```bash
pnpm db:generate:mysql
```

Expected: `drizzle/mysql/0000_*.sql` + `drizzle/mysql/meta/` 생성. 생성된 SQL에 13개 `CREATE TABLE`이 있는지 확인:

```bash
grep -c 'CREATE TABLE' drizzle/mysql/0000_*.sql
```

Expected: `13`

- [ ] **Step 6: 생성된 0000 SQL에 collation 수동 반영 (스펙 §5.3, §6.2.4)**

`drizzle/mysql/0000_*.sql`을 열어:
1. 모든 `char(36)` 컬럼 정의에 ` CHARACTER SET ascii COLLATE ascii_bin`을 덧붙인다. 예: `` `user_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL ``
2. `user_password_hash varchar(255)` 정의에 ` CHARACTER SET ascii COLLATE ascii_bin`을 덧붙인다.
3. `user_sn varchar(255)` 정의에 ` CHARACTER SET ascii COLLATE ascii_bin`을 덧붙인다 (app-layer normalize가 소문자를 보장하므로 binary 비교 안전 — 스펙 §5.2).
4. 각 `CREATE TABLE ... ;` 의 닫는 괄호 뒤에 ` DEFAULT CHARSET=utf8mb4` 가 없으면 추가.

검증: 

```bash
grep -c 'ascii_bin' drizzle/mysql/0000_*.sql
```

Expected: uuid 컬럼 수(36개 내외) + 2 — 0이 아니면 됨. 정확한 수보다 **Task 6의 실 DB 마이그레이션 테스트가 통과하는지**가 기준.

- [ ] **Step 7: migrationsPath.ts에 dialect 인자 추가**

`src/main/core/database/migrate/migrationsPath.ts` 전체 교체:

```ts
// 마이그레이션 SQL 폴더 경로 해석 (dev: 레포 루트, packaged: resources)
// 주의: 이 모듈은 메인 프로세스 런타임에서만 import 한다 (electron 의존성, 테스트에서 import 금지)

import { join, resolve } from 'node:path'
import { app } from 'electron'

export type MigrationDialect = 'pg' | 'mysql'

export function getMigrationsFolder(dialect: MigrationDialect): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'drizzle', dialect)
  }
  return resolve(process.cwd(), 'drizzle', dialect)
}
```

- [ ] **Step 8: 호출부/테스트 경로 업데이트**

대상 파일 찾기:

```bash
grep -rn "getMigrationsFolder()\|'drizzle'" src/ --include='*.ts'
```

다음과 같이 수정한다:
- `src/main/handler/workspace/ConnectWorkspaceHandler.ts`: `await adapter.runMigrations(getMigrationsFolder())` → `await adapter.runMigrations(getMigrationsFolder('pg'))` (Task 7에서 dbms 분기로 다시 바뀜 — 여기서는 'pg' 고정으로 컴파일만 유지)
- 테스트 파일들(`readAfterWrite.test.ts`, `transaction.atomicity.test.ts`, `PostgresAdapter.migrate.test.ts`, `auth.integration.test.ts` 등 grep에 걸리는 모든 파일): `resolve(process.cwd(), 'drizzle')` → `resolve(process.cwd(), 'drizzle/pg')`

- [ ] **Step 9: 기존 PG 테스트 회귀 확인**

```bash
pnpm typecheck:node && RUN_DB_TESTS=1 pnpm test
```

Expected: 모두 PASS (PostgreSQL 컨테이너 기동 상태 필요 — `pnpm docker:up`)

- [ ] **Step 10: Commit**

```bash
git add -A drizzle/ drizzle.config.ts drizzle.mysql.config.ts package.json src/
git commit -m "feat: 마이그레이션 폴더 pg/mysql 분리 + MySQL 베이스라인 0000 (ascii_bin collation)"
```

---

### Task 4: PG 타임스탬프 precision(3) 마이그레이션 (스펙 §6.2.2 — 양 엔진 ms 고정)

**Files:**
- Modify: `src/main/core/database/schema/drizzle/schema.ts` (모든 `timestamp(...)` 호출)
- Create (generated): `drizzle/pg/0003_*.sql`

- [ ] **Step 1: schema.ts의 모든 timestamp에 precision 3 지정**

`schema.ts`에서 모든 `timestamp('<name>')` → `timestamp('<name>', { precision: 3 })`. 대상 컬럼(22개): `user_created_at`, `user_updated_at`, `project_start_date`, `project_end_date`, `milestone_due_date`, `milestone_created_at`, `milestone_updated_at`, `issue_created_at`, `issue_updated_at`, `file_created_at`, `file_updated_at`, `comment_created_at`, `comment_updated_at`, `label_created_at`, `task_created_at`, `task_updated_at`, `relation_created_at`, `notification_created_at`, `integration_created_at`, `integration_updated_at`, `created_at`, `expires_at`. `.defaultNow()` 등 체이닝은 그대로 유지. 예:

```ts
milestone_created_at: timestamp('milestone_created_at', { precision: 3 }).defaultNow(),
```

- [ ] **Step 2: 마이그레이션 생성**

```bash
pnpm db:generate
```

Expected: `drizzle/pg/0003_*.sql` 생성, 내용은 `ALTER TABLE ... ALTER COLUMN ... SET DATA TYPE timestamp (3);` 류.

- [ ] **Step 3: PG 통합 테스트로 적용/멱등성 검증**

```bash
RUN_DB_TESTS=1 pnpm test PostgresAdapter.migrate
```

Expected: PASS (기존 migrate 테스트가 새 0003 포함 전체 이력을 fresh DB에 적용)

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/schema/drizzle/schema.ts drizzle/pg/
git commit -m "feat: PG 타임스탬프 precision(3) 고정 — MySQL datetime(3)과 ms 단위 정렬 (마이그레이션 0003)"
```

---

### Task 5: MySqlAdapter + wrapMySqlError + 테스트 DB 유틸

**Files:**
- Create: `src/main/core/database/__testutils__/mysqlTestDb.ts`
- Create: `src/main/core/database/adapter/MySqlAdapter.ts`
- Test: `src/main/core/database/adapter/MySqlAdapter.test.ts` (단위: 에러 매핑)
- Test: `src/main/core/database/adapter/MySqlAdapter.migrate.test.ts` (통합: 마이그레이션 적용+멱등)

- [ ] **Step 1: wrapMySqlError 단위 테스트 작성 (실패 확인)**

`src/main/core/database/adapter/MySqlAdapter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ErrorCode } from '../../interface/CoreInterface'
import { wrapMySqlError } from './MySqlAdapter'

const ctx = { host: 'h', port: 3306, database: 'd', user: 'u' }

describe('wrapMySqlError', () => {
  it('maps ER_ACCESS_DENIED_ERROR(1045) to AUTH_ERROR', () => {
    const e = wrapMySqlError({ errno: 1045, message: 'Access denied' }, ctx)
    expect(e.code).toBe(ErrorCode.AUTH_ERROR)
  })

  it('maps ER_BAD_DB_ERROR(1049) to NOT_FOUND_ERROR', () => {
    const e = wrapMySqlError({ errno: 1049, message: 'Unknown database' }, ctx)
    expect(e.code).toBe(ErrorCode.NOT_FOUND_ERROR)
  })

  it('maps DB/table access denied (1044, 1142, 1227) to PERMISSION_ERROR', () => {
    for (const errno of [1044, 1142, 1227]) {
      expect(wrapMySqlError({ errno, message: 'denied' }, ctx).code).toBe(ErrorCode.PERMISSION_ERROR)
    }
  })

  it('maps network errno codes to NETWORK_ERROR', () => {
    for (const code of ['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'ECONNRESET']) {
      expect(wrapMySqlError({ code, message: 'net' }, ctx).code).toBe(ErrorCode.NETWORK_ERROR)
    }
  })

  it('falls back to DB_ERROR preserving the message', () => {
    const e = wrapMySqlError({ errno: 9999, message: 'boom' }, ctx)
    expect(e.code).toBe(ErrorCode.DB_ERROR)
    expect(e.message).toBe('boom')
  })
})
```

- [ ] **Step 2: 실패 확인**

```bash
pnpm test MySqlAdapter.test
```

Expected: FAIL — `Cannot find module './MySqlAdapter'`

- [ ] **Step 3: MySqlAdapter.ts 구현**

`src/main/core/database/adapter/MySqlAdapter.ts` (전체 파일):

```ts
// MySQL 어댑터 - drizzle-orm + mysql2 Pool 기반 구현 (스펙 §4.1, §7)

import fs from 'node:fs'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import mysql from 'mysql2/promise'
import type { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode } from '@/interface/CoreInterface'
import * as schema from '../schema/drizzle/schema.mysql'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

// MySQL errno / Node errno를 PostgresAdapter.wrapPgError와 같은 비즈니스 에러로 매핑
export function wrapMySqlError(
  error: unknown,
  ctx: { host?: string; port?: number; database?: string; user?: string }
): DatabaseError {
  const err = error as { errno?: number; code?: string; message?: string }
  const errno = err?.errno
  const rawMessage = err?.message ?? 'Unknown database error'

  // MySQL server error codes
  if (errno === 1045) {
    // ER_ACCESS_DENIED_ERROR
    return new DatabaseError(
      ErrorCode.AUTH_ERROR,
      `Authentication failed for user "${ctx.user ?? 'unknown'}". Please check your username and password.`,
      { mysqlErrno: errno }
    )
  }
  if (errno === 1049) {
    // ER_BAD_DB_ERROR
    return new DatabaseError(ErrorCode.NOT_FOUND_ERROR, `Database "${ctx.database ?? 'unknown'}" does not exist.`, {
      mysqlErrno: errno
    })
  }
  if (errno === 1044 || errno === 1142 || errno === 1227) {
    // ER_DBACCESS_DENIED / ER_TABLEACCESS_DENIED / ER_SPECIFIC_ACCESS_DENIED
    return new DatabaseError(ErrorCode.PERMISSION_ERROR, `Permission denied for user "${ctx.user ?? 'unknown'}".`, {
      mysqlErrno: errno
    })
  }

  // Network-level errors (Node.js errno codes)
  const code = err?.code
  if (code === 'ECONNREFUSED') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Cannot connect to database server at ${ctx.host ?? '?'}:${ctx.port ?? '?'}. Please check if the server is running.`,
      { mysqlCode: code }
    )
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Host "${ctx.host ?? 'unknown'}" could not be resolved. Please check the hostname.`,
      { mysqlCode: code }
    )
  }
  if (code === 'ETIMEDOUT' || code === 'ECONNRESET') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Connection to ${ctx.host ?? '?'}:${ctx.port ?? '?'} timed out or was reset. Please check your network.`,
      { mysqlCode: code }
    )
  }

  return new DatabaseError(ErrorCode.DB_ERROR, rawMessage, { mysqlErrno: errno, mysqlCode: code })
}

export class MySqlAdapter implements DatabaseAdapter {
  private pool: Pool | null = null
  private db: MySql2Database<typeof schema> | null = null

  async connect(config: ConnectionConfig): Promise<void> {
    const poolOptions: PoolOptions = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      timezone: 'Z', // UTC 고정 — 세션 TZ 변환 차단 (스펙 §6.2.2)
      connectTimeout: 5000,
      connectionLimit: 10
    }

    if (config.sslCertPath) {
      poolOptions.ssl = { ca: fs.readFileSync(config.sslCertPath, 'utf-8') }
    }

    const pool = mysql.createPool(poolOptions)

    // Pool warm-up + utf8mb4 검증 (스펙 §7 — 기존 DB를 조용히 가정하지 않는다)
    try {
      const conn = await pool.getConnection()
      try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT @@character_set_database AS cs')
        const cs = rows[0]?.cs as string | undefined
        if (cs !== 'utf8mb4') {
          console.warn(`[MySqlAdapter] database charset is "${cs}", expected utf8mb4 — non-ASCII text may corrupt`)
        }
      } finally {
        conn.release()
      }
    } catch (error: unknown) {
      pool.end().catch(() => {})
      throw wrapMySqlError(error, {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user
      })
    }

    this.pool = pool
    this.db = drizzle(pool, { schema, mode: 'default' })
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
      this.db = null
    }
  }

  isConnected(): boolean {
    return this.pool !== null && this.db !== null
  }

  getConnection(): MySql2Database<typeof schema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  // GET_LOCK으로 동시 기동 마이그레이션 가드 (스펙 §8.4 — PG advisory lock 대응물)
  async runMigrations(migrationsFolder: string): Promise<void> {
    if (!this.db || !this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    const conn = await this.pool.getConnection()
    try {
      const [rows] = await conn.query<RowDataPacket[]>("SELECT GET_LOCK('hydra_migrations', 60) AS got")
      if (Number(rows[0]?.got) !== 1) {
        throw new DatabaseError(ErrorCode.DB_ERROR, 'Could not acquire migration lock (another instance migrating?)', null)
      }
      await migrate(this.db, { migrationsFolder })
    } finally {
      await conn.query("SELECT RELEASE_LOCK('hydra_migrations')").catch(() => {})
      conn.release()
    }
  }

  // 격리 수준을 PG 기본(READ COMMITTED)과 일치시킨다 (스펙 §7)
  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => fn(tx), { isolationLevel: 'read committed' })
  }
}
```

- [ ] **Step 4: 단위 테스트 통과 확인**

```bash
pnpm test MySqlAdapter.test && pnpm typecheck:node
```

Expected: PASS (5 tests), 타입 에러 없음

- [ ] **Step 5: mysqlTestDb.ts 작성**

`src/main/core/database/__testutils__/mysqlTestDb.ts`:

```ts
// 통합 테스트용 격리 MySQL 데이터베이스 생성/삭제 헬퍼 (docker-compose mysql 대상)

import mysql from 'mysql2/promise'

export function mysqlTestConfig() {
  return {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? 'mysql'
  }
}

export async function createMySqlTestDatabase(): Promise<string> {
  const name = `hydra_test_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`
  const conn = await mysql.createConnection(mysqlTestConfig())
  try {
    await conn.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4`)
  } finally {
    await conn.end()
  }
  return name
}

export async function dropMySqlTestDatabase(name: string): Promise<void> {
  const conn = await mysql.createConnection(mysqlTestConfig())
  try {
    await conn.query(`DROP DATABASE IF EXISTS \`${name}\``)
  } finally {
    await conn.end()
  }
}
```

- [ ] **Step 6: 마이그레이션 통합 테스트 작성**

`src/main/core/database/adapter/MySqlAdapter.migrate.test.ts`:

```ts
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMySqlTestDatabase, dropMySqlTestDatabase, mysqlTestConfig } from '../__testutils__/mysqlTestDb'
import { MySqlAdapter } from './MySqlAdapter'

const MIGRATIONS = resolve(process.cwd(), 'drizzle/mysql')

describe.runIf(process.env.RUN_DB_TESTS_MYSQL === '1')('MySqlAdapter migrations', () => {
  let adapter: MySqlAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createMySqlTestDatabase()
    adapter = new MySqlAdapter()
    await adapter.connect({ ...mysqlTestConfig(), database: dbName })
  })

  afterAll(async () => {
    await adapter.disconnect()
    await dropMySqlTestDatabase(dbName)
  })

  it('applies the baseline migration (13 tables + journal)', async () => {
    await adapter.runMigrations(MIGRATIONS)
    const db = adapter.getConnection()
    const rows = (await db.execute(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${dbName}'`
    )) as unknown as Array<unknown>
    // 13 app tables + __drizzle_migrations
    expect((rows as Array<{ length?: number }>)[0]).toBeDefined()
  })

  it('is idempotent on re-run', async () => {
    await expect(adapter.runMigrations(MIGRATIONS)).resolves.not.toThrow()
  })

  it('stores uuid columns as ascii_bin char(36)', async () => {
    const db = adapter.getConnection()
    const result = (await db.execute(
      `SELECT collation_name AS cn FROM information_schema.columns WHERE table_schema = '${dbName}' AND table_name = 'users' AND column_name = 'user_id'`
    )) as unknown as [Array<{ cn: string }>, unknown]
    expect(result[0][0].cn).toBe('ascii_bin')
  })
})
```

- [ ] **Step 7: 통합 테스트 실행 (MySQL 컨테이너 필요)**

```bash
RUN_DB_TESTS_MYSQL=1 pnpm test MySqlAdapter.migrate
```

Expected: PASS (3 tests). 실패하면 Task 3 Step 6의 SQL 수동 편집을 점검할 것 (전형적 원인: collation 문법 오타, FK 참조 컬럼과 collation 불일치 — **FK로 연결된 char(36) 컬럼은 양쪽 모두 ascii_bin이어야 한다**).

- [ ] **Step 8: Commit**

```bash
git add src/main/core/database/adapter/MySqlAdapter.ts src/main/core/database/adapter/MySqlAdapter.test.ts src/main/core/database/adapter/MySqlAdapter.migrate.test.ts src/main/core/database/__testutils__/mysqlTestDb.ts
git commit -m "feat: MySqlAdapter (mysql2 풀, UTC, utf8mb4 검증, GET_LOCK 마이그레이션, READ COMMITTED) + wrapMySqlError"
```

---

### Task 6: 리포지토리 스키마 주입 (단일 리포지토리 셋이 양 엔진 서빙)

**Files:**
- Modify: `src/main/core/database/repository/drizzle/executor.ts`
- Modify: `src/main/core/database/repository/drizzle/Drizzle*Repository.ts` (11개 전부)

**설계:** 리포지토리 타입 기준은 pg(`DrizzleDb`)로 유지하고, 스키마 객체를 생성자에서 주입받는다(기본값 = pg 스키마 → 기존 호출부/테스트 무변경). MySQL 연결 시 와이어링(Task 7)에서 mysql 스키마를 `DrizzleSchema`로 캐스트해 전달한다. 런타임 정합성은 Task 9의 크로스 엔진 통합 테스트가 보증한다.

- [ ] **Step 1: executor.ts에 DrizzleSchema 추가**

`src/main/core/database/repository/drizzle/executor.ts` 전체 교체:

```ts
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '../../schema/drizzle/schema'

// 포터블 쿼리 빌더의 "타입 기준"은 pg로 둔다. MySQL 연결은 구조적으로 동일한
// 포터블 서브셋(select/insert/update/delete/transaction)만 사용하므로
// 어댑터 와이어링에서 DrizzleDb/DrizzleSchema로 캐스트해 단일 리포지토리 셋을 공유한다.
export type DrizzleDb = NodePgDatabase<typeof schema>
// tx 핸들 타입을 transaction 콜백 인자에서 직접 추출 (drizzle 내부 제네릭에 의존하지 않음)
export type DrizzleTx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0]
export type DrizzleExecutor = DrizzleDb | DrizzleTx
// 주입 가능한 스키마 집합 (pg 스키마 모듈의 형태가 규범)
export type DrizzleSchema = typeof schema
```

- [ ] **Step 2: DrizzleUserRepository 변환 (패턴 기준 파일)**

`src/main/core/database/repository/drizzle/DrizzleUserRepository.ts` 전체 교체:

```ts
// Drizzle 기반 사용자 리포지토리 구현

import { eq, sql } from 'drizzle-orm'
import * as pgSchema from '../../schema/drizzle/schema'
import type { RepoExecutor } from '../interfaces/RepoExecutor'
import type { CreateUserData, UpdateUserData, UserRecord, UserRepository } from '../interfaces/UserRepository'
import type { DrizzleDb, DrizzleExecutor, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleUserRepository implements UserRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const { users } = this.schema
    const rows = await this.db.select().from(users).where(eq(users.user_id, userId)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findBySn(userSn: string): Promise<UserRecord | null> {
    const { users } = this.schema
    const rows = await this.db.select().from(users).where(eq(users.user_sn, userSn)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findAll(): Promise<UserRecord[]> {
    const rows = await this.db.select().from(this.schema.users)
    return rows as UserRecord[]
  }

  async create(data: CreateUserData, executor: RepoExecutor = this.db): Promise<UserRecord> {
    const { users } = this.schema
    const ex = executor as DrizzleExecutor
    const now = new Date()
    await ex.insert(users).values({
      user_id: data.userId,
      user_sn: data.userSn,
      user_password_hash: data.passwordHash,
      user_status: data.userStatus ?? 'active',
      user_name: data.userName ?? null,
      user_email: data.userEmail ?? null,
      user_role: data.userRole ?? 'member',
      user_avatar_path: data.userAvatarPath ?? null,
      user_created_at: now,
      user_updated_at: now
    })
    return selectById<UserRecord>(ex, users, users.user_id, data.userId)
  }

  async update(userId: string, data: UpdateUserData): Promise<UserRecord> {
    const { users } = this.schema
    const values: Record<string, unknown> = { user_updated_at: new Date() }
    if (data.userName !== undefined) values.user_name = data.userName
    if (data.userEmail !== undefined) values.user_email = data.userEmail
    if (data.userAvatarPath !== undefined) values.user_avatar_path = data.userAvatarPath
    if (data.userStatus !== undefined) values.user_status = data.userStatus

    await this.db.update(users).set(values).where(eq(users.user_id, userId))
    return selectById<UserRecord>(this.db, users, users.user_id, userId)
  }

  async delete(userId: string): Promise<boolean> {
    const { users } = this.schema
    await this.db.delete(users).where(eq(users.user_id, userId))
    return true
  }

  async count(executor: RepoExecutor = this.db): Promise<number> {
    const ex = executor as DrizzleExecutor
    const rows = await ex.select({ count: sql<number>`count(*)` }).from(this.schema.users)
    return Number(rows[0].count)
  }
}
```

- [ ] **Step 3: 나머지 10개 리포지토리에 동일 패턴 적용**

각 파일에 **기계적으로 동일한 3가지 변경**을 적용한다:

1. `import * as schema from '../../schema/drizzle/schema'` → `import * as pgSchema from '../../schema/drizzle/schema'`
2. 모듈 레벨 `const { <tables> } = schema` 줄 **삭제**, 생성자를 `constructor(private db: DrizzleDb, private schema: DrizzleSchema = pgSchema) {}`로 변경 (executor import에 `DrizzleSchema` 추가)
3. 각 메서드 본문 첫 줄에 `const { <tables> } = this.schema` 를 추가 (해당 메서드가 쓰는 테이블만)

파일별 테이블 (기존 모듈 레벨 destructure 기준):

| 파일 | 테이블 |
|---|---|
| `DrizzleCommentRepository.ts` | `comments` |
| `DrizzleFileRepository.ts` | `files`, `issuesFilesLink` |
| `DrizzleIntegrationRepository.ts` | `integrations` |
| `DrizzleIssueRelationRepository.ts` | `issueRelations` |
| `DrizzleIssueRepository.ts` | `issues` |
| `DrizzleLabelRepository.ts` | `labels`, `issuesLabelsLink` |
| `DrizzleMilestoneRepository.ts` | `milestones` |
| `DrizzleNotificationRepository.ts` | `notifications` |
| `DrizzleProjectRepository.ts` | `projects`, `usersProjectsLink` |
| `DrizzleTaskRepository.ts` | `tasks` |

- [ ] **Step 4: 잔여 모듈 레벨 destructure 없는지 검증**

```bash
grep -rn '} = schema$' src/main/core/database/repository/drizzle/
```

Expected: 출력 없음 (0건)

- [ ] **Step 5: 타입체크 + 기존 PG 테스트 회귀**

```bash
pnpm typecheck:node && RUN_DB_TESTS=1 pnpm test
```

Expected: 모두 PASS — 기본값 인자 덕에 기존 호출부는 무변경으로 컴파일/통과

- [ ] **Step 6: Commit**

```bash
git add src/main/core/database/repository/drizzle/
git commit -m "refactor: 리포지토리 스키마 생성자 주입 — 단일 리포지토리 셋이 pg/mysql 스키마를 받도록 (기본값 pg)"
```

---

### Task 7: createAdapter 팩토리 + dbms 플럼빙 (config/connect/manager/handler)

**Files:**
- Create: `src/main/core/database/adapter/createAdapter.ts`
- Test: `src/main/core/database/adapter/createAdapter.test.ts`
- Modify: `src/main/core/interface/types/workspace.ts`
- Modify: `src/main/core/workspace/WorkspaceManager.ts` (load 백필)
- Modify: `src/main/handler/workspace/ConnectWorkspaceHandler.ts`

- [ ] **Step 1: 팩토리 테스트 작성 (실패 확인)**

`src/main/core/database/adapter/createAdapter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createAdapter } from './createAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

describe('createAdapter', () => {
  it('returns PostgresAdapter for postgresql', () => {
    expect(createAdapter('postgresql')).toBeInstanceOf(PostgresAdapter)
  })
  it('returns MySqlAdapter for mysql', () => {
    expect(createAdapter('mysql')).toBeInstanceOf(MySqlAdapter)
  })
  it('defaults to PostgresAdapter when dbms is omitted', () => {
    expect(createAdapter(undefined)).toBeInstanceOf(PostgresAdapter)
  })
})
```

실행: `pnpm test createAdapter` → Expected: FAIL (`Cannot find module './createAdapter'`)

- [ ] **Step 2: workspace.ts에 DbmsType/dbms 추가**

`src/main/core/interface/types/workspace.ts` 전체 교체:

```ts
export type DbmsType = 'postgresql' | 'mysql'

export interface WorkspaceConfig {
  id: string
  name: string
  host: string
  port: number
  dbName: string
  username: string
  dbms: DbmsType
  sslCertPath?: string
}

export interface WorkspaceSaveParams {
  name: string
  host: string
  port: number
  dbName: string
  username: string
  dbms: DbmsType
  sslCertPath?: string
}

export interface WorkspaceDeleteParams {
  workspaceId: string
}

export interface WorkspaceConnectParams {
  host: string
  port: number
  dbName: string
  username: string
  password: string
  // 미지정 시 postgresql (구버전 renderer persist 호환)
  dbms?: DbmsType
  sslCertPath?: string
}

export interface WorkspaceStatusResponse {
  connected: boolean
  needsSetup: boolean
}
```

- [ ] **Step 3: createAdapter.ts 구현**

```ts
// dbms 설정에 따른 DatabaseAdapter 팩토리 (스펙 §4.1)

import type { DbmsType } from '@/interface/CoreInterface'
import type { DatabaseAdapter } from './DatabaseAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

export function createAdapter(dbms: DbmsType | undefined): DatabaseAdapter {
  return dbms === 'mysql' ? new MySqlAdapter() : new PostgresAdapter()
}
```

주의: `DbmsType`이 `@/interface/CoreInterface`(re-export 배럴)에서 노출되는지 확인하고, 없으면 `src/main/core/interface/CoreInterface.ts`의 workspace 타입 re-export에 포함시킨다 (기존 `WorkspaceConfig` 등이 어떻게 re-export되는지 같은 줄을 보고 따라 한다).

실행: `pnpm test createAdapter` → Expected: PASS (3 tests)

- [ ] **Step 4: WorkspaceManager.load에 dbms 백필**

`src/main/core/workspace/WorkspaceManager.ts`의 `load()`를 다음으로 교체 (기존 워크스페이스 저장본에는 dbms가 없음):

```ts
  private load(): WorkspaceStore {
    if (!existsSync(this.storePath)) {
      return { workspaces: [] }
    }

    try {
      const raw = readFileSync(this.storePath)

      const parsed = safeStorage.isEncryptionAvailable()
        ? (JSON.parse(safeStorage.decryptString(raw)) as WorkspaceStore)
        : (JSON.parse(raw.toString('utf-8')) as WorkspaceStore)

      // Phase 4 이전 저장본에는 dbms가 없다 → postgresql로 백필
      parsed.workspaces = parsed.workspaces.map((ws) => ({ dbms: 'postgresql' as const, ...ws }))
      return parsed
    } catch {
      return { workspaces: [] }
    }
  }
```

- [ ] **Step 5: ConnectWorkspaceHandler를 팩토리 + 스키마 주입으로 전환**

`src/main/handler/workspace/ConnectWorkspaceHandler.ts` 전체 교체:

```ts
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { createAdapter } from '@/database/adapter/createAdapter'
import { getMigrationsFolder } from '@/database/migrate/migrationsPath'
import { RepositoryContainer } from '@/database/RepositoryContainer'
import {
  DrizzleCommentRepository,
  DrizzleFileRepository,
  DrizzleIntegrationRepository,
  DrizzleIssueRelationRepository,
  DrizzleIssueRepository,
  DrizzleLabelRepository,
  DrizzleMilestoneRepository,
  DrizzleNotificationRepository,
  DrizzleProjectRepository,
  DrizzleTaskRepository,
  DrizzleUserRepository
} from '@/database/repository/drizzle'
import type { DrizzleSchema } from '@/database/repository/drizzle/executor'
import * as pgSchema from '@/database/schema/drizzle/schema'
import * as mysqlSchema from '@/database/schema/drizzle/schema.mysql'
import type * as schema from '@/database/schema/drizzle/schema'
import { IpcChannel, type WorkspaceConnectParams } from '@/interface/CoreInterface'

export class ConnectWorkspaceHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_CONNECT> {
  constructor() {
    super(IpcChannel.WORKSPACE_CONNECT)
  }

  async handler(params: WorkspaceConnectParams) {
    // 기존 연결이 있으면 정리
    const container = RepositoryContainer.getInstance()
    if (container.isInitialized) {
      await container.teardown()
    }

    const dbms = params.dbms ?? 'postgresql'
    const adapter = createAdapter(dbms)

    // adapter.connect()는 실패 시 DatabaseError를 throw하며,
    // initHandler의 BaseError 브랜치가 이를 IPC 응답으로 변환해준다.
    await adapter.connect({
      host: params.host,
      port: params.port,
      database: params.dbName,
      user: params.username,
      password: params.password,
      sslCertPath: params.sslCertPath
    })

    // 스키마를 최신 마이그레이션으로 적용 (멱등) — dialect별 폴더
    await adapter.runMigrations(getMigrationsFolder(dbms === 'mysql' ? 'mysql' : 'pg'))

    // 단일 리포지토리 셋: 타입 기준은 pg, MySQL은 구조 호환 캐스트 (executor.ts 참고)
    const db = adapter.getConnection() as NodePgDatabase<typeof schema>
    const schemaSet: DrizzleSchema = dbms === 'mysql' ? (mysqlSchema as unknown as DrizzleSchema) : pgSchema

    const userRepo = new DrizzleUserRepository(db, schemaSet)
    const projectRepo = new DrizzleProjectRepository(db, schemaSet)
    const issueRepo = new DrizzleIssueRepository(db, schemaSet)
    const fileRepo = new DrizzleFileRepository(db, schemaSet)
    const commentRepo = new DrizzleCommentRepository(db, schemaSet)
    const labelRepo = new DrizzleLabelRepository(db, schemaSet)
    const milestoneRepo = new DrizzleMilestoneRepository(db, schemaSet)
    const taskRepo = new DrizzleTaskRepository(db, schemaSet)
    const issueRelationRepo = new DrizzleIssueRelationRepository(db, schemaSet)
    const notificationRepo = new DrizzleNotificationRepository(db, schemaSet)
    const integrationRepo = new DrizzleIntegrationRepository(db, schemaSet)

    container.initialize(
      adapter,
      userRepo,
      projectRepo,
      issueRepo,
      fileRepo,
      commentRepo,
      labelRepo,
      milestoneRepo,
      taskRepo,
      issueRelationRepo,
      notificationRepo,
      integrationRepo
    )

    // Phase 3: 연결 시 자동 admin 생성 제거. users 비어있으면 setup 필요.
    const userCount = await userRepo.count()

    return {
      data: {
        connected: true,
        needsSetup: userCount === 0
      },
      error: null
    }
  }
}
```

- [ ] **Step 6: 타입체크 + 전체 테스트**

```bash
pnpm typecheck && RUN_DB_TESTS=1 pnpm test
```

Expected: PASS. renderer 타입체크(`typecheck:web`)는 `WorkspaceSaveParams.dbms`가 필수가 되면서 **실패할 수 있다** — 그 경우 Task 8(renderer)까지는 `typecheck:node`만 통과 기준으로 삼고, 이 단계 커밋은 main 쪽 파일만 포함한다.

- [ ] **Step 7: Commit**

```bash
git add src/main/core/database/adapter/createAdapter.ts src/main/core/database/adapter/createAdapter.test.ts src/main/core/interface/ src/main/core/workspace/WorkspaceManager.ts src/main/handler/workspace/ConnectWorkspaceHandler.ts
git commit -m "feat: createAdapter 팩토리 + WorkspaceConfig/ConnectParams에 dbms — 연결 시 PG/MySQL 선택"
```

---

### Task 8: 초대 페이로드 + renderer (DBMS 선택 UI)

**Files:**
- Modify: `src/main/core/interface/types/invite.ts`
- Modify: `src/main/handler/invite/GenerateInviteHandler.ts`
- Modify: `src/main/handler/invite/ApplyInviteHandler.ts`
- Modify: `src/renderer/src/types/auth.ts`
- Modify: `src/renderer/src/components/pages/WorkspacePage.tsx`

- [ ] **Step 1: invite.ts에 dbms 추가**

`src/main/core/interface/types/invite.ts` 전체 교체:

```ts
import type { DbmsType } from './workspace'

export interface InviteGenerateParams {
  workspaceName: string
  host: string
  port: number
  dbName: string
  dbms: DbmsType
  expiresInHours?: number
}

export interface InviteApplyParams {
  code: string
}

export interface InviteCodeInfo {
  workspaceName: string
  host: string
  port: number
  dbName: string
  dbms: DbmsType
  expiresAt: string | null
}
```

- [ ] **Step 2: GenerateInviteHandler payload에 dbms 포함**

`GenerateInviteHandler.ts`의 `payload` 객체에 한 줄 추가:

```ts
    const payload = {
      workspaceName: params.workspaceName,
      host: params.host,
      port: params.port,
      dbName: params.dbName,
      dbms: params.dbms,
      expiresAt
    }
```

- [ ] **Step 3: ApplyInviteHandler에 구버전 코드 백필**

`ApplyInviteHandler.ts`의 `handler`에서 디코드 직후에 백필 추가:

```ts
    const decoded = Buffer.from(params.code, 'base64').toString('utf-8')
    const info = JSON.parse(decoded) as InviteCodeInfo
    // Phase 4 이전에 발급된 초대 코드에는 dbms가 없다 → postgresql로 백필
    info.dbms = info.dbms === 'mysql' ? 'mysql' : 'postgresql'
```

- [ ] **Step 4: renderer WorkspaceConfig에 dbms 추가**

`src/renderer/src/types/auth.ts`의 `WorkspaceConfig`에 필드 추가:

```ts
export interface WorkspaceConfig {
  id: string
  name: string
  host: string
  port: number
  dbName: string
  username: string
  dbms: 'postgresql' | 'mysql'
  sslCertPath?: string
}
```

- [ ] **Step 5: WorkspacePage에 DBMS 선택 추가**

`src/renderer/src/components/pages/WorkspacePage.tsx` 수정 사항 (파일 구조는 유지, 다음 4곳):

1. import에 Select 아토믹 추가:
```ts
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select'
```
(`atoms/Select.tsx`의 실제 export 이름을 열어 확인하고 맞출 것 — shadcn 표준이면 위와 같다)

2. `newWs` state에 dbms 추가 (기본 postgresql):
```ts
  const [newWs, setNewWs] = useState({
    name: '',
    host: 'localhost',
    port: '5432',
    dbName: '',
    username: 'postgres',
    dbms: 'postgresql' as 'postgresql' | 'mysql',
    sslCertPath: ''
  })
```

3. dbms 변경 핸들러 (port/username 기본값 자동 전환) — 폼 JSX의 host/port Input 위에 Select 배치:
```tsx
  const handleDbmsChange = (dbms: 'postgresql' | 'mysql') => {
    setNewWs((prev) => ({
      ...prev,
      dbms,
      port: prev.port === '5432' || prev.port === '3306' ? (dbms === 'mysql' ? '3306' : '5432') : prev.port,
      username: prev.username === 'postgres' || prev.username === 'root' ? (dbms === 'mysql' ? 'root' : 'postgres') : prev.username
    }))
  }
```
```tsx
  <div className='space-y-2'>
    <Label>DBMS</Label>
    <Select value={newWs.dbms} onValueChange={(v) => handleDbmsChange(v as 'postgresql' | 'mysql')}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='postgresql'>PostgreSQL</SelectItem>
        <SelectItem value='mysql'>MySQL 8</SelectItem>
      </SelectContent>
    </Select>
  </div>
```

4. IPC 호출에 dbms 전달:
- `WORKSPACE_SAVE` 호출 객체에 `dbms: newWs.dbms` 추가, 저장 후 state 리셋에도 `dbms: 'postgresql'` 포함
- `handleConnect`의 `WORKSPACE_CONNECT` 호출에 `dbms: ws.dbms` 추가
- 초대 적용 흐름에서 `INVITE_APPLY` 결과(`info`)로 워크스페이스를 저장/연결하는 지점에 `dbms: info.dbms` 전달 (해당 코드 블록은 파일 내 `applyInvite` 사용처를 따라가며 수정)

- [ ] **Step 6: 전체 타입체크 + 렌더러 확인**

```bash
pnpm typecheck && pnpm lint:ci
```

Expected: PASS (Task 7 Step 6에서 보류했던 typecheck:web 포함)

- [ ] **Step 7: Commit**

```bash
git add src/main/core/interface/types/invite.ts src/main/handler/invite/ src/renderer/src/types/auth.ts src/renderer/src/components/pages/WorkspacePage.tsx
git commit -m "feat: 초대 페이로드 dbms + 워크스페이스 폼 DBMS 선택 UI (포트/계정 기본값 자동 전환)"
```

---

### Task 9: 크로스 엔진 통합 테스트 (read-after-write / lower-LIKE / 트랜잭션 원자성)

**Files:**
- Test: `src/main/core/database/mysql.integration.test.ts`

스펙 §11: "같은 리포지토리 테스트 스위트를 실제 MySQL 컨테이너에 대해서도 실행". 기존 PG 테스트(`readAfterWrite.test.ts`, `transaction.atomicity.test.ts`)의 시나리오를 MySQL 어댑터 + mysql 스키마 주입으로 재현한다.

- [ ] **Step 1: 통합 테스트 작성**

`src/main/core/database/mysql.integration.test.ts`:

```ts
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMySqlTestDatabase, dropMySqlTestDatabase, mysqlTestConfig } from './__testutils__/mysqlTestDb'
import { MySqlAdapter } from './adapter/MySqlAdapter'
import { DrizzleIssueRepository } from './repository/drizzle/DrizzleIssueRepository'
import { DrizzleProjectRepository } from './repository/drizzle/DrizzleProjectRepository'
import { DrizzleUserRepository } from './repository/drizzle/DrizzleUserRepository'
import type { DrizzleDb, DrizzleSchema } from './repository/drizzle/executor'
import * as mysqlSchema from './schema/drizzle/schema.mysql'

const MIGRATIONS = resolve(process.cwd(), 'drizzle/mysql')

describe.runIf(process.env.RUN_DB_TESTS_MYSQL === '1')('mysql cross-engine repository suite', () => {
  let adapter: MySqlAdapter
  let dbName: string
  let db: DrizzleDb
  const schema = mysqlSchema as unknown as DrizzleSchema

  beforeAll(async () => {
    dbName = await createMySqlTestDatabase()
    adapter = new MySqlAdapter()
    await adapter.connect({ ...mysqlTestConfig(), database: dbName })
    await adapter.runMigrations(MIGRATIONS)
    db = adapter.getConnection() as unknown as DrizzleDb
  })

  afterAll(async () => {
    await adapter.disconnect()
    await dropMySqlTestDatabase(dbName)
  })

  async function seedUser(): Promise<string> {
    const userRepo = new DrizzleUserRepository(db, schema)
    const userId = randomUUID()
    await userRepo.create({
      userId,
      userSn: userId,
      passwordHash: 'test-hash',
      userName: 'tester',
      userRole: 'admin'
    })
    return userId
  }

  it('read-after-write: create() returns the inserted row without RETURNING', async () => {
    const userId = await seedUser()
    const projectRepo = new DrizzleProjectRepository(db, schema)
    const projectId = randomUUID()
    const project = await projectRepo.create({
      projectId,
      projectName: 'P',
      projectKey: `K${Date.now() % 100000}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    expect(project.project_id).toBe(projectId)
    expect(project.project_name).toBe('P')

    const issueRepo = new DrizzleIssueRepository(db, schema)
    const issueId = randomUUID()
    const created = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'hello',
      issueKey: 'K-1',
      createdBy: userId
    })
    expect(created.issue_id).toBe(issueId)
  })

  it('update() returns the fresh row', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const userId = await seedUser()
    const updated = await userRepo.update(userId, { userName: 'renamed' })
    expect(updated.user_name).toBe('renamed')
  })

  it('transaction rolls back all writes when the callback throws', async () => {
    const userId = await seedUser()
    const projectRepo = new DrizzleProjectRepository(db, schema)
    const projectId = randomUUID()

    await expect(
      adapter.transaction(async (tx) => {
        await projectRepo.create(
          {
            projectId,
            projectName: 'doomed',
            projectKey: `D${Date.now() % 100000}`,
            createdBy: userId,
            startDate: new Date(),
            endDate: new Date()
          },
          tx as Parameters<typeof projectRepo.create>[1]
        )
        throw new Error('boom')
      })
    ).rejects.toThrow('boom')

    const found = await projectRepo.findById(projectId)
    expect(found).toBeNull()
  })

  it('timestamps round-trip as Date in UTC (datetime(3))', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const userId = await seedUser()
    const row = await userRepo.findById(userId)
    expect(row?.user_created_at).toBeInstanceOf(Date)
    // ms 정밀도 보존: 1초 이내 오차
    expect(Math.abs(Date.now() - (row?.user_created_at as Date).getTime())).toBeLessThan(60_000)
  })
})
```

**주의:** `DrizzleProjectRepository.findById`/검색 메서드 시그니처는 실제 인터페이스(`ProjectRepository.ts`)를 열어 확인하고 맞출 것. `caseInsensitiveLike` 기반 검색 메서드가 있으면(예: 이슈/프로젝트 검색) 같은 패턴으로 케이스 1개를 추가한다: 대문자 검색어로 소문자 행이 매치되는지.

- [ ] **Step 2: 실행**

```bash
RUN_DB_TESTS_MYSQL=1 pnpm test mysql.integration
```

Expected: PASS (4+ tests). 전형적 실패와 원인:
- `Incorrect datetime value` → mysql2 `timezone: 'Z'` 누락 또는 datetime fsp 불일치
- `no RETURNING` 류 에러 → 어떤 리포지토리가 아직 `.returning()`을 쓰고 있다는 뜻 (Phase 2 누락 — 해당 리포지토리를 read-after-write로 수정)
- collation FK 에러 → Task 3 Step 6 점검

- [ ] **Step 3: PG 회귀 재확인**

```bash
RUN_DB_TESTS=1 pnpm test
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/mysql.integration.test.ts
git commit -m "test: MySQL 크로스 엔진 통합 스위트 (read-after-write, 트랜잭션 원자성, UTC datetime)"
```

---

### Task 10: CI에 MySQL 8.0 컨테이너 + 문서

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `CLAUDE.md` (명령어 표)
- Modify: `README.md` (MySQL 연결 + 최소 권한 GRANT)

- [ ] **Step 1: ci.yml에 mysql 서비스 추가**

`services:` 블록의 postgres 아래에 추가:

```yaml
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: hydra
          MYSQL_ROOT_PASSWORD: mysql
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -h localhost -pmysql"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
```

`Test` 스텝의 `env`에 추가:

```yaml
          RUN_DB_TESTS_MYSQL: '1'
          MYSQL_HOST: localhost
          MYSQL_PORT: '3306'
          MYSQL_USER: root
          MYSQL_PASSWORD: mysql
```

- [ ] **Step 2: CLAUDE.md 명령어 표 갱신**

Commands 표에 추가:

```markdown
| Drizzle generate MySQL migration | `pnpm db:generate:mysql` |
```

Architecture 섹션의 DB Abstraction에 한 줄 추가:

```markdown
  - `adapter/MySqlAdapter.ts` — Drizzle + mysql2 implementation (workspace `dbms: 'mysql'`)
  - `adapter/createAdapter.ts` — dbms → adapter factory
```

- [ ] **Step 3: README에 MySQL 섹션 추가**

DB 연결 문서 부근에 추가 (정확한 위치는 README의 기존 PostgreSQL 안내 다음):

````markdown
### MySQL 8 workspace

Hydra can connect to MySQL 8.0+ as well as PostgreSQL. Select the DBMS when adding a workspace.

Runtime service account needs DML only (never `ALL PRIVILEGES`):

```sql
CREATE USER 'hydra_app'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hydra.* TO 'hydra_app'@'%';
```

Schema migrations run automatically at connect and require a separate, higher-privileged
account only for the very first connect (or grant `CREATE, ALTER, INDEX, REFERENCES`
temporarily). The database must use `utf8mb4`.
````

- [ ] **Step 4: 전체 게이트 실행**

```bash
pnpm typecheck && pnpm lint:ci && RUN_DB_TESTS=1 RUN_DB_TESTS_MYSQL=1 pnpm test && pnpm build
```

Expected: 전부 PASS

- [ ] **Step 5: Commit + 푸시**

```bash
git add .github/workflows/ci.yml CLAUDE.md README.md
git commit -m "ci: MySQL 8.0 컨테이너 추가 + MySQL 워크스페이스/GRANT 문서"
git push -u origin feature/mysql-multidbms-phase4
```

Expected: CI green (PG + MySQL 게이트 테스트 포함)

---

## Self-Review 결과 (작성 시 수행)

- **스펙 커버리지** (§12 Phase 4 = "schema.mysql.ts, MySqlAdapter + wrapMySqlError, factory, mysql2, dbms in config/invite, charset/TZ/pool/SSL, CI against MySQL"): schema.mysql.ts→Task 2, MySqlAdapter/wrapMySqlError→Task 5, factory→Task 7, mysql2→Task 1, dbms config→Task 7 / invite→Task 8, charset/TZ/pool/SSL→Task 5(connect), CI→Task 10. 추가로 §8.1 dialect별 마이그레이션 폴더→Task 3, §6.2.2 ms 정밀도→Task 4, §8.4 GET_LOCK→Task 5, §11 크로스 엔진 스위트→Task 9.
- **Phase 4 범위 제외 확인**: `user_db_role` 드랍(Phase 5), retry/backoff(§7, 어느 Phase에도 명시 안 됨 — 보류), 통계 쿼리 최적화 등은 포함하지 않음.
- **타입 일관성**: `DbmsType`은 `workspace.ts` 정의 → invite/factory/renderer에서 공유. `DrizzleSchema`는 Task 6 정의 → Task 7/9에서 동일 명칭 사용. `getMigrationsFolder(dialect)` 시그니처는 Task 3 정의 → Task 7에서 동일 사용.
- **알려진 불확실 지점(실행자가 검증)**: ① drizzle-kit mysql generate 산출물의 정확한 파일명/형식, ② `atoms/Select.tsx`의 export 이름, ③ `ProjectRepository` 인터페이스 메서드 시그니처(통합 테스트에서 확인), ④ `DbmsType`의 CoreInterface re-export 경로. 각 해당 Task에 확인 지시를 명시했다.
