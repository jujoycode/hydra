import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@components/ui/toaster'
import { router as HydraRouter } from '@routes'

function App(): JSX.Element {
  return (
    <>
      <RouterProvider router={HydraRouter} />
      <Toaster />
    </>
  )
}

export default App
