'use client'

import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { Button } from '@components/ui/button'
import { Popover } from '@components/common/Popover'
import { Profile } from '@components/features/nav/Profile'
import { ChevronDown, UserRoundPlus } from 'lucide-react'

export function TopNavigation(): JSX.Element {
  const navigate = useNavigate()

  // TEST: 추후 DB 조회로 변경
  const projectList = [
    {
      label: 'Project 1'
    },
    {
      label: 'Project 2'
    }
  ]

  const ProjectPopoverButton = () => {
    return (
      <Popover
        trigger={
          <Button variant='plain'>
            Projects <ChevronDown />
          </Button>
        }
        content={{ main: projectList, footer: [{ label: 'view all projects' }] }}
      />
    )
  }

  const MemberPopoverButton = () => {
    return (
      <Popover
        trigger={
          <Button variant='plain'>
            Members <ChevronDown />
          </Button>
        }
        content={{ main: [{ label: 'invite', component: <UserRoundPlus size={18} strokeWidth={1.5} /> }] }}
      />
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
        </HStack>
      </Flex>
    </Box>
  )
}
