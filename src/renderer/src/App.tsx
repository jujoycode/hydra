import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@components/common/Layout'
import { HomePage } from '@pages/HomePage'
import { ProjectPage } from '@pages/ProjectPage'

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects/:projectId' element={<ProjectPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
