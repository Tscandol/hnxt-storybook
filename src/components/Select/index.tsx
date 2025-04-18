'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils/css'

const selectContainerVariants = cva('flex flex-col', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-[200px]',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
})

const selectButtonVariants = cva(
  'px-4 border h-12 w-full appearance-none text-neutral-black placeholder:text-neutral-50 transition-all duration-500 ease-in-out focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-5 border-neutral-5 hover:border-neutral-50 focus:bg-white focus:border-primary-orange',
        error: 'border-secondary-red',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
      focused: {
        true: 'border-primary-orange bg-white',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
      focused: false,
    },
  }
)

const dropdownVariants = cva(
  'absolute z-10 w-full mt-1 bg-white border border-neutral-5 shadow-lg max-h-60 overflow-auto transition-all duration-500 ease-in-out',
  {
    variants: {},
    defaultVariants: {},
  }
)

const optionVariants = cva(
  'w-full px-4 py-2 text-left hover:bg-neutral-5 focus:outline-hidden focus:bg-[#FF641833] transition-all duration-500 ease-in-out cursor-pointer',
  {
    variants: {
      selected: {
        true: 'bg-[#FF641833]',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

const helperTextVariants = cva('text-xs mt-2 pl-6', {
  variants: {
    error: {
      true: 'text-secondary-red',
      false: 'text-neutral-50',
    },
    disabled: {
      true: 'text-neutral-25',
      false: '',
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
})

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof selectContainerVariants> {
  label?: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  options: SelectOption[]
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      label,
      value,
      onValueChange,
      error,
      helperText,
      required,
      fullWidth = true,
      disabled,
      placeholder,
      options,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = value && value.length > 0
    const selectedOption = options.find((option) => option.value === value)
    const selectRef = React.useRef<HTMLDivElement>(null)

    const uniqueId = React.useId()
    const selectId = id || `select-${uniqueId}`

    const setRefs = React.useCallback(
      (element: HTMLDivElement | null) => {
        selectRef.current = element

        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          isOpen
        ) {
          setIsOpen(false)
          setIsFocused(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const handleToggleOpen = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
        setIsFocused(!isOpen)
      }
    }

    const handleSelectOption = (optionValue: string) => {
      onValueChange(optionValue)
      setIsOpen(false)
      setIsFocused(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setIsFocused(false)
        return
      }

      if ((e.key === 'ArrowDown' || e.key === 'Enter') && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
        setIsFocused(true)
        return
      }

      if (isOpen && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault()
        const currentIndex = options.findIndex((opt) => opt.value === value)
        let nextIndex = currentIndex

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
        }

        onValueChange(options[nextIndex].value)
      }
    }

    return (
      <div
        ref={setRefs}
        className={cn(selectContainerVariants({ fullWidth }), className)}
        {...props}
      >
        {label && (
          <Label
            htmlFor={selectId}
            variant={error ? 'error' : 'default'}
            required={required}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <button
            id={selectId}
            type="button"
            onClick={handleToggleOpen}
            onKeyDown={handleKeyDown}
            className={selectButtonVariants({
              variant: error ? 'error' : 'default',
              disabled,
              focused: isFocused || isOpen,
            })}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? selectId : undefined}
          >
            <div className="flex items-center justify-between">
              <span className={!hasValue ? 'text-neutral-50' : ''}>
                {selectedOption?.label || placeholder}
              </span>
              <Image
                src="/icons/arrow-down.svg"
                alt="toggle"
                width={24}
                height={24}
                className={cn(
                  'transition-transform',
                  isOpen ? 'rotate-180' : ''
                )}
              />
            </div>
          </button>

          {isOpen && !disabled && (
            <div
              className={dropdownVariants()}
              role="listbox"
              aria-activedescendant={
                value ? `option-${value}-${selectId}` : undefined
              }
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  id={`option-${option.value}-${selectId}`}
                  onClick={() => handleSelectOption(option.value)}
                  className={optionVariants({
                    selected: option.value === value,
                  })}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={helperTextVariants({ error: !!error, disabled })}
            aria-live={error ? 'assertive' : 'polite'}
            id={`helper-${selectId}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export {
  selectContainerVariants,
  selectButtonVariants,
  dropdownVariants,
  optionVariants,
  helperTextVariants,
}
