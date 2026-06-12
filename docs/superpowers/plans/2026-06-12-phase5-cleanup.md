# Phase 5: Cleanup (user_db_role 드랍 + ROLE 잔재 제거) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ROLE 인증 모델의 마지막 잔재인 `users.user_db_role` 컬럼을 양 엔진에서 드랍하고, 문서를 현행화하며, Phase 4 리뷰에서 미뤄둔 2개 마이너(createAdapter fail-fast, MySQL 버전 경고)를 해소한다 (스펙 §12 Phase 5, §8.3).

**Architecture:** 컬럼 드랍은 스키마 파일 수정 → drizzle-kit generate로 마이그레이션 산출 (PG 0004, MySQL 0001) → `UserRecord` 인터페이스에서 필드 제거 (파생 `SafeUser`는 자동 반영). 마이그레이션은 connect 시 자동 적용되므로 앱 업그레이드 후 첫 연결은 DDL 권한 계정 필요 (Phase 4에서 문서화된 동작).

**Tech Stack:** Drizzle ORM + drizzle-kit (postgresql/mysql dialects), Vitest, mysql2/pg.

**Branch:** `feature/phase5-cleanup` (origin/v3 = `7abbf36`에서 분기, 기존 워크트리 재사용)

**Base spec:** `docs/superpowers/specs/2026-06-06-mysql-support-and-auth-redesign-design.md` §8.3, §12(5)

**주의 — 비가역 마이그레이션 (스펙 §8.5):** DROP COLUMN은 되돌릴 수 없다. 마이그레이션 SQL 첫 줄에 백업 권고 주석을 남긴다.

---

## File Structure

```
src/main/core/database/schema/drizzle/schema.ts          (수정: user_db_role 제거)
src/main/core/database/schema/drizzle/schema.mysql.ts    (수정: user_db_role 제거)
src/main/core/database/repository/interfaces/UserRepository.ts  (수정: UserRecord에서 필드 제거)
src/preload/mockApi.ts                                   (수정: mock 유저에서 필드 제거)
drizzle/pg/0004_*.sql                                    (생성: DROP COLUMN)
drizzle/mysql/0001_*.sql                                 (생성: DROP COLUMN)
src/main/core/database/adapter/createAdapter.ts          (수정: 알 수 없는 dbms fail-fast)
src/main/core/database/adapter/createAdapter.test.ts     (수정: fail-fast 테스트)
src/main/core/database/adapter/MySqlAdapter.ts           (수정: 버전 경고)
CLAUDE.md, docs/design/table-erd.md                      (수정: 문서 현행화)
docs/superpowers/plans/2026-06-12-phase4-mysql-adapter.md (커밋: 메인 체크아웃에 untracked로 남은 Phase 4 계획서)
```

**검증 명령(공통):** `pnpm typecheck` / `pnpm lint:ci` / `RUN_DB_TESTS=1 pnpm test` / `RUN_DB_TESTS_MYSQL=1 MYSQL_PORT=3307 pnpm test` (이 머신의 MySQL 컨테이너는 호스트 포트 3307, CI는 3306)

---

### Task 0: 브랜치 준비

- [ ] **Step 1: 최신 v3에서 분기** (현 워크트리에서)

```bash
git fetch origin v3
git checkout -b feature/phase5-cleanup origin/v3
```

Expected: `Switched to a new branch 'feature/phase5-cleanup'`, `git log --oneline -1` = `7abbf36`

---

### Task 1: user_db_role 컬럼 드랍 (스키마 + 마이그레이션 + 인터페이스)

**Files:**
- Modify: `src/main/core/database/schema/drizzle/schema.ts:13`
- Modify: `src/main/core/database/schema/drizzle/schema.mysql.ts:30`
- Modify: `src/main/core/database/repository/interfaces/UserRepository.ts:10`
- Modify: `src/preload/mockApi.ts:15,25,35`
- Create (generated): `drizzle/pg/0004_*.sql`, `drizzle/mysql/0001_*.sql`

- [ ] **Step 1: 양 스키마에서 컬럼 제거**

