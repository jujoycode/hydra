import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { Separator } from '@/atoms/Separator'
import { Home, LaptopMinimalCheck, ListTodo, Settings } from 'lucide-react'

export function ProjectSidebar() {
  const { projectId } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('')

  if (!projectId) return null

  // 현재 페이지에 따라 활성화된 탭 설정
  useEffect(() => {
    const path = location.pathname
    const pathParts = path.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (lastPart === projectId) {
      setActiveTab('overview')
    } else {
      setActiveTab(lastPart)
    }
  }, [location.pathname, projectId])

  const tabClassName = (tab: string) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:scale-105 transition-all duration-300',
      activeTab === tab && 'bg-accent'
    )

  return (
    <aside className='w-56 min-w-56 border-r h-full overflow-y-auto p-4'>
      <div className='space-y-4'>
        <div className='text-lg font-semibold'>Project Menu</div>

        <div className='space-y-1'>
          {projectId && (
            <>
              <Link to={`/projects/${projectId}`} className={tabClassName('overview')}>
                <Home size={16} strokeWidth={1.5} className='mr-2' />
                Overview
              </Link>
              <Link to={`/projects/${projectId}/issues`} className={tabClassName('issues')}>
                <LaptopMinimalCheck size={16} strokeWidth={1.5} className='mr-2' />
                Issues
              </Link>
              <Link to={`/projects/${projectId}/tasks`} className={tabClassName('tasks')}>
                <ListTodo size={16} strokeWidth={1.5} className='mr-2' />
                Tasks
              </Link>

              <Separator className='mt-8 mb-2' />

              <Link to={`/projects/${projectId}/settings`} className={tabClassName('settings')}>
                <Settings size={16} strokeWidth={1.5} className='mr-2' />
                Settings
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
