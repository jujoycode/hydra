import { Github, Send, Slack } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/atoms/Button'
import { Checkbox } from '@/atoms/Checkbox'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { useIntegrationMutations, useIntegrations } from '@/hooks/use-integrations'
import type { Integration as IntegrationRecord } from '@/interface/CoreInterface'
import { SettingCard } from '@/molecules/cards/SettingCard'

function parseConfig(record: IntegrationRecord | undefined): Record<string, string> {
  if (!record) return {}
  try {
    return JSON.parse(record.integration_config)
  } catch {
    return {}
  }
}

// 폼은 로드된 레코드를 초기값으로 받아 마운트 시 1회 초기화한다(useEffect로 서버→폼 동기화하지 않음).
function IntegrationForm({ records }: { records: IntegrationRecord[] }) {
  const { save, testSlack } = useIntegrationMutations()

  const slack = records.find((i) => i.integration_type === 'slack')
  const github = records.find((i) => i.integration_type === 'github')
  const slackConfig = parseConfig(slack)
  const githubConfig = parseConfig(github)

  const [slackUrl, setSlackUrl] = useState(slackConfig.webhookUrl ?? '')
  const [slackEnabled, setSlackEnabled] = useState(slack?.integration_enabled ?? false)
  const [githubToken, setGithubToken] = useState(githubConfig.token ?? '')
  const [githubRepo, setGithubRepo] = useState(githubConfig.repo ?? '')
  const [githubEnabled, setGithubEnabled] = useState(github?.integration_enabled ?? false)

  const handleSaveSlack = async () => {
    try {
      await save.mutateAsync({
        integrationType: 'slack',
        integrationConfig: JSON.stringify({ webhookUrl: slackUrl }),
        integrationEnabled: slackEnabled
      })
      toast.success('Slack settings saved')
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  const handleTestSlack = async () => {
    if (!slackUrl.trim()) {
      toast.error('Enter a webhook URL first')
      return
    }
    const ok = await testSlack.mutateAsync({ webhookUrl: slackUrl }).catch(() => false)
    if (ok) toast.success('Test message sent to Slack!')
  }

  const handleSaveGithub = async () => {
    try {
      await save.mutateAsync({
        integrationType: 'github',
        integrationConfig: JSON.stringify({ token: githubToken, repo: githubRepo }),
        integrationEnabled: githubEnabled
      })
      toast.success('GitHub settings saved')
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  return (
    <div className='w-full space-y-6'>
      {/* Slack */}
      <SettingCard title='Slack Integration' description='Send notifications to a Slack channel via incoming webhook'>
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
            <Button onClick={handleSaveSlack} disabled={save.isPending} size='sm'>
              {save.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handleTestSlack}
              disabled={testSlack.isPending || !slackUrl.trim()}
              variant='outline'
              size='sm'
            >
              <Send className='size-3 mr-1' />
              {testSlack.isPending ? 'Sending...' : 'Test'}
            </Button>
          </div>
        </div>
      </SettingCard>

      {/* GitHub */}
      <SettingCard title='GitHub Integration' description='Connect to a GitHub repository for issue synchronization'>
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
            <p className='text-xs text-muted-foreground mt-1'>Format: owner/repo (e.g., jujoycode/hydra)</p>
          </div>

          <Button onClick={handleSaveGithub} disabled={save.isPending} size='sm'>
            {save.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </SettingCard>
    </div>
  )
}

export default function IntegrationPage() {
  const { data: records = [], isLoading } = useIntegrations()

  if (isLoading) {
    return (
      <div className='w-full p-6'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  }

  return <IntegrationForm records={records} />
}
