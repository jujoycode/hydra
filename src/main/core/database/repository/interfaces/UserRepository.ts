import type { RepoExecutor } from './RepoExecutor'

export interface UserRecord {
  user_id: string
  user_sn: string
  user_password_hash: string
  user_status: string | null
  user_name: string | null
  user_email: string | null
  user_db_role: string | null
  user_avatar_path: string | null
  user_role: 'admin' | 'member'
  user_created_at: Date | null
  user_updated_at: Date | null
}

// 비밀번호 해시를 제외한, 렌더러로 보낼 수 있는 안전한 사용자 형태
export type SafeUser = Omit<UserRecord, 'user_password_hash'>

export interface CreateUserData {
  userId: string
  userSn: string
  passwordHash: string
  userName?: string | null
  userEmail?: string | null
  userRole?: 'admin' | 'member'
  userStatus?: string
  userAvatarPath?: string | null
}

export interface UpdateUserData {
  userName?: string
  userEmail?: string
  userAvatarPath?: string | null
  userStatus?: string
}

export interface UserRepository {
  findById(userId: string): Promise<UserRecord | null>
  findBySn(userSn: string): Promise<UserRecord | null>
  findAll(): Promise<UserRecord[]>
  create(data: CreateUserData, executor?: RepoExecutor): Promise<UserRecord>
  update(userId: string, data: UpdateUserData): Promise<UserRecord>
  delete(userId: string): Promise<boolean>
  count(executor?: RepoExecutor): Promise<number>
}
