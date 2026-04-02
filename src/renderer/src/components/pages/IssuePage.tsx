import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { IssueDetailsDialog } from '@/organisms/dialogs/IssueDetailsDialog'
import { IssueTable } from '@/organisms/issues/IssueTable'
import type { Issue } from '@/types/issue'

import DUMMY_ISSUES from '../../../../../dummy/issues.json'

export default function IssuePage() {
  const { projectId } = useParams({ strict: false })
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [issues, _] = useState<Issue[]>(DUMMY_ISSUES as unknown as Issue[])

  return (
    <div className='p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-muted-foreground mt-2'>projects / {projectId}</p>
          <h1 className='text-2xl font-bold'>Issues</h1>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        <IssueTable issues={issues} onSelectIssue={setSelectedIssue} />
      </div>

      <IssueDetailsDialog
        issue={selectedIssue}
        open={!!selectedIssue}
        onOpenChange={(open) => !open && setSelectedIssue(null)}
      />
    </div>
  )
}
