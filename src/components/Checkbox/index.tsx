'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

export type CheckboxSize = 'sm' | 'md' | 'lg'

const wrapperVariants = cva(
  'rounded-full flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'w-[38px] h-[38px]',
        md: 'w-[42px] h-[42px]',
        lg: 'w-[46px] h-[46px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const buttonVariants = cva('flex items-center justify-center', {
  variants: {
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    disabled: false,
  },
})

export interface CheckboxProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof wrapperVariants>, 'disabled'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  size?: CheckboxSize
  disabled?: boolean
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      onCheckedChange,
      size = 'md',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const checkboxSizes = {
      sm: 15,
      md: 18,
      lg: 21,
    }

    const iconSize = checkboxSizes[size]

    const wrapperClassName = cn(
      wrapperVariants({ size }),
      !disabled && 'hover:bg-neutral-10 focus-within:bg-[#FF641833]',
      className
    )

    return (
      <div className={wrapperClassName}>
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked}
          onClick={() => !disabled && onCheckedChange(!checked)}
          className={buttonVariants({ disabled })}
          type="button"
          disabled={disabled}
          {...props}
        >
          <Image
            src={`/icons/checkbox${checked ? '_orange' : '-empty'}.svg`}
            alt="Checkbox"
            width={iconSize}
            height={iconSize}
          />
        </button>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
