import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useProject } from '@/hooks/use-project'
import { Input } from '@/atoms/Input'
import { Button } from '@/atoms/Button'
import { ProjectTable } from '@/organisms/projects/ProjectTable'
import { CreateProjectDialog } from '@/organisms/dialogs/CreateProjectDialog'
import { Plus, Search, Info, Folders } from 'lucide-react'

// Maximum number of projects a user can create
const MAX_PROJECTS_PER_USER = 3

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useAuth()
  const { projects, setProjects } = useProject()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        // Future API implementation can be added here
        // setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        toast.error('Failed to load project list')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user, projects, setProjects])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Count of projects created by the user
  const myProjectsCount = projects ? projects.filter((project) => project.project_created_by === user?.id).length : 0

  // Check if user can create more projects
  const canCreateProject = myProjectsCount < MAX_PROJECTS_PER_USER

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
        {/* Search and new project button */}
        <div className='flex justify-between items-center mb-3'>
          <div className='relative w-64'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search project by name...'
              className='w-full h-9 pl-9'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className='flex gap-2'>
            {canCreateProject ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} size='sm'>
                <Plus className='h-3.5 w-3.5 mr-1.5' />
                New Project
              </Button>
            ) : (
              <Button variant='outline' disabled size='sm' className='h-9 px-3 text-xs font-normal'>
                <Info className='h-3.5 w-3.5 mr-1.5' />
                Limit Reached
              </Button>
            )}
          </div>
        </div>

        {/* Project table */}
        <ProjectTable projects={projects || []} isLoading={isLoading} searchTerm={searchTerm} />
      </div>

      {/* Dialog */}
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} userId={user.id} />
    </div>
  )
}
