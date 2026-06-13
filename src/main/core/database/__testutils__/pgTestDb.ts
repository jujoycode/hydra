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
