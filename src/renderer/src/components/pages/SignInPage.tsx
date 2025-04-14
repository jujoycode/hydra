import { SignInForm } from '@organisms/SignInForm'

export default function SignInPage() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <SignInForm className='w-full max-w-3xl' />
    </div>
  )
}
