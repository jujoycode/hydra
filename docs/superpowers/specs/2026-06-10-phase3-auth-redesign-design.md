# Phase 3 — Authentication Redesign — Design Spec

**Status:** Approved in brainstorming 2026-06-10. Input to the Phase 3 implementation plan.

**Parent spec:** `docs/superpowers/specs/2026-06-06-mysql-support-and-auth-redesign-design.md`
(§5 Authentication, §6.1 `users` table, §6.2 type rules, §8 migration, §9 security, §11 testing, §12 phasing item 3). This document records the **Phase-3-specific decisions** made in brainstorming and resolves the parent spec's open questions for this phase. Where this document and the parent disagree, **this document wins for Phase 3**.

---

## 1. Summary

Replace Hydra's "DB connection = authentication" model with a real per-user local login layered on top of the shared workspace connection. A member opens a workspace, enters the shared DB service-account password (as today), the app connects + migrates, then the member authenticates with a personal **username + password** against the `users` table. Admins onboard members with an initial password. No PostgreSQL ROLE is created per user anymore. **PostgreSQL-only** this phase (MySQL adapter is Phase 4).

This phase also establishes the app's **UX baseline**: the auth screens (login + admin setup) use a split brand-panel layout that becomes the visual reference for all future UI.

## 2. Locked Decisions (brainstorming 2026-06-10)

1. **Pre-release → clean schema.** No deployed user data to preserve. New `users` columns are created **NOT NULL / UNIQUE from the start** — no nullable→backfill→constrain multi-step migration, no forced-reset-of-existing-users flow. (Supersedes parent §8.2 for this phase.)
2. **Login identifier = separate username** (`user_sn`), distinct from email. Normalized (trim + lowercase) at both insert and lookup. `user_email` kept for display/contact, also normalized.
3. **No forced password change on first login.** Members log in with the admin-set initial password directly. (Forced-change + `must_reset` marker deferred to a later phase.)
4. **Session TTL:** default **1 day**; "remember me" extends to **30 days**.
5. **`user_db_role` is deprecated, not dropped.** Keep the column; stop reading/writing it. Actual `DROP` is Phase 5 (parent §8.3).
6. **Auth UI direction = split brand panel** (left dark brand panel + right form). This is the app's new UX standard; login and admin-setup share the layout.
7. **PostgreSQL-only.** No `schema.mysql.ts`, no MySQL adapter, no `dbms` config work — Phase 4.

## 3. Architecture

Three concerns, isolated:

- **Auth core (main, pure/unit-testable):** password hashing, identifier normalization, session record encode/decode + TTL. No DB, no Electron beyond `safeStorage` for session persistence.
- **Auth data + flow (main):** schema columns + migration, repository methods (`findBySn`, create-with-hash, `countUsers`), IPC handlers (login / setup-admin / logout / session bootstrap), advisory-lock-guarded connect→migrate→seed sequence.
- **Auth UI (renderer):** `LoginPage`, `AdminSetupPage`, auth-store session layer, route guard requiring connected **AND** authenticated.

### 3.1 Auth core modules (`src/main/core/auth/`)
- `password.ts` — `hashPassword(plain): Promise<string>` and `verifyPassword(plain, encoded): Promise<boolean>`.
  - Algorithm: Node `crypto.scrypt`, params `N=2^15 (32768), r=8, p=1`. Memory ≈ `128·N·r ≈ 33.5 MiB`, which **exceeds** Node's default `maxmem` of 32 MiB and would throw — so an explicit `maxmem` (e.g. `64 * 1024 * 1024`) is **required**, not optional. Per-user random salt ≥16 bytes.
  - Storage format (self-describing, lets params evolve): `scrypt$N=32768,r=8,p=1$<saltB64>$<hashB64>`.
  - `verifyPassword` parses params from the stored string and uses `crypto.timingSafeEqual`.
- `normalize.ts` — `normalizeHandle(value): string` = `value.trim().toLowerCase()`. Applied to `user_sn` and `user_email` at every insert and every lookup.
- `session.ts` — encode/decode an opaque session record `{ userId, userSn, issuedAt, expiresAt }`; `createSession(user, rememberMe)`, `isExpired(session)`. Persisted via Electron `safeStorage` (reuse the `WorkspaceManager` safeStorage pattern). TTL: 1 day default, 30 days when `rememberMe`.

### 3.2 Data model — `users` (migration `0002`; current history is `0000` tables + `0001` indexes)
| Column | Change |
|--------|--------|
| `user_sn varchar(255)` | **ADD** UNIQUE NOT NULL — normalized login handle |
| `user_password_hash varchar(255)` | **ADD** NOT NULL — scrypt encoded string |
| `user_status varchar(20)` default `'active'` | **ADD** — `active` / `inactive` |
| `user_db_role` | keep, deprecated (no read/write) |
| `user_email`, `user_name`, `user_role`, `user_created_at`, `user_updated_at` | keep |

Schema edit in `schema.ts` (PK stays `user_id` uuid). Generate migration via `pnpm db:generate`. Because the dev DB is pre-release, applying against a fresh DB is sufficient; no in-place backfill. Add an index on `user_sn` is unnecessary (UNIQUE already creates one).

