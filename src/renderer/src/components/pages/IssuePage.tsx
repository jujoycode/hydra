import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Issue as IssueRecord } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from '@/lib/mapIssue'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import type { Issue } from '@/types/issue'

async function fetchProjectIssues(projectId: string): Promise<Issue[]> {
  const result = await window.callApi(IpcChannel.ISSUE_LIST, { projectId })
  const records = Array.isArray(result.data) ? (result.data as IssueRecord[]) : []
  return records.map(mapIssueRecordToIssue)
}

export default function IssuePage() {
  const { t } = useTranslation('issue')
  const { projectId } = useParams({ strict: false })
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const {
    data: issues = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['project-issues', projectId],
    queryFn: () => fetchProjectIssues(projectId as string),
    enabled: !!projectId
  })

  return (
    <div className='p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-muted-foreground mt-2'>projects / {projectId}</p>
          <h1 className='text-2xl font-bold'>{t('title')}</h1>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        {isError ? (
          <p className='text-sm text-destructive'>Failed to load issues. Please try again.</p>
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
