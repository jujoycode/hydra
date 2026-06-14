import { Copy, LinkIcon, Loader2, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/Dialog'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { Textarea } from '@/atoms/Textarea'
import { useUserMutations, useUsers } from '@/hooks/use-users'
import type { User as UserRecord } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

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
  const { t } = useTranslation('member')
  const { t: tc } = useTranslation('common')
  const { data: members = [], isLoading } = useUsers()
  const { createMember, deleteUser, generateInvite } = useUserMutations()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null)
  const isSubmitting = createMember.isPending || deleteUser.isPending || generateInvite.isPending
  const { currentWorkspace } = useAuthStore()

  // Add member form state
  const [userSn, setUserSn] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [initialPassword, setInitialPassword] = useState('')
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member')

  // Invite state
  const [expiresInHours, setExpiresInHours] = useState('24')
  const [inviteCode, setInviteCode] = useState('')

  const resetAddForm = () => {
    setUserSn('')
    setUserName('')
    setUserEmail('')
    setInitialPassword('')
    setUserRole('member')
  }

  const handleAddMember = async () => {
    if (!userSn.trim()) {
      toast.error(t('validation.enterUserSn'))
      return
    }
    if (!userName.trim()) {
      toast.error(t('validation.enterName'))
      return
    }
    if (!userEmail.trim()) {
      toast.error(t('validation.enterEmail'))
      return
    }
    if (!initialPassword.trim()) {
      toast.error(t('validation.enterPassword'))
      return
    }

    try {
      await createMember.mutateAsync({
        userSn: userSn.trim(),
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        initialPassword: initialPassword.trim(),
        userRole
      })
    } catch {
      return // 에러는 invokeApi가 토스트로 안내한다.
    }

    toast.success(t('toast.added'))
    setIsAddOpen(false)
    resetAddForm()
  }

  const handleConfirmDelete = (member: UserRecord) => {
    setDeleteTarget(member)
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteUser.mutateAsync({ id: deleteTarget.user_id, shouldSoftDelete: false })
    } catch {
      return // 에러는 invokeApi가 토스트로 안내한다.
    }

    toast.success(t('toast.removed'))
    setIsDeleteOpen(false)
    setDeleteTarget(null)
  }

  const handleGenerateInvite = async () => {
    if (!currentWorkspace) {
      toast.error(t('toast.noWorkspace'))
      return
    }

    try {
      const data = await generateInvite.mutateAsync({
        workspaceName: currentWorkspace.name,
        host: currentWorkspace.host,
        port: currentWorkspace.port,
        dbName: currentWorkspace.dbName,
        dbms: currentWorkspace.dbms ?? 'postgresql',
        expiresInHours: Number(expiresInHours)
      })
      if (data) setInviteCode(data.code)
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    }
  }

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(inviteCode)
    toast.success(t('toast.inviteCopied'))
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
          <h1 className='text-2xl font-bold'>{t('title')}</h1>
          <p className='text-sm text-muted-foreground mt-1'>{t('description')}</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setIsInviteOpen(true)}>
            <LinkIcon className='size-4 mr-2' />
            {t('button.generateInvite')}
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className='size-4 mr-2' />
            {t('button.addMember')}
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
          <p className='text-lg font-medium'>{t('empty.noMembers')}</p>
          <p className='text-sm mt-1'>{t('empty.noMembersDescription')}</p>
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
                  <p className='font-medium'>{member.user_name || t('label.unknown')}</p>
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
            <DialogTitle>{t('dialog.addTitle')}</DialogTitle>
            <DialogDescription>{t('dialog.addDescription')}</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='userSn'>{t('label.userSn')}</Label>
              <Input
                id='userSn'
                placeholder={t('placeholder.userSn')}
                value={userSn}
                onChange={(e) => setUserSn(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='userName'>{t('label.name')}</Label>
              <Input
                id='userName'
                placeholder={t('placeholder.name')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='userEmail'>{t('label.email')}</Label>
              <Input
                id='userEmail'
                type='email'
                placeholder={t('placeholder.email')}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='initialPassword'>{t('label.password')}</Label>
              <Input
                id='initialPassword'
                type='password'
                placeholder={t('placeholder.password')}
                value={initialPassword}
                onChange={(e) => setInitialPassword(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='userRole'>{t('label.role')}</Label>
              <Select value={userRole} onValueChange={(v) => setUserRole(v as 'admin' | 'member')}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='member'>{tc('role.member')}</SelectItem>
                  <SelectItem value='admin'>{tc('role.admin')}</SelectItem>
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
              {tc('button.cancel')}
            </Button>
            <Button onClick={handleAddMember} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
              {t('button.addMember')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.removeTitle')}</DialogTitle>
            <DialogDescription>
              {t('dialog.removeDescription', { name: deleteTarget?.user_name || t('label.unknown') })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
              {tc('button.cancel')}
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
              {tc('button.remove')}
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
            <DialogTitle>{t('dialog.inviteTitle')}</DialogTitle>
            <DialogDescription>{t('dialog.inviteDescription')}</DialogDescription>
          </DialogHeader>
          {inviteCode ? (
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label>{t('label.inviteCode')}</Label>
                <Textarea readOnly value={inviteCode} className='font-mono text-xs min-h-[80px]' />
              </div>
              <Button onClick={handleCopyInvite} className='w-full'>
                <Copy className='size-4 mr-2' />
                {tc('button.copy')}
              </Button>
            </div>
          ) : (
            <>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label>{t('label.expiration')}</Label>
                  <Select value={expiresInHours} onValueChange={setExpiresInHours}>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='24'>{tc('expiration.24h')}</SelectItem>
                      <SelectItem value='48'>{tc('expiration.48h')}</SelectItem>
                      <SelectItem value='72'>{tc('expiration.72h')}</SelectItem>
                      <SelectItem value='168'>{tc('expiration.1week')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={handleCloseInvite}>
                  {tc('button.cancel')}
                </Button>
                <Button onClick={handleGenerateInvite} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='size-4 mr-2 animate-spin' />}
                  {tc('button.generate')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
