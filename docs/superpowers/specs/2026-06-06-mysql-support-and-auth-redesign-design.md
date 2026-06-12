# MySQL Support + Authentication Redesign — Design Spec

- **Date**: 2026-06-06
- **Status**: Approved (design); pending implementation plan
- **Author**: jujoycode (with Claude Code)
- **Branch target**: `feature/*` (new)

---

## 1. Summary

Make Hydra work on **both PostgreSQL and MySQL** (multi-DBMS, selectable per workspace at
connect time), and **replace the current authentication model** ("DB connection = auth /
member = PostgreSQL ROLE") with a **unified app-level local account login** (login ID +
password hash + persisted session) that works identically on both engines.

This spec incorporates the findings of a DBA-perspective design review (46 verified findings)
so that the cross-DBMS port does not silently break at runtime.

## 2. Locked Decisions

| # | Decision |
|---|----------|
| 1 | Support **both** PostgreSQL and MySQL. `WorkspaceConfig.dbms: 'postgresql' \| 'mysql'`, chosen at connect. |
| 2 | **App-level authentication, unified** for both engines. Remove `createRole`/`dropRole` and the DB-ROLE model entirely. |
| 3 | New auth = **local account login**: login ID (`user_sn`) + password (hashed) + persisted local session. |
| 4 | DB connection uses a **single shared service account** per workspace. **Credentials are NOT embedded in the invite** — the member enters the shared DB password once at connect (as today). The invite carries only `host/port/dbName/dbms`. |
| 5 | Login identifier = **new column `user_sn`** (unique, not null), distinct from the existing `user_id` UUID PK. |
| 6 | Session = **persisted via Electron `safeStorage`** for auto-login, with expiry + "remember me". |

## 3. Non-Goals

- Per-user DB-level privilege separation / DB-level audit (intentionally dropped with the ROLE model; see §9).
- A server/broker tier in front of the database (considered and rejected for offline-first; revisit later if true per-user DB authorization is needed).
- Encryption-at-rest for the `integrations` table secrets (pre-existing gap; noted but out of scope here).
- Migrating other DBMS engines beyond PostgreSQL and MySQL.

---

## 4. Architecture

### 4.1 Adapter & factory

```
ConnectWorkspaceHandler
  └─ createAdapter(config.dbms)              ← NEW factory
       ├─ PostgresAdapter   (pg     + schema.pg.ts)
       └─ MySqlAdapter      (mysql2 + schema.mysql.ts)   ← NEW
  └─ adapter.connect(config)
  └─ adapter.runMigrations()                ← NEW: real migrator (see §8), called on connect
  └─ RepositoryContainer.init(db, schema)   ← inject (db, schema)
       └─ ONE portable repository set (dialect-neutral)
```

- `DatabaseAdapter` interface is **simplified**: drop `createRole`/`dropRole`. Keep
  `connect`, `getConnection`, `transaction`, `runMigrations`, and error wrapping
  (`wrapPgError` / new `wrapMySqlError` mapping MySQL errno → the same business errors).
- Add `mysql2` dependency. Keep `pg`, `drizzle-orm`, `drizzle-kit`.

### 4.2 Dual schema strategy

- Two files: `schema.pg.ts` (`pgTable`, `uuid`) and `schema.mysql.ts` (`mysqlTable`).
- **Column-set parity test** (Vitest): assert both files define the same tables and the same
  column names, so they cannot drift silently.
- Type-mapping rules between the two files are defined in §6.2 (NOT a naive 1:1 copy).

### 4.3 Repository de-coupling

- Repositories currently hardcode `NodePgDatabase<typeof schema>` in their constructors
  (all 11 files). Change to a **dialect-neutral handle** (`db`) + injected `schema`.
- The repository implementations must use **only the portable subset** of the query builder
  (see §4.4). A single repository set serves both engines.

### 4.4 Cross-dialect query semantics — the portable repository base

These are the runtime-breaking divergences found in review. All must be handled in a shared
base, not per-call:

1. **No `.returning()`** (MySQL/mysql2 has no `RETURNING`; 20 call sites today).
   → Use **read-after-write**: UUID is already generated app-side, so `INSERT` (no
   `.returning()`), then `SELECT … WHERE id = <thatId>` and return that row. For `UPDATE`,
   capture the id from the WHERE clause and re-`SELECT`. Wrap insert/update + select in a
   transaction. Do **not** use `$returningId()` (does not work for app-supplied UUID PKs,
   and is unavailable on update).
