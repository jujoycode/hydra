# Phase 2 — Portable Repositories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository layer DBMS-portable while staying PostgreSQL-only at runtime: stop using PostgreSQL-only query features (`RETURNING`, `ilike`), centralize the DB handle type behind a dialect-neutral alias, add the secondary indexes MySQL will need, and switch UUID generation to time-ordered v7 — all with **no user-facing behavior change**.

**Architecture:** Repositories currently call drizzle's `.returning()` (no MySQL equivalent) and `ilike()` (pg-core only), and hardcode `NodePgDatabase<typeof schema>` in their constructors. This phase (1) replaces `.returning()` with **read-after-write** (write, then `SELECT` the row by its app-generated PK via a shared `selectById` helper), (2) replaces `ilike()` with a portable `lower(col) LIKE lower(?)` helper that escapes user wildcards, (3) retypes every repo constructor to the existing `DrizzleDb` alias so Phase 4 can widen it to a union in one place, (4) adds explicit secondary indexes on the FK/filter columns repositories query, and (5) switches `CoreUtil.getUuid()` from `uuidv4` to `uuidv7`. The transaction-threading work and the migrator already landed in Phase 1; this phase builds on them.

**Tech Stack:** Electron + TypeScript, Drizzle ORM (`drizzle-orm/node-postgres` + `drizzle-orm/pg-core`), `pg`, drizzle-kit, `uuid@13`, Vitest.

**Reference spec:** `docs/superpowers/specs/2026-06-06-mysql-support-and-auth-redesign-design.md` (§4.3, §4.4.1, §4.4.2, §6.2.1, §6.2.6, §12 item 2).

> **Commit convention:** Korean Conventional Commits (e.g. `feat:`, `fix:`, `refactor:`, `chore:`). End every commit message with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer (omitted from the examples below for brevity).

> **DB-gated tests:** Integration tests use the Phase 1 harness (`__testutils__/pgTestDb.ts`) and only run when `RUN_DB_TESTS=1` with a reachable Postgres (`pnpm docker:up`). Without it they are **skipped** (acceptable locally).

---

## Design decisions (read before starting)

- **Read-after-write uses the caller's executor, no per-method transaction.** Each `create`/`update` writes and then re-`SELECT`s by the **app-generated PK** it already holds. Methods that already accept an `executor` (Phase 1: `ProjectRepository.create` / `linkUser`) pass it to both the write and the read-back, so a handler-opened transaction sees the row. Methods without an executor use `this.db` for both. We do **not** open a new transaction inside `create`/`update`: a single-row write keyed by a unique app-generated id needs no isolation to read itself back, and multi-write atomicity is already handled at the handler level via `adapter.transaction()` (Phase 1, §4.4.3). This keeps the interface churn at zero beyond Phase 1.
- **No interface-signature changes.** `selectById` is an internal drizzle-implementation helper. Repository interfaces (`interfaces/*.ts`) are untouched — return types are unchanged (`create` still returns `IssueRecord`, etc.).
- **`DrizzleDb` alias is the dialect-neutral handle.** It already exists in `executor.ts` (`= NodePgDatabase<typeof schema>`). Retyping constructors to it is a pure indirection today (identical type) that gives Phase 4 a single widening point. Schema-file splitting (`schema.mysql.ts`) and the adapter factory are **out of scope** (Phase 4).
- **UUIDv7 is new-rows-only.** Existing v4 ids are left as-is; v4 and v7 coexist (§6.2.1). No data rewrite.

---

## File Structure

**Created:**
- `src/main/core/database/repository/drizzle/readAfterWrite.ts` — shared `selectById(executor, table, pkColumn, id)` helper. One responsibility: re-read a just-written row by PK (the `RETURNING` replacement).
- `src/main/core/database/repository/drizzle/portable.ts` — portable SQL fragments: `escapeLikePattern()` + `caseInsensitiveLike(column, value)` (the `ilike` replacement).
- `src/main/core/database/repository/drizzle/portable.test.ts` — unit tests for `escapeLikePattern`.
- `src/main/core/database/repository/drizzle/readAfterWrite.test.ts` — integration test (DB-gated) proving create/update return the written row without `RETURNING`.
- `drizzle/0001_*.sql` + updated `drizzle/meta/` — generated index migration (via `pnpm db:generate`).

