import type { SafeUser } from '../../database/repository/interfaces/UserRepository'

export type User = SafeUser

export interface AuthDeleteUserParams {
  id: string
  shouldSoftDelete: boolean
}

export interface AuthUpdateUserParams {
  userId: string
  userName?: string
  userAvatarKey?: string | null
}

// 관리자가 멤버를 만들 때 (ROLE 생성 없음, 초기 비밀번호 설정)
export interface CreateMemberParams {
  userSn: string
  userName: string
  userEmail: string
  initialPassword: string
  userRole?: 'admin' | 'member'
}

export interface LoginParams {
  userSn: string
  password: string
  rememberMe?: boolean
}

export interface SetupAdminParams {
  userSn: string
  userName: string
  userEmail?: string
  password: string
}

export interface SessionStatusResponse {
  authenticated: boolean
  user: SafeUser | null
}
