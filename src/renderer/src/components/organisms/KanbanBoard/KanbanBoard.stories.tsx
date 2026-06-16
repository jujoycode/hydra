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
 * dnd-kit 기반 칸반 보드. 이슈 상태(backlog / in_progress / review / done / blocked)별 컬럼에 카드를 배치하고,
 * 카드를 다른 컬럼으로 드래그하면 `onMove(issueId, newState)`를 호출한다. 카드 클릭 시 `onSelectIssue`가 호출된다.
 * 프로젝트 보드 화면에서 이슈를 상태별로 시각화/이동할 때 사용한다.
 */
const meta: Meta<typeof KanbanBoard> = {
  title: 'Organisms/KanbanBoard',
  component: KanbanBoard,
  argTypes: {
    issues: {
      description: '보드에 표시할 이슈 배열. 각 이슈의 state 값에 따라 컬럼으로 분류된다.',
      control: 'object',
      table: { type: { summary: 'Issue[]' } }
    },
    onMove: {
      description: '카드를 다른 상태 컬럼으로 드롭했을 때 호출. (issueId: string, newState: IssueStatus) => void',
      control: false,
      table: { type: { summary: '(issueId: string, newState: IssueStatus) => void' } }
    },
    onSelectIssue: {
      description: '카드 클릭 시 호출(선택). (issue: Issue) => void',
      control: false,
      table: { type: { summary: '(issue: Issue) => void' } }
    }
  },
  args: { onMove: () => {} }
}
export default meta
type Story = StoryObj<typeof KanbanBoard>

/** 다섯 개 상태 컬럼에 이슈가 하나씩 배치된 기본 보드. */
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

/** 이슈가 없을 때 빈 컬럼만 표시되는 상태. */
export const Empty: Story = { args: { issues: [] } }
