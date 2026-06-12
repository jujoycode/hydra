import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/interface/CoreInterface'
import type { AuthState, WorkspaceConfig } from '@/types/auth'

// TEMP(디자인 미리보기): 로그인/연결 없이 대시보드 진입용 mock 유저. 정식 인증 복구 시 제거.
const MOCK_USER: User = {
  user_id: 'preview-admin',
  user_name: 'Preview Admin',
  user_email: 'preview@hydra.local',
  user_db_role: 'postgres',
  user_avatar_path: null,
  user_role: 'admin',
  user_created_at: null,
  user_updated_at: null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // TEMP(디자인 미리보기): 기본을 연결됨 + mock 유저로 둬 인증 게이트 우회
      user: MOCK_USER,
      isConnected: true,
      isLoading: false,
      error: null,
      currentWorkspace: null,

      setUser: (user: User | null) => set({ user }),
      setConnected: (connected: boolean) => set({ isConnected: connected }),
      setCurrentWorkspace: (ws: WorkspaceConfig | null) => set({ currentWorkspace: ws }),
      setError: (error: Error | null) => set({ error }),

      disconnect: () =>
        set({
          user: null,
          isConnected: false,
          currentWorkspace: null
        }),

      reset: () =>
        set({
          user: null,
          isConnected: false,
          isLoading: false,
          error: null,
          currentWorkspace: null
        })
    }),
    {
      name: 'hydra-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        currentWorkspace: state.currentWorkspace
      }),
      onRehydrateStorage: () => (state) => {
        // TEMP(디자인 미리보기): 재시작 후에도 연결됨 + mock 유저 유지 (인증 게이트 우회)
        if (state) {
          state.setConnected(true)
          state.setUser(MOCK_USER) // 미리보기: mock 데이터 담당자 ID와 일치하도록 항상 고정
        }
      }
    }
  )
)
