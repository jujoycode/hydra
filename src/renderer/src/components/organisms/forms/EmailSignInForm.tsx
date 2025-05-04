import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/atoms/Button'
import { InputField } from '@/molecules/InputField'

interface EmailSignInFormProps extends React.ComponentProps<'div'> {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function EmailSignInForm({
  className,
  email,
  onEmailChange,
  onSubmit,
  isLoading,
  ...props
}: EmailSignInFormProps) {
  const handleSubmit = () => {
    if (!email) {
      return
    }

    onSubmit()
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-2xl font-bold'>Welcome back</h1>
        <p className='text-muted-foreground text-balance'>Login and manage your projects</p>
      </div>

      <InputField.Email
        label='Email'
        placeholder='mail@example.com'
        value={email}
        onChange={(e) => {
          onEmailChange(e.target.value)
        }}
      />

      <Button type='button' className='w-full' loading={isLoading} disabled={!email} onClick={handleSubmit}>
        Sign In
      </Button>
    </div>
  )
}
