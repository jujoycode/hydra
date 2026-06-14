import { Outlet } from '@tanstack/react-router'

export function ProjectLayout() {
  return (
    <div className='flex h-full flex-col'>
      <Outlet />
    </div>
  )
}
