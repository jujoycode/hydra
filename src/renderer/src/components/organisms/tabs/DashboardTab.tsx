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
  // 트렌드 차트 라인 설정
  const trendLines = useMemo(
    () => [
      {
        dataKey: '생성',
        color: '#3B82F6',
        gradientId: 'colorIssue'
      },
      {
        dataKey: '해결',
        color: '#10B981',
        gradientId: 'colorResolve'
      }
    ],
    []
  )

  return (
    <div className='h-full overflow-auto p-4 bg-slate-50/50 dark:bg-slate-900/20'>
      {/* 상단 통계 카드 */}
      <div className='grid grid-cols-5 gap-3 mb-5'>
        <StatCard
          title='총 이슈'
          value={issueStats.total}
          change='+12%'
          icon={<ListTodo className='text-white h-5 w-5' />}
          colorScheme='blue'
        />

        <StatCard
          title='진행 중'
          value={issueStats.inProgress}
          change='+8%'
          icon={<Clock className='text-white h-5 w-5' />}
          colorScheme='cyan'
        />

        <StatCard
          title='완료'
          value={issueStats.done}
          change='+15%'
          icon={<CheckCircle2 className='text-white h-5 w-5' />}
          colorScheme='emerald'
        />

        <StatCard
          title='검토 중'
          value={issueStats.review}
          change='+5%'
          icon={<PieChartIcon className='text-white h-5 w-5' />}
          colorScheme='amber'
        />

        <StatCard
          title='차단됨'
          value={issueStats.blocked}
          change='-4%'
          icon={<AlertCircle className='text-white h-5 w-5' />}
          colorScheme='rose'
        />
      </div>

      {/* 차트 섹션 */}
      <div className='grid grid-cols-3 gap-4'>
        {/* 이슈 상태 도넛 차트 */}
        <ChartCard
          title='이슈 상태 분포'
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

        {/* 이슈 트렌드 차트 */}
        <ChartCard
          title='이슈 트렌드'
          icon={<TrendingUp />}
          iconBgColor='bg-sky-100 dark:bg-sky-900/30'
          iconColor='text-sky-600 dark:text-sky-400'
        >
          <AreaTrendChart data={trendData} lines={trendLines} height={200} />
        </ChartCard>

        {/* 이슈 유형 버블 차트 */}
        <ChartCard
          title='이슈 유형 분포'
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
