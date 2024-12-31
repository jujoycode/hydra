'use client'

import { useState } from 'react'
import { For, Stack, Text } from '@chakra-ui/react'

export function SettingSidebar() {
  const [selectedItem, setSelectedItem] = useState<number>(0) // 선택된 항목 상태

  const items = [
    {
      label: 'Profile'
    },
    {
      label: 'Integration (soon)',
      disable: true
    }
  ]

  return (
    <Stack w='full'>
      <For each={items}>
        {(item, index) => (
          <Text
            key={index}
            p={2}
            borderRadius={6}
            cursor='pointer'
            fontSize='sm'
            fontWeight={selectedItem === index ? 'semibold' : 'light'}
            _hover={{ bg: 'gray.100' }}
            onClick={() => !item.disable && setSelectedItem(index)}
          >
            {item.label}
          </Text>
        )}
      </For>
    </Stack>
  )
}
