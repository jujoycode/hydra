import { useAuthStore } from '@/stores/auth'

/**
 * 인증 상태를 관리하는 커스텀 훅
 * @returns 인증 상태 및 기능
 */
export const useAuth = () => {
  const { user, session, isLoading, isAuthenticated, error, setUser, setSession, setError, signOut, reset } =
    useAuthStore()

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    setUser,
    setSession,
    setError,
    signOut,
    reset
  }
}
