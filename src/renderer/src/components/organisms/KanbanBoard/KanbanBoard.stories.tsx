import type { Meta, StoryObj } from '@storybook/react'
import type { Issue } from '@/types/issue'
import { KanbanBoard } from './KanbanBoard'

const issue = (over: Partial<Issue>): Issue => ({
  id: Math.random().toString(36).slice(2),
  type: 'feature',
  key: 'HYD-1',
  title: 'Sample issue',
  created: new Date(),
  updated: new Date(),
  reporter: { name: 'user', avatar: '' },
  assignee: '',
  state: 'backlog',
  ...over
})

const meta: Meta<typeof KanbanBoard> = {
  title: 'Organisms/KanbanBoard',
  component: KanbanBoard,
  args: { onMove: () => {} }
}
export default meta
type Story = StoryObj<typeof KanbanBoard>

export const Default: Story = {
  args: {
    issues: [
      issue({ title: 'Set up CI', state: 'backlog', key: 'H-1' }),
      issue({ title: 'Build kanban', state: 'in_progress', key: 'H-2' }),
      issue({ title: 'Review PR', state: 'review', key: 'H-3' }),
      issue({ title: 'Ship v1', state: 'done', key: 'H-4' }),
      issue({ title: 'Blocked task', state: 'blocked', key: 'H-5' })
    ]
  }
}

export const Empty: Story = { args: { issues: [] } }
