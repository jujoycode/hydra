import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@layouts/AppLayout'
import { ProjectLayout } from '@layouts/ProjectLayout'
import { HomePage } from '@pages/HomePage'
import { ProjectPage } from '@pages/ProjectPage'

function App(): JSX.Element {
  /**
   * @rule
   * main: /
   * project: /projects
   * project detail: /projects/:projectId
   * issue: /projects/:projectId/issues
   * issue detail: /projects/:projectId/issues/:issueId
   */

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects' element={<ProjectLayout />}>
            <Route path=':projectId' element={<ProjectPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
