import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useAuthStore()
  const location = useLocation()

  // *. 실시간 session 상태 변화 처리
  if (!session) {
    return <Navigate to='/signin' state={{ from: location }} replace />
  }

  return children
}
