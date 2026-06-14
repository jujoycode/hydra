import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { invokeApi } from '@/hooks/use-api'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

export default function AdminSetupPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { setUser, setAuthenticated, setNeedsSetup } = useAuthStore()
  const [form, setForm] = useState({ userSn: '', userName: '', userEmail: '', password: '', confirm: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error(t('setup.passwordMismatch'))
      return
    }
    setSubmitting(true)
    try {
      const user = await invokeApi(IpcChannel.AUTH_SETUP_ADMIN, {
        userSn: form.userSn,
        userName: form.userName,
        userEmail: form.userEmail || undefined,
        password: form.password
      })
      if (user) {
        setUser(user)
        setAuthenticated(true)
        setNeedsSetup(false)
        navigate({ to: '/' })
      }
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('setup.title')} subtitle={t('setup.subtitle')}>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1.5'>
          <Label htmlFor='userSn'>{t('setup.userSn')}</Label>
          <Input
            id='userSn'
            value={form.userSn}
            onChange={(e) => setForm({ ...form, userSn: e.target.value })}
            autoFocus
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='userName'>{t('setup.userName')}</Label>
          <Input id='userName' value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='userEmail'>{t('setup.userEmail')}</Label>
          <Input
            id='userEmail'
            type='email'
            value={form.userEmail}
            onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>{t('setup.password')}</Label>
          <Input
            id='password'
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='confirm'>{t('setup.confirm')}</Label>
          <Input
            id='confirm'
            type='password'
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={submitting || !form.userSn || !form.userName || !form.password}
        >
          {submitting ? t('setup.submitting') : t('setup.submit')}
        </Button>
      </form>
    </AuthLayout>
  )
}
