import type { NotificationRecord } from '../../database/repository/interfaces/NotificationRepository'

export type Notification = NotificationRecord

export interface ListNotificationsParams {
  userId: string
}

export interface MarkNotificationReadParams {
  notificationId: string
}

export interface MarkAllNotificationsReadParams {
  userId: string
}

export interface DeleteNotificationParams {
  notificationId: string
}

export interface CountUnreadParams {
  userId: string
}
