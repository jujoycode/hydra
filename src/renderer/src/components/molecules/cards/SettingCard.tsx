import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/atoms/Card'

interface SettingCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const SettingCard: React.FC<SettingCardProps> = ({ title, description, children, footer, className }) => {
  return (
    <Card className={className}>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg'>{title}</CardTitle>
        {description && <CardDescription className='text-sm mt-1'>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className='border-t justify-end'>{footer}</CardFooter>}
    </Card>
  )
}
