import { useEffect, useState } from 'react'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { BubbleDataPoint } from '@/atoms/charts/BubbleChart'
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
  const [bubbleData, setBubbleData] = useState<BubbleDataPoint[]>([])
  const [projectStats, setProjectStats] = useState({
    total: 0,
    active: 0,
    dueThisMonth: 0,
    avgProgress: 0
  })
  const [projectProgressData, setProjectProgressData] = useState<
    { name: string; completed: number; remaining: number; [key: string]: string | number }[]
  >([])
  const [projectIssueData, setProjectIssueData] = useState<
    { name: string; resolved: number; in_progress: number; blocked: number; [key: string]: string | number }[]
  >([])

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      // Fetch all projects for the user
      const projectResult = await window.callApi(IpcChannel.PROJECT_LIST, { userId: user.user_id })
      const projects = Array.isArray(projectResult.data) ? (projectResult.data as Project[]) : []

      // Fetch all issues across all projects
      const allIssues: Issue[] = []
      for (const project of projects) {
        const issueResult = await window.callApi(IpcChannel.ISSUE_LIST, { projectId: project.project_id })
        const projectIssues = Array.isArray(issueResult.data) ? (issueResult.data as Issue[]) : []
        allIssues.push(...projectIssues)
      }

      // Compute status counts
      const statusCount = { open: 0, in_progress: 0, done: 0, review: 0, blocked: 0 }
      for (const issue of allIssues) {
        const status = issue.issue_status || 'open'
        if (status in statusCount) statusCount[status as keyof typeof statusCount]++
      }

      // Issue stats
      setIssueStats({
        total: allIssues.length,
        inProgress: statusCount.in_progress,
        done: statusCount.done,
        review: statusCount.review,
        blocked: statusCount.blocked
      })

      // Status donut chart data
      setStatusData([
        { name: 'In Progress', value: statusCount.in_progress, color: STATUS_COLORS.in_progress },
        { name: 'Done', value: statusCount.done, color: STATUS_COLORS.done },
        { name: 'Blocked', value: statusCount.blocked, color: STATUS_COLORS.blocked },
        { name: 'Review', value: statusCount.review, color: STATUS_COLORS.review }
      ])

      // Bubble chart data (issue categories)
      const categoryCounts: Record<string, number> = {}
      for (const issue of allIssues) {
        const category = issue.issue_category || 'uncategorized'
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }
      setBubbleData(
        Object.entries(categoryCounts).map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: count * 5,
          count
        }))
      )

      // Trend data (last 6 months)
      const now = new Date()
      const months: TrendDataPoint[] = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = date.toLocaleString('en', { month: 'long' })
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

      // Project stats
      setProjectStats({
        total: projects.length,
        active: projects.length,
        dueThisMonth: 0,
        avgProgress: allIssues.length > 0 ? Math.round((statusCount.done / allIssues.length) * 100) : 0
      })

      // Project progress data
      setProjectProgressData(
        projects.map((project) => {
          const projectIssues = allIssues.filter((i) => i.project_id === project.project_id)
          const doneCount = projectIssues.filter((i) => i.issue_status === 'done').length
          const completed = projectIssues.length > 0 ? Math.round((doneCount / projectIssues.length) * 100) : 0
          return {
            name: project.project_name,
            completed,
            remaining: projectIssues.length - doneCount
          }
        })
      )

      // Project issue distribution data
      setProjectIssueData(
        projects.map((project) => {
          const projectIssues = allIssues.filter((i) => i.project_id === project.project_id)
          return {
            name: project.project_name,
            resolved: projectIssues.filter((i) => i.issue_status === 'done').length,
            in_progress: projectIssues.filter((i) => i.issue_status === 'in_progress').length,
            blocked: projectIssues.filter((i) => i.issue_status === 'blocked').length
          }
        })
      )
    }

    loadData()
  }, [user])

  if (!user) return null

  return (
    <HomePageTemplate
      user={user}
      issueStats={issueStats}
      statusData={statusData}
      trendData={trendData}
      bubbleData={bubbleData}
      projectStats={projectStats}
      projectProgressData={projectProgressData}
      projectIssueData={projectIssueData}
    />
  )
}
