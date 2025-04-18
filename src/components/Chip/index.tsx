'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

export type ChipVariant = 'filled' | 'outlined'
export type ChipSeverity = 'success' | 'info' | 'warning' | 'error'

const chipVariants = cva(
  'inline-flex items-center px-[10px] py-[3px] rounded-full text-[0.75rem] leading-[166%] font-normal',
  {
    variants: {
      variant: {
        filled: '',
        outlined: 'bg-transparent border',
      },
      severity: {
        success: '',
        info: '',
        warning: '',
        error: '',
      },
    },
    compoundVariants: [
      {
        variant: 'filled',
        severity: 'success',
        class: 'bg-secondary-green text-neutral-white',
      },
      {
        variant: 'filled',
        severity: 'info',
        class: 'bg-secondary-blue text-neutral-white',
      },
      {
        variant: 'filled',
        severity: 'warning',
        class: 'bg-primary-light-yellow text-neutral-black',
      },
      {
        variant: 'filled',
        severity: 'error',
        class: 'bg-secondary-red text-neutral-white',
      },

      {
        variant: 'outlined',
        severity: 'success',
        class: 'border-secondary-green text-secondary-green',
      },
      {
        variant: 'outlined',
        severity: 'info',
        class: 'border-secondary-blue text-secondary-blue',
      },
      {
        variant: 'outlined',
        severity: 'warning',
        class: 'border-primary-light-yellow text-primary-light-yellow',
      },
      {
        variant: 'outlined',
        severity: 'error',
        class: 'border-secondary-red text-secondary-red',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      severity: 'info',
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  label: string
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, label, variant, severity, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, severity }), className)}
        {...props}
      >
        {label}
      </div>
    )
  }
)

Chip.displayName = 'Chip'

export { chipVariants }
