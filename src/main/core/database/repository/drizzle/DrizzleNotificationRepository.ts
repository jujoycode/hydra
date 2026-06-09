import { and, count, desc, eq } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type {
  CreateNotificationData,
  NotificationRecord,
  NotificationRepository
} from '../interfaces/NotificationRepository'
import type { DrizzleDb } from './executor'
import { selectById } from './readAfterWrite'

const { notifications } = schema

export class DrizzleNotificationRepository implements NotificationRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateNotificationData): Promise<NotificationRecord> {
    await this.db.insert(notifications).values({
      notification_id: data.notificationId,
      user_id: data.userId,
      notification_type: data.notificationType,
      notification_title: data.notificationTitle,
      notification_message: data.notificationMessage ?? null,
      notification_link: data.notificationLink ?? null
    })
    return selectById<NotificationRecord>(this.db, notifications, notifications.notification_id, data.notificationId)
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
    await this.db
      .update(notifications)
      .set({ notification_read: true })
      .where(eq(notifications.notification_id, notificationId))
    return selectById<NotificationRecord>(this.db, notifications, notifications.notification_id, notificationId)
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
