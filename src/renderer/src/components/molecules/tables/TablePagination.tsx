import { Table } from '@tanstack/react-table'
import { Button } from '@/atoms/Button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TablePaginationProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>
  /** 추가 CSS 클래스 */
  className?: string
  /** 페이지 변경 시 콜백 */
  onPageChange?: (pageIndex: number) => void
}

/**
 * 테이블 페이지네이션 컴포넌트
 */
export function TablePagination<TData>({ table, className, onPageChange }: TablePaginationProps<TData>) {
  // table이 null인 경우 기본값 처리
  if (!table) {
    return null
  }

  // 페이지 정보
  const { pageSize, pageIndex } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const totalPages = table.getPageCount()

  // 현재 표시되는 행 범위
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)

  // 페이지 변경 핸들러
  const handlePageChange = (newPageIndex: number) => {
    table.setPageIndex(newPageIndex)
    onPageChange?.(newPageIndex)
  }

  return (
    <div className={cn('flex items-center justify-between px-2 py-2', className)}>
      {/* 현재 표시되는 행 범위 정보 */}
      <div className='flex items-center gap-1 text-sm text-muted-foreground'>
        <div>
          Showing <span className='font-medium'>{start}</span> to <span className='font-medium'>{end}</span> of{' '}
          <span className='font-medium'>{totalRows}</span> rows
        </div>
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className='flex items-center gap-3'>
        {/* 페이지 네비게이션 버튼 */}
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            onClick={() => handlePageChange(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label='First page'
          >
            <ChevronsLeft className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
            aria-label='Previous page'
          >
            <ChevronLeft className='h-3.5 w-3.5' />
          </Button>

          {/* 페이지 번호 */}
          <div className='flex items-center gap-1 min-w-[70px] justify-center'>
            <span className='text-xs'>
              Page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
              <span className='font-medium'>{totalPages || 1}</span>
            </span>
          </div>

          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!table.getCanNextPage()}
            aria-label='Next page'
          >
            <ChevronRight className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='h-7 w-7 p-0'
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            aria-label='Last page'
          >
            <ChevronsRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
    </div>
  )
}
