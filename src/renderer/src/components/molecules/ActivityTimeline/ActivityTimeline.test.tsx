import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ActivityLogRecord } from '@/interface/CoreInterface'
import { ActivityTimeline, describeActivity } from './ActivityTimeline'

const rec = (over: Partial<ActivityLogRecord>): ActivityLogRecord => ({
  activity_id: 'a',
  activity_entity_type: 'issue',
  activity_entity_id: 'i1',
  activity_action: 'comment_created',
  activity_actor_id: null,
  activity_metadata: null,
  activity_created_at: null,
  ...over
})

describe('describeActivity', () => {
  it('status_changed를 from→to로 표현한다', () => {
    const text = describeActivity(
      rec({ activity_action: 'status_changed', activity_metadata: JSON.stringify({ from: 'backlog', to: 'done' }) })
    )
    expect(text).toBe('changed status: backlog → done')
  })

  it('comment_created는 라벨로 표현한다', () => {
    expect(describeActivity(rec({ activity_action: 'comment_created' }))).toBe('added a comment')
  })

  it('알 수 없는 action은 원문을 반환한다', () => {
    expect(describeActivity(rec({ activity_action: 'weird' }))).toBe('weird')
  })
})

describe('ActivityTimeline', () => {
  it('로딩 / 빈 / 목록 상태를 렌더한다', () => {
    const { container, rerender } = render(<ActivityTimeline activities={[]} isLoading />)
    expect(container.textContent).toContain('Loading')

    rerender(<ActivityTimeline activities={[]} />)
    expect(container.textContent).toContain('No activity')

    rerender(<ActivityTimeline activities={[rec({ activity_action: 'comment_created' })]} />)
    expect(container.textContent).toContain('added a comment')
  })
})
