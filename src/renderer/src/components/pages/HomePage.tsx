import { useEffect, useState } from 'react'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import { useAuth } from '@/hooks/use-auth'
import type { Issue, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { HomePageTemplate } from '@/templates/HomePageTemplate'

const STATUS_COLORS = {
  in_progress: '#3B82F6',
  done: '#10B981',
  blocked: '#EF4444',
  review: '#F59E0B'
}

export default function HomePage() {
  const { user } = useAuth()
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

      setStatusData([
        { name: '진행 중', value: statusCount.in_progress, color: STATUS_COLORS.in_progress },
        { name: '완료', value: statusCount.done, color: STATUS_COLORS.done },
        { name: '차단됨', value: statusCount.blocked, color: STATUS_COLORS.blocked },
        { name: '검토 중', value: statusCount.review, color: STATUS_COLORS.review }
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

        months.push({ name: monthName, 생성: created, 해결: resolved })
      }
      setTrendData(months)
    }

    loadData()
  }, [user])

  if (!user) return null

  return <HomePageTemplate user={user} issueStats={issueStats} statusData={statusData} trendData={trendData} />
}
