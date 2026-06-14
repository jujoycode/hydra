import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconColor?: string
  description?: string
}

export const StatCard = ({ title, value, icon, iconColor = 'text-muted-foreground', description }: StatCardProps) => {
  return (
    <div className='flex items-center gap-3 rounded-lg border bg-card p-4'>
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-muted ${iconColor}`}>{icon}</div>
      <div className='min-w-0'>
        <p className='text-xs text-muted-foreground'>{title}</p>
        <div className='flex items-baseline gap-1.5'>
          <span className='text-xl font-semibold tabular-nums'>{value}</span>
          {description && <span className='text-xs text-muted-foreground'>{description}</span>}
        </div>
      </div>
    </div>
  )
}
