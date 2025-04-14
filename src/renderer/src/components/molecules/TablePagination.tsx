"use client"

import { Button } from '@atoms/Button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { TablePaginationProps } from '@/types/table'

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-t">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-500">
          {table.getFilteredRowModel().rows.length}개 중 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="hidden sm:flex h-8 w-8 p-0 lg:flex"
        >
          <span className="sr-only">첫 페이지</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">이전 페이지</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium mx-2">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">다음 페이지</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="hidden sm:flex h-8 w-8 p-0 lg:flex"
        >
          <span className="sr-only">마지막 페이지</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 