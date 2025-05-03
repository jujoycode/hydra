import { useState } from 'react'
import { Link } from 'react-router'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/atoms/NavigationMenu'
import { Button } from '@/atoms/Button'
import { Separator } from '@/atoms/Separator'
import { ListItem } from '@/molecules/ListItem'
import { HeaderUserMenu } from '@/organisms/HeaderUserMenu'
import { CreateProjectDialog } from '@/organisms/CreateProjectDialog'
import { TextSearch, Plus } from 'lucide-react'
import type { Project, User } from '@/interface/CoreInterface'

export function Header({ user, projects }: { user: User; projects: Project[] }) {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)

  return (
    <header className='w-full border-b bg-background flex'>
      <div className='w-full flex justify-between h-14 items-center px-4'>
        <Link to='/' className='flex items-center gap-2 ml-8 mr-8 font-bold'>
          Hydra
        </Link>

        {/* 프로젝트 메뉴 */}
        <NavigationMenu className='mx-4'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className='text-sm text-muted-foreground p-4 pb-0'>Recently</p>

                <ul className='grid w-[320px] gap-2 p-2 md:w-[320px] md:grid-cols-1 lg:w-[320px]'>
                  {projects.map((project) => (
                    <ListItem
                      key={project.project_id}
                      title={project.project_name}
                      desc={project.project_desc ?? ''}
                      href={`/projects/${project.project_id}`}
                    />
                  ))}
                </ul>

                <Separator />

                <Link to='/projects'>
                  <Button variant='ghost' className='w-[95%] mt-2 ml-2 text-sm font-light flex justify-start'>
                    <TextSearch size={16} strokeWidth={1.5} />
                    View all projects
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  className='w-[95%] mt-2 ml-2 text-sm font-light flex justify-start'
                  onClick={() => setIsCreateProjectOpen(true)}
                >
                  <Plus size={16} strokeWidth={1.5} />
                  Create new project
                </Button>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 이슈 생성 버튼 */}
        <Button className='rounded-md'>Create</Button>

        <div className='flex items-end gap-2 ml-auto'>
          <HeaderUserMenu user={user} className='ml-2' />
        </div>
      </div>

      {/* 프로젝트 생성 다이얼로그 */}
      <CreateProjectDialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen} userId={user.id} />
    </header>
  )
}
