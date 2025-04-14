import { RouterProvider } from 'react-router'
import { router } from '@/routers'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
