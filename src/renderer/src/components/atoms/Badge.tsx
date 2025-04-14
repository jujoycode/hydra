import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva('inline-flex items-center rounded-md font-medium transition-colors', {
  variants: {
    variant: {
      solid: '',
      subtle: 'bg-opacity-20',
      outline: 'border',
      surface: 'bg-opacity-10',
      plain: '',
    },
    size: {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm',
    },
    colorScheme: {
      gray: 'text-gray-700 dark:text-gray-300',
      red: 'text-red-700 dark:text-red-300',
      orange: 'text-orange-700 dark:text-orange-300',
      yellow: 'text-yellow-700 dark:text-yellow-300',
      green: 'text-green-700 dark:text-green-300',
      teal: 'text-teal-700 dark:text-teal-300',
      blue: 'text-blue-700 dark:text-blue-300',
      cyan: 'text-cyan-700 dark:text-cyan-300',
      purple: 'text-purple-700 dark:text-purple-300',
      pink: 'text-pink-700 dark:text-pink-300',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      colorScheme: 'gray',
      className: 'bg-gray-500 text-white dark:bg-gray-600',
    },
    {
      variant: 'solid',
      colorScheme: 'red',
      className: 'bg-red-500 text-white dark:bg-red-600',
    },
    {
      variant: 'solid',
      colorScheme: 'orange',
      className: 'bg-orange-500 text-white dark:bg-orange-600',
    },
    {
      variant: 'solid',
      colorScheme: 'yellow',
      className: 'bg-yellow-500 text-white dark:bg-yellow-600',
    },
    {
      variant: 'solid',
      colorScheme: 'green',
      className: 'bg-green-500 text-white dark:bg-green-600',
    },
    {
      variant: 'solid',
      colorScheme: 'teal',
      className: 'bg-teal-500 text-white dark:bg-teal-600',
    },
    {
      variant: 'solid',
      colorScheme: 'blue',
      className: 'bg-blue-500 text-white dark:bg-blue-600',
    },
    {
      variant: 'solid',
      colorScheme: 'cyan',
      className: 'bg-cyan-500 text-white dark:bg-cyan-600',
    },
    {
      variant: 'solid',
      colorScheme: 'purple',
      className: 'bg-purple-500 text-white dark:bg-purple-600',
    },
    {
      variant: 'solid',
      colorScheme: 'pink',
      className: 'bg-pink-500 text-white dark:bg-pink-600',
    },
    {
      variant: 'subtle',
      colorScheme: 'gray',
      className: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'red',
      className: 'bg-red-100 dark:bg-red-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'orange',
      className: 'bg-orange-100 dark:bg-orange-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'yellow',
      className: 'bg-yellow-100 dark:bg-yellow-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'green',
      className: 'bg-green-100 dark:bg-green-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'teal',
      className: 'bg-teal-100 dark:bg-teal-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'blue',
      className: 'bg-blue-100 dark:bg-blue-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'cyan',
      className: 'bg-cyan-100 dark:bg-cyan-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'purple',
      className: 'bg-purple-100 dark:bg-purple-800',
    },
    {
      variant: 'subtle',
      colorScheme: 'pink',
      className: 'bg-pink-100 dark:bg-pink-800',
    },
    {
      variant: 'outline',
      colorScheme: 'gray',
      className: 'border-gray-200 dark:border-gray-700',
    },
    {
      variant: 'outline',
      colorScheme: 'red',
      className: 'border-red-200 dark:border-red-700',
    },
    {
      variant: 'outline',
      colorScheme: 'orange',
      className: 'border-orange-200 dark:border-orange-700',
    },
    {
      variant: 'outline',
      colorScheme: 'yellow',
      className: 'border-yellow-200 dark:border-yellow-700',
    },
    {
      variant: 'outline',
      colorScheme: 'green',
      className: 'border-green-200 dark:border-green-700',
    },
    {
      variant: 'outline',
      colorScheme: 'teal',
      className: 'border-teal-200 dark:border-teal-700',
    },
    {
      variant: 'outline',
      colorScheme: 'blue',
      className: 'border-blue-200 dark:border-blue-700',
    },
    {
      variant: 'outline',
      colorScheme: 'cyan',
      className: 'border-cyan-200 dark:border-cyan-700',
    },
    {
      variant: 'outline',
      colorScheme: 'purple',
      className: 'border-purple-200 dark:border-purple-700',
    },
    {
      variant: 'outline',
      colorScheme: 'pink',
      className: 'border-pink-200 dark:border-pink-700',
    },
    {
      variant: 'surface',
      colorScheme: 'gray',
      className: 'bg-gray-50 dark:bg-gray-900',
    },
    {
      variant: 'surface',
      colorScheme: 'red',
      className: 'bg-red-50 dark:bg-red-900',
    },
    {
      variant: 'surface',
      colorScheme: 'orange',
      className: 'bg-orange-50 dark:bg-orange-900',
    },
    {
      variant: 'surface',
      colorScheme: 'yellow',
      className: 'bg-yellow-50 dark:bg-yellow-900',
    },
    {
      variant: 'surface',
      colorScheme: 'green',
      className: 'bg-green-50 dark:bg-green-900',
    },
    {
      variant: 'surface',
      colorScheme: 'teal',
      className: 'bg-teal-50 dark:bg-teal-900',
    },
    {
      variant: 'surface',
      colorScheme: 'blue',
      className: 'bg-blue-50 dark:bg-blue-900',
    },
    {
      variant: 'surface',
      colorScheme: 'cyan',
      className: 'bg-cyan-50 dark:bg-cyan-900',
    },
    {
      variant: 'surface',
      colorScheme: 'purple',
      className: 'bg-purple-50 dark:bg-purple-900',
    },
    {
      variant: 'surface',
      colorScheme: 'pink',
      className: 'bg-pink-50 dark:bg-pink-900',
    },
  ],
  defaultVariants: {
    variant: 'subtle',
    size: 'sm',
    colorScheme: 'gray',
  },
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
