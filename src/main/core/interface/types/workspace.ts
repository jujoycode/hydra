export interface WorkspaceConfig {
  id: string
  name: string
  host: string
  port: number
  dbName: string
  username: string
  sslCertPath?: string
}

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
  needsSetup: boolean
}
