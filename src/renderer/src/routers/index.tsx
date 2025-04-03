import { createHashRouter } from 'react-router-dom'
import { authLoader } from './loaders/authLoader'
import { projectLoader } from './loaders/projectLoader'
import { AuthGuard } from './guards/AuthGuard'
import { AppLayout } from '@layouts/AppLayout'
import { ProjectLayout } from '@layouts/ProjectLayout'
import { SettingLayout } from '@layouts/SettingLayout'
import { HomePage } from '@pages/HomePage'
import { SignInPage } from '@pages/SignInPage'
import { ProjectPage } from '@pages/ProjectPage'
import { ProjectList } from '@pages/projects/ProjectList'
import { AccountSettingPage } from '@pages/AccountSettingPage'

export const router = createHashRouter([
  {
    path: '/',
    loader: authLoader,
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        loader: projectLoader,
        element: <HomePage />
      },
      {
        path: 'projects',
        element: <ProjectLayout />,
        children: [
          {
            path: 'list',
            element: <ProjectList />
          },
          {
            path: ':projectId',
            element: <ProjectPage />
          }
        ]
      },
      {
        path: 'settings',
        element: <SettingLayout />,
        children: [
          {
            path: 'account/:accountId',
            element: <AccountSettingPage />
          }
        ]
      }
    ]
  },
  {
    path: '/signin',
    element: <SignInPage />
  }
])
