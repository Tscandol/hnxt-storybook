'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

export interface TabProps {
  label: string
  value: string
}

const tabsVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal:
        'flex-row overflow-x-auto scrollbar-thin scrollbar-track-neutral-5 scrollbar-thumb-neutral-25',
      vertical: 'flex-col',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
  },
})

const tabVariants = cva(
  'text-medium px-4 py-2 transition-all duration-500 ease-in-out',
  {
    variants: {
      isActive: {
        true: 'bg-primary-orange text-white',
        false: 'text-neutral-black hover:bg-neutral-10 focus:bg-neutral-10',
      },
      orientation: {
        horizontal: '',
        vertical: '',
      },
      fullWidth: {
        true: 'flex-1 text-center',
        false: 'min-w-fit',
      },
    },
    compoundVariants: [
      {
        fullWidth: true,
        orientation: 'vertical',
        class: '',
      },
    ],
    defaultVariants: {
      isActive: false,
      orientation: 'horizontal',
      fullWidth: false,
    },
  }
)

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  tabs: TabProps[]
  value: string
  onValueChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs,
      value,
      onValueChange,
      orientation = 'horizontal',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(tabsVariants({ orientation, fullWidth }), className)}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={value === tab.value}
            aria-controls={`panel-${tab.value}`}
            className={tabVariants({
              isActive: value === tab.value,
              orientation,
              fullWidth: fullWidth && orientation === 'horizontal',
            })}
            onClick={() => onValueChange(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  panelValue: string
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, panelValue, children, className, ...props }, ref) => {
    if (value !== panelValue) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${panelValue}`}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabPanel.displayName = 'TabPanel'

export { tabsVariants, tabVariants }
