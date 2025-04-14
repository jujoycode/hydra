import { useState } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@lib/utils'
import { Button } from '@atoms/Button'
import { Separator } from '@atoms/Separator'
import { Popover, PopoverContent, PopoverTrigger } from '@atoms/Popover'
import { UserAvatar } from '@molecules/UserAvatar'
import { Settings, SunMoon, LogOut } from 'lucide-react'

type UserMenuProps = {
  user: {
    name: string
    email: string
    avatarUrl?: string
    role?: string
  }
  className?: string
}

export function HeaderUserMenu({ user, className }: UserMenuProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const onSettings = () => {
    navigate('/settings')
    setIsOpen(false)
  }

  const onLogout = () => {
    console.log('로그아웃')
    setIsOpen(false)
  }

  const onThemeToggle = () => {
    console.log('테마 변경')
    setIsOpen(false)
  }

  return (
    <div className='flex items-center gap-2'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-1 rounded-md p-1 px-3 hover:bg-accent transition-colors outline-none',
              className
            )}
          >
            <UserAvatar name={user.name} avatar={user.avatarUrl} email={user.email} size='sm' showInfo={true} />
          </button>
        </PopoverTrigger>

        <PopoverContent className='w-56 p-2' align='end'>
          <div className='space-y-1'>
            <MenuItem onClick={onSettings} icon={<Settings size={14} strokeWidth={1.5} />}>
              Settings
            </MenuItem>
            <MenuItem onClick={onThemeToggle} icon={<SunMoon size={14} strokeWidth={1.5} />}>
              Theme
            </MenuItem>

            <Separator />

            <MenuItem onClick={onLogout} icon={<LogOut size={14} strokeWidth={1.5} />}>
              Logout
            </MenuItem>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

type MenuItemProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

function MenuItem({ children, icon, onClick, className }: MenuItemProps) {
  return (
    <Button
      variant='ghost'
      onClick={onClick}
      className={cn(
        'w-full text-left flex items-center justify-start gap-2 px-2 py-1.5 text-xs font-medium rounded-sm hover:bg-accent outline-none transition-colors cursor-pointer h-8',
        className
      )}
    >
      {icon && <span className='text-muted-foreground'>{icon}</span>}
      {children}
    </Button>
  )
}
