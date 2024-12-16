import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@components/common/Layout'
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
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects/:projectId' element={<ProjectPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
