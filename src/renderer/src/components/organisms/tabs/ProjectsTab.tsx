import { useMemo } from 'react'
import { BubbleChart, type BubbleDataPoint } from '@/atoms/charts/BubbleChart'
import { StackedBarChart, type StackDataPoint } from '@/atoms/charts/StackedBarChart'
import { HorizontalBarChart, type BarDataPoint } from '@/atoms/charts/HorizontalBarChart'
import { StatCard } from '@/molecules/cards/StatCard'
import { ChartCard } from '@/molecules/cards/ChartCard'
import { Folders, GitBranch, Calendar, Percent, Timer, GitPullRequest } from 'lucide-react'

interface ProjectProgress extends BarDataPoint {
  completed: number
  remaining: number
}

interface ProjectIssue extends StackDataPoint {
  resolved: number
  in_progress: number
  blocked: number
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
  // Stack bar chart configuration
  const projectIssueBars = useMemo(
    () => [
      {
        dataKey: 'resolved',
        stackId: 'a',
        fill: '#10B981'
      },
      {
        dataKey: 'inProgress',
        stackId: 'a',
        fill: '#3B82F6'
      },
      {
        dataKey: 'blocked',
        stackId: 'a',
        fill: '#EF4444',
        radius: [0, 4, 4, 0] as [number, number, number, number]
      }
    ],
    []
  )

  // Deadline chart bubble data transformation
  const deadlineBubbleData = useMemo<BubbleDataPoint[]>(() => {
    return projectProgressData.map((project) => ({
      name: project.name,
      value: project.remaining,
      count: project.completed
    }))
  }, [projectProgressData])

  return (
    <div className='h-full overflow-auto p-4 bg-slate-50/50 dark:bg-slate-900/20'>
      {/* Top statistics cards */}
      <div className='grid grid-cols-4 gap-3 mb-5'>
        <StatCard
          title='Total Projects'
          value={projectStats.total}
          change='+2'
          icon={<Folders className='text-white h-5 w-5' />}
          colorScheme='indigo'
        />

        <StatCard
          title='In Progress'
          value={projectStats.active}
          icon={<GitBranch className='text-white h-5 w-5' />}
          colorScheme='cyan'
        />

        <StatCard
          title='Due Soon'
          value={projectStats.dueThisMonth}
          icon={<Calendar className='text-white h-5 w-5' />}
          colorScheme='rose'
        />

        <StatCard
          title='Average Progress'
          value={`${projectStats.avgProgress}%`}
          icon={<Percent className='text-white h-5 w-5' />}
          colorScheme='emerald'
        />
      </div>

      {/* Chart section */}
      <div className='grid grid-cols-3 gap-4'>
        {/* Project progress chart */}
        <ChartCard
          title='Project Progress'
          icon={<Percent />}
          iconBgColor='bg-indigo-100 dark:bg-indigo-900/30'
          iconColor='text-indigo-600 dark:text-indigo-400'
        >
          <HorizontalBarChart
            data={projectProgressData}
            dataKey='completionRate'
            height={200}
            gradientId='progressGradient'
            gradientColors={{ start: '#8B5CF6', end: '#C084FC' }}
            domain={[0, 100]}
            formatter={(value) => [`${value}%`, 'Completion Rate']}
          />
        </ChartCard>

        {/* Project issues distribution chart */}
        <ChartCard
          title='Project Issues'
          icon={<GitPullRequest />}
          iconBgColor='bg-sky-100 dark:bg-sky-900/30'
          iconColor='text-sky-600 dark:text-sky-400'
        >
          <StackedBarChart data={projectIssueData} bars={projectIssueBars} height={200} />
        </ChartCard>

        {/* Project deadline status chart */}
        <ChartCard
          title='Deadline Status'
          icon={<Timer />}
          iconBgColor='bg-rose-100 dark:bg-rose-900/30'
          iconColor='text-rose-600 dark:text-rose-400'
        >
          <BubbleChart
            data={deadlineBubbleData}
            height={200}
            xAxisConfig={{
              dataKey: 'value',
              name: 'Days Remaining',
              type: 'number'
            }}
            yAxisConfig={{
              dataKey: 'name',
              name: 'Project'
            }}
            zAxisConfig={{
              dataKey: 'count',
              name: 'Progress',
              range: [30, 150]
            }}
            tooltipFormatter={(value, name) => {
              if (name === 'count') return [`${value}%`, 'Progress']
              if (name === 'value') return [`${value} days`, 'Time Remaining']
              return [value, name]
            }}
            colors={deadlineBubbleData.map((entry) => {
              // Colors determined by remaining days
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
