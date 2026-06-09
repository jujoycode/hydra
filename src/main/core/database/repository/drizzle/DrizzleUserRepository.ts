// Drizzle 기반 사용자 리포지토리 구현

import { eq, sql } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type { CreateUserData, UpdateUserData, UserRecord, UserRepository } from '../interfaces/UserRepository'
import type { DrizzleDb } from './executor'

const { users } = schema

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: DrizzleDb) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const rows = await this.db.select().from(users).where(eq(users.user_id, userId)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findByDbRole(dbRole: string): Promise<UserRecord | null> {
    const rows = await this.db.select().from(users).where(eq(users.user_db_role, dbRole)).limit(1)
    return (rows[0] as UserRecord) ?? null
  }

  async findAll(): Promise<UserRecord[]> {
    const rows = await this.db.select().from(users)
    return rows as UserRecord[]
  }

  async create(data: CreateUserData): Promise<UserRecord> {
    const now = new Date()
    const rows = await this.db
      .insert(users)
      .values({
        user_id: data.userId,
        user_name: data.userName,
        user_email: data.userEmail,
        user_db_role: data.userDbRole,
        user_role: data.userRole ?? 'member',
        user_avatar_path: data.userAvatarPath ?? null,
        user_created_at: now,
        user_updated_at: now
      })
      .returning()
    return rows[0] as UserRecord
  }

  async update(userId: string, data: UpdateUserData): Promise<UserRecord> {
    const values: Record<string, unknown> = {
      user_updated_at: new Date()
    }
    if (data.userName !== undefined) values.user_name = data.userName
    if (data.userEmail !== undefined) values.user_email = data.userEmail
    if (data.userAvatarPath !== undefined) values.user_avatar_path = data.userAvatarPath

    const rows = await this.db.update(users).set(values).where(eq(users.user_id, userId)).returning()
    return rows[0] as UserRecord
  }

  async delete(userId: string): Promise<boolean> {
    await this.db.delete(users).where(eq(users.user_id, userId))
    return true
  }

  async count(): Promise<number> {
    const rows = await this.db.select({ count: sql<number>`count(*)` }).from(users)
    return Number(rows[0].count)
  }
}
