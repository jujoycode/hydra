import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useSignInStore } from '@stores/signInStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useAuthStore()
  const { actions } = useSignInStore()
  const location = useLocation()

  // *. 실시간 session 상태 변화 처리
  if (!session) {
    actions.resetSignIn()
    return <Navigate to='/signin' state={{ from: location }} replace />
  }

  return children
}
