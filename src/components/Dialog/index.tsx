'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const backdropVariants = cva('fixed inset-0 z-40', {
  variants: {
    variant: {
      default: 'bg-neutral-25/50',
      dark: 'bg-neutral-black/70',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const dialogVariants = cva(
  'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white z-50 w-full',
  {
    variants: {
      size: {
        default: 'max-w-md',
        sm: 'max-w-sm',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-[95%]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants>,
    VariantProps<typeof backdropVariants> {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ className, open, onClose, children, variant, size, ...props }, ref) => {
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    React.useEffect(() => {
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (open && event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscapeKey)
      return () => {
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }, [open, onClose])

    if (!open) return null

    return (
      <>
        <div
          className={backdropVariants({ variant })}
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={ref}
          className={cn(dialogVariants({ size }), className)}
          style={{ boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.14)' }}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

Dialog.displayName = 'Dialog'

export { dialogVariants, backdropVariants }
