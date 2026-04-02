import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/atoms/Dialog'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { Textarea } from '@/atoms/Textarea'
import { formatDate } from '@/lib/utils'
import { InfoRow } from '@/molecules/InfoRow'
import { IssueBadge, type IssueState } from '@/molecules/issues/IssueBadge'
import { UserAvatar } from '@/molecules/users/UserAvatar'
import type { IssueDetailsDialogProps } from '@/types/dialog'
import type { Issue, IssuePriority, IssueType } from '@/types/issue'

export function IssueDetailsDialog({
  issue,
  open,
  onOpenChange,
  mode = issue ? 'view' : 'create',
  onSave
}: IssueDetailsDialogProps) {
  const { t } = useTranslation('issue')
  const { t: tc } = useTranslation('common')
  const isCreateMode = mode === 'create'
  const isEditMode = mode === 'edit'
  const isFormMode = isCreateMode || isEditMode

  // 기본 이슈 데이터 생성
  const defaultIssue: Issue = {
    id: '',
    key: `HYDRA-${Math.floor(Math.random() * 1000)}`,
    title: '',
    type: 'feature',
    created: new Date(),
    updated: new Date(),
    reporter: {
      name: 'Current User',
      avatar: 'https://ui-avatars.com/api/?name=User',
      email: 'user@example.com'
    },
    assignee: 'Unassigned',
    state: 'in_progress',
    description: '',
    priority: 'medium',
    tags: []
  }

  // 폼 상태 관리
  const [formData, setFormData] = useState<Issue>(issue || defaultIssue)

  // issue prop이 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (issue) {
      setFormData(issue)
    } else {
      setFormData(defaultIssue)
    }
  }, [issue, defaultIssue])

  // 입력 필드 변경 핸들러
  const handleChange = (field: keyof Issue, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // 저장 핸들러
  const handleSave = () => {
    if (onSave) {
      onSave({
        ...formData,
        updated: new Date()
      })
    }
    onOpenChange(false)
  }

  // 편집 모드로 전환
  const handleEdit = () => {
    // 뷰 모드에서 편집 모드로 전환
    if (mode === 'view' && issue) {
      onOpenChange(true)
      // 만약 mode prop을 직접 수정할 수 없다면, 부모 컴포넌트에서 모드 변경 로직을 구현해야 합니다.
    }
  }

  if (!isCreateMode && !issue) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <div className='flex items-center gap-2 mb-1'>
            {isFormMode ? (
              <Input value={formData.key} onChange={(e) => handleChange('key', e.target.value)} className='w-32' />
            ) : (
              <Badge variant='outline'>{formData.key}</Badge>
            )}
          </div>
          <DialogTitle className='text-xl'>
            {isFormMode ? (
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className='w-full mt-2'
                placeholder={t('placeholder.title')}
              />
            ) : (
              formData.title
            )}
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {isFormMode ? (
            <>
              <div className='grid gap-2'>
                <Label htmlFor='type'>{t('label.type')}</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value as IssueType)}>
                  <SelectTrigger id='type'>
                    <SelectValue placeholder={t('placeholder.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bug'>{tc('type.bug')}</SelectItem>
                    <SelectItem value='feature'>{tc('type.feature')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='assignee'>{t('label.assignee')}</Label>
                <Input
                  id='assignee'
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  placeholder={t('placeholder.assigneeName')}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='state'>{t('label.status')}</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange('state', value as IssueState)}>
                  <SelectTrigger id='state'>
                    <SelectValue placeholder={t('placeholder.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='in_progress'>{tc('status.in_progress')}</SelectItem>
                    <SelectItem value='done'>{tc('status.done')}</SelectItem>
                    <SelectItem value='blocked'>{tc('status.blocked')}</SelectItem>
                    <SelectItem value='review'>{tc('status.review')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='priority'>{t('label.priority')}</Label>
                <Select
                  value={formData.priority || 'medium'}
                  onValueChange={(value) => handleChange('priority', value as IssuePriority)}
                >
                  <SelectTrigger id='priority'>
                    <SelectValue placeholder={t('placeholder.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>{tc('priority.low')}</SelectItem>
                    <SelectItem value='medium'>{tc('priority.medium')}</SelectItem>
                    <SelectItem value='high'>{tc('priority.high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='description'>{t('label.description')}</Label>
                <Textarea
                  id='description'
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={t('placeholder.detailedDescription')}
                  rows={5}
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow
                label={tc('label.assignee')}
                value={
                  <Badge variant='outline' className='font-normal'>
                    {formData.assignee}
                  </Badge>
                }
              />
              <InfoRow label={tc('label.status')} value={<IssueBadge state={formData.state} variant='subtle' />} />
              <InfoRow
                label={tc('label.reporter')}
                value={
                  <UserAvatar
                    name={formData.reporter.name}
                    avatar={formData.reporter.avatar}
                    email={formData.reporter.email}
                    showInfo={!!formData.reporter.email}
                    size='sm'
                  />
                }
              />
              <InfoRow label={tc('label.created')} value={formatDate(formData.created)} />
              <InfoRow label={tc('label.updated')} value={formatDate(formData.updated)} />

              {formData.priority && (
                <InfoRow
                  label={tc('label.priority')}
                  value={
                    <Badge
                      variant='subtle'
                      colorScheme={
                        formData.priority === 'high' ? 'red' : formData.priority === 'medium' ? 'yellow' : 'green'
                      }
                    >
                      {formData.priority}
                    </Badge>
                  }
                />
              )}

              {formData.description && (
                <div className='mt-4'>
                  <h4 className='font-medium mb-2'>{tc('label.description')}</h4>
                  <div className='p-4 bg-gray-50 rounded-md'>{formData.description}</div>
                </div>
              )}
            </>
          )}
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {tc('button.cancel')}
          </Button>
          {isFormMode ? (
            <Button onClick={handleSave}>{isCreateMode ? tc('button.create') : tc('button.save')}</Button>
          ) : (
            <Button onClick={handleEdit}>{t('button.edit')}</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
