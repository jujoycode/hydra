import { GripVertical } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { cn } from '@/lib/utils'

type ResizablePanelGroupProps = ComponentProps<typeof Group> & {
  /** Alias for `orientation` (shadcn compatibility) */
  direction?: 'horizontal' | 'vertical'
}

function ResizablePanelGroup({ className, direction, orientation, ...props }: ResizablePanelGroupProps) {
  return (
    <Group
      orientation={orientation ?? direction ?? 'horizontal'}
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ComponentProps<typeof Panel>) {
  return <Panel {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) {
  return (
    <Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className='z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border'>
          <GripVertical className='h-2.5 w-2.5' />
        </div>
      )}
    </Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
