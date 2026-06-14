import { cn } from '@/lib/utils'

interface DividerProps {
  text: string
  className?: string
}

export function Divider({ text, className }: DividerProps) {
  return (
    <div
      className={cn(
        'after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t',
        className
      )}
    >
      <span className='bg-card text-muted-foreground relative z-10 px-2'>{text}</span>
    </div>
  )
}
