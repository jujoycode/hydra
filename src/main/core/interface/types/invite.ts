export interface InviteGenerateParams {
  workspaceName: string
  host: string
  port: number
  dbName: string
  expiresInHours?: number
}

export interface InviteApplyParams {
  code: string
}

export interface InviteCodeInfo {
  workspaceName: string
  host: string
  port: number
  dbName: string
  expiresAt: string | null
}
