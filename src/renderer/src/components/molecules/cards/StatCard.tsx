import { ReactNode } from 'react'
import { Card, CardContent } from '@/atoms/Card'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: string
  colorScheme?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'indigo' | 'rose'
}

const colorSchemes = {
  blue: {
    bgGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    titleText: 'text-blue-100',
    changeText: 'text-blue-200'
  },
  cyan: {
    bgGradient: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    titleText: 'text-cyan-100',
    changeText: 'text-cyan-200'
  },
  emerald: {
    bgGradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
    titleText: 'text-emerald-100',
    changeText: 'text-emerald-200'
  },
  amber: {
    bgGradient: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    titleText: 'text-amber-100',
    changeText: 'text-amber-200'
  },
  indigo: {
    bgGradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    titleText: 'text-indigo-100',
    changeText: 'text-indigo-200'
  },
  rose: {
    bgGradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    titleText: 'text-rose-100',
    changeText: 'text-rose-200'
  }
}

export const StatCard = ({ title, value, icon, change, colorScheme = 'blue' }: StatCardProps) => {
  const colors = colorSchemes[colorScheme]

  return (
    <Card
      className={`shadow-md border-0 overflow-hidden ${colors.bgGradient} text-white hover:shadow-lg transition-all duration-200`}
    >
      <CardContent className='p-3 flex justify-between items-center'>
        <div>
          <p className={`text-xs font-medium ${colors.titleText}`}>{title}</p>
          <h3 className='text-xl font-bold mt-0.5 flex items-baseline'>
            {value}
            {change && <span className={`text-xs ml-1.5 ${colors.changeText}`}>{change}</span>}
          </h3>
        </div>
        <div className='bg-white/20 backdrop-blur-sm p-2 rounded-xl'>{icon}</div>
      </CardContent>
    </Card>
  )
}