### 3.3 Repository (`UserRepository` / `DrizzleUserRepository`)
- `findBySn(userSn): Promise<UserRecord | null>` — lookup by normalized `user_sn`.
- `countUsers(): Promise<number>` — for empty-DB detection (first-admin).
- `create(...)` extended to persist `user_sn`, `user_password_hash`, `user_status`. `createMember` path no longer touches `user_db_role`.
- All writes keep the Phase 2 read-after-write pattern; no `.returning()`.

### 3.4 Connect → migrate → seed sequence (`ConnectWorkspaceHandler`)
1. Connect with shared service account (unchanged; password entered per connect, never in invite).
2. `runMigrations()` (Phase 1) — now also applies the auth-column migration.
3. **Advisory lock** around migrate + first-admin detection so concurrent members/instances against the same shared account don't double-seed: `pg_advisory_lock(<const key>)` … `pg_advisory_unlock`. (MySQL `GET_LOCK` is Phase 4.)
4. Report DB state to the renderer: `needsSetup` (users table empty) vs `ready` (has users). The renderer routes to setup vs login accordingly.

### 3.5 IPC handlers
- `auth/LoginHandler` — input `{ userSn, password, rememberMe }`; normalize, `findBySn`, `verifyPassword`, check `user_status==='active'`; on success create + persist session, return the user.
- `auth/SetupAdminHandler` — only valid when `countUsers()===0` (re-checked under advisory lock); creates the first `admin` user with hashed password; creates session.
- `auth/LogoutHandler` — clears the persisted session.
- `auth/SessionStatusHandler` (bootstrap) — read persisted session; if expired → unauthenticated; else re-verify the user row still exists and `user_status==='active'`; return `{ authenticated, user }`.
- `CreateMemberHandler` — **remove `createRole` call**; insert `users` row with `user_sn` + hashed initial password + `user_role`. `DeleteUserHandler` — stop calling `dropRole`; respect/possibly set `user_status`. Remove now-dead `createRole`/`dropRole` from `PostgresAdapter` (and the `DatabaseAdapter` interface) — they were the only string-interpolated raw SQL (parent §9).

### 3.6 Renderer
- `auth` store gains a session/`currentUser` layer on top of `isConnected`. `bootstrap()` (existing) extends to: sync connection (existing `WORKSPACE_STATUS`) **then** call `SessionStatus`; expose `isAuthenticated`. Route guard = `isConnected && isAuthenticated`.
- Routes: `/login` and `/setup` (public-within-connected). After connect, renderer reads `needsSetup`/`ready` and navigates to `/setup` or `/login`; on auth success → app.
- `LoginPage` + `AdminSetupPage`: **split brand panel** layout (left dark brand panel with Hydra wordmark + tagline; right form). shadcn/Tailwind tokens, dark-mode aware, Pretendard. These set the UX baseline; built with care (frontend-design at implementation time).
- The existing `WorkspacePage`/connect UI stays for step 1–2 (workspace pick + DB password); login/setup layer on after connection.

## 4. Data Flow

```
Workspace pick / invite ─▶ DB service password ─▶ connect()
   ─▶ runMigrations()  ──(pg_advisory_lock)──▶ detect state
        ├─ users empty ─▶ /setup  ─▶ SetupAdmin ─▶ session ─▶ app
        └─ users exist ─▶ /login  ─▶ Login      ─▶ session ─▶ app
App mount ─▶ bootstrap(): connection status + SessionStatus(re-verify exists+active) ─▶ guard
```

## 5. Error Handling
- Wrong password / unknown `user_sn` → single generic "invalid credentials" (no user enumeration). `inactive` user → same generic message (don't reveal status).
- `SetupAdmin` when users already exist → rejected (race lost under lock) → renderer falls back to `/login`.
- scrypt failure / malformed stored hash → treated as auth failure, logged server-side.
- Session decode failure / expiry / user-missing / inactive on bootstrap → unauthenticated, route to `/login`.
- DB/connection errors keep the existing `DatabaseError` wrapping.

## 6. Security
- Parameterized Drizzle only; remove the last string-interpolated raw SQL (`createRole`/`dropRole`).
- scrypt with explicit stored params; `timingSafeEqual`; salt ≥16 bytes.
- Generic auth errors (no enumeration). `user_status='inactive'` honored on next bootstrap / sensitive op (documented limitation: in-flight session persists until relaunch/re-verify — parent §5.4).
- Backups now contain password hashes (accepted; at-rest encryption out of scope). Least-privilege service-account grant documented (parent §5.7) — doc-only this phase.

## 7. Testing
- **Unit (no DB):** password hash round-trip + wrong-password rejection + param parsing; `normalizeHandle`; session create/expiry; `user_status` invalidation logic.
- **Integration (DB-gated, `RUN_DB_TESTS=1`):** auth migration applies on fresh DB + idempotent; `SetupAdmin` seeds first admin then is rejected on second call; concurrent-setup advisory lock (two parallel setups → exactly one admin); `Login` success / wrong-password / inactive; `findBySn` normalization (mixed-case login matches).
- **Renderer:** guard redirects (unauthenticated → /login; empty DB → /setup); bootstrap re-verify path.

## 8. Out of Scope (later phases)
- MySQL adapter / `schema.mysql.ts` / `dbms` config (Phase 4).
- Drop `user_db_role`, remove ROLE remnants, finalize docs (Phase 5).
- Forced first-login password change, password reset/self-service, at-rest secret encryption.

## 9. Open Questions
- None blocking. (Advisory-lock key constant, exact brand-panel copy, and token-level visual polish are implementation details resolved in the plan / at build time.)
