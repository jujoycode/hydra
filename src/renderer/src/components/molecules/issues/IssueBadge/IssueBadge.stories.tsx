import type { Meta, StoryObj } from '@storybook/react'
import { IssueBadge } from './IssueBadge'

const meta: Meta<typeof IssueBadge> = {
  title: 'Molecules/IssueBadge',
  component: IssueBadge
}
export default meta
type Story = StoryObj<typeof IssueBadge>

export const Backlog: Story = { args: { state: 'backlog' } }
export const InProgress: Story = { args: { state: 'in_progress' } }
export const Review: Story = { args: { state: 'review' } }
export const Done: Story = { args: { state: 'done' } }
export const Blocked: Story = { args: { state: 'blocked' } }

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
