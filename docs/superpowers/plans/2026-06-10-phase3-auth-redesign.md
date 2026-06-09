# Phase 3 — Authentication Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace "DB connection = authentication" with a real per-user local login (username + scrypt password + session) layered on top of the shared workspace connection, including a first-admin setup flow, member onboarding without PostgreSQL ROLEs, and a split brand-panel auth UI that becomes the app's UX baseline.

**Architecture:** Three isolated concerns. (1) **Auth core** (`src/main/core/auth/`): pure, unit-testable password hashing, identifier normalization, and session-record TTL logic. (2) **Auth data + flow**: new `users` columns + migration, repository lookups, IPC handlers (login / setup-admin / logout / session-status), and an advisory-lock-guarded first-admin seed; `ConnectWorkspaceHandler` stops auto-creating an admin and instead reports whether setup is needed; `createRole`/`dropRole` are removed. (3) **Auth UI** (renderer): a session layer in the auth store, `/login` + `/setup` routes with a reworked guard, and `LoginPage` + `AdminSetupPage` in a split brand-panel layout. PostgreSQL-only (MySQL is Phase 4).

**Tech Stack:** Electron + TypeScript, Node `crypto.scrypt`, Electron `safeStorage`, Drizzle ORM + `pg`, drizzle-kit, TanStack Router, Zustand, shadcn/ui + Tailwind, Vitest.

**Reference spec:** `docs/superpowers/specs/2026-06-10-phase3-auth-redesign-design.md` (and parent `2026-06-06-mysql-support-and-auth-redesign-design.md` §5/§6/§8/§9/§11).

> **Commit convention:** Korean Conventional Commits (`feat:`/`fix:`/`refactor:`/`test:`/`docs:`/`chore:`/`style:`). End every commit message body with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer (omitted below for brevity).

> **Environment:** Windows + PowerShell. Git prints harmless `LF will be replaced by CRLF` warnings — ignore. **Only `git add` the specific paths each task lists** — never `git add -A`/`.` (working tree carries unrelated CRLF noise). CI runs `pnpm lint:ci` = `biome check .` (strict, no auto-fix) and treats **formatter mismatches as errors** — after editing, run `pnpm exec biome check <files>` and commit any format result. DB-gated tests run only with `RUN_DB_TESTS=1` + a reachable Postgres (`pnpm docker:up`); they skip otherwise.

---

## Design decisions baked into this plan

- **Pre-release → clean schema.** New `users` columns are `NOT NULL`/`UNIQUE`; the migration is a plain `ALTER TABLE ADD COLUMN` applied to a fresh/empty `users` table. Dev DBs must be reset (`docker volume rm`) before manual testing because `ADD COLUMN ... NOT NULL` fails on a table with rows (the old auto-admin row).
- **Login identifier = `user_sn`** (separate username), normalized `trim().toLowerCase()` at insert and lookup. `user_email` also normalized.
- **No forced first-login change; session = 1 day, remember-me = 30 days.**
- **`user_db_role` kept but deprecated** (no read/write); `createRole`/`dropRole` removed. Drop column is Phase 5.
- **Password hash never leaves main:** auth IPC responses return `SafeUser = Omit<UserRecord,'user_password_hash'>`.
- **First-admin seed race** guarded by `pg_advisory_xact_lock` inside a transaction (transaction-scoped lock auto-releases; avoids the pooled-connection footgun of session-scoped `pg_advisory_lock`).

---

## Execution prerequisites & ordering

- **Tasks are strictly sequential.** Task N's new types/files/aliases exist by the time Task N+1 runs (e.g. `SafeUser` from Task 5, the `AUTH_*` channels from Task 6, and the `@/auth` alias from Task 7 Step 1 are all in place before any later task imports them). Do not reorder.
- **Phase 1/2 artifacts already exist and are reused** (verify if unsure): `src/main/core/database/repository/drizzle/executor.ts` (exports `DrizzleDb`, `DrizzleExecutor`, `DrizzleTx`), `repository/interfaces/RepoExecutor.ts` (`RepoExecutor`), `repository/drizzle/readAfterWrite.ts` (`selectById`), and `database/__testutils__/pgTestDb.ts` (`createTestDatabase`/`dropTestDatabase`/`pgTestConfig`).
- **The `@/auth` alias (Task 7 Step 1) must be added before any `@/auth/*` import is typechecked.** It is the first step of Task 7 for this reason.
- After editing any file, run `pnpm exec biome check <files>` (CI uses strict `biome check`; a formatter mismatch fails CI even if local `pnpm lint` auto-fixed your working tree).

---

## File Structure

**Created (main):**
- `src/main/core/auth/password.ts` — `hashPassword` / `verifyPassword` (scrypt, self-describing string).
- `src/main/core/auth/password.test.ts` — unit tests.
- `src/main/core/auth/normalize.ts` — `normalizeHandle`.
- `src/main/core/auth/normalize.test.ts` — unit tests.
- `src/main/core/auth/session.ts` — pure session-record + TTL (`createSessionRecord`, `isExpired`, `SESSION_TTL_MS`).
- `src/main/core/auth/session.test.ts` — unit tests.
- `src/main/core/auth/SessionManager.ts` — safeStorage persistence (singleton, mirrors `WorkspaceManager`).
- `src/main/handler/auth/LoginHandler.ts`, `SetupAdminHandler.ts`, `LogoutHandler.ts`, `SessionStatusHandler.ts`.
- `src/main/core/auth/auth.integration.test.ts` — DB-gated integration tests.

**Created (renderer):**
- `src/renderer/src/components/pages/LoginPage.tsx`
- `src/renderer/src/components/pages/AdminSetupPage.tsx`
- `src/renderer/src/components/templates/AuthLayout.tsx` — shared split brand-panel shell.

**Modified (main):**
- `schema/drizzle/schema.ts` (users columns) → migration `drizzle/0002_*.sql`.
- `repository/interfaces/UserRepository.ts`, `repository/drizzle/DrizzleUserRepository.ts`.
- `adapter/PostgresAdapter.ts`, `adapter/DatabaseAdapter.ts` (remove createRole/dropRole).
- `interface/ipc.ts` (channels + payloads + `WorkspaceStatusResponse`), `interface/types/auth.ts`, `interface/types/workspace.ts`.
- `handler/workspace/ConnectWorkspaceHandler.ts`, `handler/workspace/WorkspaceStatusHandler.ts`.
- `handler/auth/CreateMemberHandler.ts`, `DeleteUserHandler.ts`, `UpdateUserHandler.ts`, `ListUsersHandler.ts`, `index.ts` (UpdateUser/ListUsers gain `toSafeUser` so the password hash never crosses IPC).
- `electron.vite.config.ts` + `tsconfig.node.json` (`@/auth` alias).

**Modified (renderer):**
- `stores/auth.ts`, `types/auth.ts`, `routers/routes.tsx`, `routers/routerContext.ts` (+ wherever the router context is built), `components/pages/WorkspacePage.tsx`, `components/pages/MembersPage.tsx`, and `locales/` (new `auth` namespace + a `member` validation/label key).

---

## Task 1: Auth core — password hashing (scrypt)

**Files:**
- Create: `src/main/core/auth/password.ts`
- Test: `src/main/core/auth/password.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/main/core/auth/password.test.ts
import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('produces a self-describing scrypt string', async () => {
    const encoded = await hashPassword('correct horse battery staple')
    expect(encoded).toMatch(/^scrypt\$N=32768,r=8,p=1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/)
  })

  it('verifies the correct password', async () => {
    const encoded = await hashPassword('hunter2')
    expect(await verifyPassword('hunter2', encoded)).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const encoded = await hashPassword('hunter2')
    expect(await verifyPassword('hunter3', encoded)).toBe(false)
  })

  it('uses a random salt (two hashes of same input differ)', async () => {
    const a = await hashPassword('same')
    const b = await hashPassword('same')
    expect(a).not.toBe(b)
    expect(await verifyPassword('same', a)).toBe(true)
    expect(await verifyPassword('same', b)).toBe(true)
  })

  it('returns false on a malformed stored hash instead of throwing', async () => {
    expect(await verifyPassword('x', 'not-a-valid-hash')).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- src/main/core/auth/password.test.ts`
Expected: FAIL (module `./password` not found).

- [ ] **Step 3: Implement `password.ts`**

