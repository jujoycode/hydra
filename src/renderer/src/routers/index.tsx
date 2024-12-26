import { createHashRouter } from 'react-router-dom'
import { authLoader } from './loaders/authLoader'
import { AuthGuard } from './guards/AuthGuard'
import { AppLayout } from '@layouts/AppLayout'
import { ProjectLayout } from '@layouts/ProjectLayout'
import { HomePage } from '@pages/HomePage'
import { ProjectPage } from '@pages/ProjectPage'
import { SignInPage } from '@pages/SignInPage'
import { SettingPage } from '@pages/SettingPage'

export const router = createHashRouter([
  {
    path: '/',
    // loader: authLoader,
    element: (
      // <AuthGuard>
      <AppLayout />
      // </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'projects',
        element: <ProjectLayout />,
        children: [
          {
            path: ':projectId',
            element: <ProjectPage />
          }
        ]
      },
      {
        path: 'setting',
        element: <SettingPage />
      }
    ]
  },
  {
    path: '/signin',
    element: <SignInPage />
  }
])
