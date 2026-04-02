import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import { Textarea } from '@/atoms/Textarea'
import { useIpcHandler } from '@/hooks/use-ipc'
import { useProject } from '@/hooks/use-project'
import { IpcChannel } from '@/interface/CoreInterface'
import { InputField } from '@/molecules/InputField'
import { DialogTemplate } from '@/templates/DialogTemplate'

interface CreateProjectDialogProps {
  open: boolean
  userId: string
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange, userId }: CreateProjectDialogProps) {
  // state
  const [isLoading, setIsLoading] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectKey, setProjectKey] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [keyValid, setKeyValid] = useState<boolean | null>(null)

  // hook
  const { projects, setProjects } = useProject()
  const navigate = useNavigate()
  // handler
  const projectCreateHandler = useIpcHandler(IpcChannel.PROJECT_CREATE)

  // Project key validation
  useEffect(() => {
    if (!projectKey) {
      setKeyValid(null)
      return
    }

    setKeyValid(/^[A-Z]{3,5}$/.test(projectKey))
  }, [projectKey])

  const handleClear = () => {
    setProjectName('')
    setProjectKey('')
    setProjectDesc('')
    setKeyValid(null)
    onOpenChange(false)
  }

  // Convert project key to uppercase
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKey(e.target.value.toUpperCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      toast.error('Please enter a project name')
      return
    }

    if (!projectKey.trim()) {
      toast.error('Please enter a project key')
      return
    }

    if (!keyValid) {
      toast.error('Please enter a valid project key')
      return
    }

    setIsLoading(true)

    try {
      const result = await projectCreateHandler({
        projectName: projectName.trim(),
        projectKey: projectKey.trim(),
        projectDesc: projectDesc.trim(),
        userId
      })

      if (result.error) {
        toast.error('Failed to create project')
        handleClear()
        return
      }

      // Update project list
      if (result.data && projects) {
        setProjects([...projects, result.data])

        toast.success('Project created successfully')
        handleClear()

        navigate({ to: '/projects/$projectId', params: { projectId: result.data.project_id } })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const dialogContent = (
    <div className='space-y-6'>
      <div>
        <div className='space-y-4'>
          <InputField id='project-name' label='Project Name'>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder='Enter new project name'
              autoFocus
              maxLength={50}
            />
          </InputField>

          <InputField id='project-key' label='Project Key'>
            <div className='relative'>
              <Input
                value={projectKey}
                onChange={handleKeyChange}
                placeholder='ex) PRJ, HYDRA'
                maxLength={5}
                className={`uppercase ${keyValid === false ? 'border-destructive' : ''}`}
              />
              {keyValid !== null && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  {keyValid ? (
                    <CheckCircle2 className='w-4 h-4 text-green-500' />
                  ) : (
                    <AlertCircle className='w-4 h-4 text-destructive' />
                  )}
                </div>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-1 flex items-start'>
              <Info className='inline-block w-3 h-3 mr-1 mt-0.5 flex-shrink-0' />
              <span>A unique identifier for your project using 3-5 letters.</span>
            </p>
          </InputField>
        </div>
      </div>

      <div>
        <InputField id='project-desc' label='Description'>
          <Textarea
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            placeholder='Enter a brief description of the project'
            className='resize-none'
            maxLength={50}
          />
          <p className='text-xs text-right text-muted-foreground mt-1'>{projectDesc.length}/50</p>
        </InputField>
      </div>
    </div>
  )

  const dialogFooter = (
    <>
      <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
        Cancel
      </Button>
      <Button type='submit' loading={isLoading} disabled={isLoading || !projectName.trim() || !keyValid}>
        Create
      </Button>
    </>
  )

  return (
    <DialogTemplate
      open={open}
      onOpenChange={onOpenChange}
      title='Create New Project'
      description='Create a new project by providing the required information below.'
      onSubmit={handleSubmit}
      footer={dialogFooter}
      maxWidthClass='sm:max-w-[500px]'
    >
      {dialogContent}
    </DialogTemplate>
  )
}
