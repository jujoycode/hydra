import { CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { CustomTooltip } from '@/atoms/charts/CustomTooltip'

export interface BubbleDataPoint {
  name: string
  value: number
  count: number
  [key: string]: string | number
}

interface BubbleChartProps {
  data: BubbleDataPoint[]
  height?: number
  colors?: string[]
  margin?: { top: number; right: number; bottom: number; left: number }
  xAxisConfig?: {
    dataKey: string
    name: string
    type: 'category' | 'number'
  }
  yAxisConfig?: {
    dataKey: string
    name: string
  }
  zAxisConfig?: {
    dataKey: string
    name: string
    range: [number, number]
  }
  tooltipFormatter?: (value: any, name: string) => [string, string]
}

const defaultColors = ['#8B5CF6', '#EC4899', '#3B82F6', '#14B8A6', '#F59E0B', '#EF4444']

export const BubbleChart = ({
  data,
  height = 200,
  colors = defaultColors,
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  xAxisConfig = {
    dataKey: 'name',
    name: '카테고리',
    type: 'category'
  },
  yAxisConfig = {
    dataKey: 'value',
    name: '중요도'
  },
  zAxisConfig = {
    dataKey: 'count',
    name: '이슈 수',
    range: [30, 120]
  },
  tooltipFormatter = (value, name) => {
    if (name === 'count') return [`${value}개`, '이슈 수']
    if (name === 'value') return [`${value}점`, '중요도']
    return [value, name]
  }
}: BubbleChartProps) => {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <ScatterChart margin={margin}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' opacity={0.3} />
          <XAxis
            type={xAxisConfig.type}
            dataKey={xAxisConfig.dataKey}
            name={xAxisConfig.name}
            tick={{ fontSize: 10 }}
            stroke='var(--muted-foreground)'
          />
          <YAxis
            type='number'
            dataKey={yAxisConfig.dataKey}
            name={yAxisConfig.name}
            tick={{ fontSize: 10 }}
            stroke='var(--muted-foreground)'
          />
          <ZAxis type='number' dataKey={zAxisConfig.dataKey} range={zAxisConfig.range} name={zAxisConfig.name} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} formatter={tooltipFormatter} />
          <Scatter name='이슈 유형' data={data} fill='#8884d8' animationDuration={1500}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