2. **No `ilike()`** (pg-core only). → Replace with `lower(col) LIKE lower(?)`, valid and
   case-insensitive on both engines regardless of collation. Escape LIKE wildcards (`%`, `_`)
   in user input. Optionally route through an adapter `caseInsensitiveLike(col, pattern)`
   helper so the pg adapter can keep native `ilike`.
3. **Transactions thread the `tx` handle.** Today `CreateProjectHandler` opens a transaction
   but the callback ignores `tx` and the repos use their captured pool `db`, so writes run
   **outside** the BEGIN/COMMIT (a real atomicity bug on PG today; impossible to honor on
   MySQL with pooled connections). → `transaction(fn)` passes `tx`; write methods accept an
   optional executor (`create(data, executor = this.db)`) and the handler passes `tx`. **Never
   mix DDL into an app transaction on MySQL** (DDL auto-commits).
4. **Booleans / counts** are already handled by Drizzle codecs (TINYINT 0/1 → JS boolean,
   counts wrapped in `Number()`); no change required (review **refuted** these as problems).

---

## 5. Authentication Design

### 5.1 Connect flow (per workspace)

1. Member opens a saved workspace (or applies an invite carrying `host/port/dbName/dbms`).
2. Member enters the **shared DB service-account password** once (re-entered each connect, as
   today; never stored in the invite). Optionally cached via `safeStorage`.
3. App connects with the shared service account → runs `runMigrations()` → determines DB state
   (empty / old-schema / current; see §8).
4. App shows the **login screen** (local account). Member authenticates with `user_sn` +
   password against the `users` table.
5. On success, a session is created and persisted (§5.4).

### 5.2 Login

- Lookup: `where(eq(users.user_sn, normalize(input)))`, then verify password hash.
- **Normalize `user_sn` and `user_email`** (trim + lowercase) via one shared helper, applied at
  **both insert and lookup**, so uniqueness and auth are case-insensitive identically on both
  engines (avoids the MySQL CI-collation vs PG CS-collation divergence). Store the normalized
  form; keep a display name separately if needed.

### 5.3 Password hashing

- **Algorithm**: Node built-in `crypto.scrypt` (no native module / Electron rebuild pain),
  per-user random salt (≥16 bytes).
- **Parameters must be explicit and stored with the hash.** Node's default `maxmem` (32 MiB)
  makes `N=2^17` throw; pick parameters that fit (e.g. `N=2^15, r=8, p=1`) **and** pass an
  explicit `maxmem`. Store as a self-describing string:
  `scrypt$N=32768,r=8,p=1$<saltB64>$<hashB64>` so parameters can evolve without breaking old
  hashes.
- **Column**: `user_password_hash varchar(255)` (fixed-length encoded output; not `TEXT`).
  Use a **binary/ascii collation** for this column on MySQL so comparison is byte-exact and
  never collation-folded.

### 5.4 Session

- Opaque session record persisted via `safeStorage`: `{ userId, userSn, issuedAt, expiresAt }`.
- "Remember me" extends `expiresAt`; otherwise a shorter TTL.
- On app mount, `bootstrap()` reads the session, checks expiry, re-opens the DB connection, and
  **re-verifies the user row still exists and `user_status = 'active'`** before granting access.
- **`user_status` invalidation**: flipping a user to `inactive` is honored on the next
  bootstrap / sensitive operation (no server to push revocation; documented limitation — an
  in-flight session persists until relaunch or the next re-verify).

### 5.5 First-admin bootstrap

- The ROLE model's auto-create-admin-on-first-connect is removed. Replace with an explicit
  **setup flow**: when the app connects to a DB whose `users` table is empty, show a
  "create admin account" screen (set `user_sn` + password) instead of login. Guard the seeding
  against concurrent runs (§8.4).

### 5.6 Member onboarding

- Admin creates a member with `user_sn`, display fields, `user_role`, and an **initial
  password** (admin-set). Member logs in with it. (Optional, deferred: force password change on
  first login.)
- `CreateMemberHandler` no longer calls `createRole`; it only inserts the `users` row (with
  hashed initial password).

### 5.7 Least-privilege service account (GRANT contract)

The runtime app performs **no DDL** (migrations run via a separate path — see §8). Ship and
document the exact grant the workspace admin must create the service account with:

