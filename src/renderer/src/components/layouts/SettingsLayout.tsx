import { Outlet } from '@tanstack/react-router'

export function SettingsLayout() {
  return (
    <div className='flex h-full flex-col p-6 md:p-10'>
      <Outlet />
    </div>
  )
}
