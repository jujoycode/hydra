import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/atoms/Card'

interface ChartCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  iconBgColor?: string
  iconColor?: string
}

export const ChartCard = ({
  title,
  icon,
  children,
  iconBgColor = 'bg-indigo-100 dark:bg-indigo-900/30',
  iconColor = 'text-indigo-600 dark:text-indigo-400'
}: ChartCardProps) => {
  return (
    <Card className='shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 hover:shadow-lg transition-all duration-200'>
      <CardHeader className='pb-1 border-b border-slate-100 dark:border-slate-800 p-3'>
        <div className='flex items-center gap-2'>
          <div className={`${iconBgColor} p-1 rounded`}>
            <div className={`h-4 w-4 ${iconColor}`}>{icon}</div>
          </div>
          <div>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-3'>{children}</CardContent>
    </Card>
  )
}
