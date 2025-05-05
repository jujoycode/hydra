import { formatDate } from '@/lib/utils'
import { Button } from '@/atoms/Button'
import { createActionsColumn, createColumn } from '@/atoms/TableColumnDef'
import { UserAvatar } from '@/molecules/users/UserAvatar'
import { IssueBadge } from '@/molecules/issues/IssueBadge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/DropdownMenu'
import {
  ArrowUpRight,
  CircleDot,
  MoreHorizontal,
  Trash2,
  TriangleAlert,
  ChevronsUp,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import type { Issue, IssueTableMeta, IssuePriority } from '@/types/issue'

// Type Column
export const typeColumn = createColumn<Issue, 'bug' | 'feature'>({
  id: 'type',
  header: 'Type',
  accessorKey: 'type',
  enableSorting: false,
  cell: ({ row }) => {
    const type = row.getValue('type') as 'bug' | 'feature'
    return (
      <div className='flex justify-center'>
        {type === 'bug' ? (
          <TriangleAlert size={16} strokeWidth={1.5} color='#dc2626' className='opacity-80' />
        ) : (
          <CircleDot size={16} strokeWidth={1.5} color='#16a34a' className='opacity-80' />
        )}
      </div>
    )
  }
})

// Priority Column
export const priorityColumn = createColumn<Issue, IssuePriority | undefined>({
  id: 'priority',
  header: 'Priority',
  accessorKey: 'priority',
  enableSorting: false,
  cell: ({ row }) => {
    const priority = row.getValue('priority') as IssuePriority | undefined

    if (!priority)
      return (
        <div className='flex justify-center'>
          <div className='h-[14px] w-[14px] text-gray-300' />
        </div>
      )

    const getPriorityConfig = () => {
      switch (priority) {
        case 'high':
          return {
            color: '#dc2626',
            label: 'High',
            icon: <ChevronsUp size={14} strokeWidth={2} className='text-red-600' />
          }
        case 'medium':
          return {
            color: '#f59e0b',
            label: 'Medium',
            icon: (
              <div className='relative flex flex-col'>
                <ChevronUp size={14} strokeWidth={2} className='text-yellow-500 -mb-[10px]' />
                <ChevronDown size={14} strokeWidth={2} className='text-yellow-500' />
              </div>
            )
          }
        case 'low':
          return {
            color: '#16a34a',
            label: 'Low',
            icon: <ChevronDown size={14} strokeWidth={2} className='text-green-600' />
          }
        default:
          return {
            color: '#6b7280',
            label: 'None',
            icon: <div className='h-[14px] w-[14px]' />
          }
      }
    }

    const { label, icon } = getPriorityConfig()

    return (
      <div className='flex justify-center items-center' title={label}>
        {icon}
      </div>
    )
  }
})

// Key Column
export const keyColumn = createColumn<Issue, string>({
  id: 'key',
  header: 'Key',
  accessorKey: 'key',
  enableSorting: true,
  sortDirection: 'desc',
  cell: ({ row, table }) => {
    const issue = row.original
    const meta = table.options.meta as IssueTableMeta | undefined
    const onSelectIssue = meta?.onSelectIssue

    return (
      <div className='text-center'>
        <Button
          variant='link'
          onClick={() => onSelectIssue?.(issue)}
          className='relative group inline-flex text-xs font-mono p-0 h-auto transition-colors duration-200'
        >
          <span className='truncate relative z-10'>{issue.key}</span>
          <span className='inline-flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 group-hover:translate-x-1'>
            <ArrowUpRight size={10} strokeWidth={1.5} />
          </span>
        </Button>
      </div>
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
    const meta = table.options.meta as IssueTableMeta | undefined
    const onSelectIssue = meta?.onSelectIssue

    return (
      <div className='max-w-full'>
        <Button
          variant='link'
          onClick={() => onSelectIssue?.(issue)}
          className='relative group inline-flex text-xs p-0 h-auto font-medium transition-colors duration-200 max-w-full'
        >
          <span className='truncate relative z-10'>{issue.title}</span>
          <span className='inline-flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 group-hover:translate-x-1'>
            <ArrowUpRight size={10} strokeWidth={1.5} />
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
    return (
      <div className='text-center'>
        <UserAvatar name={issue.assignee} avatar={issue.reporter.avatar} size='xs' align='center' />
      </div>
    )
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
      <div className='text-center'>
        <UserAvatar
          name={issue.reporter.name}
          avatar={issue.reporter.avatar}
          email={issue.reporter.email}
          size='xs'
          showInfo={!!issue.reporter.email}
          align='center'
        />
      </div>
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
    return (
      <div className='text-left'>
        <IssueBadge state={state as any} size='sm' variant='subtle' />
      </div>
    )
  }
})

// Created Date Column
export const createdDateColumn = createColumn<Issue, Date>({
  id: 'created',
  header: 'Created',
  accessorKey: 'created',
  enableSorting: true,
  cell: ({ row }) => {
    const date = row.getValue('created') as Date
    return (
      <div className='text-center'>
        <span className='text-xs text-gray-600'>{formatDate(date)}</span>
      </div>
    )
  }
})

// Updated Date Column
export const updatedDateColumn = createColumn<Issue, Date>({
  id: 'updated',
  header: 'Updated',
  accessorKey: 'updated',
  enableSorting: true,
  cell: ({ row }) => {
    const date = row.getValue('updated') as Date
    return (
      <div className='text-center'>
        <span className='text-xs text-gray-600'>{formatDate(date)}</span>
      </div>
    )
  }
})

// Actions Column
export const actionsColumn = createActionsColumn<Issue>({
  id: 'actions',
  header: '',
  cell: () => {
    return (
      <div className='flex justify-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-6 w-6 p-0 action-button'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-3.5 w-3.5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer'>
              <Trash2 color='red' className='h-3.5 w-3.5 mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
})

// Default columns collection
export const IssueColumns = [
  typeColumn,
  priorityColumn,
  keyColumn,
  titleColumn,
  assigneeColumn,
  reporterColumn,
  statusColumn,
  createdDateColumn,
  updatedDateColumn,
  actionsColumn
]
