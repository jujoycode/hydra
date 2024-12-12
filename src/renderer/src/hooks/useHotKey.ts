import { useEffect } from 'react'

type KeyCombo = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export function useHotKey(combo: KeyCombo, handler: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === combo.key.toLowerCase() &&
        (!combo.ctrl || e.ctrlKey) &&
        (!combo.meta || e.metaKey) &&
        (!combo.shift || e.shiftKey) &&
        (!combo.alt || e.altKey)
      ) {
        e.preventDefault()
        handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [combo, handler])
}
