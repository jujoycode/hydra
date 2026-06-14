import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import type { Issue, Milestone, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { formatKoreanDate } from '@/lib/formatDate'
import { PRIORITY_CLASS, PRIORITY_LABEL, STATUS_CLASS, STATUS_LABEL } from '@/lib/statusTokens'
import { cn } from '@/lib/utils'
import type { IssueState } from '@/molecules/issues/IssueBadge'
import type { IssuePriority } from '@/types/issue'
import i18n from '../../../locales'

/** DB의 issue_status('open' 별칭 포함)를 IssueState 토큰 키로 정규화 */
function toIssueState(status: string | null | undefined): IssueState {
  switch (status) {
    case 'open':
      return 'backlog'
    case 'in_progress':
    case 'review':
    case 'done':
    case 'blocked':
    case 'backlog':
      return status
    default:
      return 'backlog'
  }
}

export default function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false })
  const [project, setProject] = useState<Project | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDueDate, setMilestoneDueDate] = useState('')

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setIsLoading(true)
      const [projectResult, issuesResult, milestonesResult] = await Promise.all([
        window.callApi(IpcChannel.PROJECT_GET, { projectId }),
        window.callApi(IpcChannel.ISSUE_LIST, { projectId }),
        window.callApi(IpcChannel.MILESTONE_LIST, { projectId })
      ])
      if (projectResult.data) setProject(projectResult.data as Project)
      if (Array.isArray(issuesResult.data)) setIssues(issuesResult.data as Issue[])
      if (Array.isArray(milestonesResult.data)) setMilestones(milestonesResult.data as Milestone[])
      setIsLoading(false)
    }
    load()
  }, [projectId])

  if (isLoading)
    return (
      <div className='p-page'>
        <p className='text-muted-foreground'>{i18n.t('common:label.loading')}</p>
      </div>
    )
  if (!project)
    return (
      <div className='p-page'>
        <p className='text-muted-foreground'>{i18n.t('common:empty.noData')}</p>
      </div>
    )

  // Compute issue stats
  const totalIssues = issues.length
  const openIssues = issues.filter((i) => i.issue_status === 'open').length
  const inProgressIssues = issues.filter((i) => i.issue_status === 'in_progress').length
  const doneIssues = issues.filter((i) => i.issue_status === 'done').length
  const blockedIssues = issues.filter((i) => i.issue_status === 'blocked').length

  const handleCreateMilestone = async () => {
    if (!milestoneTitle.trim()) return
    const result = await window.callApi(IpcChannel.MILESTONE_CREATE, {
      projectId: projectId!,
      milestoneTitle: milestoneTitle.trim(),
      milestoneDueDate: milestoneDueDate || undefined
    })
    if (result.data) {
      setMilestones((prev) => [...prev, result.data as Milestone])
      setMilestoneTitle('')
      setMilestoneDueDate('')
      setShowMilestoneForm(false)
    }
  }

  return (
    <div className='p-page h-full overflow-auto'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
          <span>{project.project_key}</span>
        </div>
        <h1 className='text-title'>{project.project_name}</h1>
        {project.project_desc && <p className='text-muted-foreground mt-2'>{project.project_desc}</p>}
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-5 gap-3 mb-6'>
        <StatCard label='전체' value={totalIssues} />
        <StatCard label={STATUS_LABEL.backlog} value={openIssues} className='text-status-in-progress-fg' />
        <StatCard label={STATUS_LABEL.in_progress} value={inProgressIssues} className='text-priority-medium' />
        <StatCard label={STATUS_LABEL.done} value={doneIssues} className='text-success' />
        <StatCard label={STATUS_LABEL.blocked} value={blockedIssues} className='text-status-blocked-fg' />
      </div>

      {/* Recent Issues */}
      <div className='rounded-lg border'>
        <div className='p-4 border-b'>
          <h2 className='text-section'>최근 이슈</h2>
        </div>
        <div className='divide-y'>
          {issues.length === 0 ? (
            <div className='p-8 text-center text-muted-foreground'>{i18n.t('common:empty.noData')}</div>
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

      {/* Milestones */}
      <div className='rounded-lg border mt-6'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='text-section'>마일스톤</h2>
          <Button variant='outline' size='sm' onClick={() => setShowMilestoneForm(!showMilestoneForm)}>
            {showMilestoneForm ? i18n.t('common:button.cancel') : '마일스톤 추가'}
          </Button>
        </div>
        {showMilestoneForm && (
          <div className='p-4 border-b bg-muted/30 flex gap-2'>
            <Input
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              placeholder='마일스톤 제목'
              className='flex-1'
            />
            <Input
              type='date'
              value={milestoneDueDate}
              onChange={(e) => setMilestoneDueDate(e.target.value)}
              className='w-40'
            />
            <Button size='sm' onClick={handleCreateMilestone}>
              {i18n.t('common:button.create')}
            </Button>
          </div>
        )}
        {milestones.length === 0 ? (
          <div className='p-8 text-center text-muted-foreground'>{i18n.t('common:empty.noData')}</div>
        ) : (
          <div className='divide-y'>
            {milestones.map((ms) => {
              const closed = ms.milestone_status === 'closed'
              return (
                <div key={ms.milestone_id} className='p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium'>{ms.milestone_title}</h3>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        closed
                          ? 'bg-status-done text-status-done-fg'
                          : 'bg-status-in-progress text-status-in-progress-fg'
                      )}
                    >
                      {closed ? '완료' : '진행 중'}
                    </span>
                  </div>
                  {ms.milestone_desc && <p className='text-sm text-muted-foreground mt-1'>{ms.milestone_desc}</p>}
                  {ms.milestone_due_date && (
                    <p className='text-caption tabular-nums text-muted-foreground mt-1'>
                      마감: {formatKoreanDate(ms.milestone_due_date)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
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
  const state = toIssueState(status)
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-sm font-medium', STATUS_CLASS[state])}>{STATUS_LABEL[state]}</span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const isKnown = priority === 'urgent' || priority === 'high' || priority === 'medium' || priority === 'low'
  if (!isKnown) return <span className='text-xs font-medium text-muted-foreground'>{priority}</span>
  const p = priority as IssuePriority
  return <span className={cn('text-xs font-medium', PRIORITY_CLASS[p])}>{PRIORITY_LABEL[p]}</span>
}
