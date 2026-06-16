import type { Meta, StoryObj } from '@storybook/react'
import { IssueBadge } from './IssueBadge'

/**
 * 이슈 상태(IssueStatus)를 색상 틴트 배경 + 동계열 텍스트 + 아이콘 배지로 표시하는 컴포넌트.
 * 라벨/색상/아이콘은 상태값에 따라 statusTokens(STATUS_LABEL/STATUS_CLASS)와 내부 STATUS_ICON에서 결정된다.
 * `variant`는 호환을 위해 받지만 무시되며 항상 동일한 틴트 스타일로 렌더한다.
 */
const meta: Meta<typeof IssueBadge> = {
  title: 'Molecules/IssueBadge',
  component: IssueBadge,
  argTypes: {
    state: {
      description: '이슈 상태값(공유 IssueStatus union). 라벨/색상/아이콘을 결정한다.',
      control: 'select',
      options: ['backlog', 'in_progress', 'review', 'done', 'blocked'],
      table: { type: { summary: "'backlog' | 'in_progress' | 'review' | 'done' | 'blocked'" } }
    },
    size: {
      description: '배지 크기',
      control: 'radio',
      options: ['sm', 'lg'],
      table: { type: { summary: "'sm' | 'lg'" }, defaultValue: { summary: 'sm' } }
    },
    variant: {
      description: '호환용으로 받지만 사용하지 않는다(스타일에 영향 없음).',
      control: false,
      table: { type: { summary: "'solid' | 'subtle' | 'outline' | 'surface' | 'plain'" } }
    },
    className: {
      description: '배지에 합쳐지는 추가 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof IssueBadge>

/** Backlog 상태 배지. */
export const Backlog: Story = { args: { state: 'backlog' } }
/** In progress 상태 배지. */
export const InProgress: Story = { args: { state: 'in_progress' } }
/** Review 상태 배지. */
export const Review: Story = { args: { state: 'review' } }
/** Done 상태 배지. */
export const Done: Story = { args: { state: 'done' } }
/** Blocked 상태 배지. */
export const Blocked: Story = { args: { state: 'blocked' } }

/** 모든 상태값을 한눈에 비교. */
export const AllStates: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <IssueBadge state='backlog' />
      <IssueBadge state='in_progress' />
      <IssueBadge state='review' />
      <IssueBadge state='done' />
      <IssueBadge state='blocked' />
    </div>
  )
}

/** lg 크기 배지. */
export const LargeSize: Story = { args: { state: 'in_progress', size: 'lg' } }
