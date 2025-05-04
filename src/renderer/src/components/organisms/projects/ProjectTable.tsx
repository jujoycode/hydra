'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
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
import { ProjectColumns } from '@/molecules/projects/ProjectColumns'
import { TablePagination } from '@/molecules/tables/TablePagination'
import { Folders } from 'lucide-react'
import type { Project } from '@/interface/CoreInterface'

interface ProjectTableProps {
  projects: Project[]
  isLoading: boolean
  searchTerm?: string
}

export function ProjectTable({ projects, isLoading, searchTerm = '' }: ProjectTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()

  // Update filters when search term changes
  useEffect(() => {
    if (searchTerm) {
      setColumnFilters([
        {
          id: 'project_name',
          value: searchTerm
        }
      ])
    } else {
      setColumnFilters([])
    }
  }, [searchTerm])

  const table = useReactTable({
    data: projects,
    columns: ProjectColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    state: {
      sorting,
      columnFilters
    },
    filterFns: {
      includesString: (row, id, filterValue) => {
        const value = row.getValue(id) as string
        return value?.toLowerCase().includes(filterValue.toLowerCase())
      }
    }
  })

  // Project row click handler
  const handleRowClick = (project: Project) => {
    navigate(`/projects/${project.project_id}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <div className='animate-pulse text-center'>
          <Folders className='h-10 w-10 text-muted-foreground mb-2 mx-auto' />
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    )
  }

  // Custom styles for columns
  const getColumnWidth = (columnId: string) => {
    switch (columnId) {
      case 'project_name':
        return 'w-[15%] min-w-[120px]'
      case 'project_key':
        return 'w-[8%] min-w-[60px]'
      case 'project_desc':
        return 'w-[47%] min-w-[300px]'
      case 'project_start_date':
        return 'w-[12%] min-w-[100px]'
      case 'project_end_date':
        return 'w-[12%] min-w-[100px]'
      case 'actions':
        return 'w-[6%] min-w-[40px]'
      default:
        return ''
    }
  }

  // Column alignment
  const getColumnAlignment = (columnId: string) => {
    switch (columnId) {
      case 'project_name':
      case 'project_desc':
        return 'text-left'
      case 'project_key':
      case 'project_start_date':
      case 'project_end_date':
        return 'text-center'
      case 'actions':
        return 'text-right'
      default:
        return ''
    }
  }

  return (
    <div className='h-full flex flex-col'>
      {/* Table */}
      <div className='rounded-md w-full overflow-hidden flex-1 flex flex-col border'>
        <div className='flex-1 overflow-y-auto overflow-x-hidden'>
          <Table>
            <TableHeader className='bg-muted/70 sticky top-0 z-10 h-8'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`${header.column.getCanSort() ? 'cursor-pointer select-none' : ''} py-1 px-2 ${getColumnWidth(header.id)} ${getColumnAlignment(header.id)}`}
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
                    className='group/row hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-200 cursor-pointer'
                    onClick={(e) => {
                      // 액션 버튼 클릭 시에는 행 클릭 이벤트 방지
                      if ((e.target as HTMLElement).closest('.action-button')) {
                        e.stopPropagation()
                        return
                      }
                      handleRowClick(row.original)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`py-1.5 px-2 ${getColumnWidth(cell.column.id)} ${getColumnAlignment(cell.column.id)}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={ProjectColumns.length} className='h-24 text-center'>
                    {!projects.length ? (
                      <div className='flex flex-col items-center justify-center py-6'>
                        <Folders className='h-10 w-10 text-muted-foreground mb-2' />
                        <p className='text-muted-foreground font-medium'>No Projects</p>
                        <p className='text-sm text-muted-foreground mt-1'>Create a new project to get started.</p>
                      </div>
                    ) : (
                      'No results found.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {projects.length > 0 && (
          <div className='border-t'>
            <TablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  )
}
