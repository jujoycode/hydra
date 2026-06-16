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
 * 이슈의 활동 로그(상태 변경 / 담당자 변경 / 댓글 작성)를 시간순 목록으로 표시하는 컴포넌트.
 * 각 항목은 `activity_action`과 `activity_metadata`를 사람이 읽을 문장으로 변환해 보여준다.
 * 로딩 중이거나 활동이 없을 때는 안내 문구를 대신 렌더한다.
 */
const meta: Meta<typeof ActivityTimeline> = {
  title: 'Molecules/ActivityTimeline',
  component: ActivityTimeline,
  argTypes: {
    activities: {
      description:
        '표시할 활동 로그 배열. 각 항목은 ActivityLogRecord(activity_id, activity_action, activity_metadata, activity_created_at 등)이며 status_changed/assigned는 metadata의 from→to를, comment_created는 고정 문구를 렌더한다.',
      control: 'object',
      table: { type: { summary: 'ActivityLogRecord[]' } }
    },
    isLoading: {
      description: 'true이면 활동 대신 로딩 안내 문구를 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ActivityTimeline>

/** 상태 변경 + 댓글 작성 활동이 섞인 기본 타임라인. */
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

/** 데이터를 불러오는 중인 로딩 상태. */
export const Loading: Story = { args: { activities: [], isLoading: true } }

/** 활동이 하나도 없을 때의 빈 상태. */
export const Empty: Story = { args: { activities: [] } }
