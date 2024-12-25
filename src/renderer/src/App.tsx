import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@components/ui/toaster'
import { useAuthStore } from '@stores/AuthStore'
import { AppLayout } from '@layouts/AppLayout'
import { ProjectLayout } from '@layouts/ProjectLayout'
import { HomePage } from '@pages/HomePage'
import { ProjectPage } from '@pages/ProjectPage'
import { SignInPage } from '@pages/SignInPage'

function App(): JSX.Element {
  const { session, setSessions } = useAuthStore()

  useEffect(() => {
    if (!session) {
      // 1. session이 store에 없을 경우, Storage에서 조회
      const storageSession = localStorage.getItem('session')

      // 2. Storage에서 조회한 session이 존재할 경우, store에 세팅
      storageSession && setSessions(JSON.parse(storageSession))
    }
  }, [])

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
