import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface StackDataPoint {
  name: string
  [key: string]: string | number
}

interface StackBarConfig {
  dataKey: string
  stackId: string
  fill: string
  radius?: [number, number, number, number]
}

interface StackedBarChartProps {
  data: StackDataPoint[]
  bars: StackBarConfig[]
  height?: number
  yAxisWidth?: number
  barSize?: number
  layout?: 'horizontal' | 'vertical'
  margin?: { top: number; right: number; bottom: number; left: number }
}

export const StackedBarChart = ({
  data,
  bars,
  height = 200,
  yAxisWidth = 80,
  barSize = 14,
  layout = 'vertical',
  margin = { top: 10, right: 10, bottom: 10, left: 80 }
}: StackedBarChartProps) => {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout={layout} margin={margin}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' opacity={0.3} />

          {layout === 'vertical' ? (
            <>
              <XAxis type='number' tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' />
              <YAxis
                dataKey='name'
                type='category'
                width={yAxisWidth}
                tick={{ fontSize: 10 }}
                stroke='var(--muted-foreground)'
              />
            </>
          ) : (
            <>
              <XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' />
              <YAxis tick={{ fontSize: 10 }} stroke='var(--muted-foreground)' />
            </>
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ padding: '4px 0' }}
            animationDuration={300}
          />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />

          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              stackId={bar.stackId}
              fill={bar.fill}
              radius={bar.radius || [0, 0, 0, 0]}
              barSize={barSize}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StackedBarChart
