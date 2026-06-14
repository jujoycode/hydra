import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import { Skeleton } from '@/atoms/Skeleton'
import { useAuth } from '@/hooks/use-auth'
import { useDashboardIssues } from '@/hooks/use-issues'
import { getCssVar } from '@/lib/statusTokens'
import { HomePageTemplate } from '@/templates/HomePageTemplate'

// 도넛 차트 색은 토큰을 런타임 hex로 읽어 SVG fill에 주입(라이트/다크 추종)
const getStatusColors = () => ({
  in_progress: getCssVar('--chart-1'),
  done: getCssVar('--success'),
  blocked: getCssVar('--destructive'),
  review: getCssVar('--chart-4')
})

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useTranslation('dashboard')

  // 사용자가 속한 프로젝트의 모든 이슈를 단일 쿼리로 조회 (N+1 제거)
  const { data: allIssues = [], isLoading } = useDashboardIssues(user?.user_id)

  const { issueStats, statusData, trendData } = useMemo(() => {
    const statusCount = { open: 0, in_progress: 0, done: 0, review: 0, blocked: 0 }
    for (const issue of allIssues) {
      const status = issue.issue_status || 'open'
      if (status in statusCount) statusCount[status as keyof typeof statusCount]++
    }

    const statusColors = getStatusColors()
    const status: StatusData[] = [
      { name: t('status.inProgress'), value: statusCount.in_progress, color: statusColors.in_progress },
      { name: t('status.done'), value: statusCount.done, color: statusColors.done },
      { name: t('status.blocked'), value: statusCount.blocked, color: statusColors.blocked },
      { name: t('status.review'), value: statusCount.review, color: statusColors.review }
    ]

    const now = new Date()
    const months: TrendDataPoint[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('ko', { month: 'short' })
      const monthStart = date.getTime()
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()

      const created = allIssues.filter((issue) => {
        const ts = new Date(issue.issue_created_at || 0).getTime()
        return ts >= monthStart && ts <= monthEnd
      }).length

      const resolved = allIssues.filter((issue) => {
        const ts = new Date(issue.issue_updated_at || 0).getTime()
        return issue.issue_status === 'done' && ts >= monthStart && ts <= monthEnd
      }).length

      months.push({ name: monthName, created, resolved })
    }

    return {
      issueStats: {
        total: allIssues.length,
        inProgress: statusCount.in_progress,
        done: statusCount.done,
        review: statusCount.review,
        blocked: statusCount.blocked
      },
      statusData: status,
      trendData: months
    }
  }, [allIssues, t])

  if (!user) return null

  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-24 w-full' />
          ))}
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Skeleton className='h-72 w-full' />
          <Skeleton className='h-72 w-full' />
        </div>
      </div>
    )
  }

  return <HomePageTemplate user={user} issueStats={issueStats} statusData={statusData} trendData={trendData} />
}
