import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CustomTooltip } from './CustomTooltip'

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
          <defs>
            {data.map((entry, index) => (
              <filter key={`shadow-${index}`} id={`shadow-${index}`} height='200%'>
                <feDropShadow dx='0' dy='3' stdDeviation='3' floodColor={entry.color} floodOpacity='0.5' />
              </filter>
            ))}
          </defs>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={height * 0.25}
            outerRadius={height * 0.35}
            paddingAngle={4}
            dataKey='value'
            label={showLabels ? ({ percent }) => `${(percent * 100).toFixed(0)}%` : undefined}
            labelLine={false}
            stroke='none'
            className='drop-shadow-xl'
            animationDuration={1500}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `url(#shadow-${index})` }} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip showLabel={false} />} formatter={(value) => [`${value}개`, '이슈 수']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
