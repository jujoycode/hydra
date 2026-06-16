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
 * 이슈에 쌓인 활동 로그를 시간순으로 늘어놓는다. 상태나 담당자 변경, 댓글 작성 같은 기록을
 * 다루는데, 각 줄은 activity_action과 activity_metadata를 사람이 읽을 만한 문장으로 바꿔 보여준다.
 * 불러오는 중이거나 아직 활동이 하나도 없으면 목록 대신 짤막한 안내 문구만 뜬다.
 */
const meta: Meta<typeof ActivityTimeline> = {
  title: 'Molecules/ActivityTimeline',
  component: ActivityTimeline,
  argTypes: {
    activities: {
      description:
        '보여줄 활동 로그 배열. status_changed나 assigned면 metadata를 읽어 무엇이 어떻게 바뀌었는지 적고, comment_created는 정해진 문구를 쓴다.',
      control: 'object',
      table: { type: { summary: 'ActivityLogRecord[]' } }
    },
    isLoading: {
      description: '켜면 활동 목록 대신 불러오는 중이라는 문구를 띄운다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ActivityTimeline>

/** 상태 변경과 댓글 작성이 섞여 있는 흔한 타임라인. */
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

/** 아직 데이터를 받아오는 중일 때. */
export const Loading: Story = { args: { activities: [], isLoading: true } }

/** 활동이 전혀 없을 때 보이는 모습. */
export const Empty: Story = { args: { activities: [] } }
