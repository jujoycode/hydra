import { X } from 'lucide-react'

import { Button } from '@/atoms/Button'
import { usePanelStore } from '@/stores/panel'

export function DetailPanel() {
  const { isDetailOpen, selectedIssueId, closeDetail } = usePanelStore()

  if (!isDetailOpen || !selectedIssueId) return null

  return (
    <div className='glass-panel flex h-full flex-col border-l transition-colors'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <span className='text-sm text-muted-foreground'>{selectedIssueId}</span>
        <Button variant='ghost' size='icon' className='size-7' onClick={closeDetail}>
          <X className='size-4' />
        </Button>
      </div>
      <div className='flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground'>
        이슈 상세 패널 (Phase 2에서 구현)
      </div>
    </div>
  )
}
