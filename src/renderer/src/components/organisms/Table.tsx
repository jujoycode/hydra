import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { TableBase, TableBaseProps } from '@/atoms/TableBase'
import { TableSearch, TableSearchProps } from '@/molecules/tables/TableSearch'
import { TablePagination, TablePaginationProps } from '@/molecules/tables/TablePagination'
import { Table as TableInstance } from '@tanstack/react-table'
import { ClipboardList } from 'lucide-react'

export interface TableProps<TData, TValue = unknown> extends TableBaseProps<TData, TValue> {
  // 추가 옵션
  title?: string
  description?: string
  actions?: React.ReactNode

  // 검색 옵션
  search?: Omit<TableSearchProps<TData>, 'table'>

  // 페이지네이션 옵션
  pagination?: Omit<TablePaginationProps<TData>, 'table'> & {
    /** 페이지당 행 개수 옵션 */
    rowsPerPageOptions?: number[]
  }

  // 로딩 상태
  isLoading?: boolean
  loadingMessage?: string

  // 추가 커스터마이징
  headerClassName?: string
  footerClassName?: string
  bodyClassName?: string
  searchClassName?: string
  tableRef?: React.Ref<TableInstance<TData>>
}

/**
 * 완전한 형태의 테이블 컴포넌트
 * 검색, 필터링, 페이지네이션을 포함한 완전한 테이블 컴포넌트입니다.
 */
export function Table<TData, TValue = unknown>({
  // TableBase props
  data,
  columns,
  initialState,
  meta,
  onRowClick,
  className,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  emptyComponent,
  emptyMessage,

  // 추가 옵션
  title,
  description,
  actions,

  // 검색 옵션
  search,

  // 페이지네이션 옵션
  pagination,

  // 로딩 상태
  isLoading,
  loadingMessage = 'Loading data...',

  // 추가 커스터마이징
  headerClassName,
  footerClassName,
  bodyClassName,
  searchClassName,
  tableRef
}: TableProps<TData, TValue>) {
  // 테이블 인스턴스 참조
  const tableInstanceRef = React.useRef<TableInstance<TData>>(null)
  const [isTableReady, setIsTableReady] = React.useState(false)

  // 테이블 인스턴스가 설정되면 상태 업데이트
  useEffect(() => {
    if (tableInstanceRef.current) {
      setIsTableReady(true)
    }
  }, [tableInstanceRef.current])

  // 로딩 컴포넌트
  const renderLoading = () => (
    <div className='flex justify-center items-center h-40 w-full'>
      <div className='animate-pulse text-center'>
        <ClipboardList className='h-10 w-10 text-muted-foreground mb-2 mx-auto' />
        <p className='text-muted-foreground'>{loadingMessage}</p>
      </div>
    </div>
  )

  if (isLoading) {
    return renderLoading()
  }

  // 테이블 레퍼런스 콜백 함수
  const handleTableRef = (instance: TableInstance<TData> | null) => {
    // 내부 참조 설정
    if (instance) {
      tableInstanceRef.current = instance
      setIsTableReady(true)
    }

    // 외부 참조 설정 (있는 경우)
    if (tableRef && typeof tableRef === 'function') {
      tableRef(instance)
    } else if (tableRef) {
      ;(tableRef as React.MutableRefObject<TableInstance<TData> | null>).current = instance
    }
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {(title || description || actions || search) && (
        <div className={cn('flex flex-col space-y-2 mb-4', headerClassName)}>
          {/* 제목과 액션 버튼 영역 */}
          {(title || description || actions) && (
            <div className='flex items-center justify-between'>
              <div>
                {title && <h2 className='text-lg font-semibold'>{title}</h2>}
                {description && <p className='text-sm text-muted-foreground'>{description}</p>}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          )}

          {/* 검색 영역 */}
          {search && isTableReady && tableInstanceRef.current && (
            <div className={cn(searchClassName)}>
              <TableSearch table={tableInstanceRef.current} {...search} />
            </div>
          )}
        </div>
      )}

      {/* 메인 테이블 */}
      <div className={cn('rounded-md border overflow-hidden', bodyClassName)}>
        <TableBase
          data={data}
          columns={columns}
          initialState={initialState}
          meta={meta}
          onRowClick={onRowClick}
          enableSorting={enableSorting}
          enableFiltering={enableFiltering}
          enablePagination={enablePagination}
          emptyComponent={emptyComponent}
          emptyMessage={emptyMessage}
          tableRef={handleTableRef}
        />
      </div>

      {/* 테이블 푸터 (페이지네이션) */}
      {enablePagination && pagination && isTableReady && tableInstanceRef.current && (
        <div className={cn('mt-2', footerClassName)}>
          <TablePagination table={tableInstanceRef.current} {...pagination} />
        </div>
      )}
    </div>
  )
}
