import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'gradient-primary text-primary-foreground shadow-glow hover:brightness-105 hover:-translate-y-px',
        destructive:
          'bg-background border border-destructive text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-background border border-input-strong text-foreground hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-green-700 underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: NonNullable<VariantProps<typeof buttonVariants>>['variant']
  size?: NonNullable<VariantProps<typeof buttonVariants>>['size']
  loading?: boolean
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, loading = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return loading ? (
    <Comp data-slot='button' className={cn(buttonVariants({ variant, size, className }))} disabled {...props}>
      <Loader2 className='size-4 animate-spin' />
      Please wait
    </Comp>
  ) : (
    <Comp data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>>
