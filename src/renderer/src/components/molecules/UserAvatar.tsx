import React from 'react'
import { cn } from '@lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@atoms/Avatar'
import { User } from 'lucide-react'

interface UserAvatarProps {
  name: string
  avatar?: string
  email?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showInfo?: boolean
  fallback?: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function UserAvatar({
  name,
  avatar,
  email,
  size = 'md',
  showInfo = false,
  fallback,
  className,
  align = 'left',
}: UserAvatarProps) {
  const avatarSizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  }

  const justifyClasses = {
    left: '',
    center: 'justify-center',
  }

  const defaultFallback = fallback || (
    <User size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 20 : 24} strokeWidth={1.5} />
  )

  return (
    <div className={cn('flex items-center gap-2', justifyClasses[align], className)}>
      <Avatar className={avatarSizeClasses[size]}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{defaultFallback}</AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className={cn('flex flex-col', align === 'left' ? 'items-start' : 'items-center')}>
          <span className={cn('font-medium', textSizeClasses[size])}>{name}</span>
          {email && <span className="text-xs text-muted-foreground">{email}</span>}
        </div>
      )}

      {!showInfo && name && <span className={textSizeClasses[size]}>{name}</span>}
    </div>
  )
}
