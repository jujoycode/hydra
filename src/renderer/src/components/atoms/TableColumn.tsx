import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

interface TableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function TableColumnHeader<TData, TValue>({ column, title, className }: TableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn('flex items-center', className)}>
      <span className='text-xs font-medium'>{title}</span>
      {column.getCanSort() && (
        <div className='ml-1.5'>
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='w-4 h-4 text-blue-600' strokeWidth={2.5} />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='w-4 h-4 text-blue-600' strokeWidth={2.5} />
          ) : (
            <ArrowUpDown className='w-4 h-4 text-gray-500' strokeWidth={2} />
          )}
        </div>
      )}
    </div>
  )
}

interface TableCellProps<TValue> {
  value: TValue
  className?: string
  format?: (value: TValue) => React.ReactNode
}

export function TableCell<TValue>({ value, className, format }: TableCellProps<TValue>) {
  return <div className={cn('py-2 text-sm', className)}>{format ? format(value) : (value as React.ReactNode)}</div>
}

interface TableSelectCellProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function TableSelectCell({ checked, onCheckedChange, disabled }: TableSelectCellProps) {
  return (
    <div className='flex items-center justify-center'>
      <input
        type='checkbox'
        className='h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary'
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
      />
    </div>
  )
}
