import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useProject } from '@/hooks/use-project'
import { ProjectTable } from '@/organisms/projects/ProjectTable'
import { CreateProjectDialog } from '@/organisms/dialogs/CreateProjectDialog'
import { Folders } from 'lucide-react'
import type { Project } from '@/interface/CoreInterface'

// Maximum number of projects a user can create
// const MAX_PROJECTS_PER_USER = 3

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { user } = useAuth()
  const { projects } = useProject()

  // Count of projects created by the user
  // const myProjectsCount = projects ? projects.filter((project) => project.project_created_by === user?.id).length : 0

  // Check if user can create more projects
  // const canCreateProject = myProjectsCount < MAX_PROJECTS_PER_USER

  if (!user) return null

  return (
    <div className='flex flex-col h-full overflow-hidden p-12 pt-8 pb-4'>
      {/* Header area */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold flex items-center gap-2'>
            <Folders />
            Projects
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>Manage and create projects.</p>
        </div>
      </div>

      {/* Content area */}
      <div className='flex-1 overflow-auto pt-8'>
        {/* Project table */}
        <ProjectTable projects={projects ?? []} onSelectProject={setSelectedProject} />
      </div>

      {/* Dialog */}
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} userId={user.id} />
      {/* Project details dialog */}
    </div>
  )
}
