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
