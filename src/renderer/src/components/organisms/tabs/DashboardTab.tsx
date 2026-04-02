import { AlertCircle, CheckCircle2, Clock, ListTodo, Search } from 'lucide-react'
import { useMemo } from 'react'
import { AreaTrendChart, type TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import { type StatusData, StatusDonutChart } from '@/atoms/charts/StatusDonutChart'
import { ChartCard } from '@/molecules/cards/ChartCard'
import { StatCard } from '@/molecules/cards/StatCard'

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
}

export const DashboardTab = ({ issueStats, statusData, trendData }: DashboardTabProps) => {
  const trendLines = useMemo(
    () => [
      { dataKey: '생성', color: '#3B82F6', gradientId: 'colorCreated' },
      { dataKey: '해결', color: '#10B981', gradientId: 'colorResolved' }
    ],
    []
  )

  const completionRate = issueStats.total > 0 ? Math.round((issueStats.done / issueStats.total) * 100) : 0

  return (
    <div className='h-full overflow-auto p-6'>
      {/* 통계 카드 */}
      <div className='grid grid-cols-4 gap-3 mb-6'>
        <StatCard
          title='전체 이슈'
          value={issueStats.total}
          icon={<ListTodo className='size-4' />}
          iconColor='text-blue-600 dark:text-blue-400'
        />
        <StatCard
          title='진행 중'
          value={issueStats.inProgress}
          icon={<Clock className='size-4' />}
          iconColor='text-amber-600 dark:text-amber-400'
        />
        <StatCard
          title='완료'
          value={issueStats.done}
          icon={<CheckCircle2 className='size-4' />}
          iconColor='text-emerald-600 dark:text-emerald-400'
          description={`${completionRate}%`}
        />
        <StatCard
          title='검토 중'
          value={issueStats.review}
          icon={<Search className='size-4' />}
          iconColor='text-violet-600 dark:text-violet-400'
        />
      </div>

      {/* 차트 영역 */}
      <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-2'>
          <ChartCard title='이슈 상태 분포'>
            <StatusDonutChart data={statusData} height={220} />
            <div className='flex flex-wrap justify-center gap-3 mt-1'>
              {statusData.map((entry) => (
                <div key={entry.name} className='flex items-center gap-1.5 text-xs'>
                  <div className='size-2.5 rounded-full' style={{ backgroundColor: entry.color }} />
                  <span className='text-muted-foreground'>{entry.name}</span>
                  <span className='font-medium tabular-nums'>{entry.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
        <div className='col-span-3'>
          <ChartCard title='이슈 추이' description='최근 6개월'>
            <AreaTrendChart data={trendData} lines={trendLines} height={250} />
          </ChartCard>
        </div>
      </div>

      {/* 차단된 이슈 알림 */}
      {issueStats.blocked > 0 && (
        <div className='mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
          <AlertCircle className='size-4 text-destructive' />
          <span className='text-sm'>
            차단된 이슈가 <span className='font-semibold'>{issueStats.blocked}건</span> 있습니다
          </span>
        </div>
      )}
    </div>
  )
}
