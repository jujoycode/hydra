import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import { useAuth } from '@/hooks/use-auth'
import type { Issue, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
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
  const [issueStats, setIssueStats] = useState({
    total: 0,
    inProgress: 0,
    done: 0,
    review: 0,
    blocked: 0
  })
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      const projectResult = await window.callApi(IpcChannel.PROJECT_LIST, { userId: user.user_id })
      const projects = Array.isArray(projectResult.data) ? (projectResult.data as Project[]) : []

      const allIssues: Issue[] = []
      for (const project of projects) {
        const issueResult = await window.callApi(IpcChannel.ISSUE_LIST, { projectId: project.project_id })
        const projectIssues = Array.isArray(issueResult.data) ? (issueResult.data as Issue[]) : []
        allIssues.push(...projectIssues)
      }

      // 상태별 집계
      const statusCount = { open: 0, in_progress: 0, done: 0, review: 0, blocked: 0 }
      for (const issue of allIssues) {
        const status = issue.issue_status || 'open'
        if (status in statusCount) statusCount[status as keyof typeof statusCount]++
      }

      setIssueStats({
        total: allIssues.length,
        inProgress: statusCount.in_progress,
        done: statusCount.done,
        review: statusCount.review,
        blocked: statusCount.blocked
      })

      const statusColors = getStatusColors()
      setStatusData([
        { name: t('status.inProgress'), value: statusCount.in_progress, color: statusColors.in_progress },
        { name: t('status.done'), value: statusCount.done, color: statusColors.done },
        { name: t('status.blocked'), value: statusCount.blocked, color: statusColors.blocked },
        { name: t('status.review'), value: statusCount.review, color: statusColors.review }
      ])

      // 추이 데이터 (최근 6개월)
      const now = new Date()
      const months: TrendDataPoint[] = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = date.toLocaleString('ko', { month: 'short' })
        const monthStart = date.getTime()
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()

        const created = allIssues.filter((issue) => {
          const t = new Date(issue.issue_created_at || 0).getTime()
          return t >= monthStart && t <= monthEnd
        }).length

        const resolved = allIssues.filter((issue) => {
          const t = new Date(issue.issue_updated_at || 0).getTime()
          return issue.issue_status === 'done' && t >= monthStart && t <= monthEnd
        }).length

        months.push({ name: monthName, created, resolved })
      }
      setTrendData(months)
    }

    loadData()
  }, [user])

  if (!user) return null

  return <HomePageTemplate user={user} issueStats={issueStats} statusData={statusData} trendData={trendData} />
}
