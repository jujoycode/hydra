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

/**
 * dnd-kit으로 만든 칸반 보드다. backlog, in_progress, review, done, blocked 같은 상태마다 컬럼이 하나씩
 * 있고 이슈는 자기 state에 맞는 컬럼으로 들어간다. 카드를 다른 컬럼으로 끌어다 놓으면 onMove가 새 상태를 들고
 * 불리고, 카드를 그냥 누르면 onSelectIssue가 불린다. 프로젝트 보드에서 이슈를 상태별로 펼쳐 보거나 옮길 때 쓴다.
 */
const meta: Meta<typeof KanbanBoard> = {
  title: 'Organisms/KanbanBoard',
  component: KanbanBoard,
  argTypes: {
    issues: {
      description: '보드에 뿌릴 이슈 목록인데, 각자 state 값을 보고 알아서 컬럼에 나뉘어 들어간다.',
      control: 'object',
      table: { type: { summary: 'Issue[]' } }
    },
    onMove: {
      description: '카드를 다른 상태 컬럼에 떨어뜨렸을 때 불린다.',
      control: false,
      table: { type: { summary: '(issueId: string, newState: IssueStatus) => void' } }
    },
    onSelectIssue: {
      description: '카드를 클릭하면 불린다. 굳이 안 넘겨도 된다.',
      control: false,
      table: { type: { summary: '(issue: Issue) => void' } }
    }
  },
  args: { onMove: () => {} }
}
export default meta
type Story = StoryObj<typeof KanbanBoard>

/** 다섯 컬럼에 이슈를 하나씩 깔아둔 기본 보드. */
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

/** 이슈가 하나도 없어서 빈 컬럼만 남은 상태. */
export const Empty: Story = { args: { issues: [] } }
