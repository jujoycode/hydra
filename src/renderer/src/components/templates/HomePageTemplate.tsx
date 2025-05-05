import { useState } from 'react'
import { Home, Clock3, ActivitySquare } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/atoms/Tabs'
import { DashboardTab } from '@/organisms/tabs/DashboardTab'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { BubbleDataPoint } from '@/atoms/charts/BubbleChart'
import type { BarDataPoint } from '@/atoms/charts/HorizontalBarChart'
import type { StackDataPoint } from '@/atoms/charts/StackedBarChart'
import type { User } from '@/interface/CoreInterface'

// 타입 정의
interface ProjectProgress extends BarDataPoint {
  name: string
  completed: number
  remaining: number
  [key: string]: string | number
}

interface ProjectIssue extends StackDataPoint {
  name: string
  resolved: number
  in_progress: number
  blocked: number
  [key: string]: string | number
}

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
  bubbleData: BubbleDataPoint[]
  projectStats: {
    total: number
    active: number
    dueThisMonth: number
    avgProgress: number
  }
  projectProgressData: ProjectProgress[]
  projectIssueData: ProjectIssue[]
}

export const HomePageTemplate = ({ user, issueStats, statusData, trendData, bubbleData }: HomePageTemplateProps) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col overflow-hidden p-8 pt-2'>
      {/* 인사말 */}
      <div className='p-6 pb-0'>
        <h1 className='text-2xl font-bold mb-2'>Hello, {user.name || 'User'}!</h1>
      </div>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1 flex flex-col overflow-hidden'>
        <div className='px-4'>
          <TabsList className='w-full justify-start border-b pb-0 pt-2 mb-0 bg-transparent'>
            <TabsTrigger
              value='dashboard'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <Home size={16} /> Dashboard
            </TabsTrigger>
            <TabsTrigger
              value='tasks'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <Clock3 size={16} /> My Tasks
            </TabsTrigger>
            <TabsTrigger
              value='activity'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <ActivitySquare size={16} /> Activity
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 대시보드 탭 */}
        <TabsContent value='dashboard' className='mt-0 flex-1'>
          <DashboardTab issueStats={issueStats} statusData={statusData} trendData={trendData} bubbleData={bubbleData} />
        </TabsContent>

        {/* 내 작업 탭 */}
        <TabsContent value='tasks' className='mt-0 flex-1 overflow-auto p-4'>
          <div className='h-full flex items-center justify-center text-center'>
            <div>
              <h3 className='text-lg font-medium mb-2'>My Tasks</h3>
              <p className='text-muted-foreground'>No tasks assigned to me.</p>
            </div>
          </div>
        </TabsContent>

        {/* 활동 탭 */}
        <TabsContent value='activity' className='mt-0 flex-1 overflow-auto p-4'>
          <div className='h-full flex items-center justify-center text-center'>
            <div>
              <h3 className='text-lg font-medium mb-2'>Activity</h3>
              <p className='text-muted-foreground'>No activity records.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
