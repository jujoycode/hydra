import { ClipboardList } from 'lucide-react'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface TableEmptyProps {
  /** 빈 상태 메시지 */
  message?: string
  /** 하위 설명 메시지 */
  description?: string
  /** 아이콘 컴포넌트 */
  icon?: React.ReactNode
  /** 로딩 상태 여부 */
  isLoading?: boolean
  /** 로딩 메시지 */
  loadingMessage?: string
  /** 추가 CSS 클래스 */
  className?: string
}

export const TABLE_EMPTY_STYLES = {
  container: 'flex flex-col items-center justify-center py-6',
  icon: 'h-10 w-10 text-muted-foreground mb-2',
  title: 'text-muted-foreground font-medium',
  description: 'text-sm text-muted-foreground mt-1'
}

/**
 * 테이블 데이터가 없는 상태나 로딩 상태를 표시하는 컴포넌트
 */
export function TableEmpty({
  message = 'No data available',
  description,
  icon,
  isLoading = false,
  loadingMessage = 'Loading data...',
  className
}: TableEmptyProps) {
  const defaultIcon = <ClipboardList className={TABLE_EMPTY_STYLES.icon} />

  if (isLoading) {
    return (
      <div className={cn(TABLE_EMPTY_STYLES.container, 'animate-pulse', className)}>
        {icon || defaultIcon}
        <p className={TABLE_EMPTY_STYLES.title}>{loadingMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn(TABLE_EMPTY_STYLES.container, className)}>
      {icon || defaultIcon}
      <p className={TABLE_EMPTY_STYLES.title}>{message}</p>
      {description && <p className={TABLE_EMPTY_STYLES.description}>{description}</p>}
    </div>
  )
}
