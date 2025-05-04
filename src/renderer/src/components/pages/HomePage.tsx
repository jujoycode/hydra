import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { HomePageTemplate } from '@/templates/HomePageTemplate'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'

// 더미 데이터 - 실제 구현 시 API로 대체
import DUMMY_ISSUES from '../../../../../dummy/issues.json'

// 차트용 더미 데이터
const STATUS_COLORS = {
  in_progress: '#3B82F6', // 진행 중 - 파란색
  done: '#10B981', // 완료 - 초록색
  blocked: '#EF4444', // 차단됨 - 빨간색
  review: '#F59E0B' // 검토 중 - 노란색
}

// 버블 차트 데이터 (이슈 유형별 분포)
const bubbleData = [
  { name: 'UI/UX', value: 35, count: 12 },
  { name: 'Bug', value: 28, count: 18 },
  { name: 'Feature', value: 42, count: 22 },
  { name: 'Performance', value: 15, count: 8 },
  { name: 'Security', value: 20, count: 6 },
  { name: 'Documentation', value: 8, count: 4 }
]

// 트렌드 데이터
const trendData = [
  { name: 'January', created: 25, resolved: 20 },
  { name: 'February', created: 30, resolved: 22 },
  { name: 'March', created: 38, resolved: 30 },
  { name: 'April', created: 32, resolved: 28 },
  { name: 'May', created: 40, resolved: 35 },
  { name: 'June', created: 45, resolved: 40 }
]

// 프로젝트 진행 현황 데이터
const projectProgressData = [
  { name: 'Web App Development', completed: 75, remaining: 14 },
  { name: 'Mobile App', completed: 45, remaining: 30 },
  { name: 'Backend API', completed: 90, remaining: 7 },
  { name: 'Design System', completed: 60, remaining: 20 },
  { name: 'Infrastructure', completed: 30, remaining: 45 }
]

// 프로젝트별 이슈 분포 데이터
const projectIssueData = [
  { name: 'Web App Development', resolved: 45, in_progress: 15, blocked: 5 },
  { name: 'Mobile App', resolved: 20, in_progress: 30, blocked: 8 },
  { name: 'Backend API', resolved: 60, in_progress: 10, blocked: 2 },
  { name: 'Design System', resolved: 30, in_progress: 25, blocked: 0 },
  { name: 'Infrastructure', resolved: 15, in_progress: 20, blocked: 10 }
]

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

  // 컴포넌트 마운트 시 더미 데이터 로드
  useEffect(() => {
    if (!user) return

    // 더미 이슈 데이터 로드 및 타입 변환
    const issues = DUMMY_ISSUES.map((issue) => ({
      ...issue,
      state: issue.state || 'in_progress'
    }))

    // 상태별 이슈 데이터 설정 (차트용)
    const statusCount = {
      in_progress: 0,
      done: 0,
      blocked: 0,
      review: 0
    }

    issues.forEach((issue) => {
      if (Object.prototype.hasOwnProperty.call(statusCount, issue.state)) {
        statusCount[issue.state as keyof typeof statusCount]++
      }
    })

    setIssueStats({
      total: issues.length,
      inProgress: statusCount.in_progress,
      done: statusCount.done,
      blocked: statusCount.blocked,
      review: statusCount.review
    })

    setStatusData([
      { name: 'In Progress', value: statusCount.in_progress, color: STATUS_COLORS.in_progress },
      { name: 'Done', value: statusCount.done, color: STATUS_COLORS.done },
      { name: 'Blocked', value: statusCount.blocked, color: STATUS_COLORS.blocked },
      { name: 'Review', value: statusCount.review, color: STATUS_COLORS.review }
    ])
  }, [user])

  // 프로젝트 통계 계산
  const projectStats = {
    total: projectProgressData.length,
    active: projectProgressData.filter((p) => p.completed < 100).length,
    dueThisMonth: projectProgressData.filter((p) => p.remaining <= 14).length,
    avgProgress: Math.round(
      projectProgressData.reduce((acc, curr) => acc + curr.completed, 0) / projectProgressData.length
    )
  }

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
