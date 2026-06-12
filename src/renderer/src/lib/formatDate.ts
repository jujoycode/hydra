import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 다양한 입력(Date | string | number | null | undefined)을 안전하게 Date로 정규화한다.
 * - null/undefined → null
 * - ISO 문자열은 parseISO 우선(브라우저 편차 방지)
 * - 유효하지 않은 날짜 → null
 */
function toDate(date: Date | string | number | null | undefined): Date | null {
  if (date == null) return null
  if (date instanceof Date) return Number.isNaN(date.getTime()) ? null : date
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * 한국식 날짜 — 예 '2026.05.25 (월)'
 * (date-fns ko locale의 EEEEE = 단일글자 요일)
 */
export function formatKoreanDate(date: Date | string | number | null | undefined): string {
  const d = toDate(date)
  return d ? format(d, 'yyyy.MM.dd (EEEEE)', { locale: ko }) : '-'
}

/**
 * 상대 시간 — 예 '3일 전'
 */
export function formatRelativeKorean(date: Date | string | number | null | undefined): string {
  const d = toDate(date)
  return d ? formatDistanceToNow(d, { locale: ko, addSuffix: true }) : '-'
}

/**
 * 24시간제 시각 — 예 '14:30'
 */
export function formatKoreanTime(date: Date | string | number | null | undefined): string {
  const d = toDate(date)
  return d ? format(d, 'HH:mm', { locale: ko }) : '-'
}
