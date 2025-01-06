'use client'

import { memo } from 'react'
// import { useAuthStore } from '@stores/AuthStore'
// import { toaster } from '@components/ui/toaster'

function Home(): JSX.Element {
  // const { user } = useAuthStore()

  // useEffect(() => {
  //   toaster.create({
  //     type: 'info',
  //     title: `Welcome, ${user?.user_metadata?.name ?? user?.id}`
  //   })
  // }, [])

  return <p>Home Page</p>
}

export const HomePage = memo(Home)
