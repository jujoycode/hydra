'use client'
import { memo } from 'react'

function Home(): JSX.Element {
  return (
    <>
      <p>Home Page</p>
    </>
  )
}

export const HomePage = memo(Home)
