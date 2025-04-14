import React, { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/atoms/Input'
import { Label } from '@/atoms/Label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/atoms/InputOtp'

const InputFieldContext = createContext<{ id: string; error?: string } | undefined>(undefined)

interface InputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  label?: string
  error?: string
  children?: React.ReactNode
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function InputFieldInput({ className, label, value, onChange, ...props }: InputFieldProps) {
  const context = useContext(InputFieldContext)
  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={context?.id}>{label}</Label>}
      <Input
        id={context?.id}
        aria-invalid={!!context?.error}
        className={className}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}

interface InputFieldEmailProps extends InputFieldProps {
  required?: boolean
  placeholder?: string
}

function InputFieldEmail({ className, label, placeholder, ...props }: InputFieldEmailProps) {
  const context = useContext(InputFieldContext)

  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={context?.id}>{label}</Label>}
      <Input
        id={context?.id}
        type='email'
        className={className}
        placeholder={placeholder}
        aria-invalid={!!context?.error}
        {...props}
      />
    </div>
  )
}

interface InputFieldPasswordProps extends InputFieldProps {
  required?: boolean
  showForgotPassword?: boolean
}

function InputFieldPassword({ showForgotPassword, required = true, className, ...props }: InputFieldPasswordProps) {
  const context = useContext(InputFieldContext)

  return (
    <div className='space-y-2'>
      {showForgotPassword && (
        <div className='flex justify-end'>
          <a href='#' className='text-sm underline-offset-2 hover:underline'>
            Forgot your password?
          </a>
        </div>
      )}
      <Input
        id={context?.id}
        type='password'
        required={required}
        aria-invalid={!!context?.error}
        className={className}
        {...props}
      />
    </div>
  )
}

interface InputFieldOTPProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  className?: string
}

function InputFieldOTP({ value, onChange, maxLength = 6, className }: InputFieldOTPProps) {
  const context = useContext(InputFieldContext)

  return (
    <InputOTP
      id={context?.id}
      value={value}
      maxLength={maxLength}
      onChange={onChange}
      containerClassName={cn('justify-center', className)}
    >
      <InputOTPGroup>
        {Array.from({ length: maxLength }).map((_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

export function InputField({ id, label, error, children, className, ...props }: InputFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId

  return (
    <InputFieldContext.Provider value={{ id: fieldId, error }}>
      <div className={cn('grid gap-2', className)} {...props}>
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        {children}
        {error && <p className='text-destructive text-sm'>{error}</p>}
      </div>
    </InputFieldContext.Provider>
  )
}

InputField.Input = InputFieldInput
InputField.Email = InputFieldEmail
InputField.Password = InputFieldPassword
InputField.OTP = InputFieldOTP
