import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

/**
 * cn
 * @returns tailwind merge class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * formatDate
 * @returns formatted date
 */
export type FormatDateOptions = 'yyyy년 MM월 dd일'
export function formatDate(date: Date, formatStr: FormatDateOptions = 'yyyy년 MM월 dd일') {
  return format(date, formatStr)
}

/**
 * getImageUrl
 * @returns image url
 */
export function getPublicImageUrl(key: string) {
  return `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/public/${import.meta.env.VITE_SUPABASE_PUBLIC_REPO}/${key}`
}
