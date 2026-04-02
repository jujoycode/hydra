import { createRootRouteWithContext, createRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import React from 'react'
import { Button } from '@/components/atoms/Button'
import { MainLayout } from '@/layouts/MainLayout'
import { ProjectLayout } from '@/layouts/ProjectLayout'
import { SettingsLayout } from '@/layouts/SettingsLayout'
import { EmptyPage } from '@/pages/EmptyPage'
import type { RouterContext } from './routerContext'

// Lazy wrapper
function lazyRoute(importFn: () => Promise<{ default: React.ComponentType }>) {
  const Component = React.lazy(importFn)
  return () => (
    <React.Suspense fallback={<EmptyPage />}>
      <Component />
    </React.Suspense>
  )
}

// Temporary page component
const TempComponent = ({ name }: { name: string }) => (
  <div className='container p-8'>
    <h1 className='text-2xl font-bold mb-4'>{name} 페이지</h1>
    <p>이 페이지는 아직 구현되지 않았습니다.</p>
    <br />
    <Button variant='outline' asChild>
      <Link to='/workspace'>Back to workspace selection</Link>
    </Button>
  </div>
)

// Root Route
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet
})

// Authenticated Layout Route
export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: ({ context }) => {
    const { isConnected, user, disconnect } = context.auth
    if (isConnected && !user) {
      disconnect()
      throw redirect({ to: '/workspace' })
    }
    if (!isConnected) {
      throw redirect({ to: '/workspace' })
    }
  },
  component: MainLayout
})

// Home
export const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: lazyRoute(() => import('@/components/pages/HomePage'))
})

// Projects
export const projectsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/projects',
  component: lazyRoute(() => import('@/components/pages/ProjectsPage'))
})

// Project Layout
export const projectLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/projects/$projectId',
  component: ProjectLayout
})

export const projectIndexRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/',
  component: lazyRoute(() => import('@/components/pages/ProjectDetailPage'))
})

// Issues
export const issuesRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/issues',
  component: lazyRoute(() => import('@/pages/IssuePage'))
})

export const issueDetailRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/issues/$issueId',
  component: lazyRoute(() => import('@/components/pages/IssueDetailPage'))
})

// Tasks
export const tasksRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/tasks',
  component: lazyRoute(() => import('@/components/pages/TasksPage'))
})

export const taskDetailRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/tasks/$taskId',
  component: () => <TempComponent name='태스크 상세' />
})

// Project Settings
export const projectSettingsRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/settings',
  component: lazyRoute(() => import('@/components/pages/ProjectSettingsPage'))
})

export const projectSettingsDetailRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/settings/$settingId',
  component: () => <TempComponent name='설정 상세' />
})

// My Issues
export const myIssuesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/my-issues',
  component: () => <TempComponent name='내 이슈' />
})

// Notifications
export const notificationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notifications',
  component: lazyRoute(() => import('@/components/pages/NotificationsPage'))
})

// Members
export const membersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/members',
  component: lazyRoute(() => import('@/components/pages/MembersPage'))
})

// Settings Layout
export const settingsLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: SettingsLayout
})

export const accountRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/',
  component: lazyRoute(() => import('@/components/pages/settings/AccountPage'))
})

export const settingsMembersRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/members',
  component: () => <TempComponent name='멤버 설정' />
})

export const settingsNotificationsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/notifications',
  component: () => <TempComponent name='알림 설정' />
})

export const settingsIntegrationsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/integrations',
  component: lazyRoute(() => import('@/components/pages/settings/IntegrationPage'))
})

// Workspace (public)
export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspace',
  beforeLoad: ({ context }) => {
    const { isConnected, user } = context.auth
    if (isConnected && user) {
      throw redirect({ to: '/' })
    }
  },
  component: lazyRoute(() => import('@/pages/WorkspacePage'))
})

// Route Tree
export const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    indexRoute,
    projectsRoute,
    myIssuesRoute,
    notificationsRoute,
    membersRoute,
    projectLayoutRoute.addChildren([
      projectIndexRoute,
      issuesRoute,
      issueDetailRoute,
      tasksRoute,
      taskDetailRoute,
      projectSettingsRoute,
      projectSettingsDetailRoute
    ]),
    settingsLayoutRoute.addChildren([accountRoute, settingsMembersRoute, settingsNotificationsRoute, settingsIntegrationsRoute])
  ]),
  workspaceRoute
])
