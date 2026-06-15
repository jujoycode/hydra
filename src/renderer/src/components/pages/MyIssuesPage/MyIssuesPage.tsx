import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyIssues } from '@/hooks/use-issues'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import { useAuthStore } from '@/stores/auth'
import type { Issue } from '@/types/issue'

export default function MyIssuesPage() {
  const { t } = useTranslation('nav')
  const { user } = useAuthStore()
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const { data: myIssues = [], isLoading, isError } = useMyIssues(user?.user_id)

  return (
    <div className='p-page h-full flex flex-col'>
      <div className='flex justify-between items-center mb-section'>
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
