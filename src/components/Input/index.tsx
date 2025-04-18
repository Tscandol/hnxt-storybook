'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const inputVariants = cva(
  'px-4 border outline-none h-12 w-full transition-colors placeholder:text-neutral-50 bg-neutral-5 text-neutral-black',
  {
    variants: {
      variant: {
        default: 'focus:border-primary-orange focus:bg-white',
        error: 'border-secondary-red focus:border-secondary-red',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      hasEndElement: {
        true: 'pr-12',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        className: 'border-neutral-5 hover:border-neutral-50',
      },
    ],
    defaultVariants: {
      variant: 'default',
      fullWidth: true,
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error'
  fullWidth?: boolean
  hasEndElement?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      fullWidth = true,
      hasEndElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

    return (
      <input
        className={cn(
          inputVariants({ variant, fullWidth, hasEndElement }),
          disabledClasses,
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
