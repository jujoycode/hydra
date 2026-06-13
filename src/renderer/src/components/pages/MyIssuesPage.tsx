import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Issue as IssueRecord, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from '@/lib/mapIssue'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import { useAuthStore } from '@/stores/auth'
import type { Issue } from '@/types/issue'

async function fetchMyIssues(userId: string): Promise<Issue[]> {
  const projectResult = await window.callApi(IpcChannel.PROJECT_LIST, { userId })
  const projects = Array.isArray(projectResult.data) ? (projectResult.data as Project[]) : []

  const records: IssueRecord[] = []
  for (const project of projects) {
    const issueResult = await window.callApi(IpcChannel.ISSUE_LIST, {
      projectId: project.project_id,
      assignedTo: userId
    })
    if (Array.isArray(issueResult.data)) records.push(...(issueResult.data as IssueRecord[]))
  }

  return records.map(mapIssueRecordToIssue)
}

export default function MyIssuesPage() {
  const { t } = useTranslation('nav')
  const { user } = useAuthStore()
  const userId = user?.user_id
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const {
    data: myIssues = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['my-issues', userId],
    queryFn: () => fetchMyIssues(userId as string),
    enabled: !!userId
  })

  return (
    <div className='p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold'>{t('myIssues')}</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            {myIssues.length > 0
              ? `${myIssues.length} issue${myIssues.length > 1 ? 's' : ''} assigned to you`
              : 'No issues assigned to you'}
          </p>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        {isError ? (
          <p className='text-sm text-destructive'>Failed to load your issues. Please try again.</p>
        ) : (
          <IssueTable issues={myIssues} onSelectIssue={setSelectedIssue} isLoading={isLoading} />
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
