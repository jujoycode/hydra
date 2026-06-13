import type { TooltipProps } from 'recharts'

interface CustomTooltipProps extends TooltipProps<any, any> {
  showLabel?: boolean
  labelFormatter?: (label: string) => string
}

export const CustomTooltip = ({ active, payload, label, showLabel = true, labelFormatter }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className='rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md'>
      {showLabel && label && (
        <p className='mb-1 border-b pb-1 text-xs font-medium'>{labelFormatter ? labelFormatter(label) : label}</p>
      )}
      <div className='space-y-1'>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-1.5'>
              <div
                className='size-2.5 rounded-full'
                style={{ backgroundColor: entry.color || entry.payload?.color || 'var(--chart-1)' }}
              />
              <span className='text-xs text-muted-foreground'>{entry.name}</span>
            </div>
            <span className='text-xs font-medium tabular-nums'>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
