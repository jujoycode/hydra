import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CustomTooltip } from './CustomTooltip'

export interface TrendDataPoint {
  name: string
  [key: string]: string | number
}

interface AreaTrendChartProps {
  data: TrendDataPoint[]
  height?: number
  lines: Array<{
    dataKey: string
    color: string
    gradientId: string
  }>
}

export const AreaTrendChart = ({ data, height = 200, lines }: AreaTrendChartProps) => {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.gradientId} id={line.gradientId} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={line.color} stopOpacity={0.8} />
                <stop offset='95%' stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' opacity={0.3} />
          <XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' />
          <YAxis tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />

          {lines.map((line, index) => (
            <Area
              key={line.dataKey}
              type='monotone'
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${line.gradientId})`}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={1500}
              animationBegin={500 + index * 300}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
