import { Outlet } from 'react-router'
import { SettingsSidebar } from '@/organisms/SettingsSidebar'

export function SettingsLayout() {
  return (
    <div className='flex h-[calc(100vh-4rem)] overflow-hidden'>
      <SettingsSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='h-full p-6 md:p-10 flex justify-center'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
