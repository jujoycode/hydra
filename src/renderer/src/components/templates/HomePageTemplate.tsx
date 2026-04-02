import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import type { User } from '@/interface/CoreInterface'
import { DashboardTab } from '@/organisms/tabs/DashboardTab'

interface HomePageTemplateProps {
  user: User
  issueStats: {
    total: number
    inProgress: number
    done: number
    review: number
    blocked: number
  }
  statusData: StatusData[]
  trendData: TrendDataPoint[]
}

export const HomePageTemplate = ({ user, issueStats, statusData, trendData }: HomePageTemplateProps) => {
  return (
    <div className='flex h-full flex-col'>
      {/* 인사말 */}
      <div className='shrink-0 px-6 pt-6'>
        <h1 className='text-lg font-semibold'>안녕하세요, {user.user_name || '사용자'}님</h1>
        <p className='text-sm text-muted-foreground'>워크스페이스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 대시보드 */}
      <div className='flex-1 overflow-hidden'>
        <DashboardTab issueStats={issueStats} statusData={statusData} trendData={trendData} />
      </div>
    </div>
  )
}
