import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/atoms/Card'

interface SignInTemplateProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
}

export function SignInTemplate({ className, children, ...props }: SignInTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8'>{children}</form>

          <div className='bg-muted relative hidden md:block'>
            <img
              src='../empty-image.svg'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a className='cursor-pointer'>Terms of Service</a> and{' '}
        <a className='cursor-pointer'>Privacy Policy</a>.
      </div>
    </div>
  )
}
