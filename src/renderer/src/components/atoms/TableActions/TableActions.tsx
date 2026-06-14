import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Button } from '@/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/atoms/DropdownMenu'
import { cn } from '@/lib/utils'

export interface TableAction {
  /** 액션 라벨 */
  label: string
  /** 액션 실행 핸들러 */
  onClick: () => void
  /** 액션 아이콘 */
  icon?: React.ReactNode
  /** 위험한 액션 여부 (빨간색으로 표시) */
  isDangerous?: boolean
  /** 액션 비활성화 여부 */
  disabled?: boolean
  /** 액션 숨김 여부 */
  hidden?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

export interface TableActionGroupProps {
  /** 액션 그룹 제목 */
  label: string
  /** 액션 목록 */
  actions: TableAction[]
}

export interface TableActionsProps {
  /** 테이블 액션 목록 */
  actions: TableAction[]
  /** 액션 그룹 목록 */
  groups?: TableActionGroupProps[]
  /** 버튼 변형 */
  variant?: 'ghost' | 'outline' | 'link'
  /** 버튼 크기 */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** 추가 CSS 클래스 */
  className?: string
  /** 메뉴 정렬 방향 */
  align?: 'start' | 'center' | 'end'
  /** 버튼 디자인 커스터마이징 */
  buttonClassName?: string
  /** 아이콘 대신 사용할 트리거 요소 */
  triggerElement?: React.ReactNode
}

/**
 * 테이블 행 액션 컴포넌트
 * 행의 액션 드롭다운 메뉴를 제공합니다.
 */
export function TableActions({
  actions,
  groups,
  variant = 'ghost',
  size = 'sm',
  className,
  align = 'end',
  buttonClassName,
  triggerElement
}: TableActionsProps) {
  // 보이는 액션과 그룹만 필터링
  const visibleActions = actions.filter((action) => !action.hidden)
  const visibleGroups = groups?.filter((group) => group.actions.some((action) => !action.hidden)) || []

  // 표시할 액션이 없으면 렌더링하지 않음
  if (visibleActions.length === 0 && visibleGroups.length === 0) {
    return null
  }

  return (
    <div className={cn('flex mr-4', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerElement || (
            <Button variant={variant} size={size} className={cn('h-6 w-6 p-0 action-button', buttonClassName)}>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-3.5 w-3.5' />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {/* 일반 액션 */}
          {visibleActions.map((action, index) => (
            <DropdownMenuItem
              key={`action-${index}`}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'cursor-pointer',
                action.isDangerous && 'text-destructive focus:text-destructive',
                action.className
              )}
            >
              {action.icon && <span className='mr-2'>{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}

          {/* 액션 그룹 */}
          {visibleGroups.map((group, groupIndex) => {
            const groupVisibleActions = group.actions.filter((action) => !action.hidden)

            if (groupVisibleActions.length === 0) return null

            // 일반 액션과 그룹 사이, 또는 그룹 사이에 구분선 추가
            const showSeparator = (visibleActions.length > 0 && groupIndex === 0) || groupIndex > 0

            return (
              <React.Fragment key={`group-${groupIndex}`}>
                {showSeparator && <DropdownMenuSeparator />}
                {group.label && <DropdownMenuItem disabled>{group.label}</DropdownMenuItem>}

                {groupVisibleActions.map((action, actionIndex) => (
                  <DropdownMenuItem
                    key={`group-${groupIndex}-action-${actionIndex}`}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={cn(
                      'cursor-pointer pl-6',
                      action.isDangerous && 'text-destructive focus:text-destructive',
                      action.className
                    )}
                  >
                    {action.icon && <span className='mr-2'>{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </React.Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
