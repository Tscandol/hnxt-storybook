'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const dividerVariants = cva('h-px w-full', {
  variants: {
    variant: {
      default: 'bg-neutral-25',
      light: 'bg-neutral-10',
      dark: 'bg-neutral-50',
    },
    orientation: {
      horizontal: '',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    variant: 'default',
    orientation: 'horizontal',
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, variant, orientation, ...props }, ref) => {
    let ariaOrientation: 'horizontal' | 'vertical' | undefined

    if (orientation === 'horizontal' || orientation === 'vertical') {
      ariaOrientation = orientation
    } else {
      ariaOrientation = undefined
    }

    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ variant, orientation }), className)}
        role={orientation === 'vertical' ? 'separator' : undefined}
        aria-orientation={ariaOrientation}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

export { dividerVariants }
