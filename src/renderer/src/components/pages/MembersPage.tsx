import { Copy, LinkIcon, Loader2, Trash2, UserPlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/Dialog'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { Textarea } from '@/atoms/Textarea'
import type { User as UserRecord } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

function generateDbRoleName(userName: string): string {
  const sanitized = userName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
  return `hydra_${sanitized}`
}

function formatDate(date: Date | string | null): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function MembersPage() {
  const [members, setMembers] = useState<UserRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentWorkspace } = useAuthStore()

  // Add member form state
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [dbRoleName, setDbRoleName] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member')

  // Invite state
  const [expiresInHours, setExpiresInHours] = useState('24')
  const [inviteCode, setInviteCode] = useState('')

  const loadMembers = useCallback(async () => {
    setIsLoading(true)
    const result = await window.callApi(IpcChannel.AUTH_LIST_USERS, undefined)
    if (Array.isArray(result.data)) {
      setMembers(result.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  // Auto-generate dbRoleName when userName changes
  useEffect(() => {
    setDbRoleName(generateDbRoleName(userName))
  }, [userName])

  const resetAddForm = () => {
    setUserName('')
    setUserEmail('')
    setDbRoleName('')
    setDbPassword('')
    setUserRole('member')
  }

  const handleAddMember = async () => {
    if (!userName.trim()) {
      toast.error('Please enter a user name')
      return
    }
    if (!userEmail.trim()) {
      toast.error('Please enter an email')
      return
    }
    if (!dbPassword.trim()) {
      toast.error('Please enter a database password')
      return
    }

    setIsSubmitting(true)
    const result = await window.callApi(IpcChannel.AUTH_CREATE_MEMBER, {
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      dbRoleName: dbRoleName.trim(),
      dbPassword: dbPassword.trim(),
      userRole
    })
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error.message || 'Failed to add member')
      return
    }

    toast.success('Member added successfully')
    setIsAddOpen(false)
    resetAddForm()
    loadMembers()
  }

  const handleConfirmDelete = (member: UserRecord) => {
    setDeleteTarget(member)
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsSubmitting(true)
    const result = await window.callApi(IpcChannel.AUTH_DELETE_USER, {
      id: deleteTarget.user_id,
      shouldSoftDelete: false
    })
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error.message || 'Failed to remove member')
      return
    }

    toast.success('Member removed successfully')
    setIsDeleteOpen(false)
    setDeleteTarget(null)
    loadMembers()
  }

  const handleGenerateInvite = async () => {
    if (!currentWorkspace) {
      toast.error('No workspace connected')
      return
    }

    setIsSubmitting(true)
    const result = await window.callApi(IpcChannel.INVITE_GENERATE, {
      workspaceName: currentWorkspace.name,
      host: currentWorkspace.host,
      port: currentWorkspace.port,
      dbName: currentWorkspace.dbName,
      expiresInHours: Number(expiresInHours)
    })
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error.message || 'Failed to generate invite code')
      return
    }

    if (result.data) {
      setInviteCode(result.data.code)
    }
  }

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(inviteCode)
    toast.success('Invite code copied to clipboard')
  }

  const handleCloseInvite = () => {
    setIsInviteOpen(false)
    setInviteCode('')
    setExpiresInHours('24')
  }

  return (
    <div className='p-6 h-full overflow-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Members</h1>
          <p className='text-sm text-muted-foreground mt-1'>Manage workspace members and invite new users</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setIsInviteOpen(true)}>
            <LinkIcon className='size-4 mr-2' />
            Generate Invite
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className='size-4 mr-2' />
            Add Member
          </Button>
        </div>
      </div>

      {/* Member list */}
      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
        </div>
      ) : members.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
          <p className='text-lg font-medium'>No members found</p>
          <p className='text-sm mt-1'>Add a member to get started</p>
        </div>
      ) : (
        <div className='rounded-lg border'>
          {members.map((member) => (
            <div key={member.user_id} className='flex items-center justify-between p-4 border-b last:border-b-0'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0'>
                  {(member.user_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className='font-medium'>{member.user_name || 'Unknown'}</p>
                  <p className='text-sm text-muted-foreground'>{member.user_email || '-'}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm text-muted-foreground hidden sm:inline'>
                  {formatDate(member.user_created_at)}
                </span>
                <Badge variant='subtle' size='sm' colorScheme={member.user_role === 'admin' ? 'purple' : 'blue'}>
                  {member.user_role}
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-destructive hover:text-destructive'
                  onClick={() => handleConfirmDelete(member)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Dialog */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!open) resetAddForm()
          setIsAddOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>Create a new member with a PostgreSQL database role.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='userName'>Name</Label>
              <Input
                id='userName'
                placeholder='John Doe'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='userEmail'>Email</Label>
              <Input
                id='userEmail'
                type='email'
                placeholder='john@example.com'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='dbRoleName'>Database Role</Label>
              <Input
                id='dbRoleName'
                placeholder='hydra_johndoe'
                value={dbRoleName}
                onChange={(e) => setDbRoleName(e.target.value)}
              />
              <p className='text-xs text-muted-foreground'>
                Auto-generated from name. This will be the PostgreSQL role name.
              </p>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='dbPassword'>Database Password</Label>
              <Input
                id='dbPassword'
                type='password'
                placeholder='Enter a secure password'
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='userRole'>Role</Label>
              <Select value={userRole} onValueChange={(v) => setUserRole(v as 'admin' | 'member')}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='member'>Member</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsAddOpen(false)
                resetAddForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <span className='font-medium text-foreground'>{deleteTarget?.user_name || 'this member'}</span>? This will
              also remove the associated PostgreSQL role. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Invite Dialog */}
      <Dialog
        open={isInviteOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseInvite()
          else setIsInviteOpen(true)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invite Code</DialogTitle>
            <DialogDescription>
              Create an invite code that others can use to connect to this workspace.
            </DialogDescription>
          </DialogHeader>
          {inviteCode ? (
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label>Invite Code</Label>
                <Textarea readOnly value={inviteCode} className='font-mono text-xs min-h-[80px]' />
              </div>
              <Button onClick={handleCopyInvite} className='w-full'>
                <Copy className='size-4 mr-2' />
                Copy to Clipboard
              </Button>
            </div>
          ) : (
            <>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label>Expiration</Label>
                  <Select value={expiresInHours} onValueChange={setExpiresInHours}>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='24'>24 hours</SelectItem>
                      <SelectItem value='48'>48 hours</SelectItem>
                      <SelectItem value='72'>72 hours</SelectItem>
                      <SelectItem value='168'>1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={handleCloseInvite}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateInvite} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
                  Generate
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
