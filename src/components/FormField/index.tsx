'use client'

import * as React from 'react'
import { useId } from 'react'
import Image from 'next/image'
import { Label } from '../Label'
import { Input, type InputProps } from '../Input'
import { Tooltip } from '../Tooltip'
import { cn } from '@/lib/utils/css'

export interface FormFieldProps extends InputProps {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  endAdornment?: React.ReactNode
  justifyContent?: 'start' | 'end'
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      className,
      label,
      helperText,
      error,
      required,
      type = 'text',
      fullWidth = true,
      endAdornment,
      disabled,
      value,
      justifyContent = 'start',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = type === 'password' && showPassword ? 'text' : type
    const hasEndElement = type === 'password' || !!endAdornment

    const generatedId = useId()
    const fieldId = id || `field-${props.name || ''}-${generatedId}`

    return (
      <div
        className={cn(
          'flex flex-col',
          fullWidth ? 'w-full' : 'w-[200px]',
          {
            'justify-end': justifyContent === 'end',
            'justify-start': justifyContent === 'start',
          },
          className
        )}
      >
        {label && (
          <div className="flex items-center justify-start">
            <Label
              htmlFor={fieldId}
              variant={error ? 'error' : 'default'}
              required={required}
              className={disabled ? 'opacity-50' : ''}
            >
              {label}
            </Label>
            {helperText && <Tooltip content={helperText} />}
          </div>
        )}

        <div className="relative">
          <Input
            id={fieldId}
            ref={ref}
            type={inputType}
            value={value}
            variant={error ? 'error' : 'default'}
            fullWidth={fullWidth}
            hasEndElement={hasEndElement}
            disabled={disabled}
            {...props}
          />

          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute right-4 top-3',
                value ? 'text-neutral-black' : 'text-neutral-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
            >
              <Image
                src={`/icons/${showPassword ? 'eye-off' : 'eye'}.svg`}
                alt={
                  showPassword
                    ? 'Masquer mot de passe'
                    : 'Afficher mot de passe'
                }
                width={24}
                height={24}
              />
            </button>
          )}

          {endAdornment && !['password'].includes(type) && (
            <span
              className={cn(
                'absolute right-4 top-3 -translate-x-1',
                value ? 'text-neutral-black' : 'text-neutral-50'
              )}
            >
              {endAdornment}
            </span>
          )}
        </div>

        {error && (
          <p
            className={cn('text-xs mt-2', {
              'text-secondary-red': error && !disabled,
              'text-neutral-50': !error && !disabled,
              'text-neutral-25': disabled,
            })}
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export { FormField }
