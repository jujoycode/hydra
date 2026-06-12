import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/core/database/schema/drizzle/schema.mysql.ts',
  out: './drizzle/mysql',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'mysql',
    database: process.env.MYSQL_DB_NAME || 'hydra'
  }
})
