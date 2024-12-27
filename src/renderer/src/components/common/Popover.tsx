import { memo, useState } from 'react'
import { Box, Flex, Text, type PopoverRootProps } from '@chakra-ui/react'
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@components/ui/popover'
import { Avatar, AvatarProps } from '@components/ui/avatar'
import { Button, ButtonProps } from '@components/ui/button'
import { ChevronDown, ChevronsUpDown } from 'lucide-react'

interface PopoverProps extends PopoverRootProps {
  trigger: React.ReactNode
  content: React.ReactNode
}

interface PopoverButtonProps extends ButtonProps {
  label: string
  sameWidth?: boolean
}

interface PopoverAvatarProps extends AvatarProps {
  children: React.ReactNode
}

interface PopoverAvatarAdditionalProps {
  mode?: 'plain' | 'extends'
  title?: string
  description?: string
  showIcon?: boolean
}

function Popover({ trigger, content, ...PopoverRootProps }: PopoverProps) {
  return (
    <PopoverRoot {...PopoverRootProps}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent w='auto'>
        <PopoverArrow />
        <PopoverBody>{content}</PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

Popover.Button = memo(({ label, sameWidth = false, children, ...ButtonProps }: PopoverButtonProps) => {
  const [open, setOpen] = useState(false)

  const handleOnClickButton = () => {
    setOpen(false)
  }

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ sameWidth }}>
      <PopoverTrigger asChild>
        <Button variant='plain' {...ButtonProps}>
          {label} <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent w='auto'>
        <PopoverArrow />
        <PopoverBody onClick={handleOnClickButton} p={2} display='flex' flexDir='column'>
          {children}
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
})

Popover.Avatar = memo(
  ({
    mode = 'plain',
    showIcon = false,
    title,
    description,
    children,
    ...AvatarProps
  }: PopoverAvatarProps & PopoverAvatarAdditionalProps) => {
    const [open, setOpen] = useState(false)

    const handleOnClickButton = () => {
      setOpen(false)
    }

    return (
      <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <PopoverTrigger>
          <Box
            display='flex'
            flexDir='row'
            alignItems='center'
            gap={2}
            p={2}
            borderRadius='md'
            _hover={{ bg: 'gray.100' }}
          >
            <Avatar variant='outline' size='xs' cursor='pointer' {...AvatarProps} />
            {mode === 'extends' && (
              <Flex direction='column' align='flex-start'>
                <Text fontSize='sm'>{title}</Text>
                <Text fontSize='xs' color='gray.500'>
                  {description}
                </Text>
              </Flex>
            )}
            <ChevronsUpDown size={12} />
          </Box>
        </PopoverTrigger>
        <PopoverContent w='auto'>
          <PopoverArrow />
          <PopoverBody onClick={handleOnClickButton} p={2} display='flex' flexDir='column'>
            {children}
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    )
  }
)

export { Popover }
