import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Textarea } from '@/components/atoms/Textarea'
import { useAuth } from '@/hooks/use-auth'
import { useProjectDetail, useProjectMutations } from '@/hooks/use-project-detail'
import type { Project } from '@/interface/CoreInterface'

// 폼은 로드된 프로젝트를 초기값으로 받아 마운트 시 1회 초기화한다(useEffect로 서버→폼 동기화하지 않음).
function ProjectSettingsForm({ project }: { project: Project }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { update, remove } = useProjectMutations(project.project_id)

  const [name, setName] = useState(project.project_name)
  const [desc, setDesc] = useState(project.project_desc || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    if (!user) return
    try {
      await update.mutateAsync({
        projectId: project.project_id,
        userId: user.user_id,
        projectName: name,
        projectKey: project.project_key,
        projectDesc: desc
      })
      toast.success('Project updated')
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  const handleDelete = async () => {
    if (!user) return
    try {
      await remove.mutateAsync({ projectId: project.project_id, userId: user.user_id })
      toast.success('Project deleted')
      navigate({ to: '/projects' })
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  return (
    <div className='p-6 h-full overflow-auto max-w-2xl'>
      <h1 className='text-2xl font-bold mb-6'>Project Settings</h1>

      {/* General */}
      <div className='space-y-4 mb-8'>
        <h2 className='text-lg font-semibold'>General</h2>
        <div>
          <Label className='mb-1 block'>Project Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label className='mb-1 block'>Project Key</Label>
          <Input value={project.project_key} disabled className='opacity-60' />
          <p className='text-xs text-muted-foreground mt-1'>Project key cannot be changed after creation</p>
        </div>
        <div>
          <Label className='mb-1 block'>Description</Label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder='Project description...'
            className='min-h-[100px]'
          />
        </div>
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className='border border-destructive/50 rounded-lg p-4'>
        <h2 className='text-lg font-semibold text-destructive mb-2'>Danger Zone</h2>
        <p className='text-sm text-muted-foreground mb-4'>
          Once you delete a project, there is no going back. This will permanently delete the project and all associated
          data.
        </p>
        {showDeleteConfirm ? (
          <div className='flex items-center gap-2'>
            <p className='text-sm text-destructive font-medium'>Are you sure?</p>
            <Button variant='destructive' size='sm' onClick={handleDelete} disabled={remove.isPending}>
              Yes, delete
            </Button>
            <Button variant='outline' size='sm' onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant='destructive' onClick={() => setShowDeleteConfirm(true)}>
            Delete Project
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ProjectSettingsPage() {
  const { projectId } = useParams({ strict: false })
  const { data: project, isLoading } = useProjectDetail(projectId)

  if (isLoading)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  if (!project)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Project not found</p>
      </div>
    )

  return <ProjectSettingsForm project={project} />
}
