import { useMemo } from 'react'
import { BubbleChart, type BubbleDataPoint } from '@/atoms/charts/BubbleChart'
import { StackedBarChart, type StackDataPoint } from '@/atoms/charts/StackedBarChart'
import { HorizontalBarChart, type BarDataPoint } from '@/atoms/charts/HorizontalBarChart'
import { StatCard } from '@/molecules/cards/StatCard'
import { ChartCard } from '@/molecules/cards/ChartCard'
import { Folders, GitBranch, Calendar, Percent, Timer, GitPullRequest } from 'lucide-react'

interface ProjectProgress extends BarDataPoint {
  완료율: number
  남은일수: number
}

interface ProjectIssue extends StackDataPoint {
  해결됨: number
  진행중: number
  차단됨: number
}

interface ProjectsTabProps {
  projectStats: {
    total: number
    active: number
    dueThisMonth: number
    avgProgress: number
  }
  projectProgressData: ProjectProgress[]
  projectIssueData: ProjectIssue[]
}

export const ProjectsTab = ({ projectStats, projectProgressData, projectIssueData }: ProjectsTabProps) => {
  // 스택 바 차트 설정
  const projectIssueBars = useMemo(
    () => [
      {
        dataKey: '해결됨',
        stackId: 'a',
        fill: '#10B981'
      },
      {
        dataKey: '진행중',
        stackId: 'a',
        fill: '#3B82F6'
      },
      {
        dataKey: '차단됨',
        stackId: 'a',
        fill: '#EF4444',
        radius: [0, 4, 4, 0] as [number, number, number, number]
      }
    ],
    []
  )

  // 마감일 차트용 버블 데이터 변환
  const deadlineBubbleData = useMemo<BubbleDataPoint[]>(() => {
    return projectProgressData.map((project) => ({
      name: project.name,
      value: project.남은일수,
      count: project.완료율
    }))
  }, [projectProgressData])

  return (
    <div className='h-full overflow-auto p-4 bg-slate-50/50 dark:bg-slate-900/20'>
      {/* 상단 통계 카드 */}
      <div className='grid grid-cols-4 gap-3 mb-5'>
        <StatCard
          title='총 프로젝트'
          value={projectStats.total}
          change='+2'
          icon={<Folders className='text-white h-5 w-5' />}
          colorScheme='indigo'
        />

        <StatCard
          title='진행 중'
          value={projectStats.active}
          icon={<GitBranch className='text-white h-5 w-5' />}
          colorScheme='cyan'
        />

        <StatCard
          title='마감 임박'
          value={projectStats.dueThisMonth}
          icon={<Calendar className='text-white h-5 w-5' />}
          colorScheme='rose'
        />

        <StatCard
          title='평균 진행률'
          value={`${projectStats.avgProgress}%`}
          icon={<Percent className='text-white h-5 w-5' />}
          colorScheme='emerald'
        />
      </div>

      {/* 차트 섹션 */}
      <div className='grid grid-cols-3 gap-4'>
        {/* 프로젝트 진행률 차트 */}
        <ChartCard
          title='프로젝트 진행률'
          icon={<Percent />}
          iconBgColor='bg-indigo-100 dark:bg-indigo-900/30'
          iconColor='text-indigo-600 dark:text-indigo-400'
        >
          <HorizontalBarChart
            data={projectProgressData}
            dataKey='완료율'
            height={200}
            gradientId='progressGradient'
            gradientColors={{ start: '#8B5CF6', end: '#C084FC' }}
            domain={[0, 100]}
            formatter={(value) => [`${value}%`, '완료율']}
          />
        </ChartCard>

        {/* 프로젝트별 이슈 분포 차트 */}
        <ChartCard
          title='프로젝트별 이슈'
          icon={<GitPullRequest />}
          iconBgColor='bg-sky-100 dark:bg-sky-900/30'
          iconColor='text-sky-600 dark:text-sky-400'
        >
          <StackedBarChart data={projectIssueData} bars={projectIssueBars} height={200} />
        </ChartCard>

        {/* 프로젝트 마감일 현황 차트 */}
        <ChartCard
          title='마감일 현황'
          icon={<Timer />}
          iconBgColor='bg-rose-100 dark:bg-rose-900/30'
          iconColor='text-rose-600 dark:text-rose-400'
        >
          <BubbleChart
            data={deadlineBubbleData}
            height={200}
            xAxisConfig={{
              dataKey: 'value',
              name: '남은 일수',
              type: 'number'
            }}
            yAxisConfig={{
              dataKey: 'name',
              name: '프로젝트'
            }}
            zAxisConfig={{
              dataKey: 'count',
              name: '진행률',
              range: [30, 150]
            }}
            tooltipFormatter={(value, name) => {
              if (name === 'count') return [`${value}%`, '진행률']
              if (name === 'value') return [`${value}일`, '남은 기간']
              return [value, name]
            }}
            colors={deadlineBubbleData.map((entry) => {
              // 색상은 남은 일수에 따라 결정
              const days = entry.value as number
              if (days <= 7) return '#EF4444'
              else if (days <= 14) return '#F59E0B'
              else if (days <= 30) return '#3B82F6'
              else return '#10B981'
            })}
          />
        </ChartCard>
      </div>
    </div>
  )
}
