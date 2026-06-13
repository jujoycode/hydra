// 알림 리포지토리 인터페이스

export interface CreateNotificationData {
  notificationId: string
  userId: string
  notificationType: string
  notificationTitle: string
  notificationMessage?: string | null
  notificationLink?: string | null
}

export interface NotificationRecord {
  notification_id: string
  user_id: string
  notification_type: string
  notification_title: string
  notification_message: string | null
  notification_read: boolean | null
  notification_link: string | null
  notification_created_at: Date | null
}

export interface NotificationRepository {
  create(data: CreateNotificationData): Promise<NotificationRecord>
  findByUser(userId: string): Promise<NotificationRecord[]>
  markAsRead(notificationId: string): Promise<NotificationRecord>
  markAllAsRead(userId: string): Promise<boolean>
  delete(notificationId: string): Promise<boolean>
  countUnread(userId: string): Promise<number>
}
