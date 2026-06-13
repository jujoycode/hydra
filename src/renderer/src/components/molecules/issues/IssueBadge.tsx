import { CheckIcon, CircleDashedIcon, ClockIcon, EyeIcon, LockIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/atoms/Badge'
import type { IssueStatus } from '@/interface/CoreInterface'
import { STATUS_CLASS, STATUS_LABEL } from '@/lib/statusTokens'
import { cn } from '@/lib/utils'

/** 이슈 상태값은 공유 인터페이스의 IssueStatus를 단일 출처로 사용한다. */
export type IssueState = IssueStatus

interface IssueBadgeProps {
  state: IssueState
  className?: string
  size?: 'sm' | 'lg'
  /**
   * 호환을 위해 받지만 사용하지 않는다.
   * 상태 배지는 항상 STATUS_CLASS(틴트 배경 + 진한 동계열 텍스트)로 렌더한다.
   */
  variant?: 'solid' | 'subtle' | 'outline' | 'surface' | 'plain'
}

const STATUS_ICON: Record<IssueState, ReactNode> = {
  backlog: <CircleDashedIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
  in_progress: <ClockIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
  review: <EyeIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
  done: <CheckIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
  blocked: <LockIcon size={12} strokeWidth={1.5} className='mr-0.5' />
}

export function IssueBadge({ state, className, size = 'sm' }: IssueBadgeProps) {
  return (
    <Badge
      variant='plain'
      size={size}
      className={cn('rounded-sm', STATUS_CLASS[state], className)}
      icon={STATUS_ICON[state]}
    >
      {STATUS_LABEL[state]}
    </Badge>
  )
}
