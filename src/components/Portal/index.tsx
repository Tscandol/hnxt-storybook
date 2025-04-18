'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const portalVariants = cva('fixed z-50', {
  variants: {},
  defaultVariants: {},
})

export interface PortalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof portalVariants> {
  isOpen: boolean
  onClose?: () => void
  containerId?: string
}

export const Portal = React.forwardRef<HTMLDivElement, PortalProps>(
  (
    {
      className,
      isOpen,
      children,
      onClose,
      containerId = 'portal-menu-container',
      style,
      ...props
    },
    ref
  ) => {
    const [portalElement, setPortalElement] =
      React.useState<HTMLElement | null>(null)
    const innerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      let container = document.getElementById(containerId)

      if (!container) {
        container = document.createElement('div')
        container.id = containerId
        document.body.appendChild(container)
      }

      setPortalElement(container)

      return () => {
        if (document.getElementById(containerId)?.childElementCount === 0) {
          container?.parentElement?.removeChild(container)
        }
      }
    }, [containerId])

    React.useEffect(() => {
      if (!isOpen || !onClose) return

      const handleClickOutside = (event: MouseEvent) => {
        if (
          innerRef.current &&
          !innerRef.current.contains(event.target as Node)
        ) {
          onClose()
        }
      }

      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }, [isOpen, onClose])

    React.useEffect(() => {
      if (!ref || !innerRef.current) return

      if (typeof ref === 'function') {
        ref(innerRef.current)
      } else {
        ref.current = innerRef.current
      }
    }, [ref, isOpen])

    if (!isOpen || !portalElement) return null

    return createPortal(
      <div
        ref={innerRef}
        className={cn(portalVariants(), className)}
        style={style}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>,
      portalElement
    )
  }
)

Portal.displayName = 'Portal'
