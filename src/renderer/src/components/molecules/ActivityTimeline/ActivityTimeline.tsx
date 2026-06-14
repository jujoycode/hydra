import type { ActivityLogRecord } from '@/interface/CoreInterface'

const ACTION_LABEL: Record<string, string> = {
  status_changed: 'changed status',
  assigned: 'changed assignee',
  comment_created: 'added a comment'
}

function parseMeta(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

/** 활동 1건을 사람이 읽을 문장으로 변환한다. */
export function describeActivity(activity: ActivityLogRecord): string {
  const meta = parseMeta(activity.activity_metadata)
  if ((activity.activity_action === 'status_changed' || activity.activity_action === 'assigned') && meta) {
    const label = ACTION_LABEL[activity.activity_action]
    return `${label}: ${meta.from ?? '—'} → ${meta.to ?? '—'}`
  }
  return ACTION_LABEL[activity.activity_action] ?? activity.activity_action
}

interface ActivityTimelineProps {
  activities: ActivityLogRecord[]
  isLoading?: boolean
}

export function ActivityTimeline({ activities, isLoading = false }: ActivityTimelineProps) {
  if (isLoading) {
    return <p className='text-sm text-muted-foreground'>Loading activity…</p>
  }
  if (activities.length === 0) {
    return <p className='text-sm text-muted-foreground'>No activity yet</p>
  }
  return (
    <ul className='space-y-3'>
      {activities.map((activity) => (
        <li key={activity.activity_id} className='flex items-start gap-2 text-sm'>
          <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40' />
          <div className='flex flex-col'>
            <span>{describeActivity(activity)}</span>
            <span className='text-xs text-muted-foreground'>
              {activity.activity_created_at ? new Date(activity.activity_created_at).toLocaleString() : ''}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
