import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { EmptyPage } from '@/pages/EmptyPage'
import { router } from '@/routers'
import { useAuthStore } from '@/stores/auth'
import './index.css'
import './locales'

function InnerApp() {
  const { user, isConnected, disconnect, isBootstrapped, bootstrap } = useAuthStore()

  // 앱 진입 시 1회 main 프로세스 상태와 동기화.
  // main이 재시작되어 RepositoryContainer 가 비어있는 경우 persist 된 isConnected 를 초기화한다.
  useEffect(() => {
    if (!isBootstrapped) {
      bootstrap()
    }
  }, [isBootstrapped, bootstrap])

  if (!isBootstrapped) {
    return <EmptyPage />
  }

  return <RouterProvider router={router} context={{ auth: { user, isConnected, disconnect } }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <InnerApp />
    </ThemeProvider>
  </StrictMode>
)
