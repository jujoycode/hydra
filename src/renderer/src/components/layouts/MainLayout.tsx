import { Outlet } from 'react-router'
import { Toaster } from '@/atoms/Sonner'
import { Header } from '@/organisms/Header'

import tempUser from '../../../../../dummy/user.json'
import tempProject from '../../../../../dummy/project.json'

export function MainLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header user={tempUser} projects={tempProject} />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
