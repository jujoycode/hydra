import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { type DbmsType, IpcChannel, type User } from '@/interface/CoreInterface'
import type { AuthState, WorkspaceConfig } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isConnected: false,
      isLoading: false,
      isBootstrapped: false,
      isAuthenticated: false,
      needsSetup: false,
      error: null,
      currentWorkspace: null,

      setUser: (user: User | null) => set({ user }),
      setConnected: (connected: boolean) => set({ isConnected: connected }),
      setCurrentWorkspace: (ws: WorkspaceConfig | null) => set({ currentWorkspace: ws }),
      setError: (error: Error | null) => set({ error }),
      setAuthenticated: (v: boolean) => set({ isAuthenticated: v }),
      setNeedsSetup: (v: boolean) => set({ needsSetup: v }),

      disconnect: () =>
        set({
          user: null,
          isConnected: false,
          isAuthenticated: false,
          needsSetup: false,
          currentWorkspace: null
        }),

      reset: () =>
        set({
          user: null,
          isConnected: false,
          isAuthenticated: false,
          needsSetup: false,
          isLoading: false,
          error: null,
          currentWorkspace: null
        }),

      logout: async () => {
        try {
          await window.callApi(IpcChannel.AUTH_LOGOUT)
        } finally {
          set({ user: null, isAuthenticated: false })
        }
      },

      // 앱 부팅 시 main 프로세스의 실제 연결 상태와 renderer persist 상태를 동기화한다.
      // main이 재시작되어 RepositoryContainer 가 초기화되지 않은 상태이면 disconnect 처리.
      bootstrap: async () => {
        try {
          const status = await window.callApi(IpcChannel.WORKSPACE_STATUS)
          const connectedInMain = status?.data?.connected === true
          const needsSetup = status?.data?.needsSetup === true

          if (!connectedInMain) {
            set({ user: null, isConnected: false, isAuthenticated: false, needsSetup: false, currentWorkspace: null })
            return
          }

          // 연결됨 → 세션 재검증
          const session = await window.callApi(IpcChannel.AUTH_SESSION_STATUS)
          const authed = session?.data?.authenticated === true
          set({
            isConnected: true,
            needsSetup,
            isAuthenticated: authed,
            user: authed ? (session?.data?.user ?? null) : null
          })
        } catch (error) {
          console.error('[auth.bootstrap] failed to sync with main', error)
          set({ user: null, isConnected: false, isAuthenticated: false, needsSetup: false, currentWorkspace: null })
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
        isAuthenticated: state.isAuthenticated,
        needsSetup: state.needsSetup,
        currentWorkspace: state.currentWorkspace
      }),
      version: 1,
      // Phase 4 이전 persist에는 currentWorkspace.dbms 필드가 없다 → postgresql로 백필
      migrate: (persisted: unknown, _version: number): Partial<AuthState> => {
        const state = persisted as Partial<AuthState>
        if (state?.currentWorkspace) {
          state.currentWorkspace = {
            ...state.currentWorkspace,
            dbms: (state.currentWorkspace as { dbms?: DbmsType }).dbms ?? 'postgresql'
          }
        }
        return state
      }
    }
  )
)
