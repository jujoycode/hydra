import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/DropdownMenu'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { Project } from '@/interface/CoreInterface'

// Date format helper function
const formatDate = (date: Date | string | null) => {
  if (!date) return <span className='text-muted-foreground text-sm'>-</span>
  return <span className='text-sm'>{new Date(date).toLocaleDateString()}</span>
}

// Project table column definitions
export const ProjectColumns: ColumnDef<Project>[] = [
  // Project name column
  {
    accessorKey: 'project_name',
    header: ({ column }) => {
      return (
        <div className='text-left font-medium  ml-4'>
          <Button
            variant='ghost'
            className='p-0 hover:bg-transparent'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const project = row.original
      return <div className='text-left font-medium truncate ml-4'>{project.project_name}</div>
    },
    filterFn: 'includesString'
  },

  // Project key column
  {
    accessorKey: 'project_key',
    enableSorting: false,
    header: () => {
      return <div className='text-center font-medium'>Key</div>
    },
    cell: ({ row }) => {
      const project = row.original
      return (
        <div className='text-center'>
          <Badge variant='outline' className='bg-primary/10 text-primary py-0.5 px-1.5'>
            {project.project_key}
          </Badge>
        </div>
      )
    },
    filterFn: 'includesString'
  },

  // Project description column
  {
    accessorKey: 'project_desc',
    header: () => <div className='text-left font-medium'>Description</div>,
    cell: ({ row }) => {
      const description = row.original.project_desc || '-'
      return <div className='text-sm text-muted-foreground truncate w-full pr-4 text-left'>{description}</div>
    }
  },

  // Start date column
  {
    accessorKey: 'project_start_date',
    header: ({ column }) => {
      return (
        <div className='text-center font-medium'>
          <Button
            variant='ghost'
            className='p-0 hover:bg-transparent'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <Calendar className='mr-1 h-3.5 w-3.5' />
            Start
            <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className='text-center'>{formatDate(row.original.project_start_date)}</div>,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as string | null
      if (!date) return false
      return new Date(date) >= new Date(filterValue as string)
    }
  },

  // End date column
  {
    accessorKey: 'project_end_date',
    header: ({ column }) => {
      return (
        <div className='text-center font-medium'>
          <Button
            variant='ghost'
            className='p-0 hover:bg-transparent'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <Calendar className='mr-1 h-3.5 w-3.5' />
            End
            <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className='text-center'>{formatDate(row.original.project_end_date)}</div>,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as string | null
      if (!date) return false
      return new Date(date) >= new Date(filterValue as string)
    }
  },

  // Actions column
  {
    id: 'actions',
    enableSorting: false,
    header: () => <div className='text-right'></div>,
    cell: () => {
      return (
        <div className='flex justify-end mr-4'>
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
    }
  }
]
