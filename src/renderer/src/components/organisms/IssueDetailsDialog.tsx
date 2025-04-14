import { useState, useEffect } from 'react'
import { formatDate } from '@lib/utils'
import { Button } from '@atoms/Button'
import { Badge } from '@atoms/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@atoms/Dialog'
import { InfoRow } from '@molecules/InfoRow'
import { UserAvatar } from '@molecules/UserAvatar'
import { IssueBadge, IssueState } from '@molecules/IssueBadge'
import { Input } from '@atoms/Input'
import { Label } from '@atoms/Label'
import { Textarea } from '@atoms/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@atoms/Select'
import type { IssueDetailsDialogProps } from '@/types/dialog'
import type { Issue, IssueCategory, IssuePriority } from '@/types/issue'

export function IssueDetailsDialog({ 
  issue, 
  open, 
  onOpenChange,
  mode = issue ? 'view' : 'create',
  onSave
}: IssueDetailsDialogProps) {
  const isCreateMode = mode === 'create'
  const isEditMode = mode === 'edit'
  const isFormMode = isCreateMode || isEditMode

  // 기본 이슈 데이터 생성
  const defaultIssue: Issue = {
    id: '',
    key: 'HYDRA-' + Math.floor(Math.random() * 1000),
    title: '',
    category: 'feature',
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
  }, [issue])

  // 입력 필드 변경 핸들러
  const handleChange = (field: keyof Issue, value: any) => {
    setFormData(prev => ({
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {isFormMode ? (
              <Input 
                value={formData.key} 
                onChange={(e) => handleChange('key', e.target.value)}
                className="w-32"
              />
            ) : (
              <Badge variant="outline">{formData.key}</Badge>
            )}
          </div>
          <DialogTitle className="text-xl">
            {isFormMode ? (
              <Input 
                value={formData.title} 
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full mt-2"
                placeholder="이슈 제목"
              />
            ) : (
              formData.title
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isFormMode ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleChange('category', value as IssueCategory)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">버그</SelectItem>
                    <SelectItem value="feature">기능</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee">담당자</Label>
                <Input 
                  id="assignee"
                  value={formData.assignee} 
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  placeholder="담당자 이름"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">상태</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => handleChange('state', value as IssueState)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">우선순위</Label>
                <Select 
                  value={formData.priority || 'medium'} 
                  onValueChange={(value) => handleChange('priority', value as IssuePriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="우선순위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">중간</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">설명</Label>
                <Textarea 
                  id="description"
                  value={formData.description || ''} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="이슈에 대한 상세 설명을 입력하세요"
                  rows={5}
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow
                label="Assignee"
                value={
                  <Badge variant="outline" className="font-normal">
                    {formData.assignee}
                  </Badge>
                }
              />
              <InfoRow label="Status" value={<IssueBadge state={formData.state} variant="subtle" />} />
              <InfoRow
                label="Reporter"
                value={
                  <UserAvatar
                    name={formData.reporter.name}
                    avatar={formData.reporter.avatar}
                    email={formData.reporter.email}
                    showInfo={!!formData.reporter.email}
                    size="sm"
                  />
                }
              />
              <InfoRow label="Created" value={formatDate(formData.created)} />
              <InfoRow label="Updated" value={formatDate(formData.updated)} />
              
              {formData.priority && (
                <InfoRow
                  label="Priority"
                  value={
                    <Badge 
                      variant="subtle" 
                      colorScheme={
                        formData.priority === 'high' ? 'red' : 
                        formData.priority === 'medium' ? 'yellow' : 'green'
                      }
                    >
                      {formData.priority}
                    </Badge>
                  }
                />
              )}
              
              {formData.description && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <div className="p-4 bg-gray-50 rounded-md">
                    {formData.description}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          {isFormMode ? (
            <Button onClick={handleSave}>
              {isCreateMode ? '생성' : '저장'}
            </Button>
          ) : (
            <Button onClick={handleEdit}>이슈 수정</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
