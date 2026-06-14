'use client'

import type { ColumnDef, Row, Table as TableInstance } from '@tanstack/react-table'
import { useRef } from 'react'
import { useTable } from '@/hooks/useTable'
import { IssueColumns } from '@/molecules/issues/IssueColumns'
import { TableEmpty } from '@/molecules/tables/TableEmpty'
import { Table } from '@/organisms/Table'
import type { Issue } from '@/types/issue'

interface IssueTableProps {
  issues: Issue[]
  onSelectIssue: (issue: Issue) => void
  isLoading?: boolean
}

export function IssueTable({ issues, onSelectIssue, isLoading = false }: IssueTableProps) {
  // Create table instance directly
  const { table } = useTable({
    data: issues,
    columns: IssueColumns as ColumnDef<Issue>[],
    initialState: {
      pagination: {
        pageSize: 8
      },
      sorting: [{ id: 'key', desc: true }]
    },
    features: {
      sorting: true,
      filtering: true,
      pagination: true
    },
    meta: {
      onSelectIssue
    },
    // Custom filter function
    filterFns: {
      arrIncludesSome: (row: any, id: string, filterValue: string[]) => {
        const value = row.getValue(id)
        return filterValue.includes(value as string)
      }
    }
  })

  const tableRef = useRef<TableInstance<Issue> | null>(null)
  tableRef.current = table

  // Row click handler
  const handleRowClick = (row: Row<Issue>) => {
    onSelectIssue(row.original)
  }

  return (
    <div className='h-full flex flex-col space-y-4'>
      {/* Single glass container wraps the entire table */}
      <div className='glass-soft rounded-xl shadow-card overflow-hidden border border-border/70 flex-1 flex flex-col [&_tbody_tr]:hover:bg-primary/5 [&_tbody_td]:px-4 [&_tbody_td]:py-2.5 [&_tbody_tr]:border-b [&_tbody_tr]:border-border/60 [&_tbody_tr:last-child]:border-b-0'>
        <Table
          data={issues}
          columns={IssueColumns as ColumnDef<Issue>[]}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          loadingMessage='Loading issues...'
          emptyComponent={<TableEmpty message='No issues' description='Create a new issue to get started' />}
          initialState={{
            pagination: {
              pageSize: 8
            },
            sorting: [{ id: 'key', desc: true }]
          }}
          // Search and filtering settings
          search={{
            searchColumn: 'title',
            placeholder: 'Search issue by title...',
            searchWidth: 'w-64 md:w-80',
            selectOptions: [
              {
                column: 'type',
                title: 'Type',
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
            ]
          }}
          // Pagination settings
          pagination={{
            rowsPerPageOptions: [8, 16, 24, 32]
          }}
          // Table reference
          tableRef={tableRef}
          className='flex-1 h-full'
          bodyClassName='!border-0 !rounded-none flex-1 overflow-y-auto'
        />
      </div>
    </div>
  )
}
