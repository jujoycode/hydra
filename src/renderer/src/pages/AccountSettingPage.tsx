import { useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { Box, Flex, Text, Input, Stack } from '@chakra-ui/react'
import { Button } from '@components/ui/button'
import { Avatar } from '@components/ui/avatar'
import { toaster } from '@components/ui/toaster'
import { IpcChannel } from '@interface/CoreInterface'

export function AccountSettingPage(): JSX.Element {
  const { user, actions } = useAuthStore()
  const [name, setName] = useState<string>(user?.name ? user.name : '')
  const [filePath, setFilePath] = useState<string>()
  const [updateState, setUpdateState] = useState(false)

  const callOpenDialog = async () => {
    const { canceled, filePaths } = await window.callApi(IpcChannel.SYSTEM_OPEN_DIALOG, {
      filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
      properties: ['openFile']
    })

    if (canceled) {
      toaster.error({
        title: 'Operation Cancelled',
        description: 'You have cancelled the operation. Please try again.'
      })

      return
    }

    setFilePath(filePaths[0])
  }

  const callUpdateUserData = async () => {
    setUpdateState(true)

    if (!user || !user.id) {
      toaster.error({
        title: 'Invalid Parameter',
        description: 'Auth info invalid, Please try again after re-logging.'
      })

      return
    }

    // const updatedInfo = await window.callApi(IpcChannel.AUTH_UPDATE_USER, {
    //   userId: user.id,
    //   userName: name
    //   // userAvatarKey: filePath
    // })

    // actions.setUser({
    //   id: updatedInfo.user_id,
    //   name: updatedInfo.user_name,
    //   email: updatedInfo.user_email,
    //   created_at: updatedInfo.user_created_at,
    //   updated_at: updatedInfo.user_updated_at,
    //   avatar_key: updatedInfo.user_avatar_key
    // })

    setUpdateState(false)
  }

  return (
    <Box bg='white' boxShadow='md' borderRadius='lg' p={6}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Stack gap={6} flex={1}>
          <Avatar
            variant='outline'
            shape='rounded'
            size='xl'
            name={user?.name ? user?.name : user?.id}
            cursor='pointer'
            _hover={{ bg: 'gray.200' }}
            onClick={() => callOpenDialog()}
          />

          <Box>
            <Text fontSize='sm' fontWeight='medium' mb={2}>
              Name
            </Text>
            <Input placeholder='Enter your full name' value={name} onChange={(e) => setName(e.target.value)} />
          </Box>

          <Box>
            <Text fontSize='sm' fontWeight='medium' mb={2}>
              Email
            </Text>
            <Input value={user?.email!} disabled />
          </Box>

          <Box>
            <Button
              colorScheme='blue'
              float='right'
              size='md'
              px={6}
              loading={updateState}
              disabled={!name}
              onClick={callUpdateUserData}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
