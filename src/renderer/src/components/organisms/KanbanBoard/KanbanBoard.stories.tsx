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
 * dnd-kit으로 구현한 칸반 보드이다. backlog, in_progress, review, done, blocked 상태마다 컬럼이 하나씩
 * 있으며 이슈는 각자의 state에 해당하는 컬럼에 배치된다. 카드를 다른 컬럼으로 끌어다 놓으면 onMove가 새 상태와
 * 함께 호출되고, 카드를 클릭하면 onSelectIssue가 호출된다. 프로젝트 보드에서 이슈를 상태별로 보거나 옮길 때 사용한다.
 */
const meta: Meta<typeof KanbanBoard> = {
  title: 'Organisms/KanbanBoard',
  component: KanbanBoard,
  argTypes: {
    issues: {
      description: '보드에 표시할 이슈 목록이며, 각자의 state 값에 따라 컬럼에 분배된다.',
      control: 'object',
      table: { type: { summary: 'Issue[]' } }
    },
    onMove: {
      description: '카드를 다른 상태 컬럼에 놓았을 때 호출된다.',
      control: false,
      table: { type: { summary: '(issueId: string, newState: IssueStatus) => void' } }
    },
    onSelectIssue: {
      description: '카드를 클릭하면 호출된다. 선택 사항이다.',
      control: false,
      table: { type: { summary: '(issue: Issue) => void' } }
    }
  },
  args: { onMove: () => {} }
}
export default meta
type Story = StoryObj<typeof KanbanBoard>

/** 다섯 개 컬럼에 이슈를 하나씩 배치한 기본 보드이다. */
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

/** 이슈가 하나도 없어 빈 컬럼만 표시되는 상태이다. */
export const Empty: Story = { args: { issues: [] } }
