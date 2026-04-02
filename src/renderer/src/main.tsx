import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from '@/routers'
import { useAuthStore } from '@/stores/auth'
import './index.css'

function InnerApp() {
  const { user, isConnected, disconnect } = useAuthStore()
  return <RouterProvider router={router} context={{ auth: { user, isConnected, disconnect } }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <InnerApp />
    </ThemeProvider>
  </StrictMode>
)
