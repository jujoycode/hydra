import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/interface/CoreInterface'
import type { AuthState, WorkspaceConfig } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isConnected: false,
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
