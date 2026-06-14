import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Issue } from '@/types/issue'
import { KanbanBoard } from './KanbanBoard'

const issue = (over: Partial<Issue>): Issue => ({
  id: Math.random().toString(36).slice(2),
  type: 'feature',
  key: 'HYD-1',
  title: 'Sample',
  created: new Date(),
  updated: new Date(),
  reporter: { name: 'user', avatar: '' },
  assignee: '',
  state: 'backlog',
  ...over
})

describe('KanbanBoard', () => {
  it('5개 상태 컬럼과 카드를 렌더한다(빈 컬럼 포함)', () => {
    render(<KanbanBoard issues={[issue({ title: 'Card A', state: 'backlog' })]} onMove={vi.fn()} />)
    // 컬럼 헤더(라벨)
    expect(screen.getByText(/대기/)).toBeInTheDocument()
    expect(screen.getByText(/완료/)).toBeInTheDocument()
    expect(screen.getByText(/차단/)).toBeInTheDocument()
    // 카드
    expect(screen.getByText('Card A')).toBeInTheDocument()
  })
})
