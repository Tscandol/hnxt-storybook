'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

export interface Step {
  label: string
  completed?: boolean
}

const stepperVariants = cva('flex items-center', {
  variants: {},
  defaultVariants: {},
})

const stepIconVariants = cva(
  'w-6 h-6 rounded-full flex items-center justify-center',
  {
    variants: {
      state: {
        active: 'bg-primary-orange',
        completed: 'bg-primary-orange',
        inactive: 'border border-neutral-50',
      },
    },
    defaultVariants: {
      state: 'inactive',
    },
  }
)

const stepLabelVariants = cva('text-sm', {
  variants: {
    state: {
      active: 'font-medium text-neutral-black',
      completed: 'font-medium text-neutral-black',
      inactive: 'text-neutral-50',
    },
  },
  defaultVariants: {
    state: 'inactive',
  },
})

const stepConnectorVariants = cva('h-[1px] flex-1', {
  variants: {
    completed: {
      true: 'bg-primary-orange',
      false: 'bg-neutral-50',
    },
  },
  defaultVariants: {
    completed: false,
  },
})

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  steps: Step[]
  activeStep: number
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, activeStep, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(stepperVariants(), className)} {...props}>
        {steps.map((step, index) => {
          const isActive = index === activeStep
          const isCompleted = index < activeStep
          const state = isActive
            ? 'active'
            : isCompleted
              ? 'completed'
              : 'inactive'

          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 pr-2',
                index !== steps.length - 1 && 'flex-1'
              )}
            >
              <div className={stepIconVariants({ state })}>
                {isCompleted ? (
                  <Image
                    src="/icons/check_white.svg"
                    alt="completed"
                    width={12}
                    height={12}
                  />
                ) : (
                  <span
                    className={cn('text-xs', {
                      'text-white': isActive || isCompleted,
                      'text-neutral-50': !isActive && !isCompleted,
                    })}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              <div>
                <span className={stepLabelVariants({ state })}>
                  {step.label}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={stepConnectorVariants({
                    completed: isCompleted,
                  })}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'

export {
  stepperVariants,
  stepIconVariants,
  stepLabelVariants,
  stepConnectorVariants,
}
