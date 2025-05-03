import { useEffect } from 'react'
import { getPublicImageUrl } from '@/lib/utils'
import { useSettings } from '@/hooks/use-settings'
import { Label } from '@/atoms/Label'
import { Input } from '@/atoms/Input'
import { Button } from '@/atoms/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/atoms/Avatar'
import { SettingsSection } from '@/molecules/SettingsSection'
import { User } from 'lucide-react'

export default function AccountPage() {
  const { user, name, setName, isLoading, fileInputRef, handleNameUpdate, handleAvatarClick, handleFileChange } =
    useSettings()

  // user가 변경되면 name 상태 업데이트
  useEffect(() => {
    if (user) {
      setName(user.name || '')
    }
  }, [user, setName])

  if (!user) return null

  return (
    <div className='w-full space-y-6'>
      {/* 프로필 섹션 */}
      <SettingsSection
        title='Profile'
        description='Manage your user profile information.'
        footer={
          <div className='flex justify-end'>
            <Button onClick={handleNameUpdate} loading={isLoading} className='w-21'>
              Save
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
                <AvatarImage
                  src={user.avatar_key ? getPublicImageUrl(user.avatar_key) : undefined}
                  alt={user.name || ''}
                />
                <AvatarFallback className='text-2xl'>
                  <User size={32} strokeWidth={1.5} />
                </AvatarFallback>
              </Avatar>
              <div className='absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <span className='text-white text-xs font-medium'>Change</span>
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>Click to select</p>
          </div>

          <div className='flex-1 space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' value={user.email || ''} disabled className='opacity-60 flex-1 min-w-[200px]' />
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}
