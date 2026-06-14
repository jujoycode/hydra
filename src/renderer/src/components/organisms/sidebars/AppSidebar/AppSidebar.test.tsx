import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IpcChannel } from '@/interface/CoreInterface'
import { SidebarProvider } from '@/organisms/sidebars/Sidebar'
import { useAuthStore } from '@/stores/auth'
import { fireEvent, render, screen } from '@/test/test-utils'
import { installMockCallApi } from '../../../../__testutils__/mockCallApi'
import { AppSidebar } from './AppSidebar'

// 레포에 라우터 테스트 하니스가 없어 라우터 훅/Link를 가벼운 스텁으로 모킹한다.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children?: ReactNode; to?: unknown }) => (
    <a href={typeof to === 'string' ? to : '#'}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/projects' }),
  useNavigate: () => vi.fn()
}))

function seedUser() {
  useAuthStore.setState({
    user: { user_id: 'u1', user_sn: 'tester', user_name: 'Tester', user_email: 't@example.com' } as never,
    isConnected: true
  })
}

describe('AppSidebar — 프로젝트 생성 진입점', () => {
  beforeEach(() => {
    installMockCallApi({ [IpcChannel.PROJECT_LIST]: () => ({ data: [], error: null }) })
    seedUser()
  })

  it('사이드바 "Add Project" 액션을 클릭하면 CreateProjectDialog가 열린다', () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    )

    // 클릭 전: 생성 다이얼로그는 닫혀 있다
    expect(screen.queryByText('새 프로젝트 생성')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTitle('프로젝트 추가'))

    // 클릭 후: 생성 다이얼로그가 열린다
    expect(screen.getByText('새 프로젝트 생성')).toBeInTheDocument()
  })
})