- **PostgreSQL** (not the DB owner): `CONNECT` on DB; `USAGE` on schema; `SELECT,INSERT,UPDATE,
  DELETE` on all tables; `USAGE` on sequences; `ALTER DEFAULT PRIVILEGES` so future tables stay
  reachable.
- **MySQL 8**: `GRANT SELECT,INSERT,UPDATE,DELETE ON workspace_db.*` — never `*.*`, never
  `ALL PRIVILEGES` (which includes DDL).
- Optionally, `ConnectWorkspaceHandler` probes that the account is non-owner / lacks DDL and
  warns otherwise.
- Schema creation/migration runs under a **separate higher-privileged migration role**, used
  out-of-band, not the runtime service account.

---

## 6. Data Model Changes

### 6.1 `users` table

| Column | Change | Notes |
|--------|--------|-------|
| `user_id` uuid PK | keep | internal id; see §6.2 for UUID generation change |
| **`user_sn`** | 🟢 ADD `varchar(255)` UNIQUE NOT NULL | normalized login handle |
| **`user_password_hash`** | 🟢 ADD `varchar(255)` NOT NULL | scrypt, binary/ascii collation (§5.3) |
| **`user_status`** | 🟢 ADD `varchar(20)` default `'active'` | `active` / `inactive`; wired into bootstrap + delete paths |
| `user_db_role` | 🔴 REMOVE (deprecate first) | do NOT drop until new login path proven (§8.3) |
| `user_name`, `user_email` | keep | display; `user_email` also normalized (§5.2) |
| `user_role` `'admin'\|'member'` | keep | app-level authorization gate |
| `user_created_at`, `user_updated_at` | keep | type rules per §6.2 |

### 6.2 Type-portability rules (`schema.mysql.ts` ≠ naive copy of `schema.pg.ts`)

