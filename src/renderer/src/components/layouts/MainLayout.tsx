import { Navigate, Outlet } from 'react-router'
import { Toaster } from '@/atoms/Sonner'
import { useProject } from '@/hooks/use-project'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/organisms/Header'

export function MainLayout() {
  const { projects } = useProject()
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/signin' />
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header user={user} projects={projects || []} />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
