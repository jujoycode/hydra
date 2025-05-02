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
import { TextSearch, Plus } from 'lucide-react'

interface HeaderProps {
  user: {
    name: string
    email: string
    avatarUrl?: string
  }
  projects: {
    id: string
    name: string
    description: string
    avatarUrl?: string
  }[]
}

export function Header({ user, projects }: HeaderProps) {
  return (
    <header className='w-full border-b bg-background flex'>
      <div className='w-full flex justify-between h-14 items-center px-4'>
        <Link to='/' className='flex items-center gap-2 ml-8 mr-8 font-bold'>
          Hydra
        </Link>

        <NavigationMenu className='mx-4'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className='text-sm text-muted-foreground p-4 pb-0'>Recently</p>

                <ul className='grid w-[320px] gap-2 p-2 md:w-[320px] md:grid-cols-1 lg:w-[320px]'>
                  {projects.map((project) => (
                    <ListItem
                      key={project.id}
                      title={project.name}
                      href={`/projects/${project.id}`}
                      imageUrl={project.avatarUrl}
                    >
                      {project.description}
                    </ListItem>
                  ))}
                </ul>

                <Separator />

                <Button variant='ghost' className='w-full mt-2 ml-2 text-sm font-light flex justify-start'>
                  <TextSearch size={16} strokeWidth={1.5} />
                  View all projects
                </Button>
                <Button variant='ghost' className='w-full mt-2 ml-2 text-sm font-light flex justify-start'>
                  <Plus size={16} strokeWidth={1.5} />
                  Create new project
                </Button>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button className='rounded-md'>Create</Button>

        <div className='flex items-end gap-2 ml-auto'>
          <HeaderUserMenu user={user} className='ml-2' />
        </div>
      </div>
    </header>
  )
}
