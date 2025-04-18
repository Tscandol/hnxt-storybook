'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/css'

const autocompleteContainerVariants = cva('flex flex-col', {
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

const inputContainerVariants = cva(
  'relative flex items-center w-full px-4 border h-12 appearance-none transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-5 border-neutral-5 hover:border-neutral-50 focus-within:bg-white focus-within:border-primary-orange',
        error: 'border-secondary-red',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  }
)

const inputVariants = cva(
  'w-full h-full bg-transparent appearance-none outline-none text-neutral-black placeholder:text-neutral-50',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
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
  'w-full px-4 py-2 text-left hover:bg-neutral-5 focus:outline-none focus:bg-[#FF641833] transition-all duration-500 ease-in-out cursor-pointer',
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

export type AutocompleteOption = {
  value: string
  label: string
}

export interface AutocompleteSelectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof autocompleteContainerVariants> {
  label?: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  options: AutocompleteOption[] | Record<string, string>
  onClear?: () => void
}

export const AutocompleteSelect = React.forwardRef<
  HTMLDivElement,
  AutocompleteSelectProps
>(
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
      onClear,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')
    const autocompleteRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const uniqueId = React.useId()
    const autocompleteId = id || `autocomplete-${uniqueId}`
    const listboxId = `listbox-${autocompleteId}`

    const setRefs = React.useCallback(
      (element: HTMLDivElement | null) => {
        autocompleteRef.current = element

        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref]
    )

    const normalizedOptions = React.useMemo(() => {
      if (Array.isArray(options)) {
        return options
      }
      return Object.entries(options).map(([key, value]) => ({
        value: value,
        label: key
          .split('_')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
          )
          .join(' '),
      }))
    }, [options])

    const filteredOptions = normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          autocompleteRef.current &&
          !autocompleteRef.current.contains(event.target as Node) &&
          isOpen
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    React.useEffect(() => {
      if (!value) {
        setSearchTerm('')
      } else {
        const selectedOption = normalizedOptions.find(
          (opt) => opt.value === value
        )
        if (selectedOption) {
          setSearchTerm(selectedOption.label)
        }
      }
    }, [value, normalizedOptions])

    const handleClear = () => {
      setSearchTerm('')
      onClear?.()
      setIsOpen(false)
      inputRef.current?.focus()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      setIsOpen(true)
    }

    const handleBlur = () => {
      setTimeout(() => {
        if (
          document.activeElement !== inputRef.current &&
          !autocompleteRef.current?.contains(document.activeElement)
        ) {
          setIsOpen(false)
        }
      }, 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        return
      }

      if (e.key === 'ArrowDown' && isOpen && filteredOptions.length > 0) {
        e.preventDefault()
        const listbox = document.getElementById(listboxId)
        const firstOption = listbox?.querySelector('button')
        ;(firstOption as HTMLElement)?.focus()
      }
    }

    const handleOptionKeyDown = (
      e: React.KeyboardEvent,
      optionValue: string,
      index: number
    ) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextOption = document.getElementById(
          `option-${index + 1}-${autocompleteId}`
        )
        if (nextOption) {
          nextOption.focus()
        } else {
          document.getElementById(`option-0-${autocompleteId}`)?.focus()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevOption = document.getElementById(
          `option-${index - 1}-${autocompleteId}`
        )
        if (prevOption) {
          prevOption.focus()
        } else {
          inputRef.current?.focus()
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelectOption(optionValue)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.focus()
      }
    }

    const handleSelectOption = (optionValue: string) => {
      const selectedOption = normalizedOptions.find(
        (opt) => opt.value === optionValue
      )
      if (selectedOption) {
        onValueChange(optionValue)
        setSearchTerm(selectedOption.label)
        setIsOpen(false)

        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
    }

    return (
      <div
        ref={setRefs}
        className={cn(autocompleteContainerVariants({ fullWidth }), className)}
        {...props}
      >
        {label && (
          <Label
            htmlFor={autocompleteId}
            variant={error ? 'error' : 'default'}
            required={required}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <div
            className={inputContainerVariants({
              variant: error ? 'error' : 'default',
              disabled,
            })}
          >
            <input
              ref={inputRef}
              id={autocompleteId}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={inputVariants({ disabled })}
              aria-autocomplete="list"
              aria-controls={isOpen ? listboxId : undefined}
              autoComplete="off"
            />

            <div className="flex items-center space-x-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn({
                    '[&>img]:opacity-50': disabled,
                  })}
                  aria-label="Effacer la sélection"
                  tabIndex={-1}
                  disabled={disabled}
                >
                  <Image
                    src="/icons/close.svg"
                    alt="clear"
                    width={24}
                    height={24}
                  />
                </button>
              )}
              <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn({
                  '[&>img]:opacity-50': disabled,
                })}
                aria-label={isOpen ? 'Fermer la liste' : 'Ouvrir la liste'}
                tabIndex={-1}
                disabled={disabled}
              >
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
              </button>
            </div>
          </div>

          {isOpen && filteredOptions.length > 0 && (
            <div
              id={listboxId}
              className={dropdownVariants()}
              role="listbox"
              aria-labelledby={autocompleteId}
            >
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  id={`option-${index}-${autocompleteId}`}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option.value, index)}
                  className={optionVariants({
                    selected: option.value === value,
                  })}
                  role="option"
                  aria-selected={option.value === value}
                  tabIndex={0}
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
            role="status"
            id={`helper-${autocompleteId}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

AutocompleteSelect.displayName = 'AutocompleteSelect'

export {
  autocompleteContainerVariants,
  inputContainerVariants,
  inputVariants,
  dropdownVariants,
  optionVariants,
  helperTextVariants,
}
