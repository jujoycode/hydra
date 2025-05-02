import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthState } from '@/types/auth'
import type { Session } from '@supabase/supabase-js'
import type { User } from '@/interface/CoreInterface'

/**
 * 인증 상태를 관리하는 Zustand 스토어
 * localStorage에 영구 저장되어 새로고침 후에도 로그인 상태가 유지됩니다.
 *
 * - user: 사용자 정보
 * - session: 세션 정보
 * - isLoading: 로딩 상태
 * - isAuthenticated: 인증 상태
 * - error: 에러 정보
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user: User | null) =>
        set((state) => ({
          user,
          isAuthenticated: !!user && !!state.session
        })),

      setSession: (session: Session | null) =>
        set((state) => ({
          session,
          isAuthenticated: !!session && !!state.user
        })),

      setError: (error: Error | null) => set({ error }),

      signOut: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false
        }),

      reset: () =>
        set({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          error: null
        })
    }),
    {
      name: 'hydra-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      }),
      skipHydration: false
    }
  )
)
