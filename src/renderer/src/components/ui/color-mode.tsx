'use client'

import type { IconButtonProps } from '@chakra-ui/react'
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import * as React from 'react'

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return <ThemeProvider attribute='class' disableTransitionOnChange={false} {...props} />
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? light : dark
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? <Sun /> : <Moon />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize='8' />}>
        <IconButton
          _hover={{
            animation: 'spin infinite 1.5s ease-in-out'
          }}
          onClick={toggleColorMode}
          variant='plain'
          size='sm'
          ref={ref}
          {...props}
        >
          {colorMode === 'light' ? <Sun /> : <Moon />}
        </IconButton>
      </ClientOnly>
    )
  }
)
