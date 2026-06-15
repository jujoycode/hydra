import { Bot } from 'lucide-react'

export function EmptyPage() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Bot size={40} strokeWidth={1} />
      <br />
      <h1 className='text-2xl font-light'>Loading...</h1>
    </div>
  )
}
