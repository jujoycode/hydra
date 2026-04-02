import { useNavigate } from '@tanstack/react-router'
import { Plug, Plus, Ticket, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Separator } from '@/components/atoms/Separator'
import { useIpcHandler } from '@/hooks/use-ipc'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceConfig } from '@/types/auth'

export default function WorkspacePage() {
  const navigate = useNavigate()
  const { setUser, setConnected, setCurrentWorkspace } = useAuthStore()
  const { workspaces, addWorkspace, removeWorkspace } = useWorkspaceStore()

  const saveWorkspace = useIpcHandler(IpcChannel.WORKSPACE_SAVE)
  const deleteWorkspace = useIpcHandler(IpcChannel.WORKSPACE_DELETE)
  const connectWorkspace = useIpcHandler(IpcChannel.WORKSPACE_CONNECT)
  const applyInvite = useIpcHandler(IpcChannel.INVITE_APPLY)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedWs, setSelectedWs] = useState<WorkspaceConfig | null>(null)
  const [inviteCode, setInviteCode] = useState('')

  // New workspace form state
  const [newWs, setNewWs] = useState({
    name: '',
    host: 'localhost',
    port: '5432',
    dbName: '',
    username: 'postgres',
    sslCertPath: ''
  })

  const handleAddWorkspace = async () => {
    const result = await saveWorkspace({
      name: newWs.name,
      host: newWs.host,
      port: parseInt(newWs.port, 10),
      dbName: newWs.dbName,
      username: newWs.username,
      sslCertPath: newWs.sslCertPath || undefined
    })
    if (result.data) {
      addWorkspace(result.data)
      setShowAddForm(false)
      setNewWs({ name: '', host: 'localhost', port: '5432', dbName: '', username: 'postgres', sslCertPath: '' })
      toast.success('Workspace added')
    }
  }

  const handleConnect = async (ws: WorkspaceConfig) => {
    setConnecting(true)
    try {
      const result = await connectWorkspace({
        host: ws.host,
        port: ws.port,
        dbName: ws.dbName,
        username: ws.username,
        password,
        sslCertPath: ws.sslCertPath
      })
      if (result.data) {
        setConnected(true)
        setUser(result.data.user)
        setCurrentWorkspace(ws)
        toast.success('Connected to workspace')
        navigate({ to: '/' })
      }
    } finally {
      setConnecting(false)
      setPassword('')
      setSelectedWs(null)
    }
  }

  const handleApplyInvite = async () => {
    const result = await applyInvite({ code: inviteCode })
    if (result.data) {
      setNewWs({
        name: result.data.workspaceName,
        host: result.data.host,
        port: String(result.data.port),
        dbName: result.data.dbName,
        username: '',
        sslCertPath: ''
      })
      setShowInviteForm(false)
      setShowAddForm(true)
      setInviteCode('')
      toast.success('Invite code applied. Complete the connection details.')
    }
  }

  const handleDelete = async (id: string) => {
    await deleteWorkspace({ workspaceId: id })
    removeWorkspace(id)
    toast.success('Workspace removed')
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='w-full max-w-md space-y-6 p-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Hydra</h1>
          <p className='text-muted-foreground'>Select or create a workspace to get started</p>
        </div>

        {/* Workspace List */}
        {workspaces.length > 0 && (
          <div className='space-y-2'>
            {workspaces.map((ws) => (
              <Card key={ws.id} className='cursor-pointer hover:border-primary transition-colors'>
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
                </CardHeader>
                {selectedWs?.id === ws.id ? (
                  <CardContent className='p-4 pt-0 space-y-2'>
                    <Input
                      type='password'
                      placeholder='Database password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button className='w-full' size='sm' disabled={connecting} onClick={() => handleConnect(ws)}>
                      <Plug className='h-4 w-4 mr-2' />
                      {connecting ? 'Connecting...' : 'Connect'}
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent className='p-4 pt-0'>
                    <Button variant='outline' className='w-full' size='sm' onClick={() => setSelectedWs(ws)}>
                      Connect
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
          <Card>
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='text-sm'>New Workspace</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-3'>
              <div className='space-y-1'>
                <Label className='text-xs'>Name</Label>
                <Input
                  placeholder='My Workspace'
                  value={newWs.name}
                  onChange={(e) => setNewWs({ ...newWs, name: e.target.value })}
                />
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-2 space-y-1'>
                  <Label className='text-xs'>Host</Label>
                  <Input
                    placeholder='localhost'
                    value={newWs.host}
                    onChange={(e) => setNewWs({ ...newWs, host: e.target.value })}
                  />
                </div>
                <div className='space-y-1'>
                  <Label className='text-xs'>Port</Label>
                  <Input
                    placeholder='5432'
                    value={newWs.port}
                    onChange={(e) => setNewWs({ ...newWs, port: e.target.value })}
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs'>Database</Label>
                <Input
                  placeholder='hydra'
                  value={newWs.dbName}
                  onChange={(e) => setNewWs({ ...newWs, dbName: e.target.value })}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs'>Username</Label>
                <Input
                  placeholder='postgres'
                  value={newWs.username}
                  onChange={(e) => setNewWs({ ...newWs, username: e.target.value })}
                />
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' className='flex-1' onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button className='flex-1' onClick={handleAddWorkspace}>
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : showInviteForm ? (
          <Card>
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='text-sm'>Enter Invite Code</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-3'>
              <Input
                placeholder='Paste invite code here'
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <div className='flex gap-2'>
                <Button variant='outline' className='flex-1' onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
                <Button className='flex-1' onClick={handleApplyInvite}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-2'>
            <Button variant='outline' className='w-full' onClick={() => setShowAddForm(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Add Workspace
            </Button>
            <Button variant='ghost' className='w-full' onClick={() => setShowInviteForm(true)}>
              <Ticket className='h-4 w-4 mr-2' />
              Use Invite Code
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
