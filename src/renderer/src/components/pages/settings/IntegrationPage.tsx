import { Github, Send, Slack } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Checkbox } from '@/atoms/Checkbox'
import type { Integration as IntegrationRecord } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { SettingCard } from '@/molecules/cards/SettingCard'

export default function IntegrationPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Slack state
  const [slackUrl, setSlackUrl] = useState('')
  const [slackEnabled, setSlackEnabled] = useState(false)
  const [isSavingSlack, setIsSavingSlack] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  // GitHub state
  const [githubToken, setGithubToken] = useState('')
  const [githubRepo, setGithubRepo] = useState('')
  const [githubEnabled, setGithubEnabled] = useState(false)
  const [isSavingGithub, setIsSavingGithub] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setIsLoading(true)
    const result = await window.callApi(IpcChannel.INTEGRATION_LIST)
    if (Array.isArray(result.data)) {
      const records = result.data as IntegrationRecord[]
      const slack = records.find((i) => i.integration_type === 'slack')
      if (slack) {
        try {
          const config = JSON.parse(slack.integration_config)
          setSlackUrl(config.webhookUrl || '')
        } catch {}
        setSlackEnabled(slack.integration_enabled ?? false)
      }
      const github = records.find((i) => i.integration_type === 'github')
      if (github) {
        try {
          const config = JSON.parse(github.integration_config)
          setGithubToken(config.token || '')
          setGithubRepo(config.repo || '')
        } catch {}
        setGithubEnabled(github.integration_enabled ?? false)
      }
    }
    setIsLoading(false)
  }

  const handleSaveSlack = async () => {
    setIsSavingSlack(true)
    const result = await window.callApi(IpcChannel.INTEGRATION_SAVE, {
      integrationType: 'slack',
      integrationConfig: JSON.stringify({ webhookUrl: slackUrl }),
      integrationEnabled: slackEnabled
    })
    if (result.error) {
      toast.error(`Failed: ${result.error.message}`)
    } else {
      toast.success('Slack settings saved')
    }
    setIsSavingSlack(false)
  }

  const handleTestSlack = async () => {
    if (!slackUrl.trim()) {
      toast.error('Enter a webhook URL first')
      return
    }
    setIsTesting(true)
    const result = await window.callApi(IpcChannel.INTEGRATION_TEST_SLACK, { webhookUrl: slackUrl })
    if (result.data) {
      toast.success('Test message sent to Slack!')
    } else {
      toast.error(result.error?.message || 'Failed to send test message')
    }
    setIsTesting(false)
  }

  const handleSaveGithub = async () => {
    setIsSavingGithub(true)
    const result = await window.callApi(IpcChannel.INTEGRATION_SAVE, {
      integrationType: 'github',
      integrationConfig: JSON.stringify({ token: githubToken, repo: githubRepo }),
      integrationEnabled: githubEnabled
    })
    if (result.error) {
      toast.error(`Failed: ${result.error.message}`)
    } else {
      toast.success('GitHub settings saved')
    }
    setIsSavingGithub(false)
  }

  if (isLoading) {
    return (
      <div className='w-full p-6'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='w-full space-y-6'>
      {/* Slack */}
      <SettingCard
        title='Slack Integration'
        description='Send notifications to a Slack channel via incoming webhook'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Slack className='size-5 text-purple-600' />
              <span className='font-medium'>Slack</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>{slackEnabled ? 'Enabled' : 'Disabled'}</span>
              <Checkbox checked={slackEnabled} onCheckedChange={(v) => setSlackEnabled(v === true)} />
            </div>
          </div>

          <div>
            <Label className='mb-1 block text-sm'>Webhook URL</Label>
            <Input
              value={slackUrl}
              onChange={(e) => setSlackUrl(e.target.value)}
              placeholder='https://hooks.slack.com/services/...'
              className='font-mono text-sm'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              Create an incoming webhook in your Slack workspace settings
            </p>
          </div>

          <div className='flex gap-2'>
            <Button onClick={handleSaveSlack} disabled={isSavingSlack} size='sm'>
              {isSavingSlack ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleTestSlack} disabled={isTesting || !slackUrl.trim()} variant='outline' size='sm'>
              <Send className='size-3 mr-1' />
              {isTesting ? 'Sending...' : 'Test'}
            </Button>
          </div>
        </div>
      </SettingCard>

      {/* GitHub */}
      <SettingCard
        title='GitHub Integration'
        description='Connect to a GitHub repository for issue synchronization'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Github className='size-5' />
              <span className='font-medium'>GitHub</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>{githubEnabled ? 'Enabled' : 'Disabled'}</span>
              <Checkbox checked={githubEnabled} onCheckedChange={(v) => setGithubEnabled(v === true)} />
            </div>
          </div>

          <div>
            <Label className='mb-1 block text-sm'>Personal Access Token</Label>
            <Input
              type='password'
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder='ghp_xxxxxxxxxxxxxxxxxxxx'
              className='font-mono text-sm'
            />
          </div>

          <div>
            <Label className='mb-1 block text-sm'>Repository</Label>
            <Input
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder='owner/repository'
              className='font-mono text-sm'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              Format: owner/repo (e.g., jujoycode/hydra)
            </p>
          </div>

          <Button onClick={handleSaveGithub} disabled={isSavingGithub} size='sm'>
            {isSavingGithub ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </SettingCard>
    </div>
  )
}
