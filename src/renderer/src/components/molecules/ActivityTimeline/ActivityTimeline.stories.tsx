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

/**
 * 이슈의 활동 로그를 시간순으로 표시한다. 상태 변경, 담당자 변경, 댓글 작성 등의 기록을 다루며,
 * 각 항목은 activity_action과 activity_metadata를 사람이 읽을 수 있는 문장으로 변환해 표시한다.
 * 로딩 중이거나 활동 기록이 없는 경우에는 목록 대신 안내 문구를 표시한다.
 */
const meta: Meta<typeof ActivityTimeline> = {
  title: 'Molecules/ActivityTimeline',
  component: ActivityTimeline,
  argTypes: {
    activities: {
      description:
        '표시할 활동 로그 배열. status_changed와 assigned는 metadata를 읽어 변경 내용을 표시하고, comment_created는 고정 문구를 사용한다.',
      control: 'object',
      table: { type: { summary: 'ActivityLogRecord[]' } }
    },
    isLoading: {
      description: '활성화하면 활동 목록 대신 로딩 문구를 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ActivityTimeline>

/** 상태 변경과 댓글 작성이 섞인 일반적인 타임라인. */
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

/** 데이터를 불러오는 중인 상태. */
export const Loading: Story = { args: { activities: [], isLoading: true } }

/** 활동 기록이 없는 상태. */
export const Empty: Story = { args: { activities: [] } }
