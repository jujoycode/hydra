import { and, count, desc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../schema/drizzle/schema'
import type {
  CreateNotificationData,
  NotificationRecord,
  NotificationRepository
} from '../interfaces/NotificationRepository'

const { notifications } = schema

export class DrizzleNotificationRepository implements NotificationRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateNotificationData): Promise<NotificationRecord> {
    const rows = await this.db
      .insert(notifications)
      .values({
        notification_id: data.notificationId,
        user_id: data.userId,
        notification_type: data.notificationType,
        notification_title: data.notificationTitle,
        notification_message: data.notificationMessage ?? null,
        notification_link: data.notificationLink ?? null
      })
      .returning()
    return rows[0] as NotificationRecord
  }

  async findByUser(userId: string): Promise<NotificationRecord[]> {
    const rows = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.user_id, userId))
      .orderBy(desc(notifications.notification_created_at))
      .limit(50)
    return rows as NotificationRecord[]
  }

  async markAsRead(notificationId: string): Promise<NotificationRecord> {
    const rows = await this.db
      .update(notifications)
      .set({ notification_read: true })
      .where(eq(notifications.notification_id, notificationId))
      .returning()
    return rows[0] as NotificationRecord
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    await this.db
      .update(notifications)
      .set({ notification_read: true })
      .where(and(eq(notifications.user_id, userId), eq(notifications.notification_read, false)))
    return true
  }

  async delete(notificationId: string): Promise<boolean> {
    await this.db.delete(notifications).where(eq(notifications.notification_id, notificationId))
    return true
  }

  async countUnread(userId: string): Promise<number> {
    const rows = await this.db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.user_id, userId), eq(notifications.notification_read, false)))
    return rows[0]?.value ?? 0
  }
}
