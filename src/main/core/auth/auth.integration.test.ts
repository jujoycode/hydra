import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../database/__testutils__/pgTestDb'
import { PostgresAdapter } from '../database/adapter/PostgresAdapter'
import { DrizzleUserRepository } from '../database/repository/drizzle/DrizzleUserRepository'
import { normalizeHandle } from './normalize'
import { hashPassword, verifyPassword } from './password'

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