`schema.ts`에서 `  user_db_role: varchar('user_db_role', { length: 255 }),` 줄 삭제.
`schema.mysql.ts`에서 `  user_db_role: varchar('user_db_role', { length: 255 }),` 줄 삭제.

- [ ] **Step 2: 패리티 테스트로 양쪽 동시 제거 확인**

```bash
pnpm test schema.parity
```

Expected: PASS (3 tests) — 한쪽만 지웠으면 column mismatch로 FAIL했을 것

- [ ] **Step 3: UserRecord에서 필드 제거**

`UserRepository.ts`에서 `  user_db_role: string | null` 줄 삭제. (`SafeUser`는 `user_password_hash`만 Omit하는 파생 타입이므로 자동 반영 — `src/main/core/auth/safeUser.ts` 변경 불필요)

- [ ] **Step 4: mockApi.ts에서 필드 제거**

`src/preload/mockApi.ts`의 mock 유저 3곳에서 `user_db_role: '...',` 줄 삭제 (15, 25, 35행 부근).

- [ ] **Step 5: 잔존 참조 0건 확인 + 타입체크**

```bash
grep -rn 'user_db_role\|userDbRole\|dbRole' src/
pnpm typecheck
```

Expected: grep 0건, typecheck 클린. (grep에 걸리는 곳이 더 있으면 — 예: 테스트 픽스처 — 같은 방식으로 제거)

- [ ] **Step 6: 마이그레이션 생성 (양 엔진)**

```bash
pnpm db:generate
pnpm db:generate:mysql
```

Expected: `drizzle/pg/0004_*.sql` = `ALTER TABLE "users" DROP COLUMN "user_db_role";` 1문, `drizzle/mysql/0001_*.sql` = `` ALTER TABLE `users` DROP COLUMN `user_db_role`; `` 1문. **다른 변경이 섞여 있으면 BLOCKED 보고** (스키마 드리프트).

- [ ] **Step 7: 비가역 경고 주석 추가**

생성된 두 SQL 파일 첫 줄에 추가:

```sql
-- 비가역: user_db_role 드랍 (ROLE 인증 모델 제거 완료, 스펙 §8.3). 적용 전 백업 권장 (pg_dump / mysqldump).
```

- [ ] **Step 8: 실 DB 적용 검증 (양 엔진)**

```bash
RUN_DB_TESTS=1 pnpm test PostgresAdapter.migrate
RUN_DB_TESTS_MYSQL=1 MYSQL_PORT=3307 pnpm test MySqlAdapter.migrate
```

Expected: 둘 다 PASS — fresh DB에 전체 이력(드랍 포함) 적용 + 멱등 재실행. MySQL migrate 테스트의 `applies the baseline migration` 케이스는 테이블 수를 세므로 드랍과 무관하게 15 유지.

- [ ] **Step 9: 전체 회귀**

```bash
RUN_DB_TESTS=1 pnpm test && RUN_DB_TESTS_MYSQL=1 MYSQL_PORT=3307 pnpm test mysql.integration && pnpm lint:ci
```

Expected: 전부 PASS / 에러 0

- [ ] **Step 10: Commit**

```bash
git add src/ drizzle/
git commit -m "feat: user_db_role 컬럼 드랍 — ROLE 인증 모델 잔재 제거 (PG 0004, MySQL 0001)"
```

---

### Task 2: createAdapter fail-fast (알 수 없는 dbms 거부)

**Files:**
- Modify: `src/main/core/database/adapter/createAdapter.ts`
- Test: `src/main/core/database/adapter/createAdapter.test.ts`

- [ ] **Step 1: 실패 테스트 추가** — `createAdapter.test.ts`의 createAdapter describe에:

```ts
  it('throws VALIDATION_ERROR for an unknown dbms value', () => {
    expect(() => createAdapter('sqlite' as never)).toThrowError(
      expect.objectContaining({ code: ErrorCode.VALIDATION_ERROR })
    )
  })
```

(`import { ErrorCode } from '../../interface/CoreInterface'` 추가. `toThrowError(objectContaining)`이 vitest 버전상 동작하지 않으면 try/catch로 `e.code` 검증하는 형태로 조정 — 검증 의미 유지)

Run: `pnpm test createAdapter` → Expected: 신규 케이스 FAIL (현재는 조용히 PostgresAdapter 반환)

