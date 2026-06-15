import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { ISSUE_STATUSES, type IssueStatus } from '@/interface/CoreInterface'
import { STATUS_LABEL } from '@/lib/statusTokens'
import { cn } from '@/lib/utils'
import type { Issue } from '@/types/issue'

interface KanbanBoardProps {
  issues: Issue[]
  /** 카드를 다른 상태 컬럼으로 드롭했을 때 호출 */
  onMove: (issueId: string, newState: IssueStatus) => void
  onSelectIssue?: (issue: Issue) => void
}

function KanbanCard({ issue, onSelect }: { issue: Issue; onSelect?: (issue: Issue) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: issue.id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined
  return (
    <button
      type='button'
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onSelect?.(issue)}
      className={cn(
        'w-full cursor-grab rounded-md border bg-card p-3 text-left text-sm shadow-sm',
        isDragging && 'opacity-50'
      )}
    >
      <p className='font-medium'>{issue.title}</p>
      <p className='mt-1 text-xs text-muted-foreground'>{issue.key}</p>
    </button>
  )
}

function KanbanColumn({
  state,
  issues,
  onSelect
}: {
  state: IssueStatus
  issues: Issue[]
  onSelect?: (issue: Issue) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: state })
  return (
    <div className='flex w-64 shrink-0 flex-col gap-2'>
      <h3 className='px-1 text-sm font-semibold'>
        {STATUS_LABEL[state]} <span className='text-muted-foreground'>({issues.length})</span>
      </h3>
      <div
        ref={setNodeRef}
        className={cn('flex min-h-24 flex-col gap-2 rounded-md bg-muted/40 p-2', isOver && 'ring-2 ring-primary/50')}
      >
        {issues.map((issue) => (
          <KanbanCard key={issue.id} issue={issue} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export function KanbanBoard({ issues, onMove, onSelectIssue }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const issueId = String(event.active.id)
    const target = event.over?.id as IssueStatus | undefined
    if (!target) return
    const issue = issues.find((i) => i.id === issueId)
    if (issue && issue.state !== target) onMove(issueId, target)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {ISSUE_STATUSES.map((state) => (
          <KanbanColumn
            key={state}
            state={state}
            issues={issues.filter((i) => i.state === state)}
            onSelect={onSelectIssue}
          />
        ))}
      </div>
    </DndContext>
  )
}
