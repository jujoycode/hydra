import type { DbmsType } from './workspace'

export interface InviteGenerateParams {
  workspaceName: string
  host: string
  port: number
  dbName: string
  dbms: DbmsType
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
  dbms: DbmsType
  expiresAt: string | null
}