- [ ] **Step 2: 구현** — `createAdapter.ts`의 함수를 교체:

```ts
export function createAdapter(dbms: DbmsType | undefined): DatabaseAdapter {
  // undefined는 구버전 renderer persist 호환 (postgresql), 그 외 알 수 없는 값은 fail-fast
  if (dbms === undefined || dbms === 'postgresql') {
    return new PostgresAdapter()
  }
  if (dbms === 'mysql') {
    return new MySqlAdapter()
  }
  throw new DatabaseError(ErrorCode.VALIDATION_ERROR, `Unsupported dbms: "${dbms}"`, null)
}
```

(import 추가: `import { DatabaseError } from '@/error/DatabaseError'`, `ErrorCode`는 기존 `@/interface/CoreInterface` import에 추가)

- [ ] **Step 3: 통과 확인 + 회귀**

```bash
pnpm test createAdapter && pnpm typecheck:node
```

Expected: 5/5 PASS (기존 4 + 신규 1), typecheck 클린

- [ ] **Step 4: Commit**

```bash
git add src/main/core/database/adapter/createAdapter.ts src/main/core/database/adapter/createAdapter.test.ts
git commit -m "fix: createAdapter — 알 수 없는 dbms 값을 조용히 PG로 폴백하지 않고 VALIDATION_ERROR"
```

---

### Task 3: MySQL 서버 버전 경고

**Files:**
- Modify: `src/main/core/database/adapter/MySqlAdapter.ts` (connect의 warm-up 블록)

- [ ] **Step 1: connect의 charset 검증 쿼리에 버전 조회 추가**

`MySqlAdapter.connect`의 warm-up try 블록에서 charset 조회를 다음으로 확장 (기존 `SELECT @@character_set_database AS cs` 쿼리 교체):

```ts
        const [rows] = await conn.query<RowDataPacket[]>(
          'SELECT @@character_set_database AS cs, VERSION() AS version'
        )
        const cs = rows[0]?.cs as string | undefined
        if (cs !== 'utf8mb4') {
          console.warn(
            `[MySqlAdapter] database charset is "${cs}", expected utf8mb4 — new tables created outside Hydra may default to a non-utf8mb4 charset`
          )
        }
        // MySQL 8.0+ 만 지원 (DATETIME(3) 기본값, utf8mb4 기본, GET_LOCK 다중 락 등) — 미만이면 경고
        const version = String(rows[0]?.version ?? '')
        const major = Number.parseInt(version.split('.')[0] ?? '', 10)
        if (Number.isFinite(major) && major < 8) {
          console.warn(`[MySqlAdapter] server version ${version} detected — Hydra supports MySQL 8.0+; behavior is undefined on older versions`)
        }
```

(charset warn 문구는 기존 파일의 현행 문구를 유지 — 위는 현행 문구 기준. 실제 파일과 다르면 실제 쪽을 유지하고 버전 체크만 추가)

- [ ] **Step 2: 통합 테스트로 회귀 확인** (8.0 컨테이너이므로 경고 없이 통과해야 함)

```bash
RUN_DB_TESTS_MYSQL=1 MYSQL_PORT=3307 pnpm test MySqlAdapter.migrate
pnpm typecheck:node && pnpm lint:ci
```

Expected: 5/5 PASS, 클린

- [ ] **Step 3: Commit**

```bash
git add src/main/core/database/adapter/MySqlAdapter.ts
git commit -m "feat: MySQL 연결 시 서버 버전 확인 — 8.0 미만 경고"
```

---

### Task 4: 문서 현행화 + 계획서 커밋