1. **UUID PK** (decided): switch generation from `uuidv4()` to **`uuidv7()`** (already in
   `uuid@13`) so ids are time-ordered — avoids InnoDB clustered-index fragmentation on MySQL and
   helps PG index locality. **New rows use v7; existing v4 ids in already-populated PG workspaces
   are left as-is** (PKs are not rewritten — v4 and v7 coexist safely, only insert locality
   differs). Store the UUID as **`char(36)` with an `ascii_bin` collation** on MySQL (decided
   over `binary(16)`: simpler cross-DBMS parity, human-readable in DB tools, no app-side byte
   conversion; the larger index size is acceptable at this app's single-team desktop scale). PG
   keeps its native `uuid` type.
2. **Timestamps**: MySQL uses **`datetime({ fsp: 3 })`** (DATETIME — no 2038 limit, no implicit
   session-TZ conversion), **not** `timestamp()`. Set mysql2 connection `timezone: 'Z'`. Pin
   fractional precision to milliseconds on **both** engines (`timestamp({ precision: 3 })` on
   PG; consider PG `timestamptz` for unambiguous UTC round-trips). Standardize on **UTC**
   everywhere.
3. **UNIQUE text columns** must be **bounded `varchar`**, never `TEXT` (MySQL `ERROR 1170`).
   - `project_key` → `varchar(50)`-ish, keep UNIQUE (load-bearing: `ProjectValidator` does a
     count-then-insert TOCTOU, so the DB constraint is the only real duplicate guard).
   - `invite_codes.code` → it is **never queried** (`ApplyInviteHandler` decodes base64
     directly; no `findByCode`). **Drop the UNIQUE** (or move uniqueness to `invite_code_id`);
     keep the payload in a non-indexed column. (Also avoids the long-base64 prefix-collision
     problem.)
   - `user_sn` → `varchar(255)` (≤ 1020 bytes < 3072 limit; fine under DYNAMIC row format).
4. **Collation**: define login-handle / email semantics once via app-layer normalization
   (§5.2). For id and hash columns use binary/ascii collations.
5. **Defaults**: `.defaultNow()` / `.default('member')` etc. generate per-dialect DDL — verify
   each on MySQL; never add a `NOT NULL` column without a default to a populated table (§8.2).
6. **Secondary indexes**: the schema currently defines **none**. Add explicit indexes on the
   FK / filter columns repositories actually query (e.g. `issues.project_id`,
   `comments.issue_id`, `notifications.user_id`, `tasks.issue_id`, link-table FKs) — critical
   on MySQL where the clustered PK makes unindexed filters table-scan.

### 6.3 `WorkspaceConfig` + invite payload

- `WorkspaceConfig` gains `dbms: 'postgresql' | 'mysql'`.
- Invite payload gains `dbms`; **carries no DB credentials** (decision #4). Keep existing
  `host/port/dbName/expiresAt`. Invite expiry already round-trips UTC ISO correctly — no change.

---

## 7. Connection & Operations

- **Retry/backoff**: wrap the eager connect warm-up in bounded retries (e.g. 3 attempts,
  exponential backoff) for transient errno only (`ECONNRESET`/`ETIMEDOUT`/`EAI_AGAIN`); never
  retry auth/permission codes (`28P01`, `28000`, `42501`, `3D000`).
- **Timeouts**: set a statement/query timeout and connection-health policy so a hung query
  doesn't block IPC handlers indefinitely.
- **Pooling**: define explicit pool policy for both engines (the pg Pool currently uses
  defaults; MySQL needs its own).
- **Charset**: assert/verify `utf8mb4` on MySQL at connect (the app connects to a pre-existing
  DB and must not silently assume it).
- **Isolation**: default isolation differs (PG READ COMMITTED vs MySQL REPEATABLE READ); set an
  explicit isolation level for app transactions so behavior matches across engines.
- **SSL**: replicate the cert-path-based SSL config in the MySQL adapter; cleartext passwords to
  a remote DB are riskier now that one shared account exposes the whole workspace.

---

## 8. Migration Strategy

**The codebase has no migrator today** (`runMigrations()` is a no-op, no `drizzle/` output, no
version table; the only apply path is the destructive dev tool `drizzle-kit push`). This is a
new workstream and a prerequisite for everything else.

### 8.1 Build a real migrator

- `drizzle-kit generate` → versioned SQL into `drizzle/pg` and `drizzle/mysql`; **ship those SQL
  folders inside the packaged app** (electron-forge `extraResource`) so they exist at runtime.
- Implement `runMigrations()` in each adapter using drizzle-orm's `migrate()`
  (`drizzle-orm/node-postgres/migrator`, `drizzle-orm/mysql2/migrator`), which records applied
  versions in `__drizzle_migrations` and is safe to re-run.
- **Call `runMigrations()` in `ConnectWorkspaceHandler`** right after `connect()` and before any
  repo access (currently never called).
- **Never run `drizzle-kit push` against a user-owned DB.**
- Maintain the two migration histories deliberately; add a **CI job that runs the MySQL
  migration against a real MySQL 8.0 container** (the `ERROR 1170` / type failures only surface
  at DDL execution time, not at typecheck).

### 8.2 `users` columns — multi-step migration

A single `ALTER TABLE … ADD COLUMN … NOT NULL` (for `user_sn`, `user_password_hash`) fails on a
populated table (first connect already auto-created an admin row). Do it in steps:

1. Add columns **nullable** (or with a temporary sentinel).
2. **Backfill**: `user_sn` from an existing handle; `user_password_hash` left as a
   "must-reset" marker that drives a forced initial-password setup on next login.
3. Add the `NOT NULL` / `UNIQUE` constraints.

PG supports transactional DDL (wrap each migration in a transaction); **MySQL DDL auto-commits**
— guard MySQL migrations with per-statement idempotency checks and explicit failure recovery.

### 8.3 `user_db_role` deprecation

Dropping `user_db_role` is irreversible and it is the only key the current login path
(`findByDbRole`) uses. **Keep it until the new login path is implemented and proven**, then drop
in a later migration.

### 8.4 State detection + concurrency

- Use the version table to distinguish **empty** (full create) / **old schema** (auth
  migration) / **current** (nothing) — startup behavior depends on this.
- Guard concurrent startup migrations and first-admin seeding (multiple members/instances
  against the same shared account) with an **advisory lock** (PG `pg_advisory_lock`; MySQL
  `GET_LOCK`).

### 8.5 Backup / rollback

- Surface a **pre-migration backup recommendation** (`pg_dump` / `mysqldump`) since the target
  is user-owned production data.
- Provide down-migrations where feasible; document that MySQL has no transactional DDL so
  rollback is best-effort + restore-from-backup.

---

## 9. Security Considerations

- **No DB credentials in the invite** (decision #4) — eliminates the "anyone with the invite gets
  full DML" exposure.
- **Loss of DB-level per-user revocation/rotation/audit** is an accepted trade-off of the shared
  service account. Mitigate with: least-privilege grant (§5.7), `user_status` deactivation, and
  app-level `user_role` authorization. If true per-user DB authorization is later required,
  revisit a broker tier.
- **Password hash storage**: binary/ascii collation, explicit scrypt params stored with the hash.
- **Backups now contain password hashes**; the `integrations` table already stores Slack/GitHub
  secrets in plaintext (pre-existing). Note for a future at-rest-encryption effort (out of scope).
- **No dynamic SQL** in the new login path (parameterized Drizzle only); the removed
  `createRole`/`dropRole` were the only string-interpolated raw SQL.

---

## 10. Pre-existing Bug to Fix (independent of MySQL)

`CreateProjectHandler` opens a transaction whose callback ignores `tx`; the repos use the pool
`db`, so `create` + `linkUser` run **outside** the BEGIN/COMMIT. A `linkUser` failure leaves an
**orphaned project** with no rollback — a real atomicity bug on PostgreSQL today. Fix as part of
the transaction-threading change (§4.4.3); audit every multi-write handler the same way.

---

## 11. Testing Strategy

- Unit: password hashing (params round-trip, wrong-password rejection), `user_sn`/email
  normalization, session expiry + `user_status` invalidation.
- Repository portability: run the **same repository test suite against both** a real PostgreSQL
  and a real MySQL container (read-after-write, search/`lower-LIKE`, transactions/atomicity).
- Schema parity test (§4.2).
- Migration tests: fresh-create, old→new auth migration on a populated `users` table, idempotent
  re-run, concurrent-run lock.
- CI: real MySQL 8.0 + PostgreSQL containers; run migrations + the cross-engine suite.

---

## 12. Phasing (incremental)

1. **Foundation**: build the real migrator (§8.1), versioned SQL, version table, call on connect.
   Fix the transaction-threading bug (§10). No behavior change yet.
2. **Portable repositories**: remove `.returning()` (read-after-write), `ilike` → `lower-LIKE`,
   dialect-neutral `db` handle, secondary indexes, UUIDv7. Still PostgreSQL-only, but portable.
3. **Auth redesign**: `user_sn`/`user_password_hash`/`user_status`, login screen, scrypt,
   session, first-admin bootstrap, member onboarding, least-privilege grant docs, connect-time
   password entry. Deprecate (don't drop) `user_db_role`. Migration for existing PG workspaces.
4. **MySQL adapter**: `schema.mysql.ts` (type rules §6.2), `MySqlAdapter` + `wrapMySqlError`,
   factory, `mysql2`, `dbms` in config/invite, charset/TZ/pool/SSL, CI against MySQL.
5. **Cleanup**: drop `user_db_role`, finalize docs, remove ROLE remnants.

---

## 13. Open Questions / Risks

- ✅ **RESOLVED — UUIDv7**: new rows generate v7; existing v4 ids are left as-is (new-rows-only,
  not a global rewrite). See §6.2.1.
- ✅ **RESOLVED — MySQL UUID storage**: `char(36)` with `ascii_bin` collation (chosen over
  `binary(16)` for simplicity / readability / cross-DBMS parity). See §6.2.1.
- **Drizzle cross-dialect typing**: the "one repository set" goal needs a small spike to confirm
  the query-builder types compose across pg/mysql with an injected `db`/`schema` (the highest
  implementation-uncertainty item).
- **Existing-workspace UX** for the forced initial-password reset after the auth migration.

---

## Appendix A — DBA review traceability

DBA-perspective review: 7 lenses, 56 agents, each finding adversarially verified against the real
code; **46 confirmed/plausible, 3 refuted**. High-severity themes folded into this spec:
`.returning()` (§4.4.1), `ilike` (§4.4.2), transaction handle (§4.4.3, §10), TEXT-UNIQUE
(§6.2.3), timestamp/TZ (§6.2.2), random-UUID clustered PK (§6.2.1), `user_sn` collation
(§5.2/§6.2.4), invite-credential exposure (§5.1/decision #4), least-privilege (§5.7),
no-migrator + multi-step `users` migration + `user_db_role` drop (§8). Refuted (no action):
boolean TINYINT mapping and count/bigint return types (handled by Drizzle codecs); "startup
migration locking difference" (no startup migrator exists yet).
