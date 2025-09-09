'use client'

import { useState, useEffect } from 'react'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isAvailable: boolean
  isPartiallyBooked: boolean
  isFullyBooked: boolean
  bookingTimes: string[]
}

interface BookingData {
  event_date: string
  start_time: string
  end_time: string
  status: string
}

export default function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingsData, setBookingsData] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookingsData(data.bookings || [])
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
        // Fallback to empty array if API fails
        setBookingsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return bookingsData.filter(booking => booking.event_date === dateString)
  }

  const isDateInPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of the month and how many days to show from previous month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()
    
    const days: CalendarDay[] = []
    
    // Add days from previous month
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isAvailable: false,
        isPartiallyBooked: false,
        isFullyBooked: false,
        bookingTimes: []
      })
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const dayBookings = getBookingsForDate(date)
      const bookingTimes = dayBookings.map(b => `${b.start_time}-${b.end_time}`)
      const isInPast = isDateInPast(date)
      
      // A day is fully booked if it has bookings covering the entire day (simplified logic)
      const isFullyBooked = dayBookings.length >= 3 // Assuming max 3 slots per day
      const isPartiallyBooked = dayBookings.length > 0 && !isFullyBooked
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isAvailable: !isInPast && !isFullyBooked,
        isPartiallyBooked,
        isFullyBooked,
        bookingTimes
      })
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isAvailable: false,
        isPartiallyBooked: false,
        isFullyBooked: false,
        bookingTimes: []
      })
    }
    
    return days
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && day.isAvailable) {
      setSelectedDate(day.date)
    }
  }

  const calendarDays = generateCalendarDays()
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card p-6">
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading availability...</p>
        </div>
      )}
      
      {!loading && (
        <>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isSelected = selectedDate?.toDateString() === day.date.toDateString()
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={!day.isCurrentMonth || !day.isAvailable}
              className={`
                h-10 w-full flex items-center justify-center text-sm rounded-md transition-colors relative
                ${!day.isCurrentMonth 
                  ? 'text-gray-300 cursor-default' 
                  : day.isAvailable
                    ? 'text-gray-900 hover:bg-primary-50 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }
                ${day.isToday ? 'bg-blue-100 text-blue-900 font-semibold' : ''}
                ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                ${day.isFullyBooked ? 'bg-red-100 text-red-900' : ''}
                ${day.isPartiallyBooked ? 'bg-yellow-100 text-yellow-900' : ''}
              `}
            >
              {day.date.getDate()}
              
              {/* Availability indicator */}
              {day.isCurrentMonth && (
                <div className={`
                  absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full
                  ${day.isAvailable ? 'bg-green-500' : day.isFullyBooked ? 'bg-red-500' : day.isPartiallyBooked ? 'bg-yellow-500' : 'bg-gray-300'}
                `} />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Fully Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Partially Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-md">
          <p className="text-sm font-medium text-primary-800">
            Selected Date: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {(() => {
            const dayBookings = getBookingsForDate(selectedDate)
            if (dayBookings.length > 0) {
              return (
                <div className="text-sm text-primary-700 mt-1">
                  <p>Existing bookings:</p>
                  <ul className="list-disc list-inside mt-1">
                    {dayBookings.map((booking, index) => (
                      <li key={index}>{booking.start_time} - {booking.end_time}</li>
                    ))}
                  </ul>
                  <p className="mt-1">You can still book if your time doesn't conflict with existing bookings.</p>
                </div>
              )
            } else {
              return (
                <p className="text-sm text-primary-700 mt-1">
                  This date is available for booking. Please fill out the booking form to reserve.
                </p>
              )
            }
          })()}
        </div>
      )}
        </>
      )}
    </div>
  )
}