**Files:**
- Modify: `CLAUDE.md:80-85` (Auth Guard/Auth Model)
- Modify: `docs/design/table-erd.md` (users ERD)
- Add: `docs/superpowers/plans/2026-06-12-phase4-mysql-adapter.md` (메인 체크아웃 `C:\Users\A040-000-0001\Documents\project\hydra\docs\superpowers\plans\`에 untracked로 존재 — 워크트리로 복사해 커밋)
- Add: `docs/superpowers/plans/2026-06-12-phase5-cleanup.md` (이 문서)

- [ ] **Step 1: CLAUDE.md Auth Model 섹션 교체**

현재 (82~85행):

```markdown
### Auth Model
- No login/signup screen. DB connection = authentication.
- Admin creates members via app → PostgreSQL ROLE created automatically
- Invite system: base64 encoded non-sensitive workspace info
```

교체:

```markdown
### Auth Model
- Two-step: workspace DB connection (shared service account) → app-level login (`user_sn` + scrypt password)
- First connect to an empty DB shows an admin setup screen; admins create members in-app (no DB ROLEs)
- Session persisted via Electron safeStorage (`remember me` extends expiry); re-verified on bootstrap
- Invite system: base64 encoded non-sensitive workspace info (`host/port/dbName/dbms` — no credentials)
```

- [ ] **Step 2: table-erd.md의 users 갱신**

ERD 블록에서 `  VARCHAR(255) user_db_role "nullable"` 줄 삭제하고 그 자리에 인증 컬럼 반영:

```
  VARCHAR(255) user_sn UK
  VARCHAR(255) user_password_hash
  VARCHAR(20) user_status "default: active"
```

설명부에서:
- `사용자 정보를 저장합니다. DB 연결 시 PostgreSQL ROLE과 매핑됩니다.` → `사용자 정보를 저장합니다. 앱 레벨 로컬 계정(user_sn + 비밀번호 해시)으로 로그인합니다.`
- `- \`user_db_role\`: PostgreSQL 데이터베이스 역할명` 줄 삭제, 대신:

```markdown
  - `user_sn`: 로그인 ID (정규화, 유니크)
  - `user_password_hash`: scrypt 해시 (파라미터 자기기술 포맷)
  - `user_status`: active / inactive
```

- [ ] **Step 3: Phase 4 계획서 복사**

```bash
cp "C:\Users\A040-000-0001\Documents\project\hydra\docs\superpowers\plans\2026-06-12-phase4-mysql-adapter.md" docs/superpowers/plans/
```

- [ ] **Step 4: 잔존 ROLE 표현 최종 스캔**

```bash
grep -rn 'PostgreSQL ROLE\|DB ROLE\|createRole\|dropRole' --include='*.md' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v 'docs/superpowers'
```

Expected: 0건 (docs/superpowers는 역사 기록이므로 제외). 걸리는 게 있으면 현행화.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md docs/
git commit -m "docs: 인증 모델 현행화 (ROLE 표현 제거) + Phase 4/5 계획서 커밋"
```

---

### Task 5: 최종 게이트 + 푸시 + PR

- [ ] **Step 1: 전체 게이트**

```bash
pnpm typecheck && pnpm lint:ci
RUN_DB_TESTS=1 RUN_DB_TESTS_MYSQL=1 MYSQL_PORT=3307 pnpm test
pnpm build
```

Expected: 전부 PASS (테스트 67개 전부)

- [ ] **Step 2: 푸시** (PR 생성은 컨트롤러가 수행)

```bash
git push -u origin feature/phase5-cleanup
```

---

## Self-Review 결과 (작성 시 수행)

- **스펙 §12(5) 커버리지**: drop user_db_role→Task 1, ROLE remnants 제거→Task 1(코드)+Task 4(문서), finalize docs→Task 4. §8.5 백업 권고→Task 1 Step 7.
- **번들 마이너**: createAdapter fail-fast→Task 2, MySQL 버전 체크→Task 3 (사용자 합의 범위). statement timeout/retry-backoff는 스펙상 Phase 배정이 없어 **의도적으로 제외**.
- **타입 일관성**: `DatabaseError(ErrorCode, message, data)` 시그니처는 기존 MySqlAdapter.runMigrations 사용례와 동일. `ErrorCode.VALIDATION_ERROR`는 ipc.ts enum에 존재 확인됨.
- **알려진 불확실 지점**: ① drizzle-kit이 DROP COLUMN 외 잡음을 생성할 가능성(Task 1 Step 6에 BLOCKED 조건 명시), ② 테스트 픽스처에 user_db_role 잔존 가능성(Task 1 Step 5 grep으로 커버), ③ vitest toThrowError(objectContaining) 버전 호환(Task 2 Step 1에 대안 명시).
