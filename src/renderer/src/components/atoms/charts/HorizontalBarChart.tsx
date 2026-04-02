import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface BarDataPoint {
  name: string
  [key: string]: string | number
}

interface HorizontalBarChartProps {
  data: BarDataPoint[]
  dataKey: string
  height?: number
  fill?: string
  gradientId?: string
  gradientColors?: { start: string; end: string }
  yAxisWidth?: number
  barSize?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  formatter?: (value: any) => [string, string]
  domain?: [number, number]
}

export const HorizontalBarChart = ({
  data,
  dataKey,
  height = 200,
  fill = '#8884d8',
  gradientId,
  gradientColors,
  yAxisWidth = 80,
  barSize = 14,
  margin = { top: 10, right: 10, bottom: 10, left: 80 },
  formatter = (value) => [`${value}`, dataKey],
  domain
}: HorizontalBarChartProps) => {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout='vertical' margin={margin}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' opacity={0.3} />
          <XAxis type='number' tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' domain={domain} />
          <YAxis
            dataKey='name'
            type='category'
            width={yAxisWidth}
            tick={{ fontSize: 10 }}
            stroke='var(--muted-foreground)'
          />
          <Tooltip
            formatter={formatter}
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ padding: '4px 0' }}
            animationDuration={300}
          />
          {gradientId && gradientColors && (
            <defs>
              <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor={gradientColors.start} />
                <stop offset='100%' stopColor={gradientColors.end} />
              </linearGradient>
            </defs>
          )}
          <Bar
            dataKey={dataKey}
            fill={gradientId ? `url(#${gradientId})` : fill}
            radius={[0, 4, 4, 0]}
            barSize={barSize}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
