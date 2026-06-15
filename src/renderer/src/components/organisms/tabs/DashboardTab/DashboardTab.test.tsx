import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DashboardTab } from './DashboardTab'

// 커넥티드 organism을 앱 프로바이더(Theme + Query + i18n)로 렌더하는 예시 테스트.
// renderWithProviders 하니스가 i18n 번역까지 정상 동작함을 검증한다.
describe('DashboardTab', () => {
  const props = {
    issueStats: { total: 10, inProgress: 3, done: 5, blocked: 1, review: 1 },
    statusData: [
      { name: 'Done', value: 5, color: 'var(--chart-1)' },
      { name: 'In Progress', value: 3, color: 'var(--chart-2)' }
    ],
    trendData: [
      { name: 'Mon', created: 2, resolved: 1 },
      { name: 'Tue', created: 3, resolved: 4 }
    ]
  }

  it('통계 카드와 차트가 프로바이더 하니스에서 렌더된다', () => {
    render(<DashboardTab {...props} />)
    // i18n 번역 키가 실제 문자열로 치환되어 노출된다(translation 누락 시 'stats.totalIssues' 키 그대로 노출됨)
    expect(screen.getByText('전체 이슈')).toBeInTheDocument()
  })

  it('완료율이 issueStats로부터 계산된다', () => {
    render(<DashboardTab {...props} />)
    // done(5) / total(10) = 50%
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
