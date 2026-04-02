import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { Issue, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'

export default function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false })
  const [project, setProject] = useState<Project | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setIsLoading(true)
      const [projectResult, issuesResult] = await Promise.all([
        window.callApi(IpcChannel.PROJECT_GET, { projectId }),
        window.callApi(IpcChannel.ISSUE_LIST, { projectId })
      ])
      if (projectResult.data) setProject(projectResult.data as Project)
      if (Array.isArray(issuesResult.data)) setIssues(issuesResult.data as Issue[])
      setIsLoading(false)
    }
    load()
  }, [projectId])

  if (isLoading)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  if (!project)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Project not found</p>
      </div>
    )

  // Compute issue stats
  const totalIssues = issues.length
  const openIssues = issues.filter((i) => i.issue_status === 'open').length
  const inProgressIssues = issues.filter((i) => i.issue_status === 'in_progress').length
  const doneIssues = issues.filter((i) => i.issue_status === 'done').length
  const blockedIssues = issues.filter((i) => i.issue_status === 'blocked').length

  return (
    <div className='p-6 h-full overflow-auto'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
          <span>{project.project_key}</span>
        </div>
        <h1 className='text-2xl font-bold'>{project.project_name}</h1>
        {project.project_desc && <p className='text-muted-foreground mt-2'>{project.project_desc}</p>}
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-5 gap-3 mb-6'>
        <StatCard label='Total' value={totalIssues} />
        <StatCard label='Open' value={openIssues} className='text-blue-600' />
        <StatCard label='In Progress' value={inProgressIssues} className='text-yellow-600' />
        <StatCard label='Done' value={doneIssues} className='text-green-600' />
        <StatCard label='Blocked' value={blockedIssues} className='text-red-600' />
      </div>

      {/* Recent Issues */}
      <div className='rounded-lg border'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Recent Issues</h2>
        </div>
        <div className='divide-y'>
          {issues.length === 0 ? (
            <div className='p-8 text-center text-muted-foreground'>No issues yet</div>
          ) : (
            issues.slice(0, 10).map((issue) => (
              <div key={issue.issue_id} className='flex items-center justify-between p-3 hover:bg-muted/50'>
                <div className='flex items-center gap-3'>
                  <StatusBadge status={issue.issue_status} />
                  <span className='text-xs text-muted-foreground font-mono'>{issue.issue_key}</span>
                  <span className='text-sm'>{issue.issue_title}</span>
                </div>
                <div className='flex items-center gap-2'>
                  {issue.issue_priority && <PriorityBadge priority={issue.issue_priority} />}
                  {issue.issue_category && (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-muted'>{issue.issue_category}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Internal helper components
function StatCard({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className='rounded-lg border p-4'>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className={`text-2xl font-bold ${className || ''}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    blocked: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    review: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  }
  const s = status || 'open'
  return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[s] || 'bg-muted'}`}>{s.replace('_', ' ')}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  }
  return <span className={`text-xs font-medium ${colors[priority] || ''}`}>{priority}</span>
}
