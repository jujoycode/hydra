import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type React from 'react'
import { cn } from '@/lib/utils'
import type { TableAlignment } from './TableBase'

export interface TableColumnHeaderProps<TData, TValue> {
  /** 테이블 컬럼 인스턴스 */
  column: Column<TData, TValue>
  /** 컬럼 제목 */
  title: string
  /** 정렬 방향 아이콘 표시 여부 */
  showSortIcon?: boolean
  /** 헤더 정렬 방식 */
  align?: TableAlignment
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 테이블 컬럼 헤더 컴포넌트
 * 정렬 아이콘을 포함한 컬럼 헤더를 렌더링합니다.
 */
export function TableColumnHeader<TData, TValue>({
  column,
  title,
  showSortIcon = true,
  align = 'left',
  className
}: TableColumnHeaderProps<TData, TValue>) {
  // 정렬 아이콘 스타일
  const iconStyles = {
    active: 'w-4 h-4 text-blue-600',
    inactive: 'w-4 h-4 text-gray-500'
  }

  // 정렬 아이콘 렌더링
  const renderSortIcon = () => {
    if (!showSortIcon || !column.getCanSort()) return null

    return (
      <div className='ml-1.5'>
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className={iconStyles.active} strokeWidth={2.5} />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className={iconStyles.active} strokeWidth={2.5} />
        ) : (
          <ArrowUpDown className={iconStyles.inactive} strokeWidth={2} />
        )}
      </div>
    )
  }

  // 정렬 방향에 따른 컨테이너 스타일
  const getContainerStyles = () => {
    switch (align) {
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-start'
    }
  }

  return (
    <div className={cn('flex items-center', getContainerStyles(), className)}>
      <span className='text-xs font-medium truncate'>{title}</span>
      {renderSortIcon()}
    </div>
  )
}

export interface TableCellProps<TValue> {
  /** 셀 값 */
  value: TValue
  /** 값 포맷 함수 */
  format?: (value: TValue) => React.ReactNode
  /** 정렬 방식 */
  align?: TableAlignment
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 테이블 셀 컴포넌트
 * 테이블 셀 내용을 포맷팅하여 표시합니다.
 */
export function TableCell<TValue>({ value, format, align = 'left', className }: TableCellProps<TValue>) {
  // 정렬 스타일
  const getAlignmentStyle = () => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return (
    <div className={cn('py-2 text-sm', getAlignmentStyle(), className)}>
      {format ? format(value) : (value as React.ReactNode)}
    </div>
  )
}
