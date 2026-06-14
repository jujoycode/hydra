import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/atoms/Button'
import { invokeApi } from '@/hooks/use-api'
import { useAuth } from '@/hooks/use-auth'
import { useProjectIssues } from '@/hooks/use-issues'
import { IpcChannel, type IssueStatus } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import { KanbanBoard } from '@/organisms/KanbanBoard'
import type { Issue } from '@/types/issue'

type ViewMode = 'table' | 'kanban'
const VIEW_KEY = 'hydra-issue-view'

export default function IssuePage() {
  const { t } = useTranslation('issue')
  const { projectId } = useParams({ strict: false })
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [view, setView] = useState<ViewMode>(() => (localStorage.getItem(VIEW_KEY) as ViewMode) || 'table')

  const { data: issues = [], isLoading, isError } = useProjectIssues(projectId)

  const changeView = (next: ViewMode) => {
    setView(next)
    localStorage.setItem(VIEW_KEY, next)
  }

  // 칸반에서 카드를 다른 상태 컬럼으로 드롭 → 상태 변경(활동 로그 자동 기록과 연동) → 캐시 무효화
  const handleMove = async (issueId: string, newState: IssueStatus) => {
    const issue = issues.find((i) => i.id === issueId)
    if (!issue || !user) return
    try {
      await invokeApi(IpcChannel.ISSUE_UPDATE, {
        issueId,
        issueTitle: issue.title,
        issueDesc: issue.description ?? '',
        issueStatus: newState,
        userId: user.user_id
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.byProject(projectId ?? '') })
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  return (
    <div className='p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-muted-foreground mt-2'>projects / {projectId}</p>
          <h1 className='text-2xl font-bold'>{t('title')}</h1>
        </div>
        <div className='flex items-center gap-1 rounded-md border p-0.5'>
          <Button variant={view === 'table' ? 'secondary' : 'ghost'} size='sm' onClick={() => changeView('table')}>
            <TableIcon size={16} className='mr-1' /> Table
          </Button>
          <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size='sm' onClick={() => changeView('kanban')}>
            <LayoutGrid size={16} className='mr-1' /> Board
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        {isError ? (
          <p className='text-sm text-destructive'>Failed to load issues. Please try again.</p>
        ) : view === 'kanban' ? (
          <KanbanBoard issues={issues} onMove={handleMove} onSelectIssue={setSelectedIssue} />
        ) : (
          <IssueTable issues={issues} onSelectIssue={setSelectedIssue} isLoading={isLoading} />
        )}
      </div>

      <IssueDetailsDialog
        issue={selectedIssue}
        open={!!selectedIssue}
        onOpenChange={(open) => !open && setSelectedIssue(null)}
      />
    </div>
  )
}
