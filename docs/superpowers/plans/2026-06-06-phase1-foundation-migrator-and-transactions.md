# Phase 1 — Foundation: Real Migrator + Transaction Integrity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Hydra a real, versioned, idempotent schema migrator that runs on connect, and fix the transaction-threading bug so multi-write operations are actually atomic — with no user-facing behavior change.

**Architecture:** Generate versioned SQL with `drizzle-kit generate` into `drizzle/`, ship it at runtime, and apply it via drizzle-orm's `migrate()` inside `PostgresAdapter.runMigrations()` (called from `ConnectWorkspaceHandler` after connect). Separately, thread the transaction handle (`tx`) into repository writes via an optional executor parameter so `CreateProjectHandler`'s two writes run inside one BEGIN/COMMIT. A new DB integration-test harness (using the existing docker-compose Postgres, gated by `RUN_DB_TESTS=1`) backs these with real tests.

**Tech Stack:** Electron + TypeScript, Drizzle ORM (`drizzle-orm/node-postgres`), `pg`, drizzle-kit, Vitest, electron-forge.

**Reference spec:** `docs/superpowers/specs/2026-06-06-mysql-support-and-auth-redesign-design.md` (§4.4.3, §8.1, §10, §12.1).

> **Commit convention:** This repo uses Korean Conventional Commits (e.g. `feat:`, `fix:`, `chore:`). End every commit message with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer (omitted from the examples below for brevity).

---

## File Structure

**Created:**
- `src/main/core/database/__testutils__/pgTestDb.ts` — test-only helper: create/drop an isolated Postgres database against the docker-compose instance. One responsibility: throwaway-DB lifecycle for integration tests.
- `src/main/core/database/__testutils__/pgTestDb.test.ts` — self-check that the harness can create/drop a DB.
- `src/main/core/database/migrate/migrationsPath.ts` — resolves the migrations folder for dev vs packaged builds. Only imported by main-process runtime (never by tests), so it may import `electron`.
- `src/main/core/database/repository/drizzle/executor.ts` — Drizzle executor types (`DrizzleDb`, `DrizzleTx`, `DrizzleExecutor`).
- `src/main/core/database/repository/interfaces/RepoExecutor.ts` — dialect-neutral `RepoExecutor` type used in repository interfaces.
- `src/main/core/database/adapter/PostgresAdapter.migrate.test.ts` — integration test for `runMigrations()`.
- `src/main/core/database/transaction.atomicity.test.ts` — integration test proving transactional rollback.
- `drizzle/` — generated migration SQL + `meta/_journal.json` (committed).

**Modified:**
- `src/main/core/database/adapter/DatabaseAdapter.ts` — `runMigrations(migrationsFolder: string)` signature.
- `src/main/core/database/adapter/PostgresAdapter.ts` — implement `runMigrations` with `migrate()`.
- `src/main/handler/workspace/ConnectWorkspaceHandler.ts` — call `runMigrations()` after connect.
- `src/main/core/database/repository/interfaces/ProjectRepository.ts` — add optional `executor` to `create`/`linkUser`.
- `src/main/core/database/repository/drizzle/DrizzleProjectRepository.ts` — honor the executor.
- `src/main/handler/projects/CreateProjectHandler.ts` — pass `tx` into the repo writes.
- `forge.config.ts` — `extraResource: ['./drizzle']`.
- `.github/workflows/ci.yml` — add a Postgres service + `RUN_DB_TESTS` env.

---

## Task 1: DB integration-test harness

**Files:**
- Create: `src/main/core/database/__testutils__/pgTestDb.ts`
- Test: `src/main/core/database/__testutils__/pgTestDb.test.ts`

- [ ] **Step 1: Write the harness helper**

