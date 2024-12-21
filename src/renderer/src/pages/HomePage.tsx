'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@stores/AuthStore'
import { toaster } from '@components/ui/toaster'

export function HomePage(): JSX.Element {
  const { user } = useAuthStore()

  useEffect(() => {
    toaster.create({
      type: 'success',
      title: `Welcome, ${user?.id}`
    })
  }, [])

  return <p>Home Page</p>
}
