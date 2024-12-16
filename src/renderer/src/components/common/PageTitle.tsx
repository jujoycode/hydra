import { Box, Text } from '@chakra-ui/react'

export function PageTitle({ title, subTitle }: { title: string; subTitle: string }) {
  return (
    <Box mb={4}>
      <Text fontSize='sm' color='gray.500'>
        {subTitle}
      </Text>
      <Text fontSize='2xl' fontWeight='semibold'>
        {title}
      </Text>
    </Box>
  )
}
