'use client'

import { For, Stack, Text } from '@chakra-ui/react'

export function SettingSidebar() {
  const selectedStyle = { bg: 'gray.100' }

  const items = ['General']

  return (
    <Stack w='full'>
      <For each={items}>
        {(item, index) => (
          <Text key={index} p={2} borderRadius={6} fontSize='sm' _hover={selectedStyle}>
            {item}
          </Text>
        )}
      </For>
    </Stack>
  )
}
