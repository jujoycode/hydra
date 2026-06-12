import type { DbmsType, User } from '@/interface/CoreInterface'

export interface WorkspaceConfig {
  id: string
  name: string
  host: string
  port: number
  dbName: string
  username: string
  dbms: DbmsType
  sslCertPath?: string
}

export interface AuthState {
  user: User | null
  isConnected: boolean
  isLoading: boolean
  isBootstrapped: boolean
  isAuthenticated: boolean
  needsSetup: boolean
  error: Error | null
  currentWorkspace: WorkspaceConfig | null
  setUser: (user: User | null) => void
  setConnected: (connected: boolean) => void
  setCurrentWorkspace: (ws: WorkspaceConfig | null) => void
  setError: (error: Error | null) => void
  setAuthenticated: (v: boolean) => void
  setNeedsSetup: (v: boolean) => void
  disconnect: () => void
  reset: () => void
  logout: () => Promise<void>
  bootstrap: () => Promise<void>
}
