import { TooltipProps } from 'recharts'
import { Separator } from '@/atoms/Separator'

interface CustomTooltipProps extends TooltipProps<any, any> {
  showLabel?: boolean
  labelFormatter?: (label: string) => string
}

export const CustomTooltip = ({ active, payload, label, showLabel = true, labelFormatter }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  // 버블차트인 경우 특별한 처리
  const isBubbleChart = payload.some((item) => item.name === '중요도' || item.name === '이슈 수')

  if (isBubbleChart) {
    const category = payload[0]?.payload?.name || label
    const importance = payload.find((item) => item.name === '중요도')?.value || ''
    const count = payload.find((item) => item.name === '이슈 수')?.value || ''

    return (
      <div className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-3 px-4 min-w-[180px] animate-in fade-in zoom-in-95 duration-200 origin-top'>
        <div className='space-y-2'>
          <p className='text-sm font-bold text-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-1'>
            카테고리 : <span className='text-indigo-600 dark:text-indigo-400'>{category}</span>
          </p>

          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>중요도 :</span>
              <span className='text-sm font-bold'>{importance}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>이슈 수 :</span>
              <span className='text-sm font-bold'>{count}개</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 기본 툴팁 디자인 (다른 차트용)
  return (
    <div className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-3 px-4 min-w-[160px] animate-in fade-in zoom-in-95 duration-200 origin-top'>
      {showLabel && (
        <>
          <p className='text-sm font-bold text-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-1'>
            {labelFormatter ? labelFormatter(label) : label}
          </p>
        </>
      )}

      <div className='space-y-2 pt-1'>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: entry.color || entry.payload?.color || '#8884d8' }}
              />
              <span className='text-xs font-medium'>{entry.name}</span>
            </div>
            <span className='text-sm font-bold'>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
