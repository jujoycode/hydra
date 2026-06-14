import type { Meta, StoryObj } from '@storybook/react'
import type { ActivityLogRecord } from '@/interface/CoreInterface'
import { ActivityTimeline } from './ActivityTimeline'

const sample = (over: Partial<ActivityLogRecord>): ActivityLogRecord => ({
  activity_id: Math.random().toString(36).slice(2),
  activity_entity_type: 'issue',
  activity_entity_id: 'i1',
  activity_action: 'comment_created',
  activity_actor_id: 'u1',
  activity_metadata: null,
  activity_created_at: new Date('2026-06-14T04:00:00Z'),
  ...over
})

const meta: Meta<typeof ActivityTimeline> = {
  title: 'Molecules/ActivityTimeline',
  component: ActivityTimeline
}
export default meta
type Story = StoryObj<typeof ActivityTimeline>

export const Default: Story = {
  args: {
    activities: [
      sample({
        activity_action: 'status_changed',
        activity_metadata: JSON.stringify({ from: 'backlog', to: 'in_progress' })
      }),
      sample({ activity_action: 'comment_created' })
    ]
  }
}

export const Loading: Story = { args: { activities: [], isLoading: true } }
export const Empty: Story = { args: { activities: [] } }
