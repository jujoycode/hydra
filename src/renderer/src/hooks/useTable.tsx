import { useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState
} from '@tanstack/react-table'

export interface UseTableOptions<TData, TValue = unknown> {
  /** 테이블 데이터 */
  data: TData[]
  /** 컬럼 정의 */
  columns: ColumnDef<TData, TValue>[]
  /** 초기 상태 */
  initialState?: {
    sorting?: SortingState
    pagination?: {
      pageSize?: number
      pageIndex?: number
    }
    columnFilters?: ColumnFiltersState
    columnVisibility?: VisibilityState
    rowSelection?: RowSelectionState
  }
  /** 테이블 기능 활성화 여부 */
  features?: {
    sorting?: boolean
    filtering?: boolean
    pagination?: boolean
    rowSelection?: boolean
  }
  /** 메타데이터 */
  meta?: Record<string, unknown>
  /** 커스텀 필터 함수 */
  filterFns?: Record<string, any>
}

/**
 * 테이블 상태 관리를 위한 커스텀 훅
 * TanStack Table의 상태와 기능을 통합적으로 관리합니다.
 */
export function useTable<TData, TValue = unknown>({
  data,
  columns,
  initialState = {
    pagination: {
      pageSize: 20
    }
  },
  features = {
    sorting: true,
    filtering: true,
    pagination: true,
    rowSelection: false
  },
  meta,
  filterFns
}: UseTableOptions<TData, TValue>) {
  // 테이블 상태 관리
  const [sorting, setSorting] = useState<SortingState>(initialState.sorting || [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState.columnVisibility || {})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState.rowSelection || {})

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: features.rowSelection ? rowSelection : undefined
    },
    enableSorting: features.sorting,
    enableColumnFilters: features.filtering,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: features.pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: features.sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: features.filtering ? getFilteredRowModel() : undefined,
    initialState,
    meta: meta as any,
    filterFns
  })

  // 검색 함수
  const setSearchValue = useCallback(
    (column: string, value: string) => {
      table.getColumn(column)?.setFilterValue(value)
    },
    [table]
  )

  // 필터 함수
  const setFilterValues = useCallback(
    (column: string, values: any) => {
      table.getColumn(column)?.setFilterValue(values)
    },
    [table]
  )

  // 모든 테이블 관련 상태와 유틸리티 반환
  return {
    table,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    actions: {
      setSorting,
      setColumnFilters,
      setColumnVisibility,
      setRowSelection,
      setSearchValue,
      setFilterValues
    }
  }
}
