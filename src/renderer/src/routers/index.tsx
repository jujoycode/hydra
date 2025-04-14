import React from 'react'
import { EmptyPage } from '@/pages/EmptyPage'
import { MainLayout } from '@/layouts/MainLayout'
import { ProjectLayout } from '@/layouts/ProjectLayout'
import { createHashRouter, type RouteObject } from 'react-router'

const lazyImport = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const Component = React.lazy(importFn)

  return (
    <React.Suspense fallback={<EmptyPage />}>
      <Component />
    </React.Suspense>
  )
}

// Temporary page component (use until actual component is implemented)
const TempComponent = ({ name }: { name: string }) => (
  <div className='container p-8'>
    <h1 className='text-2xl font-bold mb-4'>{name} 페이지</h1>
    <p>이 페이지는 아직 구현되지 않았습니다.</p>
  </div>
)

// Main Routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <TempComponent name='홈' />
      },
      {
        path: 'projects',
        children: [
          {
            index: true,
            element: <TempComponent name='프로젝트 목록' />
          },
          {
            path: ':projectId',
            element: <ProjectLayout />,
            children: [
              {
                index: true,
                element: <TempComponent name='프로젝트 상세' />
              },
              {
                path: 'issues',
                children: [
                  {
                    index: true,
                    element: lazyImport(() => import('@/pages/IssuePage'))
                  },
                  {
                    path: ':issueId',
                    element: <TempComponent name='이슈 상세' />
                  }
                ]
              },
              {
                path: 'tasks',
                children: [
                  {
                    index: true,
                    element: <TempComponent name='태스크 목록' />
                  },
                  {
                    path: ':taskId',
                    element: <TempComponent name='태스크 상세' />
                  }
                ]
              },

              {
                path: 'settings',
                children: [
                  {
                    index: true,
                    element: <TempComponent name='설정' />
                  },
                  {
                    path: ':taskId',
                    element: <TempComponent name='설정 상세' />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            index: true,
            element: <TempComponent name='설정' />
          }
        ]
      }
    ]
  },
  {
    path: 'signin',
    element: lazyImport(() => import('@/pages/SignInPage'))
  }
]

export const router = createHashRouter(routes)
export default router
