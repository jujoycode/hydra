import { Badge } from '@/atoms/Badge'
import { CheckIcon, ClockIcon, LockIcon } from 'lucide-react'

export type IssueState = 'in_progress' | 'done' | 'blocked' | 'review'

interface IssueBadgeProps {
  state: IssueState
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'subtle' | 'outline' | 'surface' | 'plain'
}

export function IssueBadge({ state, className, size = 'sm', variant = 'subtle' }: IssueBadgeProps) {
  const getBadgeProps = () => {
    switch (state) {
      case 'done':
        return {
          label: 'Done',
          icon: <CheckIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
          colorScheme: 'green' as const
        }
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: <ClockIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
          colorScheme: 'yellow' as const
        }
      case 'blocked':
        return {
          label: 'Blocked',
          icon: <LockIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
          colorScheme: 'red' as const
        }
      case 'review':
        return {
          label: 'Review',
          icon: <CheckIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
          colorScheme: 'blue' as const
        }

      default:
        return {
          label: state,
          icon: <CheckIcon size={12} strokeWidth={1.5} className='mr-0.5' />,
          colorScheme: 'gray' as const
        }
    }
  }

  const { label, colorScheme, icon } = getBadgeProps()

  return (
    <Badge className={className} variant={variant} size={size} colorScheme={colorScheme} icon={icon}>
      {label}
    </Badge>
  )
}
