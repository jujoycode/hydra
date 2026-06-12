// 마이그레이션 SQL 폴더 경로 해석 (dev: 레포 루트, packaged: resources)
// 주의: 이 모듈은 메인 프로세스 런타임에서만 import 한다 (electron 의존성, 테스트에서 import 금지)

import { join, resolve } from 'node:path'
import { app } from 'electron'

export type MigrationDialect = 'pg' | 'mysql'

export function getMigrationsFolder(dialect: MigrationDialect): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'drizzle', dialect)
  }
  return resolve(process.cwd(), 'drizzle', dialect)
}
