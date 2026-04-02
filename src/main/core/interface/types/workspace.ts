import type { UserRecord } from '../../database/repository/interfaces/UserRepository'

export interface WorkspaceSaveParams {
  name: string
  host: string
  port: number
  dbName: string
  username: string
  sslCertPath?: string
}

export interface WorkspaceDeleteParams {
  workspaceId: string
}

export interface WorkspaceConnectParams {
  host: string
  port: number
  dbName: string
  username: string
  password: string
  sslCertPath?: string
}

export interface WorkspaceStatusResponse {
  connected: boolean
  user: UserRecord | null
  isFirstLogin: boolean
}
