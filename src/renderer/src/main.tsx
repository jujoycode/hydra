import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/atoms/Sonner'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/routers'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import './index.css'
import './locales'

function InnerApp() {
  const { user, isConnected, disconnect } = useAuthStore()

  // TEMP(디자인 미리보기): project 스토어를 채우는 부트스트랩이 없어, 시작 시 PROJECT_LIST로 시드한다.
  useEffect(() => {
    window
      .callApi(IpcChannel.PROJECT_LIST, { userId: user?.user_id ?? '' })
      .then((res) => {
        const projects = res?.data
        if (Array.isArray(projects) && projects.length > 0) {
          const store = useProjectStore.getState()
          store.setProjects(projects)
          if (!store.selectedProjectId) store.setSelectedProjectId(projects[0].project_id)
        }
      })
      .catch(() => {})
  }, [user?.user_id])

  return <RouterProvider router={router} context={{ auth: { user, isConnected, disconnect } }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
