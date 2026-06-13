import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProjectIssues } from '@/hooks/use-issues'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import type { Issue } from '@/types/issue'

export default function IssuePage() {
  const { t } = useTranslation('issue')
  const { projectId } = useParams({ strict: false })
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const { data: issues = [], isLoading, isError } = useProjectIssues(projectId)

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
