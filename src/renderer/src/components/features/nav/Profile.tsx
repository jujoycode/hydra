import { Stack } from '@chakra-ui/react'
import { useAuthStore } from '@stores/AuthStore'
import { Divider } from '@components/ui/divider'
import { Button } from '@components/ui/button'
import { Popover } from '@components/common/Popover'
import { ContentList } from '@components/features/nav/ContentList'
import { LogOut, Settings, UserRound } from 'lucide-react'

export function Profile(): JSX.Element {
  const { user } = useAuthStore()

  const settingItem = [
    {
      name: 'Settings',
      icon: <Settings strokeWidth={1.5} />
    },
    {
      id: 'account',
      name: 'Account',
      icon: <UserRound strokeWidth={1.5} />
    }
  ]

  return (
    <Popover.Avatar shape='rounded' mode='extends' title={user?.user_metadata?.name} description={user?.email}>
      <Stack gap={2} mb={2}>
        <ContentList itemList={settingItem} baseRoute='/settings' changeRoute />
      </Stack>

      <Divider />

      <Button variant='ghost' size='sm' mt={2} fontWeight='light'>
        <LogOut strokeWidth={1.5} />
        Logout
      </Button>
    </Popover.Avatar>
  )
}
