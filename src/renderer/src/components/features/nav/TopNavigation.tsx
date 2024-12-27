'use client'

import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, Stack, Button, Text } from '@chakra-ui/react'
import { Popover } from '@components/common/Popover'
import { ContentList } from '@components/features/nav/ContentList'
import { ColorModeButton } from '@components/ui/color-mode'
import { Divider } from '@components/ui/divider'
import { Profile } from '@components/features/nav/Profile'

export function TopNavigation(): JSX.Element {
  const navigate = useNavigate()

  // TEST: 추후 DB 조회로 변경
  const projectList = [
    {
      id: '1',
      name: 'Project 1'
    },
    {
      id: '2',
      name: 'Project 2'
    }
  ]

  const ProjectPopoverButton = () => {
    return (
      <Popover.Button label='Projects'>
        <Stack gap={2} mb={2}>
          <ContentList itemList={projectList} baseRoute='/projects' changeRoute />
        </Stack>

        <Divider />

        <Button variant='ghost' size='xs' mt={2}>
          view all projects
        </Button>
        <Button variant='ghost' size='xs' mt={2}>
          create new project
        </Button>
      </Popover.Button>
    )
  }

  const MemberPopoverButton = () => {
    return (
      <Popover.Button label='Members'>
        <Button variant='ghost' size='xs' mt={2}>
          invite
        </Button>
      </Popover.Button>
    )
  }

  return (
    <Box as='nav' px={4} w='full' shadow='sm'>
      <Flex h={16} alignItems='center' justifyContent='space-between' maxW='7xl' mx='auto'>
        <HStack gap={8}>
          <Box marginLeft={4} marginRight={4}>
            <Text fontSize='xl' fontWeight='semibold' onClick={() => navigate('/')} cursor='pointer'>
              Hydra
            </Text>
          </Box>

          <HStack gap={2}>
            <ProjectPopoverButton />
            <MemberPopoverButton />

            <Button size='sm'>Create</Button>
          </HStack>
        </HStack>

        <HStack>
          <Profile />
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  )
}
