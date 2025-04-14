"use client"

import { useState, useEffect } from 'react'
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@atoms/Table'
import { TableSearchBar } from '@molecules/TableSearchBar'
import { TablePagination } from '@molecules/TablePagination'
import { IssueColumns } from '@molecules/IssueColumns'
import type { Issue, IssueTableMeta } from '@/types/issue'

// 확장된 컬럼 메타 타입
interface ExtendedColumnMeta {
  initSorting?: (table: any) => void;
  [key: string]: any;
}

interface IssueTableProps {
  issues: Issue[]
  onSelectIssue: (issue: Issue) => void
}

export function IssueTable({ issues, onSelectIssue }: IssueTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: issues,
    columns: IssueColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      onSelectIssue,
    } as IssueTableMeta,
    // Array filtering for multiple checkbox selections
    filterFns: {
      arrIncludesSome: (row, id, filterValue: string[]) => {
        const value = row.getValue(id);
        return filterValue.includes(value as string);
      },
    },
  })
  
  // 컬럼의 초기 정렬 적용
  useEffect(() => {
    // 컬럼 메타데이터에서 초기 정렬 설정이 있는지 확인
    IssueColumns.forEach(column => {
      // 타입 단언을 사용하여 meta 속성에 initSorting이 있는지 확인
      const meta = column.meta as ExtendedColumnMeta | undefined;
      if (meta && typeof meta.initSorting === 'function') {
        meta.initSorting(table);
      }
    })
  }, [table]) // table이 초기화되었을 때 실행
  
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <TableSearchBar 
        table={table}
        searchColumn="title"
        placeholder="Search issue by title..."
        searchWidth="w-64 md:w-80"
        filters={[
          {
            column: 'state',
            options: ['in_progress', 'done', 'blocked', 'review'],
            getLabel: (state) => state.replace('_', ' '),
            title: 'Status'
          }
        ]}
        selectOptions={[
          {
            column: 'category',
            title: 'Category',
            options: [
              { value: 'bug', label: 'Bug' },
              { value: 'feature', label: 'Feature' }
            ]
          },
          {
            column: 'state',
            title: 'Status',
            options: [
              { value: 'in_progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'review', label: 'Review' }
            ]
          }
        ]}
      />

      {/* Table */}
      <div className="rounded-md border w-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                    className="group/row hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-200"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={IssueColumns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <TablePagination table={table} />
      </div>
    </div>
  )
} 