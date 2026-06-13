import { ChevronDown, ChevronsUp, ChevronUp, CircleDot, TriangleAlert, User2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/Dialog'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { Textarea } from '@/atoms/Textarea'
import { useProjectMembers } from '@/hooks/use-members'
import { useProject } from '@/hooks/use-project'
import type { Issue as IssueRecord, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { useIssueStore } from '@/stores/issue'
import type { IssuePriority } from '@/types/issue'

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function CreateIssueDialog({ open, onOpenChange, userId }: CreateIssueDialogProps) {
  const { t } = useTranslation('issue')
  const { t: tc } = useTranslation('common')
  // 프로젝트 상태 관리
  const { projects } = useProject()

  // 이슈 store — 생성 성공 시 캐시된 리스트 갱신
  const issues = useIssueStore((state) => state.issues)
  const setIssues = useIssueStore((state) => state.setIssues)

  // 이슈 생성 폼 상태 관리
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [issueType, setIssueType] = useState<'bug' | 'feature'>('feature')
  const [assignee, setAssignee] = useState<string>(userId) // 기본값으로 현재 사용자 설정
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 선택된 프로젝트의 멤버만 담당자 후보로 조회 (users_projects_link 기반)
  const { data: members = [] } = useProjectMembers(open ? selectedProject : undefined)

  // 다이얼로그 초기화
  const resetForm = () => {
    setSelectedProject('')
    setIssueType('feature')
    setAssignee(userId)
    setPriority('medium')
    setTitle('')
    setDescription('')
  }

  // 다이얼로그가 닫힐 때 폼 초기화
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open, resetForm])

  // 이슈 생성 제출 처리
  const handleSubmit = async () => {
    if (!selectedProject) {
      toast.error(t('validation.selectProject'))
      return
    }

    if (!title.trim()) {
      toast.error(t('validation.enterTitle'))
      return
    }

    setIsSubmitting(true)

    try {
      const selectedProjectObj = projects?.find((p: Project) => p.project_id === selectedProject)
      if (!selectedProjectObj) return

      const issueKey = `${selectedProjectObj.project_key}-${Date.now().toString(36).toUpperCase()}`

      const result = await window.callApi(IpcChannel.ISSUE_CREATE, {
        issueId: '',
        projectId: selectedProject,
        issueKey,
        issueTitle: title,
        issueDesc: description,
        userId,
        issuePriority: priority,
        issueCategory: issueType,
        assignedTo: assignee
      })

      if (result.error) {
        toast.error(t('toast.createFailed', { error: result.error.message }))
        return
      }

      // 캐시된 이슈 리스트에 신규 이슈 prepend (있을 때만)
      if (result.data && issues) {
        setIssues([result.data as IssueRecord, ...issues])
      }

      toast.success(t('toast.created'))
      onOpenChange(false)
    } catch (error) {
      console.error('Issue creation failed:', error)
      toast.error(t('toast.createError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
          <DialogDescription>{t('dialog.createDescription')}</DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          {/* 프로젝트 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='project' className='text-right'>
              {t('label.project')}
            </Label>
            <div className='col-span-3'>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('placeholder.selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project: Project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>
                      {project.project_name} ({project.project_key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 이슈 타입 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='type' className='text-right'>
              {t('label.type')}
            </Label>
            <div className='col-span-3'>
              <Select value={issueType} onValueChange={(value: 'bug' | 'feature') => setIssueType(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('placeholder.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='bug'>
                    <div className='flex items-center'>
                      <TriangleAlert size={16} className='mr-2 text-destructive' />
                      {tc('type.bug')}
                    </div>
                  </SelectItem>
                  <SelectItem value='feature'>
                    <div className='flex items-center'>
                      <CircleDot size={16} className='mr-2 text-mc-green' />
                      {tc('type.feature')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 담당자 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='assignee' className='text-right'>
              {t('label.assignee')}
            </Label>
            <div className='col-span-3'>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('placeholder.selectAssignee')} />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      <div className='flex items-center'>
                        <User2 size={16} className='mr-2' />
                        {member.user_name || member.user_email || 'Unknown'}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 우선순위 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='priority' className='text-right'>
              {t('label.priority')}
            </Label>
            <div className='col-span-3'>
              <Select value={priority} onValueChange={(value: IssuePriority) => setPriority(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('placeholder.selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='high'>
                    <div className='flex items-center'>
                      <ChevronsUp size={16} className='mr-2 text-priority-high' />
                      {tc('priority.high')}
                    </div>
                  </SelectItem>
                  <SelectItem value='medium'>
                    <div className='flex items-center'>
                      <div className='relative flex flex-col mr-2'>
                        <ChevronUp size={16} className='text-priority-medium -mb-[10px]' />
                        <ChevronDown size={16} className='text-priority-medium' />
                      </div>
                      {tc('priority.medium')}
                    </div>
                  </SelectItem>
                  <SelectItem value='low'>
                    <div className='flex items-center'>
                      <ChevronDown size={16} className='mr-2 text-priority-low' />
                      {tc('priority.low')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 이슈 제목 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              {t('label.title')}
            </Label>
            <div className='col-span-3'>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('placeholder.title')}
                className='w-full'
              />
            </div>
          </div>

          {/* 내용 텍스트 에어리어 */}
          <div className='grid grid-cols-4 gap-4'>
            <Label htmlFor='description' className='text-right pt-2'>
              {t('label.description')}
            </Label>
            <div className='col-span-3'>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('placeholder.description')}
                className='min-h-[240px] resize-y'
              />
              <p className='text-xs text-muted-foreground mt-1'>{t('help.editorNote')}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? tc('button.connecting') : t('button.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
