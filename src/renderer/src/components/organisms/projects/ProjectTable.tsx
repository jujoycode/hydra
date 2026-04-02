'use client'

import { useNavigate } from '@tanstack/react-router'
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  type Table as TableInstance,
  useReactTable
} from '@tanstack/react-table'
import { useRef, useState } from 'react'
import type { Project } from '@/interface/CoreInterface'
import { ProjectColumns } from '@/molecules/projects/ProjectColumns'
import { TableEmpty } from '@/molecules/tables/TableEmpty'
import { Table } from '@/organisms/Table'

interface ProjectTableProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  isLoading?: boolean
}

export function ProjectTable({ projects, onSelectProject, isLoading = false }: ProjectTableProps) {
  // 상태 초기화
  const [sorting, setSorting] = useState<SortingState>([{ id: 'project_name', desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: projects,
    columns: ProjectColumns as ColumnDef<Project>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 20
      },
      sorting: [{ id: 'project_name', desc: false }]
    },
    state: {
      sorting,
      columnFilters
    },
    meta: {
      onSelectProject
    },
    // 커스텀 필터 함수
    filterFns: {
      includesString: (row, id, filterValue) => {
        const value = row.getValue(id) as string
        return value?.toLowerCase().includes(filterValue.toLowerCase())
      }
    }
  })

  const tableRef = useRef<TableInstance<Project> | null>(null)
  tableRef.current = table

  // 행 클릭 핸들러
  const handleRowClick = (row: Row<Project>) => {
    navigate({ to: '/projects/$projectId', params: { projectId: row.original.project_id } })
  }

  return (
    <div className='h-full flex flex-col space-y-4'>
      <Table
        data={projects}
        columns={ProjectColumns as ColumnDef<Project>[]}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        loadingMessage='Loading projects...'
        emptyComponent={<TableEmpty message='No projects' description='Create a new project to get started' />}
        // 검색 및 필터링 설정
        search={{
          searchColumn: 'project_name',
          placeholder: 'Search project by name...',
          searchWidth: 'w-64 md:w-80'
        }}
        // 페이지네이션 설정
        pagination={{
          rowsPerPageOptions: [10, 20, 30, 50]
        }}
        // 테이블 참조
        tableRef={tableRef}
        className='flex-1'
        bodyClassName='flex-1 overflow-y-auto'
      />
    </div>
  )
}
