import { Info, PlusCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import { CreateProjectDialog } from '@/organisms/dialogs/CreateProjectDialog'

interface ProjectsPageHeaderProps {
  userId: string
  projectCount: number
  maxProjects?: number
  onSearch?: (term: string) => void
}

export function ProjectsPageHeader({ userId, projectCount, maxProjects = 3, onSearch }: ProjectsPageHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    // Pass search term to parent component
    if (onSearch) {
      onSearch(value)
    }
  }

  const canCreateProject = projectCount < maxProjects

  return (
    <div className='py-4 px-8'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <h1 className='text-xl text-foreground'>Projects</h1>
          <p className='text-sm text-muted-foreground mt-1.5'>
            View and manage your projects. You can create up to {maxProjects} projects.
            {canCreateProject ? (
              <span className='ml-1'>
                ({projectCount}/{maxProjects})
              </span>
            ) : (
              <span className='text-amber-600 ml-1'>
                (Creation limit reached: {projectCount}/{maxProjects})
              </span>
            )}
          </p>
        </div>

        <div className='flex gap-3 items-center'>
          <div className='relative w-64'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search projects...'
              className='w-full pl-9'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {canCreateProject ? (
            <Button variant='default' onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className='h-4 w-4 mr-1.5' />
              New Project
            </Button>
          ) : (
            <Button variant='outline' disabled>
              <Info className='h-4 w-4 mr-1.5' />
              Limit Reached
            </Button>
          )}
        </div>
      </div>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} userId={userId} />
    </div>
  )
}