```ts
// src/main/core/auth/password.ts
// scrypt 비밀번호 해싱. 파라미터를 해시 문자열에 함께 저장해 향후 진화 가능.
// 형식: scrypt$N=32768,r=8,p=1$<saltB64>$<hashB64>

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb)

const N = 32768 // 2^15
const R = 8
const P = 1
const KEYLEN = 64
// 메모리 ≈ 128*N*r ≈ 33.5MiB > Node 기본 maxmem(32MiB) → 명시적 maxmem 필수
const MAXMEM = 64 * 1024 * 1024

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = (await scrypt(plain, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM })) as Buffer
  return `scrypt$N=${N},r=${R},p=${P}$${salt.toString('base64')}$${derived.toString('base64')}`
}

export async function verifyPassword(plain: string, encoded: string): Promise<boolean> {
  try {
    const parts = encoded.split('$')
    if (parts.length !== 4 || parts[0] !== 'scrypt') return false
    const params = Object.fromEntries(parts[1].split(',').map((kv) => kv.split('=')))
    const n = Number(params.N)
    const r = Number(params.r)
    const p = Number(params.p)
    if (!n || !r || !p) return false
    const salt = Buffer.from(parts[2], 'base64')
    const expected = Buffer.from(parts[3], 'base64')
    const derived = (await scrypt(plain, salt, expected.length, { N: n, r, p, maxmem: MAXMEM })) as Buffer
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test -- src/main/core/auth/password.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Typecheck + lint the new files**

Run: `pnpm typecheck:node` (no errors) and `pnpm exec biome check src/main/core/auth/` (no errors).

- [ ] **Step 6: Commit**

```bash
git add src/main/core/auth/password.ts src/main/core/auth/password.test.ts
git commit -m "feat: scrypt 비밀번호 해싱 모듈 추가 (자기기술 형식)"
```

---

## Task 2: Auth core — normalize + session record

**Files:**
- Create: `src/main/core/auth/normalize.ts`, `src/main/core/auth/session.ts`
- Test: `src/main/core/auth/normalize.test.ts`, `src/main/core/auth/session.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/main/core/auth/normalize.test.ts
import { describe, expect, it } from 'vitest'
import { normalizeHandle } from './normalize'

describe('normalizeHandle', () => {
  it('trims and lowercases', () => {
    expect(normalizeHandle('  JuJoyCode ')).toBe('jujoycode')
    expect(normalizeHandle('A@B.COM')).toBe('a@b.com')
  })
})
```

```ts
// src/main/core/auth/session.test.ts
import { describe, expect, it } from 'vitest'
import { createSessionRecord, isExpired, SESSION_TTL_MS } from './session'

const user = { user_id: 'u1', user_sn: 'admin' }
const NOW = 1_700_000_000_000

