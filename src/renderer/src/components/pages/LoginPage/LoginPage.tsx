import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { invokeApi } from '@/hooks/use-api'
import { IpcChannel } from '@/interface/CoreInterface'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { setUser, setAuthenticated } = useAuthStore()
  const [userSn, setUserSn] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const user = await invokeApi(IpcChannel.AUTH_LOGIN, { userSn, password, rememberMe })
      if (user) {
        setUser(user)
        setAuthenticated(true)
        navigate({ to: '/' })
      }
    } catch {
      // 에러는 invokeApi가 토스트로 안내한다.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1.5'>
          <Label htmlFor='userSn'>{t('login.userSn')}</Label>
          <Input id='userSn' value={userSn} onChange={(e) => setUserSn(e.target.value)} autoFocus />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>{t('login.password')}</Label>
          <Input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <label className='flex items-center gap-2 text-sm text-muted-foreground'>
          <input type='checkbox' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          {t('login.rememberMe')}
        </label>
        <Button type='submit' className='w-full' disabled={submitting || !userSn || !password}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>
    </AuthLayout>
  )
}
