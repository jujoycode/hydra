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
    <div className='glass-soft hover-lift flex items-center gap-3 rounded-lg border border-border/70 p-card shadow-card'>
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-muted ${iconColor}`}>{icon}</div>
      <div className='min-w-0'>
        <p className='text-caption text-muted-foreground'>{title}</p>
        <div className='flex items-baseline gap-1.5'>
          <span className='text-title tabular-nums'>{value}</span>
          {description && <span className='text-caption text-muted-foreground'>{description}</span>}
        </div>
      </div>
    </div>
  )
}
