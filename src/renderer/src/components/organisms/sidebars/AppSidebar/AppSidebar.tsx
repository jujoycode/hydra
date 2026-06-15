import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronDown, Home, ListChecks, LogOut, Moon, Plus, Settings, Sun, Users } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/atoms/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/atoms/DropdownMenu'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { CreateProjectDialog } from '@/organisms/dialogs/CreateProjectDialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from '@/organisms/sidebars/Sidebar'
import { useAuthStore } from '@/stores/auth'

// 알림 뱃지 카운트 (추후 실제 데이터로 교체)
const NOTIFICATION_COUNT = 0

function WorkspaceHeader() {
  const { currentWorkspace, disconnect } = useAuth()
  const logout = useAuthStore((s) => s.logout)
  const { state } = useSidebar()
  const navigate = useNavigate()
  const { t } = useTranslation('nav')

  const handleDisconnect = async () => {
    await logout()
    await disconnect()
    navigate({ to: '/workspace' })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-md gradient-primary text-primary-foreground text-xs font-bold shrink-0'>
                {currentWorkspace?.name?.charAt(0)?.toUpperCase() ?? 'H'}
              </div>
              {state === 'expanded' && (
                <div className='flex flex-col gap-0.5 leading-none overflow-hidden'>
                  <span className='font-semibold truncate'>{currentWorkspace?.name ?? 'Workspace'}</span>
                  <span className='text-xs text-muted-foreground truncate'>{currentWorkspace?.host ?? ''}</span>
                </div>
              )}
              {state === 'expanded' && <ChevronDown className='ml-auto size-4 shrink-0' />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start' className='w-56'>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={handleDisconnect}>
              <LogOut className='size-4' />
              {t('leaveWorkspace')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function MainNavGroup() {
  const location = useLocation()
  const { t } = useTranslation('nav')

  const navItems = [
    { label: t('home'), icon: Home, href: '/' },
    { label: t('myIssues'), icon: ListChecks, href: '/my-issues' },
    { label: t('notifications'), icon: Bell, href: '/notifications', badge: NOTIFICATION_COUNT }
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Link to={item.href as any}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge != null && item.badge > 0 && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function ProjectsGroup() {
  const { user } = useAuth()
  const { data: projects = [] } = useProjects(user?.user_id)
  const location = useLocation()
  const { t } = useTranslation('nav')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
      <SidebarGroupAction title={t('addProject')} onClick={() => setIsCreateOpen(true)}>
        <Plus />
        <span className='sr-only'>{t('addProject')}</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {(projects ?? []).map((project) => {
            const to = `/projects/${project.project_id}/issues`
            const isActive = location.pathname.startsWith(`/projects/${project.project_id}`)
            const initial = project.project_name?.charAt(0)?.toUpperCase() ?? 'P'
            return (
              <SidebarMenuItem key={project.project_id}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={project.project_name}>
                  <Link to={to}>
                    <span className='flex size-4 shrink-0 items-center justify-center rounded-md gradient-primary text-primary-foreground text-[10px] font-bold'>
                      {initial}
                    </span>
                    <span>{project.project_name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          {(!projects || projects.length === 0) && (
            <SidebarMenuItem>
              <span className='px-2 text-xs text-muted-foreground'>{t('noProjects')}</span>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
      {user && <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} userId={user.user_id} />}
    </SidebarGroup>
  )
}

function BottomNavGroup() {
  const location = useLocation()
  const { t } = useTranslation('nav')

  const navItems = [
    { label: t('members'), icon: Users, href: '/members' },
    { label: t('settings'), icon: Settings, href: '/settings' }
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Link to={item.href as any}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function UserFooter() {
  const { user, disconnect } = useAuth()
  const logout = useAuthStore((s) => s.logout)
  const { state } = useSidebar()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('nav')

  const handleDisconnect = async () => {
    await logout()
    await disconnect()
    navigate({ to: '/workspace' })
  }

  const initials = user?.user_name
    ? user.user_name
        .split(' ')
        .map((n) => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : (user?.user_email?.charAt(0)?.toUpperCase() ?? '?')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent'>
              <Avatar className='size-8 shrink-0'>
                <AvatarFallback className='text-xs font-medium'>{initials}</AvatarFallback>
              </Avatar>
              {state === 'expanded' && (
                <div className='flex flex-col gap-0.5 leading-none overflow-hidden'>
                  <span className='font-medium truncate'>{user?.user_name ?? t('user')}</span>
                  <span className='text-xs text-muted-foreground truncate'>{user?.user_email ?? ''}</span>
                </div>
              )}
              {state === 'expanded' && <ChevronDown className='ml-auto size-4 shrink-0' />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='top' align='start' className='w-56'>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <Settings className='size-4' />
                {t('settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className='mr-2 size-4' /> : <Moon className='mr-2 size-4' />}
              {theme === 'dark' ? t('lightMode') : t('darkMode')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={handleDisconnect}>
              <LogOut className='size-4' />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <WorkspaceHeader />
      </SidebarHeader>

      <SidebarContent>
        <MainNavGroup />
        <SidebarSeparator />
        <ProjectsGroup />
        <SidebarSeparator />
        <BottomNavGroup />
      </SidebarContent>

      <SidebarFooter>
        <UserFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
