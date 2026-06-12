import type { ColumnDef, SortDirection } from '@tanstack/react-table'
import type { TableAlignment, TableColumnWidth } from './TableBase'

// 컬럼 메타데이터 확장 인터페이스
export interface ColumnMeta extends TableColumnWidth {
  /** 정렬 방식 */
  align?: TableAlignment
  /** 추가 CSS 클래스 */
  className?: string
  /** 열 표시 여부 */
  visible?: boolean
  /** 커스텀 메타데이터 */
  [key: string]: any
}

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
  sortDirection,
  width,
  minWidth,
  maxWidth,
  align
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
  /** 컬럼 너비 (CSS 클래스) */
  width?: string
  /** 최소 너비 (CSS 클래스) */
  minWidth?: string
  /** 최대 너비 (CSS 클래스) */
  maxWidth?: string
  /** 정렬 방식 */
  align?: TableAlignment
}): ColumnDef<TData, TValue> {
  // 확장된 메타데이터 생성
  const extendedMeta: ColumnMeta = {
    ...(meta || {}),
    width,
    minWidth,
    maxWidth,
    align
  }

  const columnDef: ColumnDef<TData, TValue> = {
    id: id || (accessorKey as string),
    accessorKey: accessorKey as string,
    accessorFn,
    header: header ? (typeof header === 'string' ? () => header : header) : () => (accessorKey as string) || id || '',
    cell,
    enableSorting,
    enableFiltering,
    meta: extendedMeta,
    // 기본 정렬 방향이 설정된 경우 sortDescFirst를 설정
    sortDescFirst: sortDirection === 'desc'
  } as ColumnDef<TData, TValue>

  // 기본 정렬 방향이 설정된 경우, 초기 정렬 상태를 추가
  if (sortDirection) {
    columnDef.meta = {
      ...extendedMeta,
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
  columns,
  meta
}: {
  id: string
  header: string | ((props: any) => React.ReactNode)
  columns: ColumnDef<TData, any>[]
  meta?: ColumnMeta
}): ColumnDef<TData> {
  return {
    id,
    header: typeof header === 'string' ? header : header,
    columns,
    meta
  }
}

// Helper to create a select column
export function createSelectColumn<TData>({
  width = 'w-10',
  align = 'center',
  meta
}: {
  width?: string
  align?: TableAlignment
  meta?: Partial<ColumnMeta>
} = {}): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <input
          type='checkbox'
          className='h-4 w-4 text-primary rounded border-input-strong focus:ring-primary'
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
          className='h-4 w-4 text-primary rounded border-input-strong focus:ring-primary'
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    meta: {
      width,
      align,
      ...meta
    }
  }
}

// Helper to create an action column
export function createActionsColumn<TData>({
  id = 'actions',
  header = '',
  cell,
  width = 'w-10',
  align = 'center',
  meta
}: {
  id?: string
  header?: string | ((props: any) => React.ReactNode)
  cell: (props: any) => React.ReactNode
  width?: string
  align?: TableAlignment
  meta?: Partial<ColumnMeta>
}): ColumnDef<TData> {
  return {
    id,
    header,
    cell,
    enableSorting: false,
    meta: {
      width,
      align,
      ...meta
    }
  }
}
