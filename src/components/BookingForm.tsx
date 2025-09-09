'use client'

import { useState } from 'react'

interface BookingFormData {
  name: string
  email: string
  phone: string
  eventType: string
  guestCount: number
  eventDate: string
  startTime: string
  endTime: string
  message: string
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: 1,
    eventDate: '',
    startTime: '',
    endTime: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Transform form data to match API expectations
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        event_type: formData.eventType,
        guest_count: formData.guestCount,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        message: formData.message
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit booking')
      }

      const result = await response.json()
      console.log('Booking submitted successfully:', result)
      
      setSubmitStatus('success')
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        guestCount: 1,
        eventDate: '',
        startTime: '',
        endTime: '',
        message: ''
      })
    } catch (error) {
      console.error('Booking error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form-input"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventType" className="form-label">
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday Party</option>
              <option value="anniversary">Anniversary</option>
              <option value="corporate">Corporate Event</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="guestCount" className="form-label">
              Number of Guests *
            </label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              required
              min="1"
              max="100"
              className="form-input"
              placeholder="10"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div>
          <label htmlFor="eventDate" className="form-label">
            Event Date *
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="form-input"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="form-label">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="form-label">
              End Time *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="message" className="form-label">
            Additional Information
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="form-input"
            placeholder="Any special requirements or additional information..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Booking confirmed successfully!
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Your orangerie reservation is now secured. You'll receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Error submitting booking request
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Please try again or contact us directly.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
