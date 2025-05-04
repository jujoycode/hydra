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
  { name: '버그', value: 28, count: 18 },
  { name: '기능', value: 42, count: 22 },
  { name: '성능', value: 15, count: 8 },
  { name: '보안', value: 20, count: 6 },
  { name: '문서', value: 8, count: 4 }
]

// 트렌드 데이터
const trendData = [
  { name: '1월', 생성: 25, 해결: 20 },
  { name: '2월', 생성: 30, 해결: 22 },
  { name: '3월', 생성: 38, 해결: 30 },
  { name: '4월', 생성: 32, 해결: 28 },
  { name: '5월', 생성: 40, 해결: 35 },
  { name: '6월', 생성: 45, 해결: 40 }
]

// 프로젝트 진행 현황 데이터
const projectProgressData = [
  { name: '웹 앱 개발', 완료율: 75, 남은일수: 14 },
  { name: '모바일 앱', 완료율: 45, 남은일수: 30 },
  { name: '백엔드 API', 완료율: 90, 남은일수: 7 },
  { name: '디자인 시스템', 완료율: 60, 남은일수: 20 },
  { name: '인프라 구축', 완료율: 30, 남은일수: 45 }
]

// 프로젝트별 이슈 분포 데이터
const projectIssueData = [
  { name: '웹 앱 개발', 해결됨: 45, 진행중: 15, 차단됨: 5 },
  { name: '모바일 앱', 해결됨: 20, 진행중: 30, 차단됨: 8 },
  { name: '백엔드 API', 해결됨: 60, 진행중: 10, 차단됨: 2 },
  { name: '디자인 시스템', 해결됨: 30, 진행중: 25, 차단됨: 0 },
  { name: '인프라 구축', 해결됨: 15, 진행중: 20, 차단됨: 10 }
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
      { name: '진행 중', value: statusCount.in_progress, color: STATUS_COLORS.in_progress },
      { name: '완료', value: statusCount.done, color: STATUS_COLORS.done },
      { name: '차단됨', value: statusCount.blocked, color: STATUS_COLORS.blocked },
      { name: '검토 중', value: statusCount.review, color: STATUS_COLORS.review }
    ])
  }, [user])

  // 프로젝트 통계 계산
  const projectStats = {
    total: projectProgressData.length,
    active: projectProgressData.filter((p) => p.완료율 < 100).length,
    dueThisMonth: projectProgressData.filter((p) => p.남은일수 <= 14).length,
    avgProgress: Math.round(
      projectProgressData.reduce((acc, curr) => acc + curr.완료율, 0) / projectProgressData.length
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
