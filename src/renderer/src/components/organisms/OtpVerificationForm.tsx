import React from 'react'
import { cn } from '@/lib/utils'
import { getMailLink } from '@/lib/mail'
import { Button } from '@/atoms/Button'
import { InputField } from '@/molecules/InputField'

interface OtpVerificationFormProps extends React.ComponentProps<'div'> {
  email: string
  otp: string
  onOtpChange: (otp: string) => void
  onSubmit: () => void
  onResendCode: () => void
  isLoading: boolean
}

export function OtpVerificationForm({
  className,
  email,
  otp,
  onOtpChange,
  onSubmit,
  onResendCode,
  isLoading,
  ...props
}: OtpVerificationFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-2xl font-bold'>Verification</h1>
        <p className='text-muted-foreground text-balance'>Enter the code sent to your email</p>
      </div>

      <InputField label='Verification Code'>
        <p className='text-sm text-muted-foreground mb-4'>
          Enter the 6-digit code sent to{' '}
          <a href={getMailLink(email)} target='_blank' rel='noopener noreferrer' className='underline'>
            {email}
          </a>
        </p>
        <InputField.OTP value={otp} maxLength={6} onChange={onOtpChange} />
      </InputField>

      <Button type='button' className='w-full' loading={isLoading} onClick={onSubmit}>
        Verify
      </Button>

      <Button type='button' variant='link' className='text-xs hover:underline text-center' onClick={onResendCode}>
        Resend code
      </Button>
    </div>
  )
}
