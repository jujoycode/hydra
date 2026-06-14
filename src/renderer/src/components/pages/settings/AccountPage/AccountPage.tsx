import { User } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/atoms/Avatar'
import { Button } from '@/atoms/Button'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms/Select'
import { useSettings } from '@/hooks/use-settings'
import { SettingCard } from '@/molecules/cards/SettingCard'

export default function AccountPage() {
  const { t, i18n } = useTranslation('settings')
  const { t: tc } = useTranslation('common')
  const { user, name, setName, isLoading, fileInputRef, handleNameUpdate, handleAvatarClick, handleFileChange } =
    useSettings()

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('hydra-language', lng)
  }

  // user가 변경되면 name 상태 업데이트
  useEffect(() => {
    if (user) {
      setName(user.user_name || '')
    }
  }, [user, setName])

  if (!user) return null

  return (
    <div className='w-full space-y-6'>
      {/* 프로필 섹션 */}
      <SettingCard
        title={t('account.profileTitle')}
        description={t('account.profileDescription')}
        footer={
          <div className='flex justify-end'>
            <Button onClick={handleNameUpdate} loading={isLoading} className='w-21'>
              {tc('button.save')}
            </Button>
          </div>
        }
      >
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex flex-col items-center space-y-3'>
            <div onClick={handleAvatarClick} className='relative cursor-pointer group'>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <Avatar className='h-24 w-24 border-2 border-muted'>
                <AvatarImage src={user.user_avatar_path || undefined} alt={user.user_name || ''} />
                <AvatarFallback className='text-2xl'>
                  <User size={32} strokeWidth={1.5} />
                </AvatarFallback>
              </Avatar>
              <div className='absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <span className='text-white text-xs font-medium'>{tc('button.change')}</span>
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>{t('account.clickToSelect')}</p>
          </div>

          <div className='flex-1 space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>{tc('label.name')}</Label>
              <Input id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder={tc('label.name')} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='email'>{tc('label.email')}</Label>
              <Input id='email' value={user.user_email || ''} disabled className='opacity-60 flex-1 min-w-[200px]' />
            </div>
          </div>
        </div>
      </SettingCard>

      {/* 언어 설정 */}
      <SettingCard title={t('language.title')} description={t('language.description')}>
        <div className='grid gap-2 max-w-xs'>
          <Label>{t('language.label')}</Label>
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ko'>한국어</SelectItem>
              <SelectItem value='en'>English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingCard>
    </div>
  )
}
