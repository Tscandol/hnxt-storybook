'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { Radio } from '@/components/ui'
import { cn } from '@/lib/utils/css'

const cardVariants = cva(
  'relative flex flex-col items-center w-full p-4 bg-neutral-5 border-2 border-transparent transition-all duration-200',
  {
    variants: {
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
        checked: false,
        disabled: false,
        class: 'hover:border-neutral-50 hover:border-2',
      },
    ],
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  }
)

const imageVariants = cva('w-1/2 h-auto mb-4 object-contain', {
  variants: {},
  defaultVariants: {},
})

export interface CardWithRadioProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, 'checked'> {
  label: string
  imageSrc: string
  imageAlt: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export const CardWithRadio = React.forwardRef<
  HTMLDivElement,
  CardWithRadioProps
>(
  (
    {
      className,
      label,
      imageSrc,
      imageAlt,
      checked,
      onCheckedChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange(!checked)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onCheckedChange(!checked)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ checked, disabled }), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
        {...props}
      >
        <div className="absolute top-2 right-2">
          <Radio
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            size="sm"
          />
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={200}
            height={200}
            className={imageVariants()}
          />
        </div>

        <p className="text-medium font-semibold text-neutral-black mt-auto">
          {label}
        </p>
      </div>
    )
  }
)

CardWithRadio.displayName = 'CardWithRadio'
