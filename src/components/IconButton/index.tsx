'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const sizeConfig = {
  sm: {
    iconSize: 20,
  },
  md: {
    iconSize: 24,
  },
  lg: {
    iconSize: 30,
  },
} as const

const iconButtonVariants = cva(
  'inline-flex items-center justify-center p-2 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        primary: 'bg-neutral-black *:invert *:brightness-200',
        secondary: 'bg-primary-orange *:invert *:brightness-200',
        tertiary: 'bg-neutral-10',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      isCardButton: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        isCardButton: false,
        className: 'hover:bg-neutral-50 focus:bg-primary-orange',
      },
      {
        variant: 'secondary',
        isCardButton: false,
        className: 'hover:bg-neutral-black focus:bg-neutral-50',
      },
      {
        variant: 'tertiary',
        isCardButton: false,
        className:
          'hover:bg-neutral-25 focus:bg-primary-orange [&:focus>*]:invert [&:focus>*]:brightness-200',
      },
      {
        variant: 'primary',
        isCardButton: true,
        className:
          'group-hover:bg-neutral-25 group-focus:bg-primary-orange [.simulation-card:focus_&>*]:invert [.simulation-card:focus_&>*]:brightness-200',
      },
      {
        variant: 'secondary',
        isCardButton: true,
        className:
          'group-hover:bg-neutral-25 group-focus:bg-primary-orange [.simulation-card:focus_&>*]:invert [.simulation-card:focus_&>*]:brightness-200',
      },
      {
        variant: 'tertiary',
        isCardButton: true,
        className:
          'group-hover:bg-neutral-25 group-focus:bg-primary-orange [.simulation-card:focus_&>*]:invert [.simulation-card:focus_&>*]:brightness-200',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isCardButton: false,
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  iconSrc: string
  alt?: string
  size?: keyof typeof sizeConfig
  isCardButton?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconSrc,
      alt = '',
      onClick,
      disabled,
      className,
      isCardButton = false,
      ...props
    },
    ref
  ) => {
    const disabledClasses = disabled
      ? 'opacity-30 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer'

    return (
      <button
        ref={ref}
        className={cn(
          iconButtonVariants({
            variant,
            size,
            isCardButton,
          }),
          disabledClasses,
          className
        )}
        onClick={onClick}
        disabled={disabled}
        type="button"
        {...props}
      >
        <Image
          src={iconSrc}
          alt={alt}
          width={sizeConfig[size].iconSize}
          height={sizeConfig[size].iconSize}
        />
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export { iconButtonVariants }
