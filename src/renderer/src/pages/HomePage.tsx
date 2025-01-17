'use client'

import { Button } from '@components/ui/button'
import { useIpcHandler } from '@hooks/useIpcHandler'
import { IpcChannel } from '@interface/CoreInterface'
import { memo } from 'react'

function Home(): JSX.Element {
  const openGoogle = async () => {
    const result = await useIpcHandler(IpcChannel.SYSTEM_OPEN_EXTERNAL_URL, { url: 'https://www.google.com' })

    console.log(result)
  }

  return (
    <>
      <p>Home Page</p>
      <Button onClick={openGoogle}>Open Google</Button>
    </>
  )
}

export const HomePage = memo(Home)
