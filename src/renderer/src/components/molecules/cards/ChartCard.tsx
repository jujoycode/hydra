import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/atoms/Card'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
}

export const ChartCard = ({ title, description, children }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {description && <p className='text-xs text-muted-foreground'>{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
