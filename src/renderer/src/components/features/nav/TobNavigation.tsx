'use client'

import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, Button, Text } from '@chakra-ui/react'
import { Popover } from '@components/common/Popover'
import { ContentList } from '@components/features/nav/ContentList'
import { ColorModeButton } from '@components/ui/color-mode'
import { useAuthStore } from '@stores/AuthStore'

export function TopNavigation(): JSX.Element {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // TEST: 추후 DB 조회로 변경
  const projectList = [
    {
      id: '1',
      name: 'Project 1'
    }
  ]

  const MemberContent = memo(() => {
    return <Text>Members</Text>
  })

  return (
    <Box as='nav' px={4} w='full' shadow='sm'>
      <Flex h={16} alignItems='center' justifyContent='space-between' maxW='7xl' mx='auto'>
        <HStack gap={8}>
          <Box marginLeft={4}>
            <Text fontSize='xl' fontWeight='semibold' onClick={() => navigate('/')} cursor='pointer'>
              Hydra
            </Text>
          </Box>
          <HStack gap={4}>
            <Popover.Button label='Projects'>
              <ContentList itemList={projectList} changeRoute />
            </Popover.Button>

            <Popover.Button label='Members'>
              <MemberContent />
            </Popover.Button>

            <Button size='sm'>Create</Button>
          </HStack>
        </HStack>

        <HStack>
          <Popover.Avatar shape='rounded' mode='extends' title={user?.user_metadata?.name} description={user?.email}>
            <Text>Setting</Text>
          </Popover.Avatar>
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  )
}
