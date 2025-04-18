'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const radioWrapperVariants = cva(
  'rounded-full flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'w-[38px] h-[38px]',
        md: 'w-[42px] h-[42px]',
        lg: 'w-[46px] h-[46px]',
      },
      disabled: {
        true: '',
        false: 'hover:bg-neutral-10 focus-within:bg-[#FF641833]',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
    },
  }
)

const radioVariants = cva(
  'rounded-full border-2 border-neutral-50 flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'w-[15px] h-[15px]',
        md: 'w-[18px] h-[18px]',
        lg: 'w-[21px] h-[21px]',
      },
      checked: {
        true: 'border-primary-orange',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      {
        checked: true,
        disabled: true,
        class: 'border-neutral-50',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
      disabled: false,
    },
  }
)

const radioInnerCircleVariants = cva(
  'rounded-full bg-primary-orange transition-transform duration-200',
  {
    variants: {
      size: {
        sm: 'w-[7px] h-[7px]',
        md: 'w-[10px] h-[10px]',
        lg: 'w-[13px] h-[13px]',
      },
      checked: {
        true: 'scale-100',
        false: 'scale-0',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
)

export interface RadioProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof radioWrapperVariants> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      className,
      checked,
      onCheckedChange,
      size = 'md',
      disabled = false,
      name,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(radioWrapperVariants({ size, disabled }), className)}>
        <button
          ref={ref}
          role="radio"
          aria-checked={checked}
          onClick={() => !disabled && onCheckedChange(!checked)}
          type="button"
          name={name}
          value={value}
          className={radioVariants({ size, checked, disabled })}
          disabled={disabled}
          {...props}
        >
          <div className={radioInnerCircleVariants({ size, checked })} />
        </button>
      </div>
    )
  }
)

Radio.displayName = 'Radio'
