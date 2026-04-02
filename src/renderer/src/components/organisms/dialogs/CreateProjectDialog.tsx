import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('project')
  const { t: tc } = useTranslation('common')
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
      toast.error(t('validation.enterName'))
      return
    }

    if (!projectKey.trim()) {
      toast.error(t('validation.enterKey'))
      return
    }

    if (!keyValid) {
      toast.error(t('validation.invalidKey'))
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
        toast.error(t('toast.createFailed'))
        handleClear()
        return
      }

      // Update project list
      if (result.data && projects) {
        setProjects([...projects, result.data])

        toast.success(t('toast.created'))
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
          <InputField id='project-name' label={t('label.name')}>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t('placeholder.name')}
              autoFocus
              maxLength={50}
            />
          </InputField>

          <InputField id='project-key' label={t('label.key')}>
            <div className='relative'>
              <Input
                value={projectKey}
                onChange={handleKeyChange}
                placeholder={t('placeholder.key')}
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
              <span>{t('placeholder.keyHelp')}</span>
            </p>
          </InputField>
        </div>
      </div>

      <div>
        <InputField id='project-desc' label={t('label.description')}>
          <Textarea
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            placeholder={t('placeholder.description')}
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
        {tc('button.cancel')}
      </Button>
      <Button type='submit' loading={isLoading} disabled={isLoading || !projectName.trim() || !keyValid}>
        {tc('button.create')}
      </Button>
    </>
  )

  return (
    <DialogTemplate
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialog.createTitle')}
      description={t('dialog.createDescription')}
      onSubmit={handleSubmit}
      footer={dialogFooter}
      maxWidthClass='sm:max-w-[500px]'
    >
      {dialogContent}
    </DialogTemplate>
  )
}