```ts
// src/main/core/database/__testutils__/pgTestDb.ts
// 통합 테스트용 격리 데이터베이스 생성/삭제 헬퍼 (docker-compose Postgres 대상)

import { Client } from 'pg'

export function pgTestConfig() {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres'
  }
}

// 유지보수용 'postgres' DB에 접속해 고유 이름의 테스트 DB를 생성
export async function createTestDatabase(): Promise<string> {
  const name = `hydra_test_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`
  const client = new Client({ ...pgTestConfig(), database: 'postgres' })
  await client.connect()
  try {
    await client.query(`CREATE DATABASE "${name}"`)
  } finally {
    await client.end()
  }
  return name
}

export async function dropTestDatabase(name: string): Promise<void> {
  const client = new Client({ ...pgTestConfig(), database: 'postgres' })
  await client.connect()
  try {
    await client.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`)
  } finally {
    await client.end()
  }
}
```

- [ ] **Step 2: Write the self-check test**

```ts
// src/main/core/database/__testutils__/pgTestDb.test.ts
import { Client } from 'pg'
import { describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from './pgTestDb'

describe.runIf(process.env.RUN_DB_TESTS === '1')('pgTestDb harness', () => {
  it('creates and drops an isolated database', async () => {
    const name = await createTestDatabase()
    const client = new Client({ ...pgTestConfig(), database: name })
    await client.connect() // DB가 실제로 존재함을 증명
    await client.end()
    await dropTestDatabase(name)
    expect(name).toMatch(/^hydra_test_/)
  })
})
```

- [ ] **Step 3: Start the local Postgres and run the test**

Run (PowerShell):
```powershell
pnpm docker:up
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/__testutils__/pgTestDb.test.ts
```
Expected: PASS (1 test). If `RUN_DB_TESTS` is unset the suite is **skipped**, which is also acceptable locally.

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/__testutils__/
git commit -m "test: 통합 테스트용 Postgres DB 격리 하니스 추가"
```

---

## Task 2: Generate the initial migration

**Files:**
- Create: `drizzle/0000_*.sql`, `drizzle/meta/_journal.json`, `drizzle/meta/0000_snapshot.json` (via tooling)

- [ ] **Step 1: Generate migration SQL from the current schema**

Run:
```bash
pnpm db:generate
```
Expected: creates a `drizzle/` directory containing `0000_<name>.sql` and a `meta/` folder. `drizzle-kit generate` diffs schema files against migration history and needs **no database connection**.

- [ ] **Step 2: Verify the SQL covers all 15 tables**

Run (PowerShell):
```powershell
Select-String -Path drizzle/0000_*.sql -Pattern 'CREATE TABLE' | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `15` (users, projects, users_projects_link, milestones, issues, files, issues_files_link, comments, labels, issues_labels_link, tasks, issue_relations, notifications, integrations, invite_codes).

- [ ] **Step 3: Commit the generated migration**

```bash
git add drizzle/
git commit -m "chore: 초기 스키마 마이그레이션 생성 (drizzle-kit generate)"
```

---

## Task 3: Implement `runMigrations()` (TDD)

**Files:**
- Test: `src/main/core/database/adapter/PostgresAdapter.migrate.test.ts`
- Modify: `src/main/core/database/adapter/DatabaseAdapter.ts:19`
- Modify: `src/main/core/database/adapter/PostgresAdapter.ts:145-147`

- [ ] **Step 1: Write the failing integration test**

```ts
// src/main/core/database/adapter/PostgresAdapter.migrate.test.ts
import { resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../__testutils__/pgTestDb'
import { PostgresAdapter } from './PostgresAdapter'

const migrationsFolder = resolve(process.cwd(), 'drizzle')

describe.runIf(process.env.RUN_DB_TESTS === '1')('PostgresAdapter.runMigrations', () => {
  let adapter: PostgresAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createTestDatabase()
    adapter = new PostgresAdapter()
    await adapter.connect({ ...pgTestConfig(), database: dbName })
  })

  afterAll(async () => {
    await adapter.disconnect()
    await dropTestDatabase(dbName)
  })

  it('creates all application tables', async () => {
    await adapter.runMigrations(migrationsFolder)
    const db = adapter.getConnection()
    const res = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    )
    const names = res.rows.map((r) => r.table_name as string)
    expect(names).toEqual(expect.arrayContaining(['users', 'projects', 'issues', 'comments', 'notifications']))
  })

  it('is idempotent on a second run', async () => {
    await expect(adapter.runMigrations(migrationsFolder)).resolves.not.toThrow()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run (PowerShell):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/adapter/PostgresAdapter.migrate.test.ts
```
Expected: FAIL on "creates all application tables" — `runMigrations` is a no-op, so no tables exist and `arrayContaining` fails. (Vitest strips types, so passing the extra `migrationsFolder` argument runs fine even before the signature change.)

- [ ] **Step 3: Update the interface signature**

In `src/main/core/database/adapter/DatabaseAdapter.ts`, change line 19:
```ts
  runMigrations(migrationsFolder: string): Promise<void>
```

- [ ] **Step 4: Implement the migrator in PostgresAdapter**

In `src/main/core/database/adapter/PostgresAdapter.ts`, add the import near the other drizzle imports (after line 6):
```ts
import { migrate } from 'drizzle-orm/node-postgres/migrator'
```
Replace the no-op `runMigrations` (lines 145-147) with:
```ts
  async runMigrations(migrationsFolder: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    await migrate(this.db, { migrationsFolder })
  }
```

- [ ] **Step 5: Run the test to verify it passes**

Run (PowerShell):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/adapter/PostgresAdapter.migrate.test.ts
```
Expected: PASS (2 tests).

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck:node`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/main/core/database/adapter/DatabaseAdapter.ts src/main/core/database/adapter/PostgresAdapter.ts src/main/core/database/adapter/PostgresAdapter.migrate.test.ts
git commit -m "feat: drizzle migrate() 기반 runMigrations 구현"
```

---

## Task 4: Resolve migrations path + wire into connect + package it

**Files:**
- Create: `src/main/core/database/migrate/migrationsPath.ts`
- Modify: `src/main/handler/workspace/ConnectWorkspaceHandler.ts:38-47`
- Modify: `forge.config.ts:8-14`

- [ ] **Step 1: Create the migrations-folder resolver**

```ts
// src/main/core/database/migrate/migrationsPath.ts
// 마이그레이션 SQL 폴더 경로 해석 (dev: 레포 루트, packaged: resources)
// 주의: 이 모듈은 메인 프로세스 런타임에서만 import 한다 (electron 의존성, 테스트에서 import 금지)

import { join, resolve } from 'node:path'
import { app } from 'electron'

export function getMigrationsFolder(): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'drizzle')
  }
  return resolve(process.cwd(), 'drizzle')
}
```

- [ ] **Step 2: Call `runMigrations()` right after connect**

In `src/main/handler/workspace/ConnectWorkspaceHandler.ts`, add the import after line 3:
```ts
import { getMigrationsFolder } from '@/database/migrate/migrationsPath'
```
Then, immediately after the `await adapter.connect({ ... })` block (after line 45) and before `const db = adapter.getConnection()`, add:
```ts
    // 스키마를 최신 마이그레이션으로 적용 (멱등)
    await adapter.runMigrations(getMigrationsFolder())
```

- [ ] **Step 3: Ship the `drizzle/` folder in packaged builds**

In `forge.config.ts`, add `extraResource` to `packagerConfig` (after line 13, `executableName: 'hydra'`):
```ts
    executableName: 'hydra',
    extraResource: ['./drizzle']
```

- [ ] **Step 4: Verify typecheck and build**

Run: `pnpm typecheck && pnpm build`
Expected: both succeed.

- [ ] **Step 5: Manual dev verification (fresh DB)**

Because `migrate()` applies `CREATE TABLE` statements, run it against a **fresh** database (a DB previously created by `drizzle-kit push` already has the tables and would error). For dev, reset once:
```powershell
pnpm docker:down
docker volume rm hydra_hydra_data
pnpm docker:up
```
Then launch the app (`pnpm dev`), connect to the workspace, and confirm it connects without error and tables exist (e.g. via `pnpm db:studio`). Existing-workspace (already-populated) migration is handled in Phase 3 — see Notes.

- [ ] **Step 6: Commit**

```bash
git add src/main/core/database/migrate/migrationsPath.ts src/main/handler/workspace/ConnectWorkspaceHandler.ts forge.config.ts
git commit -m "feat: 연결 시 마이그레이션 자동 실행 + drizzle 폴더 패키징"
```

---

## Task 5: Fix transaction atomicity (TDD)

**Files:**
- Create: `src/main/core/database/repository/interfaces/RepoExecutor.ts`
- Create: `src/main/core/database/repository/drizzle/executor.ts`
- Test: `src/main/core/database/transaction.atomicity.test.ts`
- Modify: `src/main/core/database/repository/interfaces/ProjectRepository.ts`
- Modify: `src/main/core/database/repository/drizzle/DrizzleProjectRepository.ts:16-32,79-85`
- Modify: `src/main/handler/projects/CreateProjectHandler.ts:20-35`

- [ ] **Step 1: Write the failing atomicity test**

```ts
// src/main/core/database/transaction.atomicity.test.ts
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PostgresAdapter } from './adapter/PostgresAdapter'
import { DrizzleProjectRepository } from './repository/drizzle/DrizzleProjectRepository'
import * as schema from './schema/drizzle/schema'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from './__testutils__/pgTestDb'

describe.runIf(process.env.RUN_DB_TESTS === '1')('transaction atomicity', () => {
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

  it('rolls back the project insert when a later write throws', async () => {
    const db = adapter.getConnection()
    const repo = new DrizzleProjectRepository(db)

    const userId = randomUUID()
    await db.insert(schema.users).values({ user_id: userId, user_name: 'tester', user_role: 'admin' })

    const projectId = randomUUID()
    await expect(
      adapter.transaction(async (tx) => {
        await repo.create(
          { projectId, projectName: 'P', projectKey: 'P1', createdBy: userId, startDate: new Date(), endDate: new Date() },
          tx
        )
        throw new Error('boom') // insert 이후 강제 롤백
      })
    ).rejects.toThrow('boom')

    const found = await db.select().from(schema.projects).where(eq(schema.projects.project_id, projectId))
    expect(found).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run (PowerShell):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/transaction.atomicity.test.ts
```
Expected: FAIL — current `create()` ignores the `tx` arg and writes via the pooled `this.db`, so the insert commits independently of the rolled-back transaction and `found` has length 1.

- [ ] **Step 3: Define the executor types**

```ts
// src/main/core/database/repository/interfaces/RepoExecutor.ts
// 리포지토리 쓰기에 주입할 수 있는 실행 핸들 (db 또는 트랜잭션). 구현체가 구체 타입으로 좁힌다.
export type RepoExecutor = unknown
```

```ts
// src/main/core/database/repository/drizzle/executor.ts
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '../../schema/drizzle/schema'

export type DrizzleDb = NodePgDatabase<typeof schema>
// tx 핸들 타입을 transaction 콜백 인자에서 직접 추출 (drizzle 내부 제네릭에 의존하지 않음)
export type DrizzleTx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0]
export type DrizzleExecutor = DrizzleDb | DrizzleTx
```

- [ ] **Step 4: Add the optional executor to the ProjectRepository interface**

In `src/main/core/database/repository/interfaces/ProjectRepository.ts`, add the import at the top:
```ts
import type { RepoExecutor } from './RepoExecutor'
```
Change the `create` and `linkUser` signatures to:
```ts
  create(data: CreateProjectData, executor?: RepoExecutor): Promise<ProjectRecord>
  linkUser(linkId: string, userId: string, projectId: string, executor?: RepoExecutor): Promise<void>
```

- [ ] **Step 5: Honor the executor in the Drizzle implementation**

In `src/main/core/database/repository/drizzle/DrizzleProjectRepository.ts`, add the import after line 4:
```ts
import type { RepoExecutor } from '../interfaces/RepoExecutor'
import type { DrizzleExecutor } from './executor'
```
Change `create` (lines 18-32) to accept and use the executor:
```ts
  async create(data: CreateProjectData, executor: RepoExecutor = this.db): Promise<ProjectRecord> {
    const ex = executor as DrizzleExecutor
    const rows = await ex
      .insert(projects)
      .values({
        project_id: data.projectId,
        project_name: data.projectName,
        project_key: data.projectKey,
        project_desc: data.projectDesc ?? null,
        project_created_by: data.createdBy,
        project_start_date: data.startDate ?? null,
        project_end_date: data.endDate ?? null
      })
      .returning()
    return rows[0] as ProjectRecord
  }
```
Change `linkUser` (lines 79-85) to:
```ts
  async linkUser(linkId: string, userId: string, projectId: string, executor: RepoExecutor = this.db): Promise<void> {
    const ex = executor as DrizzleExecutor
    await ex.insert(usersProjectsLink).values({
      user_project_link_id: linkId,
      user_id: userId,
      project_id: projectId
    })
  }
```

- [ ] **Step 6: Run the atomicity test to verify it passes**

Run (PowerShell):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/database/transaction.atomicity.test.ts
```
Expected: PASS — `create()` now runs on the transaction, so the rollback removes the project and `found` has length 0.

- [ ] **Step 7: Thread `tx` through the production handler**

In `src/main/handler/projects/CreateProjectHandler.ts`, change the transaction block (lines 20-35) so the callback receives `tx` and passes it to both writes:
```ts
      const project = await this.repos.db.transaction(async (tx) => {
        const project = await this.repos.projects.create(
          {
            projectId,
            projectName: params.projectName,
            projectKey: params.projectKey,
            projectDesc: params.projectDesc,
            createdBy: params.userId,
            startDate: new Date(),
            endDate: new Date()
          },
          tx
        )

        // 사용자-프로젝트 연결 생성 (동일 트랜잭션)
        await this.repos.projects.linkUser(CoreUtil.getUuid(), params.userId, project.project_id, tx)

        return project
      })
```

- [ ] **Step 8: Typecheck and run the full main test suite**

Run (PowerShell):
```powershell
pnpm typecheck:node
$env:RUN_DB_TESTS='1'; pnpm test
```
Expected: typecheck clean; all tests pass (existing 3 unit tests + new integration tests).

- [ ] **Step 9: Commit**

```bash
git add src/main/core/database/repository/interfaces/RepoExecutor.ts src/main/core/database/repository/interfaces/ProjectRepository.ts src/main/core/database/repository/drizzle/executor.ts src/main/core/database/repository/drizzle/DrizzleProjectRepository.ts src/main/handler/projects/CreateProjectHandler.ts src/main/core/database/transaction.atomicity.test.ts
git commit -m "fix: 프로젝트 생성 트랜잭션이 실제로 원자적이도록 tx 핸들 전달"
```

---

## Task 6: Run DB-gated tests in CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add a Postgres service and enable the DB tests**

In `.github/workflows/ci.yml`, under `jobs.ci` (after `runs-on: ubuntu-latest`, before `steps:`), add:
```yaml
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: postgres
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
```
Then change the existing `Test` step to set the DB env so the gated suites run:
```yaml
      - name: Test
        run: pnpm test
        env:
          RUN_DB_TESTS: '1'
          DB_HOST: localhost
          DB_PORT: '5432'
          DB_USER: postgres
          DB_PASSWORD: postgres
```
(`POSTGRES_DB: postgres` keeps the maintenance database the harness connects to for `CREATE DATABASE`/`DROP DATABASE`.)

- [ ] **Step 2: Validate the workflow YAML locally**

Run (PowerShell):
```powershell
pnpm exec js-yaml .github/workflows/ci.yml > $null; if ($LASTEXITCODE -eq 0) { 'yaml ok' } else { 'yaml error' }
```
Expected: `yaml ok`. (If `js-yaml` is unavailable, visually confirm indentation matches the surrounding steps — two spaces under `steps:` items.)

- [ ] **Step 3: Commit and verify on CI**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: Postgres 서비스 추가 및 DB 통합 테스트 활성화"
```
Push the branch and confirm the CI run's **Test** step executes the integration suites (not skipped) and passes.

---

## Notes / Risks

- **Existing populated databases:** `migrate()` runs `CREATE TABLE`, so it errors against a DB that already has the schema (e.g. one created by `drizzle-kit push`). This is fine for fresh dev DBs and unreleased v3. **Baselining / in-place migration of already-populated workspaces is Phase 3's scope** (spec §8.2–§8.4), where the `users` auth-column migration and schema-version detection are designed.
- **`drizzle-kit push` stays a dev-only tool** and must never run against a user DB (spec §8.1). After this phase, prefer `pnpm db:generate` + the runtime migrator.
- **DB-gated tests** only run when `RUN_DB_TESTS=1` and a reachable Postgres exists; otherwise they skip. This keeps `pnpm test` green for contributors without Docker while CI runs them for real.

---

## Self-Review

**Spec coverage (Phase 1 scope = spec §8.1 migrator + §10 transaction bug + §11 test harness/CI):**
- Real versioned migrator (`generate` → `migrate()` on connect): Tasks 2, 3, 4. ✅
- Ship migrations at runtime (extraResource): Task 4 Step 3. ✅
- `runMigrations()` called in `ConnectWorkspaceHandler`: Task 4 Step 2. ✅
- Transaction-threading bug fixed + atomicity proven: Task 5. ✅
- DB integration-test harness + CI against real Postgres: Tasks 1, 6. ✅
- Out of Phase 1 (deferred, noted): existing-DB baselining, MySQL adapter, repo `.returning()`/`ilike` portability, auth columns — covered by later-phase plans.

**Placeholder scan:** No `TBD`/`TODO`/"handle edge cases". Every code step shows complete code; every run step states the expected result. ✅

**Type consistency:** `runMigrations(migrationsFolder: string)` is consistent across the interface (Task 3 Step 3), the impl (Task 3 Step 4), the call site (Task 4 Step 2), and tests. `RepoExecutor` (interface) / `DrizzleExecutor` (impl) names are used consistently in Task 5 Steps 3–7. `create`/`linkUser` signatures match between interface and impl. `pgTestConfig`/`createTestDatabase`/`dropTestDatabase` names match across the harness and all three integration tests. ✅

---

## Execution Handoff

(Filled in after presenting to the user.)
