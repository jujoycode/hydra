import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

/**
 * cn
 * @returns tailwind merge class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * formatDate
 * @deprecated 한국식 날짜는 `lib/formatDate.ts`의 `formatKoreanDate`를 사용하라.
 * @returns formatted date
 */
export type FormatDateOptions = 'yyyy년 MM월 dd일'
export function formatDate(date: Date, formatStr: FormatDateOptions = 'yyyy년 MM월 dd일') {
  return format(date, formatStr)
}