describe('session record', () => {
  it('default TTL is 1 day', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(s.expiresAt - s.issuedAt).toBe(SESSION_TTL_MS.default)
    expect(SESSION_TTL_MS.default).toBe(24 * 60 * 60 * 1000)
  })

  it('remember-me TTL is 30 days', () => {
    const s = createSessionRecord(user, true, NOW)
    expect(s.expiresAt - s.issuedAt).toBe(SESSION_TTL_MS.remember)
    expect(SESSION_TTL_MS.remember).toBe(30 * 24 * 60 * 60 * 1000)
  })

  it('carries userId + userSn', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(s.userId).toBe('u1')
    expect(s.userSn).toBe('admin')
  })

  it('isExpired compares against now', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(isExpired(s, NOW + 1000)).toBe(false)
    expect(isExpired(s, s.expiresAt + 1)).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test -- src/main/core/auth/normalize.test.ts src/main/core/auth/session.test.ts`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `normalize.ts`**

```ts
// src/main/core/auth/normalize.ts
// 로그인 핸들/이메일 정규화 — insert 와 lookup 양쪽에서 동일하게 적용한다.
export function normalizeHandle(value: string): string {
  return value.trim().toLowerCase()
}
```

- [ ] **Step 4: Implement `session.ts`**

```ts
// src/main/core/auth/session.ts
// 세션 레코드(순수 로직). 영속화는 SessionManager가 담당한다.

export interface SessionRecord {
  userId: string
  userSn: string
  issuedAt: number
  expiresAt: number
}

const DAY = 24 * 60 * 60 * 1000
export const SESSION_TTL_MS = { default: DAY, remember: 30 * DAY } as const

export function createSessionRecord(
  user: { user_id: string; user_sn: string },
  rememberMe: boolean,
  now: number
): SessionRecord {
  const ttl = rememberMe ? SESSION_TTL_MS.remember : SESSION_TTL_MS.default
  return { userId: user.user_id, userSn: user.user_sn, issuedAt: now, expiresAt: now + ttl }
}

export function isExpired(session: SessionRecord, now: number): boolean {
  return now >= session.expiresAt
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `pnpm test -- src/main/core/auth/normalize.test.ts src/main/core/auth/session.test.ts`
Expected: PASS (1 + 4 tests).

- [ ] **Step 6: Typecheck + commit**

Run: `pnpm typecheck:node`
```bash
git add src/main/core/auth/normalize.ts src/main/core/auth/normalize.test.ts src/main/core/auth/session.ts src/main/core/auth/session.test.ts
git commit -m "feat: 핸들 정규화 + 세션 레코드(TTL) 코어 추가"
```

---

## Task 3: Auth core — SessionManager (safeStorage persistence)

**Files:**
- Create: `src/main/core/auth/SessionManager.ts`

Mirrors `WorkspaceManager` (encrypt with `safeStorage` when available, plaintext fallback; file under `app.getPath('userData')`).

- [ ] **Step 1: Implement `SessionManager.ts`**

```ts
// src/main/core/auth/SessionManager.ts
// 세션 레코드를 safeStorage로 암호화해 userData/session.json 에 영속화 (WorkspaceManager 패턴).

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app, safeStorage } from 'electron'
import type { SessionRecord } from './session'

export class SessionManager {
  private static instance: SessionManager | null = null
  private storePath: string

  private constructor() {
    this.storePath = join(app.getPath('userData'), 'session.json')
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  load(): SessionRecord | null {
    if (!existsSync(this.storePath)) return null
    try {
      const raw = readFileSync(this.storePath)
      const json = safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(raw) : raw.toString('utf-8')
      return JSON.parse(json) as SessionRecord
    } catch {
      return null
    }
  }

  save(session: SessionRecord): void {
    const json = JSON.stringify(session)
    if (safeStorage.isEncryptionAvailable()) {
      writeFileSync(this.storePath, safeStorage.encryptString(json))
    } else {
      writeFileSync(this.storePath, json, 'utf-8')
    }
  }

  clear(): void {
    if (existsSync(this.storePath)) rmSync(this.storePath)
  }
}
```

- [ ] **Step 2: Typecheck + lint + commit**

Run: `pnpm typecheck:node` and `pnpm exec biome check src/main/core/auth/`
```bash
git add src/main/core/auth/SessionManager.ts
git commit -m "feat: SessionManager — safeStorage 기반 세션 영속화"
```

(No unit test: this is thin I/O over Electron `safeStorage`; its behavior is exercised by the Task 8 integration path and the pure logic lives in `session.ts`. `load()` returns `null` on a missing or corrupted file — treated as "no session" / re-authenticate, a deliberate fail-closed default.)

---

## Task 4: Schema — `users` auth columns + migration 0002

**Files:**
- Modify: `src/main/core/database/schema/drizzle/schema.ts` (users table, lines 6-15)
- Create (tooling): `drizzle/0002_*.sql` + updated `drizzle/meta/`

- [ ] **Step 1: Add the columns to the `users` table**

Replace the current `users` definition with (keep `user_db_role`, add the three new columns):

```ts
export const users = pgTable('users', {
  user_id: uuid('user_id').primaryKey(),
  user_sn: varchar('user_sn', { length: 255 }).notNull().unique(),
  user_password_hash: varchar('user_password_hash', { length: 255 }).notNull(),
  user_status: varchar('user_status', { length: 20 }).default('active'),
  user_name: varchar('user_name', { length: 255 }),
  user_email: varchar('user_email', { length: 255 }),
  user_db_role: varchar('user_db_role', { length: 255 }),
  user_avatar_path: varchar('user_avatar_path', { length: 1024 }),
  user_role: varchar('user_role', { length: 50 }).default('member'),
  user_created_at: timestamp('user_created_at'),
  user_updated_at: timestamp('user_updated_at')
})
```

- [ ] **Step 2: Generate the migration**

Run: `pnpm db:generate`
Expected: a new `drizzle/0002_<name>.sql` with `ALTER TABLE "users" ADD COLUMN ...` for `user_sn`, `user_password_hash`, `user_status` (plus the unique constraint on `user_sn`), and updated `drizzle/meta/`. No `CREATE TABLE`.

- [ ] **Step 3: Verify the migration content**

Run (PowerShell):
```powershell
Select-String -Path drizzle/0002_*.sql -Pattern 'ADD COLUMN' | Measure-Object | Select-Object -ExpandProperty Count
Select-String -Path drizzle/0002_*.sql -Pattern 'CREATE TABLE' | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: first ≥ 3, second 0.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck:node` (will show errors in `DrizzleUserRepository`/handlers until Tasks 5-7 — that's expected; confirm the only errors are about the new columns / missing fields, not schema syntax). If the schema file itself has a syntax error, fix it before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/main/core/database/schema/drizzle/schema.ts drizzle/
git commit -m "feat: users 인증 컬럼(user_sn/password_hash/status) + 마이그레이션 0002"
```

---

## Task 5: Repository — auth-aware UserRepository

**Files:**
- Modify: `src/main/core/database/repository/interfaces/UserRepository.ts`
- Modify: `src/main/core/database/repository/drizzle/DrizzleUserRepository.ts`

- [ ] **Step 1: Update the interface types**

In `UserRepository.ts`, update `UserRecord`, `CreateUserData`, and the interface:

```ts
import type { RepoExecutor } from './RepoExecutor'

export interface UserRecord {
  user_id: string
  user_sn: string
  user_password_hash: string
  user_status: string | null
  user_name: string | null
  user_email: string | null
  user_db_role: string | null
  user_avatar_path: string | null
  user_role: 'admin' | 'member'
  user_created_at: Date | null
  user_updated_at: Date | null
}

// 비밀번호 해시를 제외한, 렌더러로 보낼 수 있는 안전한 사용자 형태
export type SafeUser = Omit<UserRecord, 'user_password_hash'>

export interface CreateUserData {
  userId: string
  userSn: string
  passwordHash: string
  userName?: string | null
  userEmail?: string | null
  userRole?: 'admin' | 'member'
  userStatus?: string
  userAvatarPath?: string | null
}

export interface UpdateUserData {
  userName?: string
  userEmail?: string
  userAvatarPath?: string | null
  userStatus?: string
}

export interface UserRepository {
  findById(userId: string): Promise<UserRecord | null>
  findBySn(userSn: string): Promise<UserRecord | null>
  findAll(): Promise<UserRecord[]>
  create(data: CreateUserData, executor?: RepoExecutor): Promise<UserRecord>
  update(userId: string, data: UpdateUserData): Promise<UserRecord>
  delete(userId: string): Promise<boolean>
  count(executor?: RepoExecutor): Promise<number>
}
```

(Removed `findByDbRole`; `userDbRole` no longer part of `CreateUserData`. `findByDbRole` callers are removed in Task 7.)

- [ ] **Step 2: Update `DrizzleUserRepository`**

```ts
// Drizzle 기반 사용자 리포지토리 구현

import { eq, sql } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type { CreateUserData, UpdateUserData, UserRecord, UserRepository } from '../interfaces/UserRepository'
import type { RepoExecutor } from '../interfaces/RepoExecutor'
import type { DrizzleDb, DrizzleExecutor } from './executor'
import { selectById } from './readAfterWrite'

const { users } = schema

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: DrizzleDb) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const rows = await this.db.select().from(users).where(eq(users.user_id, userId)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findBySn(userSn: string): Promise<UserRecord | null> {
    const rows = await this.db.select().from(users).where(eq(users.user_sn, userSn)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findAll(): Promise<UserRecord[]> {
    const rows = await this.db.select().from(users)
    return rows as UserRecord[]
  }

  async create(data: CreateUserData, executor: RepoExecutor = this.db): Promise<UserRecord> {
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
    const values: Record<string, unknown> = { user_updated_at: new Date() }
    if (data.userName !== undefined) values.user_name = data.userName
    if (data.userEmail !== undefined) values.user_email = data.userEmail
    if (data.userAvatarPath !== undefined) values.user_avatar_path = data.userAvatarPath
    if (data.userStatus !== undefined) values.user_status = data.userStatus

    await this.db.update(users).set(values).where(eq(users.user_id, userId))
    return selectById<UserRecord>(this.db, users, users.user_id, userId)
  }

  async delete(userId: string): Promise<boolean> {
    await this.db.delete(users).where(eq(users.user_id, userId))
    return true
  }

  async count(executor: RepoExecutor = this.db): Promise<number> {
    const ex = executor as DrizzleExecutor
    const rows = await ex.select({ count: sql<number>`count(*)` }).from(users)
    return Number(rows[0].count)
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck:node`
Expected: errors remain only in handlers that still reference `findByDbRole` / old `CreateUserData` (fixed in Task 7) and IPC types (Task 6). The repository file itself must be clean.

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/repository/interfaces/UserRepository.ts src/main/core/database/repository/drizzle/DrizzleUserRepository.ts
git commit -m "feat: UserRepository에 findBySn + 인증 컬럼 + 실행자(tx) 지원, findByDbRole 제거"
```

---

## Task 6: IPC — channels, payloads, types

**Files:**
- Modify: `src/main/core/interface/ipc.ts`, `src/main/core/interface/types/auth.ts`, `src/main/core/interface/types/workspace.ts`

- [ ] **Step 1: Add auth channels to `IpcChannel`**

In `ipc.ts`, in the `// AUTH-` block of the `IpcChannel` enum, add:
```ts
  AUTH_LOGIN = 'authLogin',
  AUTH_LOGOUT = 'authLogout',
  AUTH_SETUP_ADMIN = 'authSetupAdmin',
  AUTH_SESSION_STATUS = 'authSessionStatus',
```

- [ ] **Step 2: Update auth types**

In `interface/types/auth.ts`:
```ts
import type { SafeUser, UserRecord } from '../../database/repository/interfaces/UserRepository'

export type User = SafeUser

export interface AuthDeleteUserParams {
  id: string
  shouldSoftDelete: boolean
}

export interface AuthUpdateUserParams {
  userId: string
  userName?: string
  userAvatarKey?: string | null
}

// 관리자가 멤버를 만들 때 (ROLE 생성 없음, 초기 비밀번호 설정)
export interface CreateMemberParams {
  userSn: string
  userName: string
  userEmail: string
  initialPassword: string
  userRole?: 'admin' | 'member'
}

export interface LoginParams {
  userSn: string
  password: string
  rememberMe?: boolean
}

export interface SetupAdminParams {
  userSn: string
  userName: string
  userEmail?: string
  password: string
}

export interface SessionStatusResponse {
  authenticated: boolean
  user: SafeUser | null
}
```

(`User` now aliases `SafeUser` so the renderer never sees `user_password_hash`. `UserRecord` import kept for any consumer that needs the full row type server-side.)

- [ ] **Step 3: Update `WorkspaceStatusResponse`**

In `interface/types/workspace.ts`, replace:
```ts
export interface WorkspaceStatusResponse {
  connected: boolean
  needsSetup: boolean
}
```
(Drops `user`/`isFirstLogin` — connect no longer authenticates a user.)

- [ ] **Step 4: Wire payloads in `ipc.ts`**

Add imports near the existing auth/workspace type imports:
```ts
import type {
  AuthDeleteUserParams,
  AuthUpdateUserParams,
  CreateMemberParams,
  LoginParams,
  SessionStatusResponse,
  SetupAdminParams
} from './types/auth'
```
Add to the `// AUTH-` block of `IpcPayloads`:
```ts
  [IpcChannel.AUTH_LOGIN]: {
    send: LoginParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_LOGOUT]: {
    send: undefined
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.AUTH_SETUP_ADMIN]: {
    send: SetupAdminParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_SESSION_STATUS]: {
    send: undefined
    receive: BaseIpcResponse<SessionStatusResponse>
  }
```
Change `AUTH_CREATE_MEMBER` and `AUTH_UPDATE_USER` receive types from `UserRecord` to `SafeUser`. Add a `SafeUser` import to `ipc.ts`:
```ts
import type { SafeUser, UserRecord } from '../database/repository/interfaces/UserRepository'
```
(`UserRecord` import stays only if still referenced; if biome flags it as unused after switching auth payloads to `SafeUser`, drop it.) Update `AUTH_LIST_USERS` receive to `BaseIpcResponse<SafeUser[]>`.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck:node`
Expected: errors now only in the handlers (Task 7) and renderer (Tasks 9-13). The interface files compile.

- [ ] **Step 6: Commit**

```bash
git add src/main/core/interface/ipc.ts src/main/core/interface/types/auth.ts src/main/core/interface/types/workspace.ts
git commit -m "feat: 인증 IPC 채널/페이로드 + SafeUser + WorkspaceStatusResponse 변경"
```

---

## Task 7: Handlers — login / setup / logout / session + connect rework + member/delete

**Files:**
- Create: `src/main/handler/auth/LoginHandler.ts`, `SetupAdminHandler.ts`, `LogoutHandler.ts`, `SessionStatusHandler.ts`
- Modify: `src/main/handler/auth/CreateMemberHandler.ts`, `DeleteUserHandler.ts`, `src/main/handler/auth/index.ts`
- Modify: `src/main/handler/workspace/ConnectWorkspaceHandler.ts`, `WorkspaceStatusHandler.ts`
- Modify: `src/main/core/database/adapter/PostgresAdapter.ts`, `adapter/DatabaseAdapter.ts`

This task is the wiring core. Implement in this order. **Do Step 1 (the `@/auth` alias) FIRST** — every later step imports from `@/auth/*` and will fail to typecheck without it.

- [ ] **Step 1: Add the `@/auth` path alias (do this before anything that imports `@/auth/*`)**

In `electron.vite.config.ts`, in the **main** process `resolve.alias` object, add the `@/auth` entry alongside the existing ones (insert in the same style as the neighbors, e.g. right before `'@/base'`):
```ts
'@/auth': resolve('src/main/core/auth'),
```
In `tsconfig.node.json`, add the matching entry to `compilerOptions.paths`:
```json
"@/auth/*": ["src/main/core/auth/*"],
```
Read both files first to match their exact existing formatting. After this step, `@/auth/password`, `@/auth/normalize`, `@/auth/session`, `@/auth/SessionManager`, `@/auth/safeUser` all resolve.

- [ ] **Step 2: Add a `toSafeUser` helper + advisory-lock constant**

Create `src/main/core/auth/safeUser.ts`:
```ts
import type { SafeUser, UserRecord } from '@/database/repository/interfaces/UserRepository'

// 비밀번호 해시를 제거해 렌더러로 안전하게 보낼 형태로 변환
export function toSafeUser(user: UserRecord): SafeUser {
  const { user_password_hash, ...safe } = user
  return safe
}

// 첫 관리자 시드 임계구역을 보호하는 advisory lock 키 (트랜잭션 스코프)
export const FIRST_ADMIN_LOCK_KEY = 481975
```

- [ ] **Step 3: Remove `createRole`/`dropRole` from the adapter**

In `adapter/DatabaseAdapter.ts`, delete the two interface lines:
```ts
  createRole(roleName: string, password: string): Promise<void>
  dropRole(roleName: string): Promise<void>
```
In `adapter/PostgresAdapter.ts`, delete the `createRole` and `dropRole` method implementations (the only string-interpolated raw SQL). Leave `transaction`, `runMigrations`, `getConnection`, `connect`, `disconnect`, `isConnected` intact. Remove the now-unused `sql` import **only if** nothing else uses it (it is used by `runMigrations`? no — `migrate` is separate; check: `sql` was imported for `createRole`/`dropRole`'s `sql.raw`. After removal, if `sql` is unused, drop the import).

- [ ] **Step 4: Rewrite `CreateMemberHandler`** (full replacement — removes the `createRole` call and the old `dbRoleName`/`dbPassword` params)

```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { normalizeHandle } from '@/auth/normalize'
import { hashPassword } from '@/auth/password'
import { toSafeUser } from '@/auth/safeUser'
import { type CreateMemberParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateMemberHandler extends CoreBaseHandler<IpcChannel.AUTH_CREATE_MEMBER> {
  constructor() {
    super(IpcChannel.AUTH_CREATE_MEMBER)
  }

  async handler(params: CreateMemberParams) {
    const passwordHash = await hashPassword(params.initialPassword)
    const user = await this.repos.users.create({
      userId: CoreUtil.getUuid(),
      userSn: normalizeHandle(params.userSn),
      passwordHash,
      userName: params.userName,
      userEmail: params.userEmail ? normalizeHandle(params.userEmail) : null,
      userRole: params.userRole ?? 'member'
    })
    return { data: toSafeUser(user), error: null }
  }
}
```

(Imports use the `@/auth` alias added in Step 1.)

- [ ] **Step 5: Rewrite `DeleteUserHandler` (drop ROLE) + sanitize `UpdateUserHandler` / `ListUsersHandler`**

`DeleteUserHandler.ts` — drop the `dropRole` call:
```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type AuthDeleteUserParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteUserHandler extends CoreBaseHandler<IpcChannel.AUTH_DELETE_USER> {
  constructor() {
    super(IpcChannel.AUTH_DELETE_USER)
  }

  async handler(params: AuthDeleteUserParams) {
    await this.repos.users.delete(params.id)
    return { data: null, error: null }
  }
}
```

**Critical (no hash leak):** `UpdateUserHandler` and `ListUsersHandler` currently return the raw `UserRecord` (now containing `user_password_hash`), but their IPC payloads changed to `SafeUser`/`SafeUser[]` in Task 6. Strip the hash with `toSafeUser`.

`UpdateUserHandler.ts` — change the return:
```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { toSafeUser } from '@/auth/safeUser'
import { type AuthUpdateUserParams, IpcChannel } from '@/interface/CoreInterface'

export class UpdateUserHandler extends CoreBaseHandler<IpcChannel.AUTH_UPDATE_USER> {
  constructor() {
    super(IpcChannel.AUTH_UPDATE_USER)
  }

  async handler(params: AuthUpdateUserParams) {
    const user = await this.repos.users.update(params.userId, {
      userName: params.userName,
      userAvatarPath: params.userAvatarKey ?? null
    })
    return { data: toSafeUser(user), error: null }
  }
}
```

`ListUsersHandler.ts` — map through `toSafeUser`:
```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { toSafeUser } from '@/auth/safeUser'
import { IpcChannel } from '@/interface/CoreInterface'

export class ListUsersHandler extends CoreBaseHandler<IpcChannel.AUTH_LIST_USERS> {
  constructor() {
    super(IpcChannel.AUTH_LIST_USERS)
  }

  async handler() {
    const users = await this.repos.users.findAll()
    return { data: users.map(toSafeUser), error: null }
  }
}
```

- [ ] **Step 6: `LoginHandler`**

```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { normalizeHandle } from '@/auth/normalize'
import { verifyPassword } from '@/auth/password'
import { toSafeUser } from '@/auth/safeUser'
import { createSessionRecord } from '@/auth/session'
import { SessionManager } from '@/auth/SessionManager'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode, IpcChannel, type LoginParams } from '@/interface/CoreInterface'

export class LoginHandler extends CoreBaseHandler<IpcChannel.AUTH_LOGIN> {
  constructor() {
    super(IpcChannel.AUTH_LOGIN)
  }

  async handler(params: LoginParams) {
    const sn = normalizeHandle(params.userSn)
    const user = await this.repos.users.findBySn(sn)
    // 사용자 열거 방지를 위해 미존재/오답/비활성 모두 동일한 일반 오류
    const ok = user ? await verifyPassword(params.password, user.user_password_hash) : false
    if (!user || !ok || user.user_status === 'inactive') {
      throw new DatabaseError(ErrorCode.AUTH_ERROR, '아이디 또는 비밀번호가 올바르지 않습니다.', null)
    }
    const session = createSessionRecord({ user_id: user.user_id, user_sn: user.user_sn }, params.rememberMe ?? false, Date.now())
    SessionManager.getInstance().save(session)
    return { data: toSafeUser(user), error: null }
  }
}
```

> `verifyPassword` runs only when `user` is non-null (guarded by `user ? ... : false`), so a missing user fails fast without a hash comparison. The generic error message covers missing-user / wrong-password / inactive alike to prevent user enumeration.

- [ ] **Step 7: `SetupAdminHandler`** (advisory-lock-guarded first-admin seed)

```ts
import { sql } from 'drizzle-orm'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { normalizeHandle } from '@/auth/normalize'
import { hashPassword } from '@/auth/password'
import { FIRST_ADMIN_LOCK_KEY, toSafeUser } from '@/auth/safeUser'
import { createSessionRecord } from '@/auth/session'
import { SessionManager } from '@/auth/SessionManager'
import type { DrizzleTx } from '@/database/repository/drizzle/executor'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode, IpcChannel, type SetupAdminParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class SetupAdminHandler extends CoreBaseHandler<IpcChannel.AUTH_SETUP_ADMIN> {
  constructor() {
    super(IpcChannel.AUTH_SETUP_ADMIN)
  }

  async handler(params: SetupAdminParams) {
    const passwordHash = await hashPassword(params.password)
    const userId = CoreUtil.getUuid()

    const user = await this.repos.db.transaction(async (tx) => {
      // 트랜잭션 스코프 advisory lock — 커밋/롤백 시 자동 해제, 동시 시드 직렬화
      await (tx as DrizzleTx).execute(sql`SELECT pg_advisory_xact_lock(${FIRST_ADMIN_LOCK_KEY})`)
      const existing = await this.repos.users.count(tx)
      if (existing > 0) {
        throw new DatabaseError(ErrorCode.OPERATION_FAILED_ERROR, '이미 관리자 계정이 존재합니다.', null)
      }
      return this.repos.users.create(
        {
          userId,
          userSn: normalizeHandle(params.userSn),
          passwordHash,
          userName: params.userName,
          userEmail: params.userEmail ? normalizeHandle(params.userEmail) : null,
          userRole: 'admin'
        },
        tx
      )
    })

    const session = createSessionRecord({ user_id: user.user_id, user_sn: user.user_sn }, false, Date.now())
    SessionManager.getInstance().save(session)
    return { data: toSafeUser(user), error: null }
  }
}
```

> `this.repos.db` is the `DatabaseAdapter`; `transaction(fn)` passes a drizzle `tx` typed as `unknown` at the adapter boundary. Cast it to `DrizzleTx` (the real pg transaction type from `executor.ts`, which exposes `.execute()` for raw SQL — the same `.execute(sql\`...\`)` API `PostgresAdapter` uses elsewhere). The `tx` is also passed to `repos.users.count(tx)` / `create(data, tx)`, which accept `RepoExecutor` (= `unknown`) — matching Phase 2's executor pattern. `pg_advisory_xact_lock` auto-releases on commit/rollback.

- [ ] **Step 8: `LogoutHandler`**

```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { SessionManager } from '@/auth/SessionManager'
import { IpcChannel } from '@/interface/CoreInterface'

export class LogoutHandler extends CoreBaseHandler<IpcChannel.AUTH_LOGOUT> {
  constructor() {
    super(IpcChannel.AUTH_LOGOUT)
  }

  async handler() {
    SessionManager.getInstance().clear()
    return { data: true, error: null }
  }
}
```

- [ ] **Step 9: `SessionStatusHandler`** (bootstrap re-verify)

```ts
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { toSafeUser } from '@/auth/safeUser'
import { isExpired } from '@/auth/session'
import { SessionManager } from '@/auth/SessionManager'
import { IpcChannel } from '@/interface/CoreInterface'

export class SessionStatusHandler extends CoreBaseHandler<IpcChannel.AUTH_SESSION_STATUS> {
  constructor() {
    super(IpcChannel.AUTH_SESSION_STATUS)
  }

  async handler() {
    const mgr = SessionManager.getInstance()
    const session = mgr.load()
    if (!session || isExpired(session, Date.now())) {
      mgr.clear()
      return { data: { authenticated: false, user: null }, error: null }
    }
    // 사용자 존재 + 활성 재검증
    const user = await this.repos.users.findById(session.userId)
    if (!user || user.user_status === 'inactive') {
      mgr.clear()
      return { data: { authenticated: false, user: null }, error: null }
    }
    return { data: { authenticated: true, user: toSafeUser(user) }, error: null }
  }
}
```

> `SessionStatusHandler` reads `this.repos` — but bootstrap may run before connect (no RepositoryContainer). `this.repos` throws if uninitialized. The renderer must only call `AUTH_SESSION_STATUS` **after** `WORKSPACE_STATUS` reports `connected: true` (see Task 9). The handler still guards: if `repos` would throw, that surfaces as an IPC error and the renderer treats it as unauthenticated.

- [ ] **Step 10: Rework `ConnectWorkspaceHandler`** (remove auto-admin; report `needsSetup`)

Replace the block at lines 79-101 (the `let user = await userRepo.findByDbRole(...)` lookup, the `isFirstLogin` auto-create `if` block, and the old `{ connected, user, isFirstLogin }` return) with:
```ts
    // Phase 3: 연결 시 자동 admin 생성 제거. users 비어있으면 setup 필요.
    const userCount = await userRepo.count()

    return {
      data: {
        connected: true,
        needsSetup: userCount === 0
      },
      error: null
    }
```
**Remove the `import { CoreUtil } from '@/util/CoreUtil'` line** — its only use in this file was the removed auto-create block (`CoreUtil.getUuid()`). The repository instantiations (`new DrizzleXRepository(db)`) do not use it. Keep everything from `adapter.connect(...)` through `container.initialize(...)` unchanged.

- [ ] **Step 11: Update `WorkspaceStatusHandler`** (full rewrite to the new response shape)

Read its current content first. It returns a `WorkspaceStatusResponse` (which changed in Task 6 to `{ connected, needsSetup }`). Update it to return `{ connected, needsSetup }`:
- `connected` = `RepositoryContainer.getInstance().isInitialized`.
- `needsSetup` = when connected, `await this.repos.users.count() === 0`; when not connected, `false`.
Example body:
```ts
  async handler() {
    const container = RepositoryContainer.getInstance()
    if (!container.isInitialized) {
      return { data: { connected: false, needsSetup: false }, error: null }
    }
    const count = await container.users.count()
    return { data: { connected: true, needsSetup: count === 0 }, error: null }
  }
```
(Adjust imports to match the file's existing style — read it first.)

- [ ] **Step 12: Register the new handlers in `auth/index.ts`**

`src/main/handler/auth/index.ts` re-exports handler classes (initHandler instantiates every exported class). It currently exports `CreateMemberHandler`, `DeleteUserHandler`, `ListUsersHandler`, `UpdateUserHandler`. Add the four new ones:
```ts
export { LoginHandler } from './LoginHandler'
export { LogoutHandler } from './LogoutHandler'
export { SessionStatusHandler } from './SessionStatusHandler'
export { SetupAdminHandler } from './SetupAdminHandler'
```
Verify (PowerShell): `Select-String -Path src/main/handler/auth/index.ts -Pattern 'LoginHandler|SetupAdminHandler|LogoutHandler|SessionStatusHandler' | Measure-Object | Select-Object -ExpandProperty Count` → expect `4`.

- [ ] **Step 13: Typecheck the whole main process**

Run: `pnpm typecheck:node`
Expected: **no errors**. Then confirm no dead references remain (PowerShell): `Select-String -Path src/main -Pattern 'findByDbRole|createRole|dropRole' | Where-Object { $_.Path -notmatch '\.test\.' } | Measure-Object | Select-Object -ExpandProperty Count` → must be `0`.

- [ ] **Step 14: Lint + commit**

Run: `pnpm exec biome check src/main/handler/auth src/main/handler/workspace src/main/core/auth src/main/core/database/adapter`
```bash
git add src/main/handler/auth src/main/handler/workspace/ConnectWorkspaceHandler.ts src/main/handler/workspace/WorkspaceStatusHandler.ts src/main/core/auth/safeUser.ts src/main/core/database/adapter/PostgresAdapter.ts src/main/core/database/adapter/DatabaseAdapter.ts electron.vite.config.ts tsconfig.node.json
git commit -m "feat: 로그인/셋업/로그아웃/세션 핸들러 + 연결 시 needsSetup, ROLE 생성 제거"
```
(The `git add src/main/handler/auth` covers the modified `CreateMemberHandler`, `DeleteUserHandler`, `UpdateUserHandler`, `ListUsersHandler`, `index.ts` and the four new handler files.)

---

## Task 8: DB integration tests (auth)

**Files:**
- Create: `src/main/core/auth/auth.integration.test.ts`

- [ ] **Step 1: Write the integration tests**

```ts
// src/main/core/auth/auth.integration.test.ts
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PostgresAdapter } from '../database/adapter/PostgresAdapter'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../database/__testutils__/pgTestDb'
import { DrizzleUserRepository } from '../database/repository/drizzle/DrizzleUserRepository'
import { hashPassword, verifyPassword } from './password'
import { normalizeHandle } from './normalize'

describe.runIf(process.env.RUN_DB_TESTS === '1')('auth integration', () => {
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

  it('auth migration created user_sn / user_password_hash / user_status', async () => {
    const repo = new DrizzleUserRepository(adapter.getConnection())
    expect(await repo.count()).toBe(0)
  })

  it('create + findBySn round-trips with normalized handle and verifiable password', async () => {
    const repo = new DrizzleUserRepository(adapter.getConnection())
    const passwordHash = await hashPassword('s3cret')
    await repo.create({
      userId: randomUUID(),
      userSn: normalizeHandle('  AdminUser '),
      passwordHash,
      userName: 'Admin',
      userRole: 'admin'
    })
    const found = await repo.findBySn('adminuser')
    expect(found).not.toBeNull()
    expect(found?.user_role).toBe('admin')
    expect(await verifyPassword('s3cret', found!.user_password_hash)).toBe(true)
    expect(await verifyPassword('wrong', found!.user_password_hash)).toBe(false)
  })

  it('user_sn UNIQUE prevents duplicates', async () => {
    const repo = new DrizzleUserRepository(adapter.getConnection())
    const passwordHash = await hashPassword('x')
    const sn = normalizeHandle('dupe')
    await repo.create({ userId: randomUUID(), userSn: sn, passwordHash, userRole: 'member' })
    await expect(repo.create({ userId: randomUUID(), userSn: sn, passwordHash, userRole: 'member' })).rejects.toThrow()
  })
})
```

- [ ] **Step 2: Run (DB-gated)**

Run (PowerShell, requires `pnpm docker:up` + fresh DB — the harness creates throwaway DBs so no manual reset needed here):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test -- src/main/core/auth/auth.integration.test.ts
```
Expected: PASS (3 tests). If Docker is unavailable, the suite SKIPS (acceptable locally; CI runs it).

- [ ] **Step 3: Commit**

```bash
git add src/main/core/auth/auth.integration.test.ts
git commit -m "test: 인증 마이그레이션/리포지토리 통합 테스트 (DB-gated)"
```

---

## Task 9: Renderer — auth store session layer

**Files:**
- Modify: `src/renderer/src/types/auth.ts`, `src/renderer/src/stores/auth.ts`

- [ ] **Step 1: Extend `AuthState` (renderer types)**

In `types/auth.ts`, add to `AuthState`:
```ts
  isAuthenticated: boolean
  needsSetup: boolean
  setAuthenticated: (v: boolean) => void
  setNeedsSetup: (v: boolean) => void
  logout: () => Promise<void>
```
(Keep all existing fields. `User` already comes from `@/interface/CoreInterface`, now aliased to `SafeUser`.)

- [ ] **Step 2: Update the store**

In `stores/auth.ts`:
- Add `isAuthenticated: false` and `needsSetup: false` to the initial state.
- Add setters `setAuthenticated`, `setNeedsSetup`.
- Add `logout`:
```ts
      logout: async () => {
        try {
          await window.callApi(IpcChannel.AUTH_LOGOUT)
        } finally {
          set({ user: null, isAuthenticated: false })
        }
      },
```
- In `disconnect` and `reset`, also clear `isAuthenticated: false` and `needsSetup: false`.
- Rewrite `bootstrap` to sync connection **and** session:
```ts
      bootstrap: async () => {
        try {
          const status = await window.callApi(IpcChannel.WORKSPACE_STATUS)
          const connectedInMain = status?.data?.connected === true
          const needsSetup = status?.data?.needsSetup === true

          if (!connectedInMain) {
            set({ user: null, isConnected: false, isAuthenticated: false, needsSetup: false, currentWorkspace: null })
            return
          }

          // 연결됨 → 세션 재검증
          const session = await window.callApi(IpcChannel.AUTH_SESSION_STATUS)
          const authed = session?.data?.authenticated === true
          set({
            isConnected: true,
            needsSetup,
            isAuthenticated: authed,
            user: authed ? (session?.data?.user ?? null) : null
          })
        } catch (error) {
          console.error('[auth.bootstrap] failed to sync with main', error)
          set({ user: null, isConnected: false, isAuthenticated: false, needsSetup: false, currentWorkspace: null })
        } finally {
          set({ isBootstrapped: true })
        }
      }
```
- Update `partialize` to also persist `isAuthenticated` and `needsSetup`.
- **Delete the `onRehydrateStorage` option entirely** from the persist config. The current code (`onRehydrateStorage: () => (state) => { if (state?.isConnected && !state.user) state.disconnect() }`) races with the new session bootstrap. `bootstrap()` runs on app mount and is now the single source of truth: it calls `WORKSPACE_STATUS` and, if connected, `AUTH_SESSION_STATUS`, then sets `isConnected`/`isAuthenticated`/`user` — reconciling any stale persisted state. So `onRehydrateStorage` is removed, not replaced.

- [ ] **Step 3: Typecheck (web) + commit**

Run: `pnpm typecheck:web`
Expected: errors remain only in routes/pages (Tasks 10-12). Store + types compile.
```bash
git add src/renderer/src/types/auth.ts src/renderer/src/stores/auth.ts
git commit -m "feat: 인증 스토어에 세션 레이어(isAuthenticated/needsSetup) + bootstrap 재검증"
```

---

## Task 10: Renderer — routes + guard rework

**Files:**
- Modify: `src/renderer/src/routers/routes.tsx`, `src/renderer/src/routers/routerContext.ts`

- [ ] **Step 1: Extend `RouterContext` and the place that builds it**

`routerContext.ts` defines its own explicit `auth` interface (currently `{ isConnected, user, disconnect }`). Replace it with the new shape:
```ts
import type { User } from '@/interface/CoreInterface'

export interface RouterContext {
  auth: {
    isConnected: boolean
    isAuthenticated: boolean
    needsSetup: boolean
    user: User | null
    disconnect: () => void
  }
}
```
Then find where this context is constructed and passed to the router (search: `Select-String -Path src/renderer/src -Pattern 'context=\{\{|RouterProvider|InnerApp'`). Wherever the `auth` context object is built from the store (e.g. in `main.tsx`/`App`), add `isAuthenticated` and `needsSetup` from `useAuthStore` so the guards in Steps 2-4 can read them. Verify with `pnpm typecheck:web` after editing.

- [ ] **Step 2: Rework `authenticatedRoute.beforeLoad`**

In `routes.tsx`, replace the `authenticatedRoute` `beforeLoad`:
```ts
  beforeLoad: ({ context }) => {
    const { isConnected, isAuthenticated, needsSetup } = context.auth
    if (!isConnected) {
      throw redirect({ to: '/workspace' })
    }
    if (!isAuthenticated) {
      throw redirect({ to: needsSetup ? '/setup' : '/login' })
    }
  },
```

- [ ] **Step 3: Add `/login` and `/setup` routes (connected-but-unauthenticated)**

```ts
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: ({ context }) => {
    const { isConnected, isAuthenticated, needsSetup } = context.auth
    if (!isConnected) throw redirect({ to: '/workspace' })
    if (isAuthenticated) throw redirect({ to: '/' })
    if (needsSetup) throw redirect({ to: '/setup' })
  },
  component: lazyRoute(() => import('@/components/pages/LoginPage'))
})

export const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/setup',
  beforeLoad: ({ context }) => {
    const { isConnected, isAuthenticated, needsSetup } = context.auth
    if (!isConnected) throw redirect({ to: '/workspace' })
    if (isAuthenticated) throw redirect({ to: '/' })
    if (!needsSetup) throw redirect({ to: '/login' })
  },
  component: lazyRoute(() => import('@/components/pages/AdminSetupPage'))
})
```

- [ ] **Step 4: Update `workspaceRoute` guard + route tree**

`workspaceRoute.beforeLoad`: redirect to `/` only when `isConnected && isAuthenticated`:
```ts
  beforeLoad: ({ context }) => {
    const { isConnected, isAuthenticated } = context.auth
    if (isConnected && isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
```
Add `loginRoute` and `setupRoute` to the `routeTree` `rootRoute.addChildren([...])` array (siblings of `workspaceRoute`):
```ts
export const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([ /* ...unchanged... */ ]),
  workspaceRoute,
  loginRoute,
  setupRoute
])
```

- [ ] **Step 5: Typecheck (web)**

Run: `pnpm typecheck:web`
Expected: errors only about the not-yet-created `LoginPage`/`AdminSetupPage` (Task 11). Route wiring compiles otherwise.

- [ ] **Step 6: Commit**

```bash
git add src/renderer/src/routers/routes.tsx src/renderer/src/routers/routerContext.ts
git commit -m "feat: /login·/setup 라우트 + 연결·인증 기반 가드 재구성"
```

---

## Task 11: Renderer — AuthLayout + LoginPage + AdminSetupPage (split brand panel)

**Files:**
- Create: `src/renderer/src/components/templates/AuthLayout.tsx`, `src/renderer/src/components/pages/LoginPage.tsx`, `src/renderer/src/components/pages/AdminSetupPage.tsx`

The split brand-panel layout (direction **B**) is the app's UX baseline. Use existing atoms (`Button`, `Input`, `Label`, `Card`) and design tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border`). Use `useIpcHandler` (see `WorkspacePage`) and `sonner` `toast` for errors.

- [ ] **Step 1: `AuthLayout` (shared shell)**

```tsx
// src/renderer/src/components/templates/AuthLayout.tsx
import type { ReactNode } from 'react'

// 좌측 브랜드 패널 + 우측 폼. 인증 화면(로그인/셋업)의 공통 셸이자 앱 UX 기준 레이아웃.
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      {/* Brand panel */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-zinc-900 p-10 text-zinc-50'>
        <div className='flex size-9 items-center justify-center rounded-lg bg-zinc-50 font-bold text-zinc-900'>H</div>
        <div className='space-y-2'>
          <div className='text-2xl font-bold'>Hydra</div>
          <p className='text-sm leading-relaxed text-zinc-400'>가볍고 빠른 이슈·프로젝트 관리</p>
        </div>
        <div className='text-xs text-zinc-600'>v3 workspace</div>
      </div>
      {/* Form panel */}
      <div className='flex w-full items-center justify-center bg-background p-6 md:w-1/2'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold text-foreground'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `LoginPage`**

```tsx
// src/renderer/src/components/pages/LoginPage.tsx
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { useIpcHandler } from '@/hooks/use-ipc'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useIpcHandler(IpcChannel.AUTH_LOGIN)
  const { setUser, setAuthenticated } = useAuthStore()
  const [userSn, setUserSn] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await login({ userSn, password, rememberMe })
      if (result.data) {
        setUser(result.data)
        setAuthenticated(true)
        navigate({ to: '/' })
      } else {
        toast.error(result.error?.message ?? '로그인에 실패했습니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title='로그인' subtitle='계정으로 계속'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1.5'>
          <Label htmlFor='userSn'>아이디</Label>
          <Input id='userSn' value={userSn} onChange={(e) => setUserSn(e.target.value)} autoFocus />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>비밀번호</Label>
          <Input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <label className='flex items-center gap-2 text-sm text-muted-foreground'>
          <input type='checkbox' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          로그인 유지 (30일)
        </label>
        <Button type='submit' className='w-full' disabled={submitting || !userSn || !password}>
          {submitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </AuthLayout>
  )
}
```

- [ ] **Step 3: `AdminSetupPage`**

```tsx
// src/renderer/src/components/pages/AdminSetupPage.tsx
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { useIpcHandler } from '@/hooks/use-ipc'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

export default function AdminSetupPage() {
  const navigate = useNavigate()
  const setupAdmin = useIpcHandler(IpcChannel.AUTH_SETUP_ADMIN)
  const { setUser, setAuthenticated, setNeedsSetup } = useAuthStore()
  const [form, setForm] = useState({ userSn: '', userName: '', userEmail: '', password: '', confirm: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }
    setSubmitting(true)
    try {
      const result = await setupAdmin({
        userSn: form.userSn,
        userName: form.userName,
        userEmail: form.userEmail || undefined,
        password: form.password
      })
      if (result.data) {
        setUser(result.data)
        setAuthenticated(true)
        setNeedsSetup(false)
        navigate({ to: '/' })
      } else {
        toast.error(result.error?.message ?? '관리자 설정에 실패했습니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title='관리자 계정 만들기' subtitle='이 워크스페이스의 첫 관리자 계정을 설정하세요'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1.5'>
          <Label htmlFor='userSn'>아이디</Label>
          <Input id='userSn' value={form.userSn} onChange={(e) => setForm({ ...form, userSn: e.target.value })} autoFocus />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='userName'>이름</Label>
          <Input id='userName' value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='userEmail'>이메일 (선택)</Label>
          <Input id='userEmail' type='email' value={form.userEmail} onChange={(e) => setForm({ ...form, userEmail: e.target.value })} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>비밀번호</Label>
          <Input id='password' type='password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='confirm'>비밀번호 확인</Label>
          <Input id='confirm' type='password' value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <Button type='submit' className='w-full' disabled={submitting || !form.userSn || !form.userName || !form.password}>
          {submitting ? '설정 중...' : '관리자 계정 만들기'}
        </Button>
      </form>
    </AuthLayout>
  )
}
```

- [ ] **Step 4: Wire i18n (app convention)**

The app uses `react-i18next` with per-namespace files (e.g. `WorkspacePage` uses `useTranslation('workspace')`, `MembersPage` uses `useTranslation('member')`). The hardcoded Korean strings in the page code above are shown for structural clarity — replace them with translation keys following the existing pattern:
1. Read `src/renderer/src/locales/index.ts` and an existing namespace file (e.g. the `workspace` namespace) to learn the exact file layout and language set (ko/en).
2. Add an `auth` namespace mirroring that layout, with keys for: login title/subtitle/userId/password/rememberMe/submit/submitting, and setup title/subtitle/userId/name/email/password/confirm/submit/submitting/passwordMismatch, plus error fallbacks (`loginFailed`, `setupFailed`).
3. In `LoginPage`/`AdminSetupPage`, add `const { t } = useTranslation('auth')` and replace each literal string with `t('login.title')` etc. Register the namespace in `locales/index.ts` the same way the others are registered.

(If introducing a full namespace is disproportionate for the team's current i18n coverage, at minimum route the strings through the existing `common` namespace where keys already exist; do NOT leave a mix of `t()` and stray literals in these baseline screens.)

- [ ] **Step 5: Typecheck (web) + lint**

Run: `pnpm typecheck:web` (no errors) and `pnpm exec biome check src/renderer/src/components/pages/LoginPage.tsx src/renderer/src/components/pages/AdminSetupPage.tsx src/renderer/src/components/templates/AuthLayout.tsx`.
> Verified during research: `useIpcHandler(channel)` returns a callable `(request?) => Promise<IpcResponse>` whose result is `{ data, error }` — matches the usage above. `Button` accepts native `disabled`; `Label` accepts `htmlFor`; `Input` accepts `id`/`type`/`value`/`onChange`. If any atom's real API differs, follow it.

- [ ] **Step 6: Commit**

```bash
git add src/renderer/src/components/templates/AuthLayout.tsx src/renderer/src/components/pages/LoginPage.tsx src/renderer/src/components/pages/AdminSetupPage.tsx src/renderer/src/locales
git commit -m "feat: 분할 패널 로그인/관리자 셋업 화면 + i18n (앱 UX 기준 레이아웃)"
```

---

## Task 12: Renderer — WorkspacePage connect flow

**Files:**
- Modify: `src/renderer/src/components/pages/WorkspacePage.tsx` (handleConnect, lines 64-88)

- [ ] **Step 1: Route to /setup or /login after connect**

Replace `handleConnect`'s success block — connect no longer returns a user; it returns `needsSetup`:
```tsx
  const handleConnect = async (ws: WorkspaceConfig) => {
    setConnecting(true)
    try {
      const result = await connectWorkspace({
        host: ws.host,
        port: ws.port,
        dbName: ws.dbName,
        username: ws.username,
        password,
        sslCertPath: ws.sslCertPath
      })
      if (result.data) {
        setConnected(true)
        setCurrentWorkspace(ws)
        setNeedsSetup(result.data.needsSetup)
        toast.success(t('toast.connected'))
        navigate({ to: result.data.needsSetup ? '/setup' : '/login' })
      } else {
        toast.error(result.error?.message ?? tc('toast.error'))
      }
    } finally {
      setConnecting(false)
      setPassword('')
      setShowPassword(false)
      setSelectedWs(null)
    }
  }
```
Update the destructure on line 21 to pull `setNeedsSetup` and drop `setUser`:
```tsx
  const { setConnected, setCurrentWorkspace, setNeedsSetup } = useAuthStore()
```
(`tc('toast.error')` — if that i18n key doesn't exist, use a literal Korean string `'연결에 실패했습니다.'`.)

- [ ] **Step 2: Typecheck (web) + lint + commit**

Run: `pnpm typecheck:web` (no errors), `pnpm exec biome check src/renderer/src/components/pages/WorkspacePage.tsx`
```bash
git add src/renderer/src/components/pages/WorkspacePage.tsx
git commit -m "feat: 연결 후 needsSetup 따라 /setup·/login 으로 라우팅 (자동 로그인 제거)"
```

---

## Task 13: Renderer — MembersPage member-creation update

**Files:**
- Modify: `src/renderer/src/components/pages/MembersPage.tsx`

`MembersPage` still builds and sends the old `CreateMemberParams` (`dbRoleName`/`dbPassword`) via `AUTH_CREATE_MEMBER`. Task 6 changed that payload to `{ userSn, userName, userEmail, initialPassword, userRole }`, so the member-creation UI must change or it breaks at typecheck/runtime.

- [ ] **Step 1: Remove the DB-role machinery, add `userSn`, rename password**

In `MembersPage.tsx`:
- Delete the `generateDbRoleName` function (currently lines 16-22).
- In the add-member form state: delete `const [dbRoleName, setDbRoleName] = useState('')`; rename `dbPassword` → `initialPassword` (`const [initialPassword, setInitialPassword] = useState('')`); add `const [userSn, setUserSn] = useState('')`.
- Delete the `useEffect` that auto-generates `dbRoleName` from `userName` (currently lines 71-73).
- In `resetAddForm`, remove `setDbRoleName('')`; replace `setDbPassword('')` with `setInitialPassword('')`; add `setUserSn('')`.

- [ ] **Step 2: Update validation + the IPC call in `handleAddMember`**

Replace the validation + `window.callApi(IpcChannel.AUTH_CREATE_MEMBER, ...)` block so it validates `userSn` and sends the new params:
```tsx
    if (!userSn.trim()) {
      toast.error(t('validation.enterUserSn'))
      return
    }
    if (!userName.trim()) {
      toast.error(t('validation.enterName'))
      return
    }
    if (!userEmail.trim()) {
      toast.error(t('validation.enterEmail'))
      return
    }
    if (!initialPassword.trim()) {
      toast.error(t('validation.enterPassword'))
      return
    }

    setIsSubmitting(true)
    const result = await window.callApi(IpcChannel.AUTH_CREATE_MEMBER, {
      userSn: userSn.trim(),
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      initialPassword: initialPassword.trim(),
      userRole
    })
    setIsSubmitting(false)
```
(Add the `member.validation.enterUserSn` i18n key alongside the existing member-namespace validation keys.)

- [ ] **Step 3: Update the Add Member dialog form fields**

In the add-member `Dialog`:
- Add a `userSn` input as the first field (before name):
```tsx
            <div className='grid gap-2'>
              <Label htmlFor='userSn'>{t('label.userSn')}</Label>
              <Input id='userSn' placeholder={t('placeholder.userSn')} value={userSn} onChange={(e) => setUserSn(e.target.value)} />
            </div>
```
- **Delete the entire `dbRoleName` field block** (the `<div>` containing `Label htmlFor='dbRoleName'`, its `Input`, and the `help.dbRole` `<p>` — currently lines 277-286).
- Rename the password field: `htmlFor='dbPassword'` → `htmlFor='initialPassword'`, `id='dbPassword'` → `id='initialPassword'`, `value={dbPassword}` → `value={initialPassword}`, `onChange={... setDbPassword ...}` → `setInitialPassword`. Keep the `t('label.password')`/`t('placeholder.password')` keys (or rename to `label.initialPassword` if you add the key).
- Add `member.label.userSn` / `member.placeholder.userSn` i18n keys.

- [ ] **Step 4: Typecheck (web) + lint + commit**

Run: `pnpm typecheck:web` (no errors), `pnpm exec biome check src/renderer/src/components/pages/MembersPage.tsx`
```bash
git add src/renderer/src/components/pages/MembersPage.tsx src/renderer/src/locales
git commit -m "feat: MembersPage 멤버 생성 — user_sn + 초기 비밀번호 (DB ROLE 입력 제거)"
```

---

## Task 14: Full verification

- [ ] **Step 1: Full typecheck**

Run: `pnpm typecheck`
Expected: main + renderer both pass.

- [ ] **Step 2: Strict lint (CI parity)**

Run: `pnpm lint:ci`
Expected: **0 errors** (warnings OK). Fix any formatter mismatch: `pnpm exec biome check --write <file>` then commit.

- [ ] **Step 3: Full test suite + DB integration**

Run (PowerShell, requires `pnpm docker:up`):
```powershell
$env:RUN_DB_TESTS='1'; pnpm test
```
Expected: all suites pass — Phase 1/2 integration + Phase 3 unit (password/normalize/session) + Phase 3 auth integration.

- [ ] **Step 4: Manual dev smoke (fresh DB)**

```powershell
pnpm docker:down
docker volume rm hydra_hydra_data
pnpm docker:up
pnpm dev
```
Confirm: connect to workspace (enter DB password) → empty DB routes to **관리자 계정 만들기** (split-panel) → create admin → lands in app. Relaunch app → session restores (stays logged in). Log out (if wired) / clear session → routes to **로그인**. Wrong password → generic error. Create a member (admin) → log in as that member with the initial password.

- [ ] **Step 5: Commit any fixups**

```bash
git add -A
git commit -m "chore: Phase 3 인증 재설계 최종 정리"
```
(Only if fixups were needed; otherwise skip. Remember: stage specific paths, not `-A`, if CRLF noise is present — re-check `git status` first.)

---

## Notes / Risks

- **`ADD COLUMN ... NOT NULL` needs an empty `users` table.** Pre-release; dev resets the volume. The throwaway-DB integration harness always starts fresh. Production-data migration is explicitly out of scope (design §2).
- **`pg_advisory_xact_lock` over `pg_advisory_lock`:** transaction-scoped avoids the pooled-connection footgun (acquire and release could otherwise land on different pooled connections). Drizzle's `transaction()` runs on a single connection, so the lock is held across the count+insert and auto-released on commit/rollback.
- **`SessionStatus` before connect:** the renderer only calls it after `WORKSPACE_STATUS` reports connected; the handler's `this.repos` access would otherwise throw and is treated as unauthenticated.
- **Password hash isolation:** every auth IPC response returns `SafeUser` via `toSafeUser`; `user_password_hash` never crosses the IPC boundary.
- **`@/auth` alias:** added to both `electron.vite.config.ts` (runtime) and `tsconfig.node.json` (typecheck) — both are required or builds/typecheck diverge.
- **MySQL adapter, `user_db_role` drop, forced password reset, password self-service** remain out of scope (Phases 4-5+).

---

## Self-Review

**Spec coverage (design §1-§9):**
- §2.1 clean schema NOT NULL: Task 4. ✅
- §2.2 username identifier + normalization: Tasks 2, 5, 7. ✅
- §2.3 no forced change / §2.4 session TTL: Task 2 (`SESSION_TTL_MS`). ✅
- §2.5 deprecate `user_db_role`, remove createRole/dropRole: Tasks 5, 7. ✅
- §2.6 split-panel UI: Task 11. ✅
- §3.1 password/normalize/session: Tasks 1-3. ✅
- §3.2 columns + migration: Task 4. ✅
- §3.3 repository (findBySn/count/create): Task 5. ✅
- §3.4 connect→migrate→advisory-lock→state: Tasks 7 (connect needsSetup; advisory xact lock in SetupAdmin). ✅
- §3.5 IPC handlers + member/delete rework: Tasks 6, 7. ✅
- §3.6 renderer store/routes/pages: Tasks 9-13 (store 9, routes/guard 10, login/setup pages 11, WorkspacePage connect 12, MembersPage onboarding 13). ✅
- §4 data flow / §5 error handling (generic auth error, setup race): Task 7. ✅
- §5.6 member onboarding (admin sets initial password, no ROLE): Task 7 (handler) + Task 13 (UI). ✅
- §6 security: parameterized only + remove raw-SQL createRole/dropRole (Task 7 Step 3); **no hash leak** — `SafeUser` on every auth IPC response incl. `UpdateUserHandler`/`ListUsersHandler` (Task 7 Step 5); generic auth errors (Task 7 Step 6). ✅
- §7 testing (unit + DB-gated integration): Tasks 1-3, 8. ✅

**Placeholder scan:** Code shown for every code step. The research-backed reviews resolved earlier guardrail notes: `useIpcHandler` signature, `Button`/`Label`/`Input` props confirmed (Task 11 Step 5). The remaining "adjust to the real layout" notes (locale-file structure in Task 11 Step 4 / Task 13; the exact line ranges in MembersPage) are deliberate — they point at files the implementer reads and edits, with concrete target shapes given.

**Type consistency:** `SafeUser = Omit<UserRecord,'user_password_hash'>` defined in Task 5, used in Tasks 6/7/9. `CreateUserData` (userSn/passwordHash) consistent between Task 5 (interface), Task 5 (impl), Task 7 (handlers). `WorkspaceStatusResponse {connected,needsSetup}` consistent across Task 6 (type), Task 7 (connect/status handlers), Task 9 (bootstrap), Task 12 (WorkspacePage). `createSessionRecord`/`isExpired`/`SESSION_TTL_MS` names match across Tasks 2, 7, 8. `normalizeHandle` consistent across Tasks 2, 5, 7, 8. `toSafeUser`/`FIRST_ADMIN_LOCK_KEY` from `@/auth/safeUser`; `DrizzleTx` from `executor.ts` used for the advisory-lock cast (Task 7 Step 7). `CreateMemberParams` (userSn/initialPassword) consistent across Task 6 (type) ↔ Task 7 Step 4 (handler) ↔ Task 13 (MembersPage). Channel names `AUTH_LOGIN/LOGOUT/SETUP_ADMIN/SESSION_STATUS` consistent (Task 6 enum ↔ Task 7 handlers ↔ Tasks 9-13 renderer).

**Adversarial-review pass:** This plan was checked by a 4-lens review workflow against the real codebase; its findings (routerContext explicit type, `UpdateUser`/`ListUsers` hash-stripping, MembersPage breakage, `@/auth` alias ordering, `onRehydrateStorage`, `DrizzleTx` cast, `LoginHandler` import) are folded in above.

---

## Execution Handoff

(Filled in after presenting to the user.)
