import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { Flex, Box, Text } from '@chakra-ui/react'
import { Avatar } from '@components/ui/avatar'
import { Popover } from '@components/common/Popover'
import { ColorModeButton } from '@components/ui/color-mode'
import { getPublicAccessUrl } from '@utils/commonUtil'
import { ChevronsUpDown, LogOut, UserRoundCog } from 'lucide-react'

export function Profile(): JSX.Element {
  const { user, actions } = useAuthStore()
  const navigate = useNavigate()

  const handleAccountSettings = () => {
    if (!user?.id) return
    navigate(`/settings/account/${user?.id}`)
  }

  const ProfileBox = (
    <Box display='flex' flexDir='row' alignItems='center' gap={2} p={2} borderRadius='md' _hover={{ bg: 'gray.100' }}>
      <Avatar
        variant='outline'
        size='xs'
        cursor='pointer'
        shape='rounded'
        src={user?.avatar_key ? getPublicAccessUrl(user.avatar_key) : undefined}
        name={user?.name ?? user?.id}
      />
      <Flex direction='column' align='flex-start'>
        <Text fontSize='sm' truncate>
          {user?.name ?? user?.id}
        </Text>
        <Text fontSize='xs' color='gray.500'>
          {user?.email}
        </Text>
      </Flex>
      <ChevronsUpDown size={12} />
    </Box>
  )

  const main = [
    {
      label: 'Account Settings',
      component: <UserRoundCog size={18} strokeWidth={1.5} />,
      onClick: handleAccountSettings
    },
    {
      label: 'Theme',
      component: <ColorModeButton />
    }
  ]

  const footer = [
    {
      label: 'Log Out',
      component: <LogOut size={16} strokeWidth={1.5} />,
      onClick: () => actions.clearAuth()
    }
  ]

  return <Popover trigger={ProfileBox} content={{ main, footer }} />
}
