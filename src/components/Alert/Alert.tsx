'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/css'

const SEVERITY_CONFIG = {
  info: {
    textColor: 'text-secondary-blue',
    backgroundColor: '#DFF7FF',
    icon: '/icons/info_blue.svg',
  },
  warning: {
    textColor: 'text-other-alert-yellow',
    backgroundColor: '#FFF7D8',
    icon: '/icons/danger_yellow.svg',
  },
  error: {
    textColor: 'text-secondary-red',
    backgroundColor: '#FFDFDC',
    icon: '/icons/info_red.svg',
  },
} as const

const alertVariants = cva('relative flex p-4 font-sm', {
  variants: {
    severity: {
      info: 'text-secondary-blue',
      warning: 'text-other-alert-yellow',
      error: 'text-secondary-red',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-[400px]',
    },
  },
  defaultVariants: {
    severity: 'info',
    fullWidth: true,
  },
})

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      severity = 'info',
      fullWidth = true,
      title,
      children,
      ...props
    },
    ref
  ) => {
    const config = SEVERITY_CONFIG[severity ?? 'info']
    const hasTitle = !!title

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ severity, fullWidth }), className)}
        role="alert"
        style={{
          backgroundColor: config.backgroundColor,
        }}
        {...props}
      >
        <div className={cn('relative flex w-full', hasTitle ? 'items-start' : 'items-center' )}>
          <div
            className={cn(
              'shrink-0 w-6 flex mr-2',
              hasTitle ? 'items-start' : 'items-center'
            )}
          >
            <Image
              src={config.icon}
              alt={`${severity} icon`}
              width={24}
              height={24}
            />
          </div>

          <div className="flex-1">
            {title && <div className="font-medium">{title}</div>}
            <div className="text-alert">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { alertVariants }

