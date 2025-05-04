import React from 'react'
import { createHashRouter, Link, type RouteObject } from 'react-router'
import { Button } from '@/components/atoms/Button'
import { EmptyPage } from '@/pages/EmptyPage'
import { MainLayout } from '@/layouts/MainLayout'
import { ProjectLayout } from '@/layouts/ProjectLayout'
import { SettingsLayout } from '@/layouts/SettingsLayout'
import { AuthGuard, withProtected, withPublic } from './guard/AuthGuard'

/**
 * 보호된 lazy 임포트 (인증 필요)
 */
const protectedLazyImport = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const Component = React.lazy(importFn)
  const ProtectedComponent = withProtected(() => <Component />)

  return (
    <React.Suspense fallback={<EmptyPage />}>
      <ProtectedComponent />
    </React.Suspense>
  )
}

/**
 * 공개 lazy 임포트 (인증 불필요)
 */
const publicLazyImport = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const Component = React.lazy(importFn)
  const PublicComponent = withPublic(() => <Component />)

  return (
    <React.Suspense fallback={<EmptyPage />}>
      <PublicComponent />
    </React.Suspense>
  )
}

// Temporary page component (use until actual component is implemented)
const TempComponent = ({ name }: { name: string }) => (
  <div className='container p-8'>
    <h1 className='text-2xl font-bold mb-4'>{name} 페이지</h1>
    <p>이 페이지는 아직 구현되지 않았습니다.</p>

    <br />

    <Button variant='outline' asChild>
      <Link to='/signin'>로그인 화면으로 돌아가기</Link>
    </Button>
  </div>
)

// 보호된 임시 컴포넌트
const ProtectedTempComponent = withProtected(TempComponent)

// Main Routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard requireAuth={true}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: protectedLazyImport(() => import('@/components/pages/HomePage'))
      },
      {
        path: 'projects',
        children: [
          {
            index: true,
            element: protectedLazyImport(() => import('@/components/pages/ProjectsPage'))
          },
          {
            path: ':projectId',
            element: (
              <AuthGuard requireAuth={true}>
                <ProjectLayout />
              </AuthGuard>
            ),
            children: [
              {
                index: true,
                element: <ProtectedTempComponent name='프로젝트 상세' />
              },
              {
                path: 'issues',
                children: [
                  {
                    index: true,
                    element: protectedLazyImport(() => import('@/pages/IssuePage'))
                  },
                  {
                    path: ':issueId',
                    element: <ProtectedTempComponent name='이슈 상세' />
                  }
                ]
              },
              {
                path: 'tasks',
                children: [
                  {
                    index: true,
                    element: <ProtectedTempComponent name='태스크 목록' />
                  },
                  {
                    path: ':taskId',
                    element: <ProtectedTempComponent name='태스크 상세' />
                  }
                ]
              },
              {
                path: 'settings',
                children: [
                  {
                    index: true,
                    element: <ProtectedTempComponent name='설정' />
                  },
                  {
                    path: ':taskId',
                    element: <ProtectedTempComponent name='설정 상세' />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'settings',
        element: (
          <AuthGuard requireAuth={true}>
            <SettingsLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: protectedLazyImport(() => import('@/components/pages/settings/AccountPage'))
          },
          {
            path: 'integration',
            element: protectedLazyImport(() => import('@/components/pages/settings/IntegrationPage'))
          }
        ]
      }
    ]
  },
  {
    path: 'signin',
    element: publicLazyImport(() => import('@/pages/SignInPage'))
  }
]

export const router = createHashRouter(routes)
export default router
