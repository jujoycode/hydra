import * as React from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed'
  colorScheme?: string
  borderWidth?: string | number
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', variant = 'solid', colorScheme = 'gray', borderWidth = '1px', ...props }, ref) => {
    const className = [
      'opacity-60',
      orientation === 'horizontal' ? 'w-full border-0 border-b' : 'h-full border-0 border-l mx-2',
      variant === 'dashed' ? 'border-dashed' : 'border-solid',
      `border-${colorScheme}-200`
    ].join(' ')

    return (
      <div
        ref={ref}
        role='separator'
        aria-orientation={orientation}
        className={className}
        style={{ borderWidth }}
        {...props}
      />
    )
  }
)
Divider.displayName = 'Divider'

export { Divider }
