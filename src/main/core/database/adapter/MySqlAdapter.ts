// MySQL 어댑터 - drizzle-orm + mysql2 Pool 기반 구현 (스펙 §4.1, §7)

import fs from 'node:fs'
import { join } from 'node:path'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import type { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise'
import mysql from 'mysql2/promise'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode } from '@/interface/CoreInterface'
import * as schema from '../schema/drizzle/schema.mysql'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

// MySQL errno / Node errno를 PostgresAdapter.wrapPgError와 같은 비즈니스 에러로 매핑
export function wrapMySqlError(
  error: unknown,
  ctx: { host?: string; port?: number; database?: string; user?: string }
): DatabaseError {
  // drizzle-orm 0.45+ wraps query errors as DrizzleQueryError with the original mysql2 error in `.cause`
  // errno가 없으면 cause 체인을 따라 내려가서 원본 mysql2 에러를 꺼낸다 (무한루프 방지: cause !== err 체크)
  let err = error as { errno?: number; code?: string; message?: string; cause?: unknown }
  while (err && typeof err.errno !== 'number' && err.cause != null && err.cause !== err) {
    err = err.cause as typeof err
  }
  const errno = err?.errno
  const rawMessage = err?.message ?? (error as { message?: string })?.message ?? 'Unknown database error'

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
  private database: string | null = null
  private host: string | null = null
  private user: string | null = null

  async connect(config: ConnectionConfig): Promise<void> {
    const poolOptions: PoolOptions = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      charset: 'utf8mb4', // connection charset 고정 — mysql2 기본값에 의존하지 않음 (스펙 §7)
      timezone: 'Z', // UTC 고정 — 세션 TZ 변환 차단 (스펙 §6.2.2)
      connectTimeout: 5000,
      connectionLimit: 10
    }

    if (config.sslCertPath) {
      poolOptions.ssl = { ca: fs.readFileSync(config.sslCertPath, 'utf-8') }
    }

    const pool = mysql.createPool(poolOptions)

    // Pool warm-up + utf8mb4 검증 (스펙 §7 — 기존 DB를 조용히 가정하지 않는다)
    // connection charset은 위에서 utf8mb4로 고정, 마이그레이션 SQL도 테이블마다 DEFAULT CHARSET=utf8mb4를 핀하므로
    // DB 기본 charset 불일치는 차단 사유가 아니라 경고 사유: Hydra 외부에서 생성된 테이블이
    // non-utf8mb4 charset을 기본값으로 가질 수 있음을 알린다.
    try {
      const conn = await pool.getConnection()
      try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT @@character_set_database AS cs, VERSION() AS version')
        const cs = rows[0]?.cs as string | undefined
        if (cs !== 'utf8mb4') {
          console.warn(
            `[MySqlAdapter] database charset is "${cs}", expected utf8mb4 — new tables created outside Hydra may default to a non-utf8mb4 charset`
          )
        }
        // MySQL 8.0+ 만 지원 (utf8mb4 기본, DATETIME(3), GET_LOCK 다중 락 등) — 미만이면 경고
        const version = String(rows[0]?.version ?? '')
        const major = Number.parseInt(version.split('.')[0] ?? '', 10)
        if (Number.isFinite(major) && major < 8) {
          console.warn(
            `[MySqlAdapter] server version ${version} detected — Hydra supports MySQL 8.0+; behavior is undefined on older versions`
          )
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
    this.database = config.database
    this.host = config.host ?? null
    this.user = config.user ?? null
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
      this.db = null
      this.database = null
      this.host = null
      this.user = null
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

  // 적용된 마이그레이션 수가 로컬 저널과 같으면 migrate를 건너뛴다.
  // 이유: drizzle mysql 마이그레이터는 매번 CREATE TABLE IF NOT EXISTS를 실행하는데
  // MySQL은 테이블이 존재해도 CREATE 권한을 요구한다(errno 1142) — DML-only 런타임
  // 계정(README의 최소권한 GRANT)이 재연결마다 실패하지 않으려면 사전 검사가 필요하다.
  private async isMigrationCurrent(migrationsFolder: string): Promise<boolean> {
    if (!this.pool) return false
    const journalPath = join(migrationsFolder, 'meta', '_journal.json')
    let localCount: number
    try {
      const journal = JSON.parse(fs.readFileSync(journalPath, 'utf-8')) as { entries?: unknown[] }
      localCount = journal.entries?.length ?? 0
    } catch {
      return false // 저널을 못 읽으면 마이그레이터에 맡긴다
    }
    if (localCount === 0) return false
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>('SELECT COUNT(*) AS cnt FROM `__drizzle_migrations`')
      return Number(rows[0]?.cnt) >= localCount
    } catch {
      return false // 테이블 없음(fresh DB) 등 — 마이그레이터 실행 필요
    }
  }

  // GET_LOCK으로 동시 기동 마이그레이션 가드 (스펙 §8.4 — PG advisory lock 대응물)
  // 락 이름을 DB 스코프로 제한: 같은 MySQL 서버의 다른 데이터베이스를 쓰는 워크스페이스가 서버 전역 락에서 경합하지 않도록
  async runMigrations(migrationsFolder: string): Promise<void> {
    if (!this.db || !this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    if (await this.isMigrationCurrent(migrationsFolder)) {
      return
    }
    // MySQL GET_LOCK 이름은 64자 제한 — DB 이름 포함 스코프 키로 truncate
    const lockName = `hydra_migrations:${this.database}`.slice(0, 64)
    const conn = await this.pool.getConnection()
    try {
      const [rows] = await conn.query<RowDataPacket[]>('SELECT GET_LOCK(?, 60) AS got', [lockName])
      if (Number(rows[0]?.got) !== 1) {
        throw new DatabaseError(
          ErrorCode.DB_ERROR,
          'Could not acquire migration lock (another instance migrating?)',
          null
        )
      }
      try {
        await migrate(this.db, { migrationsFolder })
      } catch (error: unknown) {
        throw wrapMySqlError(error, {
          host: this.host ?? undefined,
          database: this.database ?? undefined,
          user: this.user ?? undefined
        })
      }
    } finally {
      try {
        await conn.query('SELECT RELEASE_LOCK(?)', [lockName])
        conn.release()
      } catch {
        // RELEASE_LOCK 실패는 사실상 죽은 커넥션 — 풀에 되돌리지 않고 폐기 (락은 세션 종료로 자동 해제)
        conn.destroy()
      }
    }
  }

  // 격리 수준을 PG 기본(READ COMMITTED)과 일치시킨다 (스펙 §7)
  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => fn(tx), { isolationLevel: 'read committed' })
  }

  // PG pg_advisory_xact_lock 대응물. MySQL GET_LOCK은 세션 스코프라 트랜잭션 커밋으로 자동 해제되지 않는다.
  // 따라서 PG처럼 트랜잭션 "안"에서 잡고 끝내면 안 된다: READ COMMITTED에서 락을 커밋 전에 풀면
  // 두 번째 대기자가 첫 트랜잭션의 미커밋 INSERT를 못 본 채 임계구역에 진입할 수 있다.
  // → 별도 커넥션에서 락을 잡고 트랜잭션 전체(커밋 포함)를 감싼 뒤, 커밋 이후에 해제한다 (runMigrations와 동일 원칙).
  async transactionWithAdvisoryLock<T>(lockKey: number, fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db || !this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    // 락 이름을 DB 스코프로 제한 + 64자 제한 truncate (마이그레이션 락과 동일 규칙)
    const lockName = `hydra_advisory:${this.database}:${lockKey}`.slice(0, 64)
    const conn = await this.pool.getConnection()
    try {
      const [rows] = await conn.query<RowDataPacket[]>('SELECT GET_LOCK(?, 10) AS got', [lockName])
      if (Number(rows[0]?.got) !== 1) {
        throw new DatabaseError(ErrorCode.DB_ERROR, 'Could not acquire advisory lock (contention or timeout)', null)
      }
      // 락을 conn에 쥔 채 별도 풀 커넥션에서 트랜잭션을 실행/커밋한다
      return await this.transaction(fn)
    } finally {
      try {
        await conn.query('SELECT RELEASE_LOCK(?)', [lockName])
        conn.release()
      } catch {
        // RELEASE_LOCK 실패는 사실상 죽은 커넥션 — 풀에 되돌리지 않고 폐기 (락은 세션 종료로 자동 해제)
        conn.destroy()
      }
    }
  }
}
