import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CustomTooltip } from '@/atoms/charts/CustomTooltip'

export interface StatusData {
  name: string
  value: number
  color: string
}

interface StatusDonutChartProps {
  data: StatusData[]
  height?: number
  showLabels?: boolean
}

export const StatusDonutChart = ({ data, height = 200, showLabels = true }: StatusDonutChartProps) => {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={height * 0.25}
            outerRadius={height * 0.38}
            paddingAngle={3}
            dataKey='value'
            label={showLabels ? ({ percent }) => `${(percent * 100).toFixed(0)}%` : undefined}
            labelLine={false}
            stroke='none'
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip showLabel={false} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
