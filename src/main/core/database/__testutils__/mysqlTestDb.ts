// 통합 테스트용 격리 MySQL 데이터베이스 생성/삭제 헬퍼 (docker-compose mysql 대상)

import mysql from 'mysql2/promise'

export function mysqlTestConfig() {
  return {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? 'mysql'
  }
}

export async function createMySqlTestDatabase(): Promise<string> {
  const name = `hydra_test_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`
  const conn = await mysql.createConnection(mysqlTestConfig())
  try {
    await conn.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4`)
  } finally {
    await conn.end()
  }
  return name
}

export async function dropMySqlTestDatabase(name: string): Promise<void> {
  const conn = await mysql.createConnection(mysqlTestConfig())
  try {
    await conn.query(`DROP DATABASE IF EXISTS \`${name}\``)
  } finally {
    await conn.end()
  }
}
