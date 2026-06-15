import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Plug, Plus, Ticket, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select'
import { Separator } from '@/components/atoms/Separator'
import { invokeApi } from '@/hooks/use-api'
import { type DbmsType, IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceConfig } from '@/types/auth'

export default function WorkspacePage() {
  const { t } = useTranslation('workspace')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const { setConnected, setCurrentWorkspace, setNeedsSetup, setUser, setAuthenticated } = useAuthStore()
  const { workspaces, addWorkspace, removeWorkspace } = useWorkspaceStore()

  const [showAddForm, setShowAddForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedWs, setSelectedWs] = useState<WorkspaceConfig | null>(null)
  const [inviteCode, setInviteCode] = useState('')

  // New workspace form state
  const [newWs, setNewWs] = useState({
    name: '',
    host: 'localhost',
    port: '5432',
    dbName: '',
    username: 'postgres',
    dbms: 'postgresql' as DbmsType,
    sslCertPath: ''
  })

  const handleDbmsChange = (dbms: DbmsType) => {
    setNewWs((prev) => ({
      ...prev,
      dbms,
      port: prev.port === '5432' || prev.port === '3306' ? (dbms === 'mysql' ? '3306' : '5432') : prev.port,
      username:
        prev.username === 'postgres' || prev.username === 'root'
          ? dbms === 'mysql'
            ? 'root'
            : 'postgres'
          : prev.username
    }))
  }

  const handleAddWorkspace = async () => {
    try {
      const data = await invokeApi(IpcChannel.WORKSPACE_SAVE, {
        name: newWs.name,
        host: newWs.host,
        port: parseInt(newWs.port, 10),
        dbName: newWs.dbName,
        username: newWs.username,
        dbms: newWs.dbms,
        sslCertPath: newWs.sslCertPath || undefined
      })
      if (data) {
        addWorkspace(data)
        setShowAddForm(false)
        setNewWs({
          name: '',
          host: 'localhost',
          port: '5432',
          dbName: '',
          username: 'postgres',
          dbms: 'postgresql',
          sslCertPath: ''
        })
        toast.success(t('toast.added'))
      }
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  const handleConnect = async (ws: WorkspaceConfig) => {
    setConnecting(true)
    try {
      const status = await invokeApi(IpcChannel.WORKSPACE_CONNECT, {
        host: ws.host,
        port: ws.port,
        dbName: ws.dbName,
        username: ws.username,
        password,
        dbms: ws.dbms,
        sslCertPath: ws.sslCertPath
      })
      if (status) {
        setConnected(true)
        setCurrentWorkspace(ws)
        setNeedsSetup(status.needsSetup)
        toast.success(t('toast.connected'))
        if (status.needsSetup) {
          navigate({ to: '/setup' })
          return
        }
        // remember-me: 유효한 세션이 있으면 로그인 건너뜀
        const session = await window.callApi(IpcChannel.AUTH_SESSION_STATUS)
        if (session?.data?.authenticated && session.data.user) {
          setUser(session.data.user)
          setAuthenticated(true)
          navigate({ to: '/' })
        } else {
          navigate({ to: '/login' })
        }
      }
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    } finally {
      setConnecting(false)
      setPassword('')
      setShowPassword(false)
      setSelectedWs(null)
    }
  }

  const handleApplyInvite = async () => {
    try {
      const data = await invokeApi(IpcChannel.INVITE_APPLY, { code: inviteCode })
      if (data) {
        setNewWs({
          name: data.workspaceName,
          host: data.host,
          port: String(data.port),
          dbName: data.dbName,
          username: '',
          dbms: data.dbms ?? 'postgresql',
          sslCertPath: ''
        })
        setShowInviteForm(false)
        setShowAddForm(true)
        setInviteCode('')
        toast.success(t('toast.inviteApplied'))
      }
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await invokeApi(IpcChannel.WORKSPACE_DELETE, { workspaceId: id })
      removeWorkspace(id)
      toast.success(t('toast.removed'))
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='w-full max-w-md space-y-section p-page'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>

        {/* Workspace List */}
        {workspaces.length > 0 && (
          <div className='space-y-2'>
            {workspaces.map((ws) => (
              <Card
                key={ws.id}
                className='bg-transparent glass-soft border-border/70 cursor-pointer hover:border-primary transition-colors'
              >
                <CardHeader className='p-4 pb-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm'>{ws.name}</CardTitle>
                    <Button variant='ghost' size='icon' className='h-6 w-6' onClick={() => handleDelete(ws.id)}>
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                  <CardDescription className='text-xs'>
                    {ws.host}:{ws.port}/{ws.dbName}
                  </CardDescription>
                  <CardDescription className='text-xs text-muted-foreground/60'>
                    {(ws as { dbms?: string }).dbms === 'mysql' ? 'MySQL 8' : 'PostgreSQL'}
                  </CardDescription>
                </CardHeader>
                {selectedWs?.id === ws.id ? (
                  <CardContent className='p-4 pt-0 space-y-2'>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('placeholder.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='pr-9'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7'
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff className='h-3.5 w-3.5' /> : <Eye className='h-3.5 w-3.5' />}
                      </Button>
                    </div>
                    <Button className='w-full' size='sm' disabled={connecting} onClick={() => handleConnect(ws)}>
                      <Plug className='h-4 w-4 mr-2' />
                      {connecting ? tc('button.connecting') : tc('button.connect')}
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent className='p-4 pt-0'>
                    <Button variant='outline' className='w-full' size='sm' onClick={() => setSelectedWs(ws)}>
                      {tc('button.connect')}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        <Separator />

        {/* Add Workspace Form */}
        {showAddForm ? (
          <Card className='bg-transparent glass-soft border-border/70'>
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='text-sm'>{t('dialog.newTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-3'>
              <div className='space-y-1'>
                <Label className='text-xs'>{t('label.name')}</Label>
                <Input
                  placeholder={t('placeholder.name')}
                  value={newWs.name}
                  onChange={(e) => setNewWs({ ...newWs, name: e.target.value })}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs'>{t('label.dbms')}</Label>
                <Select value={newWs.dbms} onValueChange={(v) => handleDbmsChange(v as DbmsType)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='postgresql'>PostgreSQL</SelectItem>
                    <SelectItem value='mysql'>MySQL 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-2 space-y-1'>
                  <Label className='text-xs'>{t('label.host')}</Label>
                  <Input
                    placeholder={t('placeholder.host')}
                    value={newWs.host}
                    onChange={(e) => setNewWs({ ...newWs, host: e.target.value })}
                  />
                </div>
                <div className='space-y-1'>
                  <Label className='text-xs'>{t('label.port')}</Label>
                  <Input
                    placeholder={t('placeholder.port')}
                    value={newWs.port}
                    onChange={(e) => setNewWs({ ...newWs, port: e.target.value })}
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs'>{t('label.database')}</Label>
                <Input
                  placeholder={t('placeholder.database')}
                  value={newWs.dbName}
                  onChange={(e) => setNewWs({ ...newWs, dbName: e.target.value })}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs'>{t('label.username')}</Label>
                <Input
                  placeholder={t('placeholder.username')}
                  value={newWs.username}
                  onChange={(e) => setNewWs({ ...newWs, username: e.target.value })}
                />
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' className='flex-1' onClick={() => setShowAddForm(false)}>
                  {tc('button.cancel')}
                </Button>
                <Button className='flex-1' onClick={handleAddWorkspace}>
                  {tc('button.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : showInviteForm ? (
          <Card className='bg-transparent glass-soft border-border/70'>
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='text-sm'>{t('dialog.inviteTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-3'>
              <Input
                placeholder={t('placeholder.inviteCode')}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <div className='flex gap-2'>
                <Button variant='outline' className='flex-1' onClick={() => setShowInviteForm(false)}>
                  {tc('button.cancel')}
                </Button>
                <Button className='flex-1' onClick={handleApplyInvite}>
                  {tc('button.apply')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-2'>
            <Button variant='outline' className='w-full' onClick={() => setShowAddForm(true)}>
              <Plus className='h-4 w-4 mr-2' />
              {t('button.addWorkspace')}
            </Button>
            <Button variant='ghost' className='w-full' onClick={() => setShowInviteForm(true)}>
              <Ticket className='h-4 w-4 mr-2' />
              {t('button.useInviteCode')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
