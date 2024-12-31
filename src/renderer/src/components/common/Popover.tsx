import { memo } from 'react'
import { Flex, Container, For, Stack, Text, Box, useDisclosure } from '@chakra-ui/react'
import { PopoverRoot, PopoverTrigger, PopoverArrow, PopoverBody, PopoverContent } from '@components/ui/popover'
import { Divider } from '@components/ui/divider'

interface PopoverProps {
  /**
   * direction
   * @desc Popover 표출 방향
   * @default 'right-end'
   */
  direction?: 'start' | 'end'

  /**
   * arrow
   * @desc Popover 화살표 표출 여부
   * @default false
   */
  arrow?: boolean

  /**
   * trigger
   * @type React.ReactNode
   */
  trigger: React.ReactNode

  /**
   * items
   * @desc Popover 메뉴 목록
   */
  content: {
    main: {
      label?: string
      component?: React.ReactNode
      onClick?: () => void
    }[]

    footer?: {
      label?: string
      component?: React.ReactNode
      onClick?: () => void
    }[]
  }
}

function Popover({ direction = 'start', arrow = false, trigger, content }: PopoverProps) {
  const { open, onToggle } = useDisclosure()

  const ContentItem = memo(
    ({ label, component, onClick }: { label?: string; component?: React.ReactNode; onClick?: () => void }) => (
      <Container
        m={0}
        p={2}
        borderRadius={6}
        cursor='pointer'
        _hover={{ bg: 'gray.100' }}
        onClick={() => {
          // onClick 함수가 존재하고, 함수가 성공하면 onToggle 함수 실행
          if (onClick) {
            onClick()
            onToggle()
          }
        }}
      >
        <Flex alignItems='center' justifyContent='space-between'>
          <Text fontSize='xs' fontWeight='medium'>
            {label}
          </Text>
          <Box w={6} display='flex' alignItems='center' justifyContent='center'>
            {component}
          </Box>
        </Flex>
      </Container>
    )
  )

  return (
    <PopoverRoot open={open} onOpenChange={onToggle} positioning={{ placement: `bottom-${direction}` }}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent w='60'>
        {arrow && <PopoverArrow />}

        <PopoverBody asChild>
          {/* Main */}
          <Stack p={2}>
            <For each={content.main}>{(item, index) => <ContentItem key={index} {...item} />}</For>

            {/* Footer */}
            {content.footer && (
              <>
                <Divider />
                <For each={content.footer}>{(item, index) => <ContentItem key={index} {...item} />}</For>
              </>
            )}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

export { Popover }
