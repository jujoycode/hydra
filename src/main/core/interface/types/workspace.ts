export type DbmsType = 'postgresql' | 'mysql'

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

export interface WorkspaceSaveParams {
  name: string
  host: string
  port: number
  dbName: string
  username: string
  dbms: DbmsType
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
  // 미지정 시 postgresql (구버전 renderer persist 호환)
  dbms?: DbmsType
  sslCertPath?: string
}

export interface WorkspaceStatusResponse {
  connected: boolean
  needsSetup: boolean
}
