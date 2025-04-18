'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { Calendar } from '@/components/ui/Calendar'
import { cn } from '@/lib/utils/css'
import { formatDate, parseDateString } from '@/lib/utils/dates'

const datePickerContainerVariants = cva('flex flex-col', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-[280px]',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
})

const inputVariants = cva(
  'w-full px-4 py-3 appearance-none bg-neutral-5 text-neutral-black placeholder:text-neutral-25 outline-hidden border border-transparent transition-all duration-500 ease-in-out',
  {
    variants: {
      error: {
        true: 'border border-secondary-red',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      focused: {
        true: 'border-primary-orange bg-white',
        false: '',
      },
    },
    compoundVariants: [
      {
        error: false,
        disabled: false,
        focused: false,
        class: 'hover:border-neutral-50',
      },
    ],
    defaultVariants: {
      error: false,
      disabled: false,
      focused: false,
    },
  }
)

const helperTextVariants = cva('text-xs mt-2 pl-6', {
  variants: {
    error: {
      true: 'text-secondary-red',
      false: 'text-neutral-50',
    },
  },
  defaultVariants: {
    error: false,
  },
})

export interface DatePickerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof datePickerContainerVariants> {
  dateValue: Date | null
  onDateValueChange: (date: Date | null) => void
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  name?: string
  autoComplete?: string
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      dateValue,
      onDateValueChange,
      label,
      error,
      helperText,
      required,
      fullWidth = true,
      disabled,
      placeholder = 'JJ/MM/AAAA',
      name,
      autoComplete = 'off',
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(
      dateValue ? formatDate(dateValue) : ''
    )
    const [isManuallyEditing, setIsManuallyEditing] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement>(null)
    const calendarRef = React.useRef<HTMLDivElement>(null)

    const generatedId = React.useId()
    const fieldId = `datepicker-${name || 'date'}-${generatedId}`

    const handleInputBlur = React.useCallback(() => {
      setIsFocused(false)

      if (isManuallyEditing) {
        if (inputValue) {
          const parsedDate = parseDateString(inputValue)
          if (parsedDate) {
            onDateValueChange(parsedDate)
          } else {
            setInputValue(dateValue ? formatDate(dateValue) : '')
          }
        } else {
          onDateValueChange(null)
        }
        setIsManuallyEditing(false)
      } else if (dateValue) {
        setInputValue(formatDate(dateValue))
      } else {
        setInputValue('')
      }
    }, [isManuallyEditing, inputValue, onDateValueChange, dateValue])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)

          if (!isManuallyEditing) {
            setInputValue(dateValue ? formatDate(dateValue) : '')
          } else {
            handleInputBlur()
          }
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isManuallyEditing, dateValue, handleInputBlur])

    React.useEffect(() => {
      if (dateValue) {
        setInputValue(formatDate(dateValue))
      } else {
        setInputValue('')
      }
    }, [dateValue])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsManuallyEditing(true)
      const rawValue = e.target.value

      if (isOpen) {
        setIsOpen(false)
      }

      const digitsOnly = rawValue.replace(/\D/g, '')
      const truncated = digitsOnly.substring(0, 8)

      let formattedValue = ''
      if (truncated.length > 0) {
        formattedValue = truncated.substring(0, 2)

        if (truncated.length > 2) {
          formattedValue += '/' + truncated.substring(2, 4)

          if (truncated.length > 4) {
            formattedValue += '/' + truncated.substring(4)
          }
        }
      }
      setInputValue(formattedValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        if (inputValue) {
          const parsedDate = parseDateString(inputValue)
          if (parsedDate) {
            onDateValueChange(parsedDate)
          } else {
            setInputValue(dateValue ? formatDate(dateValue) : '')
          }
        } else {
          onDateValueChange(null)
        }
        setIsManuallyEditing(false)
        inputRef.current?.blur()
      }
    }

    const handleCalendarButtonClick = () => {
      if (disabled) return

      if (isManuallyEditing) {
        setInputValue('')
        setIsManuallyEditing(false)
      }

      setIsOpen(!isOpen)
    }

    const handleInputClick = () => {
      if (isOpen) {
        setIsOpen(false)
      }
      setIsManuallyEditing(true)
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleDateSelect = (date: Date) => {
      onDateValueChange(date)
      setInputValue(formatDate(date))
      setIsOpen(false)
      setIsManuallyEditing(false)
    }

    return (
      <div
        ref={ref}
        className={cn(datePickerContainerVariants({ fullWidth }), className)}
        {...props}
      >
        {label && (
          <label
            htmlFor={fieldId}
            className="mb-2 text-medium text-neutral-black"
          >
            {label}
            {required && <span>*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            placeholder={placeholder}
            disabled={disabled}
            className={inputVariants({
              error: !!error,
              disabled,
              focused: isFocused,
            })}
            id={fieldId}
            name={name || 'date'}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={
              error || helperText ? `${fieldId}-feedback` : undefined
            }
          />

          <button
            type="button"
            onClick={handleCalendarButtonClick}
            className={cn('absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer', {
              '[&>img]:opacity-25': disabled,
            })}
            disabled={disabled}
            aria-label="Ouvrir le calendrier"
          >
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={24}
              height={24}
            />
          </button>

          {isOpen && !disabled && (
            <div ref={calendarRef} className="absolute z-10 mt-1">
              <Calendar
                dateValue={dateValue}
                onDateValueChange={handleDateSelect}
              />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={`${fieldId}-feedback`}
            className={helperTextVariants({ error: !!error })}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { datePickerContainerVariants, inputVariants, helperTextVariants }
