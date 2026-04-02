// 사용자 리포지토리 인터페이스

export interface CreateUserData {
  userId: string
  userName: string
  userEmail: string
  userDbRole: string
  userRole?: 'admin' | 'member'
  userAvatarPath?: string | null
}

export interface UpdateUserData {
  userName?: string
  userEmail?: string
  userAvatarPath?: string | null
}

export interface UserRecord {
  user_id: string
  user_name: string | null
  user_email: string | null
  user_db_role: string | null
  user_avatar_path: string | null
  user_role: 'admin' | 'member'
  user_created_at: Date | null
  user_updated_at: Date | null
}

export interface UserRepository {
  findById(userId: string): Promise<UserRecord | null>
  findByDbRole(dbRole: string): Promise<UserRecord | null>
  findAll(): Promise<UserRecord[]>
  create(data: CreateUserData): Promise<UserRecord>
  update(userId: string, data: UpdateUserData): Promise<UserRecord>
  delete(userId: string): Promise<boolean>
  count(): Promise<number>
}
