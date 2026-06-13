import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Textarea } from '@/components/atoms/Textarea'
import { useAuth } from '@/hooks/use-auth'
import type { Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'

export default function ProjectSettingsPage() {
  const { projectId } = useParams({ strict: false })
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Editable fields
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setIsLoading(true)
      const result = await window.callApi(IpcChannel.PROJECT_GET, { projectId })
      const data = result.data as Project | null
      if (data) {
        setProject(data)
        setName(data.project_name)
        setDesc(data.project_desc || '')
      }
      setIsLoading(false)
    }
    load()
  }, [projectId])

  const handleSave = async () => {
    if (!project || !user) return
    setIsSaving(true)
    const result = await window.callApi(IpcChannel.PROJECT_UPDATE, {
      projectId: project.project_id,
      userId: user.user_id,
      projectName: name,
      projectKey: project.project_key,
      projectDesc: desc
    })
    if (result.error) {
      toast.error(`Failed: ${result.error.message}`)
    } else {
      toast.success('Project updated')
      setProject(result.data as Project)
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!project || !user) return
    const result = await window.callApi(IpcChannel.PROJECT_DELETE, {
      projectId: project.project_id,
      userId: user.user_id
    })
    if (result.error) {
      toast.error(`Failed: ${result.error.message}`)
    } else {
      toast.success('Project deleted')
      navigate({ to: '/projects' })
    }
  }

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
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
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
            <Button variant='destructive' size='sm' onClick={handleDelete}>
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
