// src/main/core/auth/normalize.ts
// 로그인 핸들/이메일 정규화 — insert 와 lookup 양쪽에서 동일하게 적용한다.
export function normalizeHandle(value: string): string {
  return value.trim().toLowerCase()
}
