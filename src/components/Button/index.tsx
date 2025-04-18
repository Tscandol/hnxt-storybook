'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-4 px-5 py-3 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        primary:
          'bg-neutral-black text-white [&>span>*]:invert [&>span>*]:brightness-200',
        secondary:
          'bg-primary-orange text-white [&>span>*]:invert [&>span>*]:brightness-200',
        tertiary: 'bg-neutral-5 text-neutral-black',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      hasChildren: {
        false: 'px-3',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        className: 'hover:bg-neutral-50 focus:bg-primary-orange',
      },
      {
        variant: 'secondary',
        className: 'hover:bg-neutral-black focus:bg-neutral-50',
      },
      {
        variant: 'tertiary',
        className:
          'hover:bg-neutral-25 focus:bg-primary-orange focus:text-white [&:focus>span>*]:invert [&:focus>span>*]:brightness-200',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
      hasChildren: true,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      fullWidth,
      disabled,
      isLoading,
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref
  ) => {
    const hasChildren = React.Children.count(children) > 0
    const isDisabled = disabled || isLoading

    // Classes pour les états disabled/loading
    const disabledClasses = isDisabled
      ? 'opacity-30 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer'

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            fullWidth,
            hasChildren,
          }),
          disabledClasses,
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="flex items-center justify-center mr-2">
            <div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Chargement"
            >
              <span className="sr-only">Chargement...</span>
            </div>
          </span>
        )}

        {!isLoading && startIcon && (
          <span className="flex items-center justify-center">{startIcon}</span>
        )}

        {children}

        {!isLoading && endIcon && (
          <span className="flex items-center justify-center">{endIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
