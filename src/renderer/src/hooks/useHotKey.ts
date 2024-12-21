import { useEffect } from 'react'

type KeyCombo = {
  key: string
  command?: boolean
  shift?: boolean
  alt?: boolean
}

export function useHotKey(combo: KeyCombo, handler: () => void) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMatch =
        event.key.toLowerCase() === combo.key.toLowerCase() &&
        (combo.command ? (isMac ? event.metaKey : event.ctrlKey) : !event.metaKey && !event.ctrlKey) &&
        (combo.shift ? event.shiftKey : !event.shiftKey) &&
        (combo.alt ? event.altKey : !event.altKey)

      if (isMatch) {
        event.preventDefault()
        handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [combo, handler, isMac])
}
