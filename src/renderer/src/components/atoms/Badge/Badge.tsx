import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

export const badgeVariants = cva('inline-flex items-center rounded-full font-medium transition-colors', {
  variants: {
    variant: {
      solid: '',
      subtle: '',
      outline: 'border',
      surface: '',
      plain: ''
    },
    size: {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm'
    },
    colorScheme: {
      gray: '',
      red: '',
      orange: '',
      yellow: '',
      green: '',
      teal: '',
      blue: '',
      cyan: '',
      purple: '',
      pink: ''
    }
  },
  compoundVariants: [
    // solid: 동계열 진한 base + 어두운 동계열 텍스트 (흰 전경 금지 — AA)
    { variant: 'solid', colorScheme: 'gray', className: 'bg-secondary text-foreground' },
    { variant: 'solid', colorScheme: 'red', className: 'bg-mc-red text-mc-red-text' },
    { variant: 'solid', colorScheme: 'orange', className: 'bg-mc-orange text-mc-orange-text' },
    { variant: 'solid', colorScheme: 'yellow', className: 'bg-mc-amber text-mc-amber-text' },
    { variant: 'solid', colorScheme: 'green', className: 'bg-mc-green text-mc-green-text' },
    { variant: 'solid', colorScheme: 'teal', className: 'bg-mc-green text-mc-green-text' },
    { variant: 'solid', colorScheme: 'blue', className: 'bg-mc-blue text-mc-blue-text' },
    { variant: 'solid', colorScheme: 'cyan', className: 'bg-mc-blue text-mc-blue-text' },
    { variant: 'solid', colorScheme: 'purple', className: 'bg-mc-violet text-mc-violet-text' },
    { variant: 'solid', colorScheme: 'pink', className: 'bg-mc-pink text-mc-pink-text' },
    // subtle: 틴트 배경 + 동계열 텍스트
    { variant: 'subtle', colorScheme: 'gray', className: 'bg-muted text-muted-foreground' },
    { variant: 'subtle', colorScheme: 'red', className: 'bg-mc-red-tint text-mc-red-text' },
    { variant: 'subtle', colorScheme: 'orange', className: 'bg-mc-orange-tint text-mc-orange-text' },
    { variant: 'subtle', colorScheme: 'yellow', className: 'bg-mc-amber-tint text-mc-amber-text' },
    { variant: 'subtle', colorScheme: 'green', className: 'bg-mc-green-tint text-mc-green-text' },
    { variant: 'subtle', colorScheme: 'teal', className: 'bg-mc-green-tint text-mc-green-text' },
    { variant: 'subtle', colorScheme: 'blue', className: 'bg-mc-blue-tint text-mc-blue-text' },
    { variant: 'subtle', colorScheme: 'cyan', className: 'bg-mc-blue-tint text-mc-blue-text' },
    { variant: 'subtle', colorScheme: 'purple', className: 'bg-mc-violet-tint text-mc-violet-text' },
    { variant: 'subtle', colorScheme: 'pink', className: 'bg-mc-pink-tint text-mc-pink-text' },
    // surface: subtle과 동일 톤
    { variant: 'surface', colorScheme: 'gray', className: 'bg-surface-soft text-muted-foreground' },
    { variant: 'surface', colorScheme: 'red', className: 'bg-mc-red-tint text-mc-red-text' },
    { variant: 'surface', colorScheme: 'orange', className: 'bg-mc-orange-tint text-mc-orange-text' },
    { variant: 'surface', colorScheme: 'yellow', className: 'bg-mc-amber-tint text-mc-amber-text' },
    { variant: 'surface', colorScheme: 'green', className: 'bg-mc-green-tint text-mc-green-text' },
    { variant: 'surface', colorScheme: 'teal', className: 'bg-mc-green-tint text-mc-green-text' },
    { variant: 'surface', colorScheme: 'blue', className: 'bg-mc-blue-tint text-mc-blue-text' },
    { variant: 'surface', colorScheme: 'cyan', className: 'bg-mc-blue-tint text-mc-blue-text' },
    { variant: 'surface', colorScheme: 'purple', className: 'bg-mc-violet-tint text-mc-violet-text' },
    { variant: 'surface', colorScheme: 'pink', className: 'bg-mc-pink-tint text-mc-pink-text' },
    // outline: 보더 + 동계열 텍스트
    { variant: 'outline', colorScheme: 'gray', className: 'border-border text-muted-foreground' },
    { variant: 'outline', colorScheme: 'red', className: 'border-border text-mc-red-text' },
    { variant: 'outline', colorScheme: 'orange', className: 'border-border text-mc-orange-text' },
    { variant: 'outline', colorScheme: 'yellow', className: 'border-border text-mc-amber-text' },
    { variant: 'outline', colorScheme: 'green', className: 'border-border text-mc-green-text' },
    { variant: 'outline', colorScheme: 'teal', className: 'border-border text-mc-green-text' },
    { variant: 'outline', colorScheme: 'blue', className: 'border-border text-mc-blue-text' },
    { variant: 'outline', colorScheme: 'cyan', className: 'border-border text-mc-blue-text' },
    { variant: 'outline', colorScheme: 'purple', className: 'border-border text-mc-violet-text' },
    { variant: 'outline', colorScheme: 'pink', className: 'border-border text-mc-pink-text' }
  ],
  defaultVariants: {
    variant: 'subtle',
    size: 'sm',
    colorScheme: 'gray'
  }
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
}

export function Badge({ className, variant, size, colorScheme, children, icon, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, colorScheme }), className)} {...props}>
      {icon}
      {children}
    </div>
  )
}
