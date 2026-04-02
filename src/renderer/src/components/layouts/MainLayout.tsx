import { Outlet } from '@tanstack/react-router'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/atoms/ResizablePanel'
import { Toaster } from '@/atoms/Sonner'
import { useAuth } from '@/hooks/use-auth'
import { DetailPanel } from '@/organisms/panels/DetailPanel'
import { AppSidebar } from '@/organisms/sidebars/AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/organisms/sidebars/Sidebar'
import { usePanelStore } from '@/stores/panel'

export function MainLayout() {
  const { user } = useAuth()
  const isDetailOpen = usePanelStore((s) => s.isDetailOpen)

  if (!user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ResizablePanelGroup direction='horizontal' className='h-screen'>
          <ResizablePanel defaultSize={isDetailOpen ? 60 : 100} minSize={40}>
            <div className='flex h-full flex-col'>
              <div className='flex items-center gap-2 border-b px-4 py-2'>
                <SidebarTrigger className='-ml-1' />
              </div>
              <main className='flex-1 overflow-auto'>
                <Outlet />
              </main>
            </div>
          </ResizablePanel>
          {isDetailOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={25} maxSize={50}>
                <DetailPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
