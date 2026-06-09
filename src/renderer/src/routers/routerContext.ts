import type { User } from '@/interface/CoreInterface'

export interface RouterContext {
  auth: {
    isConnected: boolean
    isAuthenticated: boolean
    needsSetup: boolean
    user: User | null
    disconnect: () => void
  }
}
