'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const paginationVariants = cva('flex gap-2 items-center', {
  variants: {},
  defaultVariants: {},
})

const pageButtonVariants = cva(
  'w-10 h-10 rounded-md flex items-center justify-center text-medium transition-all duration-200',
  {
    variants: {
      isActive: {
        true: 'bg-primary-orange text-white',
        false: 'text-neutral-black hover:bg-neutral-5',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      {
        isActive: true,
        disabled: true,
        class: 'bg-primary-orange text-white opacity-50 cursor-not-allowed',
      },
    ],
    defaultVariants: {
      isActive: false,
      disabled: false,
    },
  }
)

const navigationButtonVariants = cva(
  'w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200',
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'text-neutral-black hover:bg-neutral-5 cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

export interface PaginationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationVariants> {
  count: number
  page: number
  onPageChange: (page: number) => void 
  disabled?: boolean
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    { className, count, page, onPageChange, disabled = false, ...props },
    ref
  ) => {
    const renderPageNumbers = () => {
      const pages: (number | 'ellipsis')[] = []
      const showEllipsis = count > 7

      if (showEllipsis) {
        if (page <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('ellipsis')
          pages.push(count)
        } else if (page >= count - 3) {
          pages.push(1)
          pages.push('ellipsis')
          for (let i = count - 4; i <= count; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('ellipsis')
          for (let i = page - 1; i <= page + 1; i++) {
            pages.push(i)
          }
          pages.push('ellipsis')
          pages.push(count)
        }
      } else {
        for (let i = 1; i <= count; i++) {
          pages.push(i)
        }
      }

      return pages
    }

    return (
      <div ref={ref} className={cn(paginationVariants(), className)} {...props}>
        <button
          onClick={() => !disabled && onPageChange(1)}
          disabled={disabled || page === 1}
          className={navigationButtonVariants({
            disabled: disabled || page === 1,
          })}
          type="button"
          aria-label="First page"
        >
          <Image
            src="/icons/chevron-double.svg"
            alt="First page"
            width={20}
            height={20}
          />
        </button>

        <button
          onClick={() => !disabled && onPageChange(page - 1)}
          disabled={disabled || page === 1}
          className={navigationButtonVariants({
            disabled: disabled || page === 1,
          })}
          type="button"
          aria-label="Previous page"
        >
          <Image
            src="/icons/chevron.svg"
            alt="Previous page"
            width={20}
            height={20}
          />
        </button>

        {renderPageNumbers().map((pageNumber, index) => (
          <button
            key={`${pageNumber}-${index}`}
            onClick={() =>
              !disabled &&
              typeof pageNumber === 'number' &&
              onPageChange(pageNumber)
            }
            className={pageButtonVariants({
              isActive: pageNumber === page,
              disabled: disabled || pageNumber === 'ellipsis',
            })}
            disabled={disabled || pageNumber === 'ellipsis'}
            type="button"
          >
            {pageNumber === 'ellipsis' ? '...' : pageNumber}
          </button>
        ))}

        <button
          onClick={() => !disabled && onPageChange(page + 1)}
          disabled={disabled || page === count}
          className={navigationButtonVariants({
            disabled: disabled || page === count,
          })}
          type="button"
          aria-label="Next page"
        >
          <Image
            src="/icons/chevron.svg"
            alt="Next page"
            width={20}
            height={20}
            className="rotate-180"
          />
        </button>

        <button
          onClick={() => !disabled && onPageChange(count)}
          disabled={disabled || page === count}
          className={navigationButtonVariants({
            disabled: disabled || page === count,
          })}
          type="button"
          aria-label="Last page"
        >
          <Image
            src="/icons/chevron-double.svg"
            alt="Last page"
            width={20}
            height={20}
            className="rotate-180"
          />
        </button>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export { paginationVariants, pageButtonVariants, navigationButtonVariants }
