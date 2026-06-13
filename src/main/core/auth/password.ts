// scrypt 비밀번호 해싱. 파라미터를 해시 문자열에 함께 저장해 향후 진화 가능.
// 형식: scrypt$N=32768,r=8,p=1$<saltB64>$<hashB64>

import { randomBytes, type ScryptOptions, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'

const N = 32768 // 2^15
const R = 8
const P = 1
const KEYLEN = 64
// 메모리 ≈ 128*N*r ≈ 33.5MiB > Node 기본 maxmem(32MiB) → 명시적 maxmem 필수
const MAXMEM = 64 * 1024 * 1024

/** promisify 대신 직접 래핑 — options 오버로드를 명확히 사용하기 위함 */
function scrypt(password: string | Buffer, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (err, derived) => {
      if (err) reject(err)
      else resolve(derived)
    })
  })
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await scrypt(plain, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM })
  return `scrypt$N=${N},r=${R},p=${P}$${salt.toString('base64')}$${derived.toString('base64')}`
}

export async function verifyPassword(plain: string, encoded: string): Promise<boolean> {
  try {
    const parts = encoded.split('$')
    if (parts.length !== 4 || parts[0] !== 'scrypt') return false
    const params = Object.fromEntries(parts[1].split(',').map((kv) => kv.split('=')))
    const n = Number(params.N)
    const r = Number(params.r)
    const p = Number(params.p)
    if (!n || !r || !p) return false
    const salt = Buffer.from(parts[2], 'base64')
    const expected = Buffer.from(parts[3], 'base64')
    const derived = await scrypt(plain, salt, expected.length, { N: n, r, p, maxmem: MAXMEM })
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}
