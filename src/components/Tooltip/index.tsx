'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const tooltipVariants = cva(
  'absolute z-50 bg-neutral-25 p-4 min-w-[180px] max-w-[300px] w-max',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      },
    },
    defaultVariants: {
      position: 'top',
    },
  }
)
export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, position = 'top', ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const tooltipRef = React.useRef<HTMLDivElement>(null)
    const iconRef = React.useRef<HTMLButtonElement>(null)
    const componentRef = ref || React.createRef<HTMLDivElement>()

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node) &&
          iconRef.current &&
          !iconRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const getArrowStyle = () => {
      const baseStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
      } as React.CSSProperties

      switch (position) {
        case 'bottom':
          return {
            ...baseStyle,
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -100%)',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #bfbfbf',
          }
        case 'left':
          return {
            ...baseStyle,
            top: '50%',
            right: 0,
            transform: 'translate(100%, -50%)',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid #bfbfbf',
          }
        case 'right':
          return {
            ...baseStyle,
            top: '50%',
            left: 0,
            transform: 'translate(-100%, -50%)',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '8px solid #bfbfbf',
          }
        case 'top':
        default:
          return {
            ...baseStyle,
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%, 100%)',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #bfbfbf',
          }
      }
    }

    return (
      <div ref={componentRef} className="relative inline-block ml-1" {...props}>
        <button
          ref={iconRef}
          className="inline-flex items-center justify-center cursor-pointer focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label={isOpen ? "Masquer l'info-bulle" : "Afficher l'info-bulle"}
        >
          <Image
            src="/icons/tooltip.svg"
            alt="Plus d'informations"
            width={16}
            height={16}
          />
        </button>

        {isOpen && (
          <div
            ref={tooltipRef}
            className={cn(tooltipVariants({ position }), className)}
            role="tooltip"
          >
            <div style={getArrowStyle()} />

            <div className="flex justify-between items-center gap-2">
              <div className="text-sm">{content}</div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
                className="ml-1 flex-shrink-0"
                type="button"
              >
                <Image
                  src="/icons/close.svg"
                  alt="Fermer"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export { tooltipVariants }
