import { useAuthStore } from '@/stores/auth'

/**
 * Custom hook for accessing auth state
 * @returns Auth state and actions
 */
export const useAuth = () => {
  const {
    user,
    isConnected,
    isLoading,
    error,
    currentWorkspace,
    setUser,
    setConnected,
    setCurrentWorkspace,
    setError,
    disconnect,
    reset
  } = useAuthStore()

  return {
    user,
    isConnected,
    isLoading,
    error,
    currentWorkspace,
    setUser,
    setConnected,
    setCurrentWorkspace,
    setError,
    disconnect,
    reset
  }
}
