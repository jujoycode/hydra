import { Outlet } from 'react-router'
import { ProjectSidebar } from '@organisms/ProjectSidebar'

export function ProjectLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ProjectSidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
