import type { User } from '@/interface/CoreInterface'

export interface RouterContext {
  auth: {
    isConnected: boolean
    user: User | null
    disconnect: () => void
  }
}
