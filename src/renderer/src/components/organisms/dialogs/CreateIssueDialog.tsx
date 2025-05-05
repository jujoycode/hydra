import { useState, useEffect } from 'react'
import { useProject } from '@/hooks/use-project'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Textarea } from '@/atoms/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/atoms/Dialog'
import { User2, CircleDot, TriangleAlert, ChevronsUp, ChevronUp, ChevronDown } from 'lucide-react'
import type { IssuePriority } from '@/types/issue'
import type { Project } from '@/interface/CoreInterface'

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function CreateIssueDialog({ open, onOpenChange, userId }: CreateIssueDialogProps) {
  // 프로젝트 상태 관리
  const { projects } = useProject()

  // 이슈 생성 폼 상태 관리
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [issueType, setIssueType] = useState<'bug' | 'feature'>('feature')
  const [assignee, setAssignee] = useState<string>(userId) // 기본값으로 현재 사용자 설정
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  }, [open, userId])

  // 이슈 생성 제출 처리
  const handleSubmit = async () => {
    if (!selectedProject) {
      toast.error('프로젝트를 선택해주세요')
      return
    }

    if (!title.trim()) {
      toast.error('이슈 제목을 입력해주세요')
      return
    }

    setIsSubmitting(true)

    try {
      // 이슈 데이터 생성
      const issueData = {
        projectId: selectedProject,
        title,
        category: issueType,
        assignee,
        priority,
        description,
        reporterId: userId
      }

      // TODO: 실제 이슈 생성 API 호출
      // await createIssue(issueData)

      console.log('이슈 생성:', issueData)

      toast.success('이슈가 성공적으로 생성되었습니다')
      onOpenChange(false)
    } catch (error) {
      console.error('이슈 생성 실패:', error)
      toast.error('이슈 생성에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>새 이슈 생성</DialogTitle>
          <DialogDescription>이슈의 세부 정보를 입력하여 새 이슈를 생성합니다.</DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          {/* 프로젝트 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='project' className='text-right'>
              프로젝트
            </Label>
            <div className='col-span-3'>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='프로젝트 선택' />
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
              이슈 타입
            </Label>
            <div className='col-span-3'>
              <Select value={issueType} onValueChange={(value: 'bug' | 'feature') => setIssueType(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='이슈 타입 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='bug'>
                    <div className='flex items-center'>
                      <TriangleAlert size={16} className='mr-2 text-red-500' />
                      버그
                    </div>
                  </SelectItem>
                  <SelectItem value='feature'>
                    <div className='flex items-center'>
                      <CircleDot size={16} className='mr-2 text-green-500' />
                      기능
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 담당자 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='assignee' className='text-right'>
              담당자
            </Label>
            <div className='col-span-3'>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='담당자 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={userId}>
                    <div className='flex items-center'>
                      <User2 size={16} className='mr-2' />
                      나에게 할당
                    </div>
                  </SelectItem>
                  {/* TODO: 프로젝트 멤버 목록 표시 */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 우선순위 선택 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='priority' className='text-right'>
              우선순위
            </Label>
            <div className='col-span-3'>
              <Select value={priority} onValueChange={(value: IssuePriority) => setPriority(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='우선순위 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='high'>
                    <div className='flex items-center'>
                      <ChevronsUp size={16} className='mr-2 text-red-500' />
                      높음
                    </div>
                  </SelectItem>
                  <SelectItem value='medium'>
                    <div className='flex items-center'>
                      <div className='relative flex flex-col mr-2'>
                        <ChevronUp size={16} className='text-yellow-500 -mb-[10px]' />
                        <ChevronDown size={16} className='text-yellow-500' />
                      </div>
                      중간
                    </div>
                  </SelectItem>
                  <SelectItem value='low'>
                    <div className='flex items-center'>
                      <ChevronDown size={16} className='mr-2 text-green-500' />
                      낮음
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 이슈 제목 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              제목
            </Label>
            <div className='col-span-3'>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='이슈 제목을 입력하세요'
                className='w-full'
              />
            </div>
          </div>

          {/* 내용 텍스트 에어리어 */}
          <div className='grid grid-cols-4 gap-4'>
            <Label htmlFor='description' className='text-right pt-2'>
              내용
            </Label>
            <div className='col-span-3'>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='이슈에 대한 설명을 작성해주세요...'
                className='min-h-[240px] resize-y'
              />
              <p className='text-xs text-muted-foreground mt-1'>
                * EditorJS 기능은 업데이트 예정입니다. 현재는 기본 텍스트 편집만 가능합니다.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '생성 중...' : '이슈 생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
