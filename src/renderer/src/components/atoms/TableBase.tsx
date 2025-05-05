import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Table as TableInstance,
  Row,
  Header
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/Table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import type { ColumnMeta } from '@/atoms/TableColumnDef'

// 테이블 스타일 상수 정의
export const TABLE_STYLES = {
  header: {
    base: 'bg-muted/70 sticky top-0 z-10',
    height: 'h-9'
  },
  headerCell: {
    base: 'py-2 px-2',
    sortable: 'cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150'
  },
  headerContent: {
    base: 'flex items-center',
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    spaceBetween: 'justify-between'
  },
  headerText: 'text-xs font-medium',
  sortIcon: {
    base: 'flex',
    margin: {
      default: 'ml-1',
      centered: 'ml-0.5'
    },
    active: 'h-3 w-3 text-blue-500',
    inactive: 'h-3 w-3 text-gray-400'
  },
  row: {
    base: 'group/row hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-200',
    height: 'h-9',
    selected: 'bg-blue-50 dark:bg-blue-950/30',
    clickable: 'cursor-pointer'
  },
  cell: {
    base: 'py-1.5 px-2'
  },
  emptyState: {
    container: 'flex flex-col items-center justify-center py-6',
    icon: 'h-10 w-10 text-muted-foreground mb-2',
    title: 'text-muted-foreground font-medium',
    description: 'text-sm text-muted-foreground mt-1'
  }
}

export type TableSortDirection = 'asc' | 'desc'
export type TableAlignment = 'left' | 'center' | 'right'
export type TableCellContent = string | number | React.ReactNode

export interface TableColumnWidth {
  width?: string // e.g. 'w-20', '200px'
  minWidth?: string // e.g. 'min-w-20', '100px'
  maxWidth?: string // e.g. 'max-w-40', '300px'
  flex?: number | string // e.g. 1, '1'
}

export interface TableBaseProps<TData, TValue = unknown> {
  // 테이블 데이터 및 컬럼 정의
  data: TData[]
  columns: ColumnDef<TData, TValue>[]

  // 테이블 상태 및 옵션
  initialState?: {
    sorting?: SortingState
    pagination?: {
      pageSize?: number
      pageIndex?: number
    }
    columnFilters?: ColumnFiltersState
    columnVisibility?: VisibilityState
  }

  // 커스텀 메타 데이터
  meta?: Record<string, unknown>

  // 이벤트 핸들러
  onRowClick?: (row: Row<TData>) => void

  // 스타일 및 접근성
  className?: string

  // 테이블 기능 활성화 여부
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean

  // Empty state
  emptyComponent?: React.ReactNode
  emptyMessage?: string

  // Reference
  tableRef?: React.Ref<TableInstance<TData>>
}

export function TableBase<TData, TValue = unknown>({
  data,
  columns,
  initialState = {
    pagination: {
      pageSize: 20
    }
  },
  meta,
  onRowClick,
  className,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  emptyComponent,
  emptyMessage = 'No data available',
  tableRef
}: TableBaseProps<TData, TValue>) {
  // 테이블 상태
  const [sorting, setSorting] = React.useState<SortingState>(initialState.sorting || [])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialState.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialState.columnVisibility || {})

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    },
    enableSorting,
    enableColumnFilters: enableFiltering,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    initialState,
    meta: meta
  })

  // Reference 설정
  React.useImperativeHandle(tableRef, () => table, [table])

  // 행 클릭 핸들러
  const handleRowClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
      // 액션 버튼 클릭 시에는 행 클릭 이벤트 방지
      if ((e.target as HTMLElement).closest('.action-button')) {
        e.stopPropagation()
        return
      }

      onRowClick?.(row)
    },
    [onRowClick]
  )

  // 정렬 아이콘을 렌더링하는 함수
  const renderSortIcon = (column: any) => {
    if (!column.getCanSort()) return null

    const meta = column.columnDef.meta || {}
    const isCentered = meta.align === 'center'
    const marginClass = isCentered ? TABLE_STYLES.sortIcon.margin.centered : TABLE_STYLES.sortIcon.margin.default

    return (
      <div className={cn(TABLE_STYLES.sortIcon.base, marginClass)}>
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className={TABLE_STYLES.sortIcon.active} strokeWidth={2} />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className={TABLE_STYLES.sortIcon.active} strokeWidth={2} />
        ) : (
          <ArrowUpDown className={TABLE_STYLES.sortIcon.inactive} strokeWidth={1.5} />
        )}
      </div>
    )
  }

  // 헤더 셀 컨텐츠 정렬
  const getHeaderAlignment = (column: Header<TData, unknown>) => {
    const meta = column.column.columnDef.meta || {}
    const align = meta['align'] || 'left'
    switch (align) {
      case 'center':
        return TABLE_STYLES.headerContent.center
      case 'right':
        return TABLE_STYLES.headerContent.right
      case 'left':
      default:
        return TABLE_STYLES.headerContent.left
    }
  }

  // 헤더 셀 스타일 가져오기
  const getHeaderCellStyles = (column: Header<TData, unknown>) => {
    const meta = column.column.columnDef.meta || {}
    const width = meta['width']
    const widthClass = width ? (typeof width === 'string' ? width : '') : ''
    return cn(TABLE_STYLES.headerCell.base, column.column.getCanSort() && TABLE_STYLES.headerCell.sortable, widthClass)
  }

  // 행 스타일 가져오기
  const getRowStyles = (row: Row<TData>) => {
    return cn(
      TABLE_STYLES.row.base,
      TABLE_STYLES.row.height,
      row.getIsSelected() && TABLE_STYLES.row.selected,
      onRowClick && TABLE_STYLES.row.clickable
    )
  }

  // 비어있는 상태 렌더링
  const renderEmptyState = () => {
    if (emptyComponent) return emptyComponent

    return (
      <div className={TABLE_STYLES.emptyState.container}>
        <p className={TABLE_STYLES.emptyState.title}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <Table>
        <TableHeader className={cn(TABLE_STYLES.header.base, TABLE_STYLES.header.height)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={TABLE_STYLES.header.height}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={getHeaderCellStyles(header)}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className={cn(TABLE_STYLES.headerContent.base, getHeaderAlignment(header))}>
                    {header.isPlaceholder ? null : (
                      <span className={TABLE_STYLES.headerText}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    )}
                    {renderSortIcon(header.column)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={getRowStyles(row)}
                data-state={row.getIsSelected() && 'selected'}
                onClick={(e) => handleRowClick(e, row)}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnMeta = (cell.column.columnDef.meta as ColumnMeta | undefined) || {}
                  const width = columnMeta?.width
                  const align = columnMeta?.align || 'left'

                  let alignClass = ''
                  switch (align) {
                    case 'center':
                      alignClass = 'text-center'
                      break
                    case 'right':
                      alignClass = 'text-right'
                      break
                    case 'left':
                    default:
                      alignClass = 'text-left'
                  }

                  const widthClass = width ? (typeof width === 'string' ? width : '') : ''

                  return (
                    <TableCell key={cell.id} className={cn(TABLE_STYLES.cell.base, alignClass, widthClass)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {renderEmptyState()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
