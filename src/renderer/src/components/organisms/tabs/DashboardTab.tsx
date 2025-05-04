import { useMemo } from 'react'
import { BubbleChart, type BubbleDataPoint } from '@/atoms/charts/BubbleChart'
import { AreaTrendChart, type TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import { StatusDonutChart, type StatusData } from '@/atoms/charts/StatusDonutChart'
import { StatCard } from '@/molecules/cards/StatCard'
import { ChartCard } from '@/molecules/cards/ChartCard'
import { ListTodo, Clock, CheckCircle2, AlertCircle, PieChartIcon, TrendingUp, Bug } from 'lucide-react'

interface DashboardTabProps {
  issueStats: {
    total: number
    inProgress: number
    done: number
    blocked: number
    review: number
  }
  statusData: StatusData[]
  trendData: TrendDataPoint[]
  bubbleData: BubbleDataPoint[]
}

export const DashboardTab = ({ issueStats, statusData, trendData, bubbleData }: DashboardTabProps) => {
  // Trend chart line configuration
  const trendLines = useMemo(
    () => [
      {
        dataKey: 'created',
        color: '#3B82F6',
        gradientId: 'colorIssue'
      },
      {
        dataKey: 'resolved',
        color: '#10B981',
        gradientId: 'colorResolve'
      }
    ],
    []
  )

  return (
    <div className='h-full overflow-auto p-4 bg-slate-50/50 dark:bg-slate-900/20'>
      {/* Top statistic cards */}
      <div className='grid grid-cols-5 gap-3 mb-5'>
        <StatCard
          title='Total Issues'
          value={issueStats.total}
          change='+12%'
          icon={<ListTodo className='text-white h-5 w-5' />}
          colorScheme='blue'
        />

        <StatCard
          title='In Progress'
          value={issueStats.inProgress}
          change='+8%'
          icon={<Clock className='text-white h-5 w-5' />}
          colorScheme='cyan'
        />

        <StatCard
          title='Completed'
          value={issueStats.done}
          change='+15%'
          icon={<CheckCircle2 className='text-white h-5 w-5' />}
          colorScheme='emerald'
        />

        <StatCard
          title='In Review'
          value={issueStats.review}
          change='+5%'
          icon={<PieChartIcon className='text-white h-5 w-5' />}
          colorScheme='amber'
        />

        <StatCard
          title='Blocked'
          value={issueStats.blocked}
          change='-4%'
          icon={<AlertCircle className='text-white h-5 w-5' />}
          colorScheme='rose'
        />
      </div>

      {/* Chart section */}
      <div className='grid grid-cols-3 gap-4'>
        {/* Issue status donut chart */}
        <ChartCard
          title='Issue Status Distribution'
          icon={<PieChartIcon />}
          iconBgColor='bg-indigo-100 dark:bg-indigo-900/30'
          iconColor='text-indigo-600 dark:text-indigo-400'
        >
          <StatusDonutChart data={statusData} height={200} />
          <div className='flex flex-wrap justify-center items-center gap-2 mt-2'>
            {statusData.map((entry) => (
              <div key={entry.name} className='flex items-center gap-1 text-[10px]'>
                <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: entry.color }}></div>
                <span className='font-medium'>{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Issue trend chart */}
        <ChartCard
          title='Issue Trend'
          icon={<TrendingUp />}
          iconBgColor='bg-sky-100 dark:bg-sky-900/30'
          iconColor='text-sky-600 dark:text-sky-400'
        >
          <AreaTrendChart data={trendData} lines={trendLines} height={200} />
        </ChartCard>

        {/* Issue type bubble chart */}
        <ChartCard
          title='Issue Type Distribution'
          icon={<Bug />}
          iconBgColor='bg-purple-100 dark:bg-purple-900/30'
          iconColor='text-purple-600 dark:text-purple-400'
        >
          <BubbleChart data={bubbleData} height={200} />
        </ChartCard>
      </div>
    </div>
  )
}
