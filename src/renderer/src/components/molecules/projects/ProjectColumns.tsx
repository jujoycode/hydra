import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/DropdownMenu'
import { createActionsColumn, createColumn } from '@/atoms/TableColumnDef'
import type { Project } from '@/interface/CoreInterface'
import { formatDate } from '@/lib/utils'

// Project name column
export const projectNameColumn = createColumn<Project, string>({
  id: 'project_name',
  header: 'Name',
  enableSorting: false,
  accessorKey: 'project_name',
  cell: ({ row }) => {
    const project = row.original
    return <div className='text-center'>{project.project_name}</div>
  },
  meta: {
    align: 'center',
    width: 'w-1/6'
  }
})

// Project key column
export const projectKeyColumn = createColumn<Project, string>({
  id: 'project_key',
  header: 'Key',
  accessorKey: 'project_key',
  enableSorting: false,
  cell: ({ row }) => {
    const project = row.getValue('project_key')
    return (
      <div className='text-center'>
        <Badge variant='outline' className='bg-primary/10 text-primary py-0.5 px-1.5'>
          {project}
        </Badge>
      </div>
    )
  },
  meta: {
    align: 'center',
    width: 'w-1/12'
  }
})

// Project description column
export const projectDescColumn = createColumn<Project, string>({
  id: 'project_desc',
  header: 'Description',
  accessorKey: 'project_desc',
  enableSorting: false,
  cell: ({ row }) => {
    const description = row.getValue('project_desc') || '-'
    return <div className='text-sm text-muted-foreground truncate w-full pr-4 text-left'>{description}</div>
  },
  meta: {
    align: 'left',
    width: 'w-1/3'
  }
})

// Start date column
export const startDateColumn = createColumn<Project, Date | string | null>({
  id: 'project_start_date',
  header: 'Start',
  accessorKey: 'project_start_date',
  enableSorting: true,
  cell: ({ row }) => <div className='text-center'>{formatDate(row.original.project_start_date)}</div>,
  meta: {
    align: 'center',
    width: 'w-1/6'
  }
})

// End date column
export const endDateColumn = createColumn<Project, Date | string | null>({
  id: 'project_end_date',
  header: 'End',
  accessorKey: 'project_end_date',
  enableSorting: true,
  cell: ({ row }) => <div className='text-center'>{formatDate(row.original.project_end_date)}</div>,
  meta: {
    align: 'center',
    width: 'w-1/6'
  }
})

// Actions column
export const actionsColumn = createActionsColumn<Project>({
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
            <DropdownMenuItem className='cursor-pointer'>
              <Pencil className='h-3.5 w-3.5 mr-2' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer'>
              <Trash2 color='red' className='h-3.5 w-3.5 mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
  width: 'w-1/12',
  align: 'center'
})

// Export default collection of columns
export const ProjectColumns = [
  projectNameColumn,
  projectKeyColumn,
  projectDescColumn,
  startDateColumn,
  endDateColumn,
  actionsColumn
]
