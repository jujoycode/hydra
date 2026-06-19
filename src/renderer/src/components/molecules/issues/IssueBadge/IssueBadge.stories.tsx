import type { Meta, StoryObj } from '@storybook/react'
import { IssueBadge } from './IssueBadge'

/**
 * 이슈 상태를 옅은 배경에 같은 계열의 글자와 아이콘을 얹은 배지로 표시한다. 라벨과 색은
 * statusTokens의 STATUS_LABEL, STATUS_CLASS에서, 아이콘은 내부 STATUS_ICON에서 상태값에 따라 가져온다.
 * variant는 전달받기만 하고 실제로는 사용하지 않으므로, 어떤 값을 지정해도 틴트 스타일 하나로만 렌더링한다.
 */
const meta: Meta<typeof IssueBadge> = {
  title: 'Molecules/IssueBadge',
  component: IssueBadge,
  argTypes: {
    state: {
      description: '공유 IssueStatus 값. 라벨과 색, 아이콘을 이 값으로 결정한다.',
      control: 'select',
      options: ['backlog', 'in_progress', 'review', 'done', 'blocked'],
      table: { type: { summary: "'backlog' | 'in_progress' | 'review' | 'done' | 'blocked'" } }
    },
    size: {
      description: '배지 크기.',
      control: 'radio',
      options: ['sm', 'lg'],
      table: { type: { summary: "'sm' | 'lg'" }, defaultValue: { summary: 'sm' } }
    },
    variant: {
      description: '호환을 위해 전달받을 뿐, 스타일에는 영향을 주지 않는다.',
      control: false,
      table: { type: { summary: "'solid' | 'subtle' | 'outline' | 'surface' | 'plain'" } }
    },
    className: {
      description: '배지에 추가할 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof IssueBadge>

/** 아직 착수하지 않은 backlog 상태. */
export const Backlog: Story = { args: { state: 'backlog' } }
/** 작업이 진행 중인 상태. */
export const InProgress: Story = { args: { state: 'in_progress' } }
/** 리뷰를 대기 중인 상태. */
export const Review: Story = { args: { state: 'review' } }
/** 완료된 이슈. */
export const Done: Story = { args: { state: 'done' } }
/** 무언가에 막혀 멈춘 상태. */
export const Blocked: Story = { args: { state: 'blocked' } }

/** 다섯 상태를 나란히 놓고 비교하는 용도. */
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

/** size를 lg로 지정한 배지. */
export const LargeSize: Story = { args: { state: 'in_progress', size: 'lg' } }
