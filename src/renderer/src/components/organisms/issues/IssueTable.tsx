'use client'

import { useState, useEffect } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/Table'
import { IssueColumns } from '@/molecules/issues/IssueColumns'
import { TableSearchBar } from '@/molecules/tables/TableSearchBar'
import { TablePagination } from '@/molecules/tables/TablePagination'
import type { Issue, IssueTableMeta } from '@/types/issue'

interface ExtendedColumnMeta {
  initSorting?: (table: any) => void
  [key: string]: any
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
    initialState: {
      pagination: {
        pageSize: 7
      }
    },
    state: {
      sorting,
      columnFilters
    },
    meta: {
      onSelectIssue
    } as IssueTableMeta,
    filterFns: {
      arrIncludesSome: (row, id, filterValue: string[]) => {
        const value = row.getValue(id)
        return filterValue.includes(value as string)
      }
    }
  })

  useEffect(() => {
    IssueColumns.forEach((column) => {
      const meta = column.meta as ExtendedColumnMeta | undefined
      if (meta && typeof meta.initSorting === 'function') {
        meta.initSorting(table)
      }
    })
  }, [table])

  return (
    <div className='space-y-4'>
      {/* Search and Filters */}
      <TableSearchBar
        table={table}
        searchColumn='title'
        placeholder='Search issue by title...'
        searchWidth='w-64 md:w-80'
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
      <div className='rounded-md border w-full overflow-hidden'>
        <div className='h-auto overflow-y-auto'>
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    className='group/row hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-200'
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={IssueColumns.length} className='h-24 text-center'>
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
