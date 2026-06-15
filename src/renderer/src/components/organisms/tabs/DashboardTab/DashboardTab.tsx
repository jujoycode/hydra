import { AlertCircle, CheckCircle2, Clock, ListTodo, Search } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AreaTrendChart, type TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import { type StatusData, StatusDonutChart } from '@/atoms/charts/StatusDonutChart'
import { getCssVar } from '@/lib/statusTokens'
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
  const { t } = useTranslation('dashboard')

  const trendLines = useMemo(
    () => [
      { dataKey: 'created', name: t('chart.created'), color: getCssVar('--chart-1'), gradientId: 'colorCreated' },
      { dataKey: 'resolved', name: t('chart.resolved'), color: getCssVar('--chart-3'), gradientId: 'colorResolved' }
    ],
    [t]
  )

  const completionRate = issueStats.total > 0 ? Math.round((issueStats.done / issueStats.total) * 100) : 0

  return (
    <div className='h-full overflow-auto p-page'>
      {/* 통계 카드 */}
      <div className='grid grid-cols-4 gap-card-gap mb-section'>
        <StatCard
          title={t('stats.totalIssues')}
          value={issueStats.total}
          icon={<ListTodo className='size-4' />}
          iconColor='text-info'
        />
        <StatCard
          title={t('stats.inProgress')}
          value={issueStats.inProgress}
          icon={<Clock className='size-4' />}
          iconColor='text-priority-medium'
        />
        <StatCard
          title={t('stats.completed')}
          value={issueStats.done}
          icon={<CheckCircle2 className='size-4' />}
          iconColor='text-success'
          description={`${completionRate}%`}
        />
        <StatCard
          title={t('stats.underReview')}
          value={issueStats.review}
          icon={<Search className='size-4' />}
          iconColor='text-status-review-fg'
        />
      </div>

      {/* 차트 영역 */}
      <div className='grid grid-cols-5 gap-section'>
        <div className='col-span-2'>
          <ChartCard title={t('chart.statusDistribution')}>
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
          <ChartCard title={t('chart.trend')} description={t('chart.trendPeriod')}>
            <AreaTrendChart data={trendData} lines={trendLines} height={250} />
          </ChartCard>
        </div>
      </div>

      {/* 차단된 이슈 알림 */}
      {issueStats.blocked > 0 && (
        <div className='mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
          <AlertCircle className='size-4 text-destructive' />
          <span className='text-sm'>{t('alert.blockedIssues', { count: issueStats.blocked })}</span>
        </div>
      )}
    </div>
  )
}
