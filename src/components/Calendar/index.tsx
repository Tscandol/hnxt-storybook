'use client'

import * as React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/css'

const calendarWrapperVariants = cva('p-4 bg-white shadow-lg', {
  variants: {},
  defaultVariants: {},
})

const dayButtonVariants = cva(
  'w-8 h-8 flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer',
  {
    variants: {
      selected: {
        true: 'bg-primary-orange text-white',
        false: 'hover:bg-neutral-10',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

const yearButtonVariants = cva('p-2 transition-all duration-500 ease-in-out cursor-pointer', {
  variants: {
    selected: {
      true: 'bg-primary-orange text-white',
      false: 'hover:bg-neutral-10',
    },
  },
  defaultVariants: {
    selected: false,
  },
})

const navigationButtonVariants = cva('bg-neutral-10 p-2 cursor-pointer', {
  variants: {
    direction: {
      up: 'rotate-180',
      left: 'rotate-90',
      right: '-rotate-90',
      down: '',
    },
  },
  defaultVariants: {
    direction: 'down',
  },
})

const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
const YEARS_PER_VIEW = 20

export interface CalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarWrapperVariants> {
  dateValue: Date | null
  onDateValueChange: (date: Date) => void
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, dateValue, onDateValueChange, ...props }, ref) => {
    const initialDate = dateValue
      ? new Date(
          Date.UTC(
            dateValue.getUTCFullYear(),
            dateValue.getUTCMonth(),
            dateValue.getUTCDate()
          )
        )
      : new Date(
          Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
        )

    const [currentDate, setCurrentDate] = React.useState(initialDate)
    const [isYearPickerOpen, setIsYearPickerOpen] = React.useState(false)
    const [yearRangeStart, setYearRangeStart] = React.useState(
      new Date().getUTCFullYear() - YEARS_PER_VIEW / 2
    )

    const handlePrevMonth = () => {
      setCurrentDate(
        new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth() - 1,
            1
          )
        )
      )
    }

    const handleNextMonth = () => {
      setCurrentDate(
        new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth() + 1,
            1
          )
        )
      )
    }

    const handlePrevYears = () => {
      setYearRangeStart(yearRangeStart - YEARS_PER_VIEW)
    }

    const handleNextYears = () => {
      setYearRangeStart(yearRangeStart + YEARS_PER_VIEW)
    }

    const handleSelectYear = (year: number) => {
      setCurrentDate(new Date(Date.UTC(year, currentDate.getUTCMonth(), 1)))
      setIsYearPickerOpen(false)
    }

    const handleDateSelect = (day: number) => {
      const newDate = new Date(
        Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), day)
      )
      onDateValueChange(newDate)
    }

    const getDaysInMonth = (date: Date) => {
      return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
      ).getUTCDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
      const firstDay = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
      ).getUTCDay()
      return firstDay === 0 ? 6 : firstDay - 1
    }

    const renderCalendar = () => {
      const daysInMonth = getDaysInMonth(currentDate)
      const firstDay = getFirstDayOfMonth(currentDate)
      const days = []

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />)
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const isSelected =
          dateValue &&
          day === dateValue.getUTCDate() &&
          currentDate.getUTCMonth() === dateValue.getUTCMonth() &&
          currentDate.getUTCFullYear() === dateValue.getUTCFullYear()

        days.push(
          <button
            key={day}
            onClick={() => handleDateSelect(day)}
            className={dayButtonVariants({ selected: isSelected })}
            type="button"
          >
            {day}
          </button>
        )
      }

      return days
    }

    const renderYearPicker = () => {
      const years = []
      for (
        let year = yearRangeStart;
        year < yearRangeStart + YEARS_PER_VIEW;
        year++
      ) {
        const isCurrentYear = currentDate.getUTCFullYear() === year

        years.push(
          <button
            key={year}
            onClick={() => handleSelectYear(year)}
            className={yearButtonVariants({ selected: isCurrentYear })}
            type="button"
          >
            {year}
          </button>
        )
      }
      return years
    }

    return (
      <div
        ref={ref}
        className={cn(calendarWrapperVariants(), className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <span>
            {MONTHS[currentDate.getUTCMonth()]} {currentDate.getUTCFullYear()}
          </span>
          <button
            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
            className={navigationButtonVariants({
              direction: isYearPickerOpen ? 'up' : 'down',
            })}
            type="button"
            aria-label="Afficher la sélection d'années"
          >
            <Image
              src="/icons/arrow-down.svg"
              alt="arrow"
              width={20}
              height={20}
            />
          </button>
          <div className="flex gap-2">
            <button
              onClick={isYearPickerOpen ? handlePrevYears : handlePrevMonth}
              className={navigationButtonVariants({ direction: 'left' })}
              type="button"
              aria-label={
                isYearPickerOpen ? 'Années précédentes' : 'Mois précédent'
              }
            >
              <Image
                src="/icons/arrow-down.svg"
                alt="previous"
                width={20}
                height={20}
              />
            </button>

            <button
              onClick={isYearPickerOpen ? handleNextYears : handleNextMonth}
              className={navigationButtonVariants({ direction: 'right' })}
              type="button"
              aria-label={
                isYearPickerOpen ? 'Années suivantes' : 'Mois suivant'
              }
            >
              <Image
                src="/icons/arrow-down.svg"
                alt="next"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {isYearPickerOpen ? (
          <div className="grid grid-cols-4 gap-1">{renderYearPicker()}</div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-neutral-50">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </>
        )}
      </div>
    )
  }
)

Calendar.displayName = 'Calendar'

export {
  calendarWrapperVariants,
  dayButtonVariants,
  yearButtonVariants,
  navigationButtonVariants,
}
