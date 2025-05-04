import { useState } from 'react'
import { Home, Folders, Clock3, ActivitySquare } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/atoms/Tabs'
import { DashboardTab } from '@/organisms/tabs/DashboardTab'
import { ProjectsTab } from '@/organisms/tabs/ProjectsTab'
import type { StatusData } from '@/atoms/charts/StatusDonutChart'
import type { TrendDataPoint } from '@/atoms/charts/AreaTrendChart'
import type { BubbleDataPoint } from '@/atoms/charts/BubbleChart'
import type { BarDataPoint } from '@/atoms/charts/HorizontalBarChart'
import type { StackDataPoint } from '@/atoms/charts/StackedBarChart'
import type { User } from '@/interface/CoreInterface'

// 타입 정의
interface ProjectProgress extends BarDataPoint {
  name: string
  완료율: number
  남은일수: number
  [key: string]: string | number
}

interface ProjectIssue extends StackDataPoint {
  name: string
  해결됨: number
  진행중: number
  차단됨: number
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

export const HomePageTemplate = ({
  user,
  issueStats,
  statusData,
  trendData,
  bubbleData,
  projectStats,
  projectProgressData,
  projectIssueData
}: HomePageTemplateProps) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col overflow-hidden'>
      {/* 인사말 */}
      <div className='p-6 pb-0'>
        <h1 className='text-2xl font-bold mb-2'>안녕하세요, {user.name || '사용자'}님!</h1>
      </div>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1 flex flex-col overflow-hidden'>
        <div className='px-4'>
          <TabsList className='w-full justify-start border-b pb-0 pt-2 mb-0 bg-transparent'>
            <TabsTrigger
              value='dashboard'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <Home size={16} /> 대시보드
            </TabsTrigger>
            <TabsTrigger
              value='projects'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <Folders size={16} /> 프로젝트
            </TabsTrigger>
            <TabsTrigger
              value='tasks'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <Clock3 size={16} /> 내 작업
            </TabsTrigger>
            <TabsTrigger
              value='activity'
              className='flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2'
            >
              <ActivitySquare size={16} /> 활동
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 대시보드 탭 */}
        <TabsContent value='dashboard' className='mt-0 flex-1'>
          <DashboardTab issueStats={issueStats} statusData={statusData} trendData={trendData} bubbleData={bubbleData} />
        </TabsContent>

        {/* 프로젝트 탭 */}
        <TabsContent value='projects' className='mt-0 flex-1'>
          <ProjectsTab
            projectStats={projectStats}
            projectProgressData={projectProgressData}
            projectIssueData={projectIssueData}
          />
        </TabsContent>

        {/* 내 작업 탭 */}
        <TabsContent value='tasks' className='mt-0 flex-1 overflow-auto p-4'>
          <div className='h-full flex items-center justify-center text-center'>
            <div>
              <h3 className='text-lg font-medium mb-2'>내 작업</h3>
              <p className='text-muted-foreground'>나에게 할당된 작업이 없습니다.</p>
            </div>
          </div>
        </TabsContent>

        {/* 활동 탭 */}
        <TabsContent value='activity' className='mt-0 flex-1 overflow-auto p-4'>
          <div className='h-full flex items-center justify-center text-center'>
            <div>
              <h3 className='text-lg font-medium mb-2'>활동</h3>
              <p className='text-muted-foreground'>최근 활동 기록이 없습니다.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
