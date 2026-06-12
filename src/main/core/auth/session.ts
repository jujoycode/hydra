// src/main/core/auth/session.ts
// 세션 레코드(순수 로직). 영속화는 SessionManager가 담당한다.

export interface SessionRecord {
  userId: string
  userSn: string
  issuedAt: number
  expiresAt: number
}

const DAY = 24 * 60 * 60 * 1000
export const SESSION_TTL_MS = { default: DAY, remember: 30 * DAY } as const

export function createSessionRecord(
  user: { user_id: string; user_sn: string },
  rememberMe: boolean,
  now: number
): SessionRecord {
  const ttl = rememberMe ? SESSION_TTL_MS.remember : SESSION_TTL_MS.default
  return { userId: user.user_id, userSn: user.user_sn, issuedAt: now, expiresAt: now + ttl }
}

export function isExpired(session: SessionRecord, now: number): boolean {
  return now >= session.expiresAt
}
