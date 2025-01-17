import { useEffect, type PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'

export function AuthGuard({ children }: PropsWithChildren) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [user, navigate])

  return children
}
