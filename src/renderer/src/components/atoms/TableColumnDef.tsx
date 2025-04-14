import { TableColumnHeader } from '@/atoms/TableColumn'
import { ColumnDef, SortDirection } from '@tanstack/react-table'

// Helper function to create a basic column definition
export function createColumn<TData, TValue = unknown>({
  id,
  header,
  accessorKey,
  accessorFn,
  cell,
  meta,
  enableSorting = true,
  enableFiltering = true,
  sortDirection
}: {
  id?: string
  header?: string | ((props: any) => React.ReactNode)
  accessorKey?: keyof TData | string
  accessorFn?: (row: TData) => TValue
  cell?: (props: any) => React.ReactNode
  meta?: Record<string, unknown>
  enableSorting?: boolean
  enableFiltering?: boolean
  /** 기본 정렬 방향 (설정하면 기본적으로 정렬된 상태로 표시됨) */
  sortDirection?: SortDirection
}): ColumnDef<TData, TValue> {
  const columnDef: ColumnDef<TData, TValue> = {
    id: id || (accessorKey as string),
    accessorKey: accessorKey as string,
    accessorFn,
    header: header
      ? typeof header === 'string'
        ? ({ column }) => <TableColumnHeader column={column} title={header} />
        : header
      : ({ column }) => <TableColumnHeader column={column} title={(accessorKey as string) || id || ''} />,
    cell,
    enableSorting,
    enableFiltering,
    meta,
    // 기본 정렬 방향이 설정된 경우 sortDescFirst를 설정
    sortDescFirst: sortDirection === 'desc'
  } as ColumnDef<TData, TValue>

  // 기본 정렬 방향이 설정된 경우, 초기 정렬 상태를 추가
  if (sortDirection) {
    columnDef.meta = {
      ...(meta || {}),
      // 테이블이 마운트될 때 기본 정렬을 적용하기 위한 초기화 함수 제공
      initSorting: (table: any) => {
        const column = table.getColumn(columnDef.id as string)
        if (column) {
          table.setSorting([{ id: columnDef.id as string, desc: sortDirection === 'desc' }])
        }
      }
    }
  }

  return columnDef
}

// Helper to create a grouped column
export function createGroupColumn<TData>({
  id,
  header,
  columns
}: {
  id: string
  header: string | ((props: any) => React.ReactNode)
  columns: ColumnDef<TData, any>[]
}): ColumnDef<TData> {
  return {
    id,
    header: typeof header === 'string' ? header : header,
    columns
  }
}

// Helper to create a select column
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <input
          type='checkbox'
          className='h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary'
          checked={table.getIsAllRowsSelected()}
          onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <input
          type='checkbox'
          className='h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary'
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false
  }
}
