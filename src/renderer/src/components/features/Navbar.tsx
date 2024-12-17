import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, Button, Text, For } from '@chakra-ui/react'
import { ColorModeButton } from '@components/ui/color-mode'
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@components/ui/popover'
import { ChevronDown } from 'lucide-react'

export function Navbar(): JSX.Element {
  const navigate = useNavigate()

  const projectList = [
    {
      id: '1',
      name: 'Project 1'
    }
  ]

  const PopoverButton = memo(({ label, content }: { label: string; content: React.ReactNode }) => {
    return (
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button variant='plain' role='menuitem'>
            {label} <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent w='auto'>
          <PopoverArrow />
          <PopoverBody>{content}</PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    )
  })

  const ProjectContent = memo(() => {
    return (
      <For each={projectList}>
        {(item, index) => (
          <Button
            key={index}
            variant='subtle'
            onClick={() => {
              navigate(`/projects/${item.id}`)
            }}
          >
            {item.name}
          </Button>
        )}
      </For>
    )
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
            <PopoverButton label='Projects' content={<ProjectContent />} />
            <PopoverButton label='Members' content={<Text>Members</Text>} />
          </HStack>
        </HStack>

        <HStack>
          <Button>Create</Button>
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  )
}
