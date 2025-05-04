import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { Separator } from '@/atoms/Separator'
import { User, Blocks } from 'lucide-react'

export function SettingsSidebar() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('')

  // 현재 페이지에 따라 활성화된 탭 설정
  useEffect(() => {
    const path = location.pathname
    const pathParts = path.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (lastPart === 'settings') {
      setActiveTab('account')
    } else {
      setActiveTab(lastPart)
    }
  }, [location.pathname])

  const tabClassName = (tab: string) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:scale-105 transition-all duration-300',
      activeTab === tab && 'bg-accent'
    )

  return (
    <aside className='w-56 min-w-56 border-r h-full overflow-y-auto p-4'>
      <div className='space-y-4'>
        <div className='text-lg font-semibold'>Settings</div>

        <div className='space-y-1'>
          <Link to='/settings' className={tabClassName('account')}>
            <User size={16} strokeWidth={1.5} className='mr-2' />
            Account
          </Link>
          <Link to='/settings/integration' className={tabClassName('integration')}>
            <Blocks size={16} strokeWidth={1.5} className='mr-2' />
            Integration
          </Link>

          <Separator className='mt-8 mb-2' />
        </div>
      </div>
    </aside>
  )
}