**Modified:**
- `src/main/core/util/CoreUtil.ts` — `getUuid()` → `uuidv7`.
- `src/main/core/util/CoreUtil.test.ts` — assert v7 output.
- `src/main/core/database/schema/drizzle/schema.ts` — add `index(...)` definitions on FK/filter columns.
- All 11 `src/main/core/database/repository/drizzle/Drizzle*Repository.ts` — retype constructor to `DrizzleDb`; replace `.returning()` with `selectById`; (IssueRepository only) replace `ilike` with `caseInsensitiveLike`.

---

## Task 1: Switch UUID generation to v7

**Files:**
- Modify: `src/main/core/util/CoreUtil.ts:3,11-13`
- Test: `src/main/core/util/CoreUtil.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test to `src/main/core/util/CoreUtil.test.ts` (append a new `describe` block; keep existing tests):

```ts
import { describe, expect, it } from 'vitest'
import { CoreUtil } from './CoreUtil'

describe('CoreUtil.getUuid', () => {
  it('generates a v7 UUID (time-ordered)', () => {
    const id = CoreUtil.getUuid()
    // RFC 9562: version nibble is the first char of the 3rd group
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generates time-ordered ids (later id sorts after earlier id)', async () => {
    const a = CoreUtil.getUuid()
    await new Promise((r) => setTimeout(r, 2))
    const b = CoreUtil.getUuid()
    expect(a < b).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run (PowerShell):
```powershell
pnpm test -- src/main/core/util/CoreUtil.test.ts
```
Expected: the new "generates a v7 UUID" test FAILS — current `getUuid()` returns a v4 id (version nibble `4`, not `7`).

- [ ] **Step 3: Switch the implementation to v7**

In `src/main/core/util/CoreUtil.ts`, change the import on line 3:
```ts
import { v7 as uuidv7 } from 'uuid'
```
and the method (lines 7-13):
```ts
  /**
   * getUuid
   * @returns UUID v7 문자열 (시간 정렬 가능 — InnoDB/PG 인덱스 지역성 향상)
   */
  static getUuid(): string {
    return uuidv7()
  }
```

- [ ] **Step 4: Run the test to verify it passes**

Run (PowerShell):
```powershell
pnpm test -- src/main/core/util/CoreUtil.test.ts
```
Expected: PASS (both new tests + existing tests).

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck:node`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/main/core/util/CoreUtil.ts src/main/core/util/CoreUtil.test.ts
git commit -m "feat: UUID 생성을 v4에서 v7로 전환 (시간 정렬 PK)"
```

---

## Task 2: Add secondary indexes + generate migration

**Files:**
- Modify: `src/main/core/database/schema/drizzle/schema.ts`
- Create (via tooling): `drizzle/0001_*.sql`, updated `drizzle/meta/`

- [ ] **Step 1: Add the `index` import**

In `src/main/core/database/schema/drizzle/schema.ts`, change line 3 to add `index`:
```ts
import { boolean, index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
```

- [ ] **Step 2: Add index definitions on FK/filter columns**

Add a third callback argument (returning an array) to the tables below. Replace each table's closing `})` with `}, (t) => [ ... ])` exactly as shown.

`issues` (after the column block, lines 51-68) — add:
```ts
export const issues = pgTable(
  'issues',
  {
    issue_id: uuid('issue_id').primaryKey(),
    project_id: uuid('project_id')
      .notNull()
      .references(() => projects.project_id),
    issue_title: text('issue_title').notNull(),
    issue_key: text('issue_key').notNull(),
    issue_desc: text('issue_desc'),
    issue_status: varchar('issue_status', { length: 50 }),
    issue_priority: varchar('issue_priority', { length: 50 }),
    issue_category: varchar('issue_category', { length: 100 }),
    issue_created_by: uuid('issue_created_by'),
    issue_modified_by: uuid('issue_modified_by'),
    issue_assigned_to: uuid('issue_assigned_to'),
    issue_milestone_id: uuid('issue_milestone_id').references(() => milestones.milestone_id),
    issue_created_at: timestamp('issue_created_at').defaultNow(),
    issue_updated_at: timestamp('issue_updated_at').defaultNow()
  },
  (t) => [
    index('idx_issues_project_id').on(t.project_id),
    index('idx_issues_assigned_to').on(t.issue_assigned_to),
    index('idx_issues_milestone_id').on(t.issue_milestone_id)
  ]
)
```

`milestones` — add `(t) => [index('idx_milestones_project_id').on(t.project_id)]`.

`comments` — add `(t) => [index('idx_comments_issue_id').on(t.issue_id)]`.

`tasks` — add `(t) => [index('idx_tasks_issue_id').on(t.issue_id)]`.

`notifications` — add `(t) => [index('idx_notifications_user_id').on(t.user_id)]`.

`issueRelations` — add:
```ts
  (t) => [
    index('idx_issue_relations_source').on(t.source_issue_id),
    index('idx_issue_relations_target').on(t.target_issue_id)
  ]
```

`usersProjectsLink` — add:
```ts
  (t) => [
    index('idx_users_projects_link_user').on(t.user_id),
    index('idx_users_projects_link_project').on(t.project_id)
  ]
```

`issuesFilesLink` — add:
```ts
  (t) => [
    index('idx_issues_files_link_issue').on(t.issue_id),
    index('idx_issues_files_link_file').on(t.file_id)
  ]
```

`issuesLabelsLink` — add:
```ts
  (t) => [
    index('idx_issues_labels_link_issue').on(t.issue_id),
    index('idx_issues_labels_link_label').on(t.label_id)
  ]
```

(Leave `users`, `projects`, `files`, `labels`, `integrations`, `inviteCodes` without new indexes — they are queried by PK or unique column only.)

- [ ] **Step 3: Typecheck the schema**

Run: `pnpm typecheck:node`
Expected: no errors. If drizzle-kit reports the callback must return an object instead of an array, your drizzle-orm is < 0.31 — switch each `(t) => [a, b]` to `(t) => ({ a, b })` with named keys. (Verify the installed version with `node -e "console.log(require('drizzle-orm/package.json').version)"`; the array form is correct for ≥ 0.31.)

- [ ] **Step 4: Generate the migration**

Run:
```bash
pnpm db:generate
```
Expected: a new `drizzle/0001_<name>.sql` containing only `CREATE INDEX` statements (no `CREATE TABLE`), plus updated `drizzle/meta/_journal.json` and a new `0001_snapshot.json`.

- [ ] **Step 5: Verify the migration is index-only**

Run (PowerShell):
```powershell
Select-String -Path drizzle/0001_*.sql -Pattern 'CREATE INDEX' | Measure-Object | Select-Object -ExpandProperty Count
Select-String -Path drizzle/0001_*.sql -Pattern 'CREATE TABLE' | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: first count `15` (total indexes added above), second count `0`.

- [ ] **Step 6: Verify migrations still apply on a fresh DB (DB-gated)**

Run (PowerShell, requires `pnpm docker:up`):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/adapter/PostgresAdapter.migrate.test.ts
```
Expected: PASS — `runMigrations()` now applies 0000 (tables) + 0001 (indexes) cleanly and idempotently.

- [ ] **Step 7: Commit**

```bash
git add src/main/core/database/schema/drizzle/schema.ts drizzle/
git commit -m "feat: FK/필터 컬럼 보조 인덱스 추가 + 마이그레이션 생성"
```

---

## Task 3: Retype repository constructors to the dialect-neutral handle

**Files:**
- Modify: all 11 `src/main/core/database/repository/drizzle/Drizzle*Repository.ts`

The neutral alias `DrizzleDb` already exists in `executor.ts`. This task is a mechanical, type-identical swap that centralizes the handle type for Phase 4.

- [ ] **Step 1: Swap the constructor type in every repository**

In **each** of the 11 files
(`DrizzleUserRepository`, `DrizzleProjectRepository`, `DrizzleIssueRepository`, `DrizzleFileRepository`, `DrizzleCommentRepository`, `DrizzleLabelRepository`, `DrizzleMilestoneRepository`, `DrizzleTaskRepository`, `DrizzleIssueRelationRepository`, `DrizzleNotificationRepository`, `DrizzleIntegrationRepository`):

Remove the import line:
```ts
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
```
Add (next to the other relative imports, e.g. after the `schema` import):
```ts
import type { DrizzleDb } from './executor'
```
Change the constructor parameter type:
```ts
  // before
  constructor(private db: NodePgDatabase<typeof schema>) {}
  // after
  constructor(private db: DrizzleDb) {}
```

`DrizzleProjectRepository` already imports from `./executor` (`DrizzleExecutor`) — add `DrizzleDb` to that existing import instead of a second line:
```ts
import type { DrizzleDb, DrizzleExecutor } from './executor'
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck:node`
Expected: no errors. `DrizzleDb` is `NodePgDatabase<typeof schema>`, so this is a zero-behavior, zero-type change — purely an indirection point.

- [ ] **Step 3: Confirm no stray `NodePgDatabase` imports remain in repositories**

Run (PowerShell):
```powershell
Select-String -Path src/main/core/database/repository/drizzle/*.ts -Pattern 'NodePgDatabase' | Select-Object -ExpandProperty Count
```
Expected: `0`.

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/repository/drizzle/
git commit -m "refactor: 리포지토리 생성자를 dialect-neutral DrizzleDb 별칭으로 통일"
```

---

## Task 4: Portable case-insensitive LIKE (replace `ilike`)

**Files:**
- Create: `src/main/core/database/repository/drizzle/portable.ts`
- Test: `src/main/core/database/repository/drizzle/portable.test.ts`
- Modify: `src/main/core/database/repository/drizzle/DrizzleIssueRepository.ts:3,88`

- [ ] **Step 1: Write the helper**

```ts
// src/main/core/database/repository/drizzle/portable.ts
// DBMS 이식 가능한 SQL 조각. pg 전용 ilike 를 양 엔진에서 동작하는 lower-LIKE 로 대체한다.

import type { AnyColumn, SQL } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// 사용자 입력의 LIKE 와일드카드(%, _, \)를 리터럴로 이스케이프
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`)
}

// 대소문자 무시 부분 일치. pg/mysql 모두에서 collation 과 무관하게 동작.
// 패턴은 바인드 파라미터로 전달되어 SQL 인젝션에 안전하다.
export function caseInsensitiveLike(column: AnyColumn, value: string): SQL {
  const pattern = `%${escapeLikePattern(value)}%`
  return sql`lower(${column}) like lower(${pattern}) escape '\\'`
}
```

- [ ] **Step 2: Write the helper unit test**

```ts
// src/main/core/database/repository/drizzle/portable.test.ts
import { describe, expect, it } from 'vitest'
import { escapeLikePattern } from './portable'

describe('escapeLikePattern', () => {
  it('escapes LIKE wildcards so user input is treated literally', () => {
    expect(escapeLikePattern('50% done')).toBe('50\\% done')
    expect(escapeLikePattern('a_b')).toBe('a\\_b')
    expect(escapeLikePattern('back\\slash')).toBe('back\\\\slash')
  })

  it('leaves ordinary text untouched', () => {
    expect(escapeLikePattern('hello world')).toBe('hello world')
  })
})
```

- [ ] **Step 3: Run the unit test**

Run (PowerShell):
```powershell
pnpm test -- src/main/core/database/repository/drizzle/portable.test.ts
```
Expected: PASS (2 tests). This suite is **not** DB-gated.

- [ ] **Step 4: Use the helper in `DrizzleIssueRepository`**

In `src/main/core/database/repository/drizzle/DrizzleIssueRepository.ts`, change the import on line 3 (drop `ilike`):
```ts
import { and, asc, desc, eq, sql } from 'drizzle-orm'
```
Add the helper import after the schema import (line 5 area):
```ts
import { caseInsensitiveLike } from './portable'
```
Change line 88:
```ts
    if (options.search) conditions.push(caseInsensitiveLike(issues.issue_title, options.search))
```

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck:node`
Expected: no errors. Confirm no remaining `ilike` usage:
```powershell
Select-String -Path src/main/core/database/repository/drizzle/*.ts -Pattern 'ilike' | Select-Object -ExpandProperty Count
```
Expected: `0`.

- [ ] **Step 6: Commit**

```bash
git add src/main/core/database/repository/drizzle/portable.ts src/main/core/database/repository/drizzle/portable.test.ts src/main/core/database/repository/drizzle/DrizzleIssueRepository.ts
git commit -m "feat: ilike를 이식 가능한 lower-LIKE 헬퍼로 대체 (와일드카드 이스케이프 포함)"
```

---

## Task 5: Read-after-write — remove all `.returning()`

**Files:**
- Create: `src/main/core/database/repository/drizzle/readAfterWrite.ts`
- Test: `src/main/core/database/repository/drizzle/readAfterWrite.test.ts`
- Modify: all 11 `Drizzle*Repository.ts` (20 `.returning()` call sites)

- [ ] **Step 1: Write the `selectById` helper**

```ts
// src/main/core/database/repository/drizzle/readAfterWrite.ts
// RETURNING 미지원 DBMS(MySQL) 대응: 쓰기 후 PK로 행을 다시 조회한다.
// id는 앱에서 생성/보유하므로 항상 알고 있다. 주어진 executor(tx 또는 풀 db)를 그대로 사용해
// 같은 트랜잭션 안에서 방금 쓴 행을 읽도록 한다.

import { eq } from 'drizzle-orm'
import type { DrizzleExecutor } from './executor'

export async function selectById<T>(
  ex: DrizzleExecutor,
  // biome noExplicitAny는 off — drizzle 테이블/컬럼 제네릭은 호출부 캐스트로 좁힌다
  table: any,
  pkColumn: any,
  id: string
): Promise<T> {
  const rows = await ex.select().from(table).where(eq(pkColumn, id)).limit(1)
  return rows[0] as T
}
```

- [ ] **Step 2: Apply the canonical transform in `DrizzleIssueRepository` (reference example)**

The transform is identical everywhere: delete `.returning()`, then `return selectById(<executor>, <table>, <pkColumn>, <id>)`. Add the import after the schema import:
```ts
import { selectById } from './readAfterWrite'
```

`create` (lines 20-40) becomes:
```ts
  async create(data: CreateIssueData): Promise<IssueRecord> {
    const now = new Date()
    await this.db.insert(issues).values({
      issue_id: data.issueId,
      project_id: data.projectId,
      issue_title: data.issueTitle,
      issue_key: data.issueKey,
      issue_desc: data.issueDesc ?? null,
      issue_status: data.issueStatus ?? null,
      issue_priority: data.issuePriority ?? null,
      issue_category: data.issueCategory ?? null,
      issue_created_by: data.createdBy,
      issue_assigned_to: data.assignedTo ?? null,
      issue_created_at: now,
      issue_updated_at: now
    })
    return selectById<IssueRecord>(this.db, issues, issues.issue_id, data.issueId)
  }
```

`update` (lines 52-66) becomes (keep the `values` block unchanged; only the final two lines change):
```ts
    await this.db.update(issues).set(values).where(eq(issues.issue_id, issueId))
    return selectById<IssueRecord>(this.db, issues, issues.issue_id, issueId)
```

- [ ] **Step 3: Apply the identical transform to the remaining 9 sites**

For each row below: add `import { selectById } from './readAfterWrite'`, drop `.returning()` from the write, and `return selectById<RecordType>(executor, table, pkColumn, id)`. **Executor** is `this.db` everywhere except `DrizzleProjectRepository.create`, which already has an `executor` param (`ex`) — use `ex` there for both the insert and the read-back. `id` for `create` is the app-supplied id field on `data`; for `update` it is the method's id argument.

| File | Method | Record type | Table const | PK column | id source | Executor |
|------|--------|-------------|-------------|-----------|-----------|----------|
| DrizzleProjectRepository | create | `ProjectRecord` | `projects` | `projects.project_id` | `data.projectId` | `ex` |
| DrizzleProjectRepository | update | `ProjectRecord` | `projects` | `projects.project_id` | `projectId` | `this.db` |
| DrizzleUserRepository | create | `UserRecord` | `users` | `users.user_id` | `data.userId` | `this.db` |
| DrizzleUserRepository | update | `UserRecord` | `users` | `users.user_id` | `userId` | `this.db` |
| DrizzleCommentRepository | create | `CommentRecord` | `comments` | `comments.comment_id` | `data.commentId` | `this.db` |
| DrizzleCommentRepository | update | `CommentRecord` | `comments` | `comments.comment_id` | `commentId` | `this.db` |
| DrizzleFileRepository | create | `FileRecord` | `files` | `files.file_id` | `data.fileId` | `this.db` |
| DrizzleLabelRepository | create | `LabelRecord` | `labels` | `labels.label_id` | `data.labelId` | `this.db` |
| DrizzleLabelRepository | update | `LabelRecord` | `labels` | `labels.label_id` | `labelId` | `this.db` |
| DrizzleMilestoneRepository | create | `MilestoneRecord` | `milestones` | `milestones.milestone_id` | `data.milestoneId` | `this.db` |
| DrizzleMilestoneRepository | update | `MilestoneRecord` | `milestones` | `milestones.milestone_id` | `milestoneId` | `this.db` |
| DrizzleTaskRepository | create | `TaskRecord` | `tasks` | `tasks.task_id` | `data.taskId` | `this.db` |
| DrizzleTaskRepository | update | `TaskRecord` | `tasks` | `tasks.task_id` | `taskId` | `this.db` |
| DrizzleIssueRelationRepository | create | `IssueRelationRecord` | `issueRelations` | `issueRelations.relation_id` | `data.relationId` | `this.db` |
| DrizzleNotificationRepository | create | `NotificationRecord` | `notifications` | `notifications.notification_id` | `data.notificationId` | `this.db` |
| DrizzleNotificationRepository | markAsRead | `NotificationRecord` | `notifications` | `notifications.notification_id` | `notificationId` | `this.db` |
| DrizzleIntegrationRepository | create | `IntegrationRecord` | `integrations` | `integrations.integration_id` | `data.integrationId` | `this.db` |
| DrizzleIntegrationRepository | update | `IntegrationRecord` | `integrations` | `integrations.integration_id` | `integrationId` | `this.db` |

> **Before editing each file**, open it and confirm the exact `data.*Id` field name and the table-const name destructured from `schema` (e.g. `const { issueRelations } = schema`). The PK column names above match `schema.ts`. The `DrizzleProjectRepository.create` already destructures `ex` from its `executor` param — reuse it.

> **Verify the count:** there are exactly **20** `.returning()` sites (2 shown in Step 2 + 18 in this table). After this step there must be zero.

- [ ] **Step 4: Confirm every `.returning()` is gone**

Run (PowerShell):
```powershell
Select-String -Path src/main/core/database/repository/drizzle/*.ts -Pattern '\.returning\(' | Select-Object -ExpandProperty Count
```
Expected: `0`.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck:node`
Expected: no errors.

- [ ] **Step 6: Write the read-after-write integration test**

```ts
// src/main/core/database/repository/drizzle/readAfterWrite.test.ts
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PostgresAdapter } from '../../adapter/PostgresAdapter'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../../__testutils__/pgTestDb'
import { DrizzleIssueRepository } from './DrizzleIssueRepository'
import { DrizzleProjectRepository } from './DrizzleProjectRepository'
import * as schema from '../../schema/drizzle/schema'

describe.runIf(process.env.RUN_DB_TESTS === '1')('read-after-write (no RETURNING)', () => {
  let adapter: PostgresAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createTestDatabase()
    adapter = new PostgresAdapter()
    await adapter.connect({ ...pgTestConfig(), database: dbName })
    await adapter.runMigrations(resolve(process.cwd(), 'drizzle'))
  })

  afterAll(async () => {
    await adapter.disconnect()
    await dropTestDatabase(dbName)
  })

  it('create() returns the inserted row without RETURNING', async () => {
    const db = adapter.getConnection()
    const userId = randomUUID()
    await db.insert(schema.users).values({ user_id: userId, user_name: 'tester', user_role: 'admin' })

    const projectRepo = new DrizzleProjectRepository(db)
    const projectId = randomUUID()
    const project = await projectRepo.create({
      projectId,
      projectName: 'P',
      projectKey: `K-${Date.now()}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    expect(project.project_id).toBe(projectId)
    expect(project.project_name).toBe('P')

    const issueRepo = new DrizzleIssueRepository(db)
    const issueId = randomUUID()
    const created = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'hello',
      issueKey: 'K-1',
      createdBy: userId
    })
    expect(created.issue_id).toBe(issueId)

    const updated = await issueRepo.update(issueId, { issueTitle: 'world', modifiedBy: userId })
    expect(updated.issue_title).toBe('world')
  })

  it('case-insensitive search matches regardless of case', async () => {
    const db = adapter.getConnection()
    const userId = randomUUID()
    await db.insert(schema.users).values({ user_id: userId, user_name: 't2', user_role: 'admin' })
    const projectId = randomUUID()
    await new DrizzleProjectRepository(db).create({
      projectId,
      projectName: 'P2',
      projectKey: `K2-${Date.now()}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    const issueRepo = new DrizzleIssueRepository(db)
    await issueRepo.create({ issueId: randomUUID(), projectId, issueTitle: 'FindMe Bug', issueKey: 'K2-1', createdBy: userId })

    const res = await issueRepo.findByProjectFiltered(projectId, { search: 'findme' })
    expect(res.total).toBe(1)
    expect(res.data[0].issue_title).toBe('FindMe Bug')
  })
})
```

> Confirm the exact field names on `CreateIssueData` / `CreateProjectData` (in the respective `interfaces/*.ts`) before running; adjust the literal objects above if a required field differs.

- [ ] **Step 7: Run the integration test (DB-gated)**

Run (PowerShell, requires `pnpm docker:up`):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/repository/drizzle/readAfterWrite.test.ts
```
Expected: PASS (2 tests). If `RUN_DB_TESTS` is unset the suite skips.

- [ ] **Step 8: Run the Phase 1 atomicity test to confirm no regression**

Run (PowerShell):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/transaction.atomicity.test.ts
```
Expected: PASS — `ProjectRepository.create` still rolls back inside a transaction (it now reads back via the same `tx`).

- [ ] **Step 9: Commit**

```bash
git add src/main/core/database/repository/drizzle/
git commit -m "feat: RETURNING 제거 — 쓰기 후 PK 재조회(read-after-write)로 이식성 확보"
```

---

## Task 6: Full verification

- [ ] **Step 1: Full typecheck**

Run: `pnpm typecheck`
Expected: main + renderer both pass (renderer is untouched but must stay green).

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: no errors. (Fix any Biome import-order / formatting issues in the new files, then re-run.)

- [ ] **Step 3: Full test suite with DB integration**

Run (PowerShell, requires `pnpm docker:up`):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test
```
Expected: all suites pass — existing unit tests, the Phase 1 migrate + atomicity integration tests, and the new portable/read-after-write tests.

- [ ] **Step 4: Manual dev smoke (fresh DB)**

Reset the dev DB so migrations apply cleanly, then exercise the app:
```powershell
pnpm docker:down
docker volume rm hydra_hydra_data
pnpm docker:up
pnpm dev
```
Confirm: connect to workspace succeeds; create a project, create/edit an issue, search issues (case-insensitive), add a comment/task/label — all still work (read-after-write returns the written rows). New rows' ids are v7 (check in `pnpm db:studio`: third UUID group starts with `7`).

- [ ] **Step 5: Commit (if any lint/format fixups were needed)**

```bash
git add -A
git commit -m "chore: Phase 2 이식성 작업 최종 정리"
```

---

## Notes / Risks

- **No transaction inside read-after-write.** Justified above (Design decisions): single-row write keyed by a unique app id needs no isolation to read itself back; handler-level `transaction()` (Phase 1) covers multi-write atomicity. If a future method does several writes that must be atomic, wrap them at the handler via `adapter.transaction()` and thread `tx` (the Phase 1 pattern), not inside the repo.
- **`selectById` uses `any` for table/column.** Biome's `noExplicitAny` is `off` in this repo, and drizzle's table/column generics are impractical to thread through a single shared helper; the return value is cast to the concrete `*Record` at each call site (same pattern the repos already use). Type safety at call sites is preserved by the explicit `selectById<XxxRecord>` type argument.
- **Index migration is additive.** `0001_*.sql` only adds indexes; it applies cleanly on top of `0000` and is idempotent via drizzle's journal. No data change.
- **Still PostgreSQL-only.** `schema.mysql.ts`, `MySqlAdapter`, the adapter factory, `mysql2`, timestamp/`char(36)` type rules (§6.2.2–§6.2.5), and `dbms` in config/invite are **Phase 4**. The `lower-LIKE` `escape '\\'` clause and the neutral `DrizzleDb` alias are written to be MySQL-compatible in advance but exercised only against PG here.
- **UUIDv7 coexistence.** Existing v4 ids in already-populated PG workspaces are untouched; only new rows are v7 (§6.2.1).

---

## Self-Review

**Spec coverage (Phase 2 scope = §12 item 2):**
- Remove `.returning()` → read-after-write: Task 5 (all 20 sites + helper + tests). ✅
- `ilike` → `lower-LIKE`: Task 4 (helper + the 1 site + wildcard escaping per §4.4.2). ✅
- Dialect-neutral `db` handle: Task 3 (all 11 constructors → `DrizzleDb`). ✅
- Secondary indexes: Task 2 (FK/filter columns per §6.2.6 + migration). ✅
- UUIDv7: Task 1 (§6.2.1). ✅
- Out of Phase 2 (deferred, noted): MySQL schema/adapter/factory, timestamp & `char(36)` type rules, `dbms` config — Phase 4; auth columns — Phase 3.

**Placeholder scan:** No `TBD`/`TODO`/"handle edge cases". Every code step shows complete code; the one repetitive transform (read-after-write) is shown in full once (Task 5 Step 2) with an exact parameter table for the remaining sites. ✅

**Type consistency:** `selectById<T>(ex, table, pkColumn, id)` signature is used identically across Task 5. `caseInsensitiveLike(column, value)` / `escapeLikePattern(value)` names match between `portable.ts`, its test, and the IssueRepository call site. `DrizzleDb` (constructor type) and `DrizzleExecutor` (helper param) come from the existing `executor.ts`. Table-const and PK-column names in the Task 5 table match `schema.ts`. ✅

---

## Execution Handoff

(Filled in after presenting to the user.)
