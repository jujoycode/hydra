import type { SafeUser, UserRecord } from '@/database/repository/interfaces/UserRepository'

// 비밀번호 해시를 제거해 렌더러로 안전하게 보낼 형태로 변환
export function toSafeUser(user: UserRecord): SafeUser {
  const { user_password_hash, ...safe } = user
  return safe
}

// 첫 관리자 시드 임계구역을 보호하는 advisory lock 키 (트랜잭션 스코프)
export const FIRST_ADMIN_LOCK_KEY = 481975
