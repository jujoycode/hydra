// Drizzle 기반 사용자 리포지토리 구현

import { eq, sql } from 'drizzle-orm'
import * as pgSchema from '../../schema/drizzle/schema'
import type { RepoExecutor } from '../interfaces/RepoExecutor'
import type { CreateUserData, UpdateUserData, UserRecord, UserRepository } from '../interfaces/UserRepository'
import type { DrizzleDb, DrizzleExecutor, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleUserRepository implements UserRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const { users } = this.schema
    const rows = await this.db.select().from(users).where(eq(users.user_id, userId)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findBySn(userSn: string): Promise<UserRecord | null> {
    const { users } = this.schema
    const rows = await this.db.select().from(users).where(eq(users.user_sn, userSn)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findAll(): Promise<UserRecord[]> {
    const { users } = this.schema
    const rows = await this.db.select().from(users)
    return rows as UserRecord[]
  }

  async create(data: CreateUserData, executor: RepoExecutor = this.db): Promise<UserRecord> {
    const { users } = this.schema
    const ex = executor as DrizzleExecutor
    const now = new Date()
    await ex.insert(users).values({
      user_id: data.userId,
      user_sn: data.userSn,
      user_password_hash: data.passwordHash,
      user_status: data.userStatus ?? 'active',
      user_name: data.userName ?? null,
      user_email: data.userEmail ?? null,
      user_role: data.userRole ?? 'member',
      user_avatar_path: data.userAvatarPath ?? null,
      user_created_at: now,
      user_updated_at: now
    })
    return selectById<UserRecord>(ex, users, users.user_id, data.userId)
  }

  async update(userId: string, data: UpdateUserData): Promise<UserRecord> {
    const { users } = this.schema
    const values: Record<string, unknown> = { user_updated_at: new Date() }
    if (data.userName !== undefined) values.user_name = data.userName
    if (data.userEmail !== undefined) values.user_email = data.userEmail
    if (data.userAvatarPath !== undefined) values.user_avatar_path = data.userAvatarPath
    if (data.userStatus !== undefined) values.user_status = data.userStatus

    await this.db.update(users).set(values).where(eq(users.user_id, userId))
    return selectById<UserRecord>(this.db, users, users.user_id, userId)
  }

  async delete(userId: string): Promise<boolean> {
    const { users } = this.schema
    await this.db.delete(users).where(eq(users.user_id, userId))
    return true
  }

  async count(executor: RepoExecutor = this.db): Promise<number> {
    const { users } = this.schema
    const ex = executor as DrizzleExecutor
    const rows = await ex.select({ count: sql<number>`count(*)` }).from(users)
    return Number(rows[0].count)
  }
}
