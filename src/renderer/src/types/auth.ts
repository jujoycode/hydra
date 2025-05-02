import type { Session } from '@supabase/supabase-js'
import type { User } from '@/interface/CoreInterface'

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setError: (error: Error | null) => void
  signOut: () => void
  reset: () => void
}
