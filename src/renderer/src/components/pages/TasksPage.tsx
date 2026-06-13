import { useParams } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/atoms/Button'
import { Checkbox } from '@/atoms/Checkbox'
import { Input } from '@/atoms/Input'
import { useAuth } from '@/hooks/use-auth'
import type { Issue, Task } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'

interface IssueWithTasks {
  issue: Issue
  tasks: Task[]
}

export default function TasksPage() {
  const { projectId } = useParams({ strict: false })
  const { user } = useAuth()
  const [issuesWithTasks, setIssuesWithTasks] = useState<IssueWithTasks[]>([])
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!projectId) return
    setIsLoading(true)

    const issueResult = await window.callApi(IpcChannel.ISSUE_LIST, { projectId })
    const issues = Array.isArray(issueResult.data) ? (issueResult.data as Issue[]) : []

    const results: IssueWithTasks[] = []
    for (const issue of issues) {
      const taskResult = await window.callApi(IpcChannel.TASK_LIST, { issueId: issue.issue_id })
      const tasks = Array.isArray(taskResult.data) ? (taskResult.data as Task[]) : []
      results.push({ issue, tasks })
    }

    setIssuesWithTasks(results)
    setIsLoading(false)
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await window.callApi(IpcChannel.TASK_UPDATE, { taskId, taskCompleted: !completed })
    await loadData()
  }

  const handleDeleteTask = async (taskId: string) => {
    await window.callApi(IpcChannel.TASK_DELETE, { taskId })
    await loadData()
  }

  const handleAddTask = async (issueId: string) => {
    const title = newTaskInputs[issueId]?.trim()
    if (!title || !user) return

    await window.callApi(IpcChannel.TASK_CREATE, {
      issueId,
      taskTitle: title,
      userId: user.user_id
    })

    setNewTaskInputs((prev) => ({ ...prev, [issueId]: '' }))
    await loadData()
  }

  const handleKeyDown = (e: React.KeyboardEvent, issueId: string) => {
    if (e.key === 'Enter') {
      handleAddTask(issueId)
    }
  }

  if (isLoading) {
    return (
      <div className='p-6 h-full flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading tasks...</p>
      </div>
    )
  }

  const totalTasks = issuesWithTasks.reduce((sum, item) => sum + item.tasks.length, 0)
  const completedTasks = issuesWithTasks.reduce(
    (sum, item) => sum + item.tasks.filter((t) => t.task_completed).length,
    0
  )

  return (
    <div className='p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-muted-foreground mt-2'>projects / {projectId}</p>
          <h1 className='text-2xl font-bold'>Tasks</h1>
        </div>
        <div className='text-sm text-muted-foreground'>
          {completedTasks} / {totalTasks} completed
        </div>
      </div>

      <div className='flex-1 overflow-auto space-y-6'>
        {issuesWithTasks.length === 0 && (
          <p className='text-muted-foreground text-center py-12'>No issues found in this project.</p>
        )}

        {issuesWithTasks.map(({ issue, tasks }) => (
          <div key={issue.issue_id} className='border rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='text-xs font-mono text-muted-foreground'>{issue.issue_key}</span>
              <h2 className='font-semibold'>{issue.issue_title}</h2>
              <span className='ml-auto text-xs text-muted-foreground'>
                {tasks.filter((t) => t.task_completed).length} / {tasks.length}
              </span>
            </div>

            <div className='space-y-2'>
              {tasks.map((task) => (
                <div key={task.task_id} className='flex items-center gap-3 group'>
                  <Checkbox
                    checked={task.task_completed ?? false}
                    onCheckedChange={() => handleToggleTask(task.task_id, task.task_completed ?? false)}
                  />
                  <span className={task.task_completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                    {task.task_title}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-0 group-hover:opacity-100 h-7 w-7'
                    onClick={() => handleDeleteTask(task.task_id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>

            <div className='flex items-center gap-2 mt-3'>
              <Input
                placeholder='Add a task...'
                value={newTaskInputs[issue.issue_id] ?? ''}
                onChange={(e) => setNewTaskInputs((prev) => ({ ...prev, [issue.issue_id]: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, issue.issue_id)}
                className='h-8 text-sm'
              />
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 shrink-0'
                onClick={() => handleAddTask(issue.issue_id)}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
