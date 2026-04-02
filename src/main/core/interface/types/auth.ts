import type { UserRecord } from '../../database/repository/interfaces/UserRepository'

export type User = UserRecord

export interface AuthDeleteUserParams {
  id: string
  shouldSoftDelete: boolean
}

export interface AuthUpdateUserParams {
  userId: string
  userName?: string
  userAvatarKey?: string | null
}

export interface CreateMemberParams {
  userName: string
  userEmail: string
  dbRoleName: string
  dbPassword: string
  userRole?: 'admin' | 'member'
}
