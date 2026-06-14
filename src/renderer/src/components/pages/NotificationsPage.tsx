import { useNavigate } from '@tanstack/react-router'
import { Bell, CheckCheck, Loader2, MessageSquare, Target, Trash2, UserCheck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import type { Notification } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { formatRelativeKorean } from '@/lib/formatDate'
import { useAuthStore } from '@/stores/auth'

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'issue_assigned':
      return <UserCheck className='size-4 text-info' />
    case 'issue_updated':
      return <Target className='size-4 text-warning' />
    case 'comment_added':
      return <MessageSquare className='size-4 text-success' />
    case 'milestone_due':
      return <Bell className='size-4 text-destructive' />
    default:
      return <Bell className='size-4 text-muted-foreground' />
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    const result = await window.callApi(IpcChannel.NOTIFICATION_LIST, { userId: user.user_id })
    if (Array.isArray(result.data)) {
      setNotifications(result.data)
    }
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleClick = async (notification: Notification) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.notification_read) {
      await window.callApi(IpcChannel.NOTIFICATION_MARK_READ, {
        notificationId: notification.notification_id
      })
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === notification.notification_id ? { ...n, notification_read: true } : n))
      )
    }

    // 링크가 있으면 이동
    if (notification.notification_link) {
      navigate({ to: notification.notification_link })
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    const result = await window.callApi(IpcChannel.NOTIFICATION_MARK_ALL_READ, { userId: user.user_id })
    if (result.data) {
      setNotifications((prev) => prev.map((n) => ({ ...n, notification_read: true })))
      toast.success('모든 알림을 읽음 처리했습니다')
    }
  }

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    const result = await window.callApi(IpcChannel.NOTIFICATION_DELETE, { notificationId })
    if (result.data) {
      setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationId))
    }
  }

  const unreadCount = notifications.filter((n) => !n.notification_read).length

  return (
    <div className='p-page h-full overflow-auto'>
      <div className='flex justify-between items-center mb-section'>
        <div>
          <h1 className='text-title'>알림</h1>
          <p className='text-caption text-muted-foreground mt-1'>
            {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '읽지 않은 알림이 없습니다'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant='outline' onClick={handleMarkAllAsRead}>
            <CheckCheck className='size-4 mr-2' />
            모두 읽음 처리
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
        </div>
      ) : notifications.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
          <Bell className='size-10 mb-3 opacity-50' />
          <p className='text-section'>알림이 없습니다</p>
          <p className='text-caption mt-1'>모두 확인했습니다!</p>
        </div>
      ) : (
        <div className='glass-soft rounded-xl shadow-card overflow-hidden border border-border/70'>
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/60 last:border-b-0 cursor-pointer transition-colors hover:bg-primary/5 ${
                !notification.notification_read ? 'bg-muted/30' : ''
              }`}
              onClick={() => handleClick(notification)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(notification)}
              role='button'
              tabIndex={0}
            >
              {/* 읽음 표시 */}
              <div className='mt-1 shrink-0'>
                {!notification.notification_read ? (
                  <div className='size-2 rounded-full bg-primary' />
                ) : (
                  <div className='size-2' />
                )}
              </div>

              {/* 아이콘 */}
              <div className='mt-0.5 shrink-0'>
                <NotificationIcon type={notification.notification_type} />
              </div>

              {/* 내용 */}
              <div className='flex-1 min-w-0'>
                <p className={`text-sm ${!notification.notification_read ? 'font-semibold' : 'font-normal'}`}>
                  {notification.notification_title}
                </p>
                {notification.notification_message && (
                  <p className='text-sm text-muted-foreground mt-0.5 truncate'>{notification.notification_message}</p>
                )}
                <p className='text-caption text-muted-foreground mt-1'>
                  {formatRelativeKorean(notification.notification_created_at)}
                </p>
              </div>

              {/* 삭제 버튼 */}
              <Button
                variant='ghost'
                size='sm'
                className='shrink-0 text-muted-foreground hover:text-destructive'
                onClick={(e) => handleDelete(e, notification.notification_id)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
