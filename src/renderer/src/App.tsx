import { HashRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@components/ui/toaster'
import { useAuthStore } from '@stores/AuthStore'
import { AppLayout } from '@layouts/AppLayout'
import { ProjectLayout } from '@layouts/ProjectLayout'
import { HomePage } from '@pages/HomePage'
import { ProjectPage } from '@pages/ProjectPage'
import { SignInPage } from '@pages/SignInPage'

function App(): JSX.Element {
  const { session } = useAuthStore()

  return (
    <>
      {session ? (
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='projects' element={<ProjectLayout />}>
                <Route path=':projectId' element={<ProjectPage />} />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      ) : (
        <SignInPage />
      )}
      <Toaster />
    </>
  )
}

export default App
