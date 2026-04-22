import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IpcChannel, type User } from '@/interface/CoreInterface'
import type { AuthState, WorkspaceConfig } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isConnected: false,
      isLoading: false,
      isBootstrapped: false,
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
        }),

      // 앱 부팅 시 main 프로세스의 실제 연결 상태와 renderer persist 상태를 동기화한다.
      // main이 재시작되어 RepositoryContainer 가 초기화되지 않은 상태이면 disconnect 처리.
      bootstrap: async () => {
        try {
          const result = await window.callApi(IpcChannel.WORKSPACE_STATUS)
          const connectedInMain = result?.data?.connected === true
          const { isConnected } = get()

          if (isConnected && !connectedInMain) {
            // renderer는 연결된 것으로 알고 있지만 main은 초기화되어 있지 않음 → 상태 정리
            set({
              user: null,
              isConnected: false,
              currentWorkspace: null
            })
          }
        } catch (error) {
          // IPC 호출 실패 시에도 안전하게 disconnect 상태로 둔다.
          console.error('[auth.bootstrap] failed to sync with main', error)
          set({
            user: null,
            isConnected: false,
            currentWorkspace: null
          })
        } finally {
          set({ isBootstrapped: true })
        }
      }
    }),
    {
      name: 'hydra-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isConnected: state.isConnected,
        currentWorkspace: state.currentWorkspace
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isConnected && !state.user) {
          state.disconnect()
        }
      }
    }
  )
)
