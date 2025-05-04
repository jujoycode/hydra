import { formatDate } from '@/lib/utils'
import { Button } from '@/atoms/Button'
import { createColumn } from '@/atoms/TableColumnDef'
import { UserAvatar } from '@/molecules/user/UserAvatar'
import { IssueBadge } from '@/molecules/issue/IssueBadge'
import { ArrowUpRight, CircleDot, TriangleAlert } from 'lucide-react'
import type { Issue, IssueTableMeta } from '@/types/issue'

// Category Column
export const categoryColumn = createColumn<Issue, 'bug' | 'feature'>({
  id: 'category',
  header: 'Category',
  accessorKey: 'category',
  enableSorting: false,
  cell: ({ row }) => {
    const category = row.getValue('category') as 'bug' | 'feature'
    return (
      <div className='flex justify-center'>
        {category === 'bug' ? (
          <TriangleAlert size={18} strokeWidth={1.5} color='red' />
        ) : (
          <CircleDot size={18} strokeWidth={1.5} color='green' />
        )}
      </div>
    )
  }
})

// Key Column
export const keyColumn = createColumn<Issue, string>({
  id: 'key',
  header: 'Issue Key',
  accessorKey: 'key',
  sortDirection: 'desc',
  cell: ({ row, table }) => {
    const issue = row.original
    return (
      <Button
        variant='link'
        onClick={() => (table.options.meta as IssueTableMeta)?.onSelectIssue?.(issue)}
        className='relative group inline-flex text-sm font-medium transition-colors duration-200'
      >
        <span className='truncate relative z-10 font-light'>{issue.key}</span>
        <span className='inline-flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 group-hover:translate-x-1'>
          <ArrowUpRight size={12} strokeWidth={1.5} />
        </span>
      </Button>
    )
  }
})

// Title Column
export const titleColumn = createColumn<Issue, string>({
  id: 'title',
  header: 'Title',
  accessorKey: 'title',
  enableSorting: false,
  cell: ({ row, table }) => {
    const issue = row.original
    return (
      <div className='max-w-full'>
        <Button
          variant='link'
          onClick={() => (table.options.meta as IssueTableMeta)?.onSelectIssue?.(issue)}
          className='relative group inline-flex text-sm font-medium transition-colors duration-200 max-w-full'
        >
          <span className='truncate relative z-10 font-light'>{issue.title}</span>
          <span className='inline-flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 group-hover:translate-x-1'>
            <ArrowUpRight size={12} strokeWidth={1.5} />
          </span>
        </Button>
      </div>
    )
  }
})

// Assignee Column
export const assigneeColumn = createColumn<Issue, string>({
  id: 'assignee',
  header: 'Assignee',
  accessorKey: 'assignee',
  enableSorting: false,
  cell: ({ row }) => {
    const issue = row.original
    return <UserAvatar name={issue.assignee} avatar={issue.reporter.avatar} size='xs' align='left' />
  }
})

// Reporter Column
export const reporterColumn = createColumn<Issue>({
  id: 'reporter',
  header: 'Reporter',
  enableSorting: false,
  cell: ({ row }) => {
    const issue = row.original
    return (
      <UserAvatar
        name={issue.reporter.name}
        avatar={issue.reporter.avatar}
        email={issue.reporter.email}
        size='xs'
        showInfo={!!issue.reporter.email}
        align='left'
      />
    )
  }
})

// Status Column
export const statusColumn = createColumn<Issue>({
  id: 'state',
  header: 'Status',
  accessorKey: 'state',
  enableSorting: false,
  cell: ({ row }) => {
    const state = row.getValue('state')
    return <IssueBadge state={state as any} />
  }
})

// Created Date Column
export const createdDateColumn = createColumn<Issue, Date>({
  id: 'created',
  header: 'Created At',
  accessorKey: 'created',
  cell: ({ row }) => {
    const date = row.getValue('created') as Date
    return <span className='text-sm text-gray-600'>{formatDate(date)}</span>
  }
})

// Updated Date Column
export const updatedDateColumn = createColumn<Issue, Date>({
  id: 'updated',
  header: 'Updated At',
  accessorKey: 'updated',
  cell: ({ row }) => {
    const date = row.getValue('updated') as Date
    return <span className='text-sm text-gray-600'>{formatDate(date)}</span>
  }
})

// Default columns collection
export const IssueColumns = [
  categoryColumn,
  keyColumn,
  titleColumn,
  assigneeColumn,
  reporterColumn,
  statusColumn,
  createdDateColumn,
  updatedDateColumn
]
