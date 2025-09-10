'use client'

import { useState } from 'react'

interface BookingFormData {
  name: string
  streetName: string
  streetNumber: string
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  message: string
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    streetName: '',
    streetNumber: '',
    eventType: '',
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
        street_name: formData.streetName,
        street_number: formData.streetNumber,
        event_type: formData.eventType,
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
        streetName: '',
        streetNumber: '',
        eventType: '',
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
        <div>
          <label htmlFor="name" className="form-label">
            Fulde Navn *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-input"
            placeholder="Dit fulde navn"
          />
        </div>

        {/* Address Information */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="streetName" className="form-label">
              Gadenavn *
            </label>
            <input
              type="text"
              id="streetName"
              name="streetName"
              value={formData.streetName}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Hovedgade"
            />
          </div>
          
          <div>
            <label htmlFor="streetNumber" className="form-label">
              Husnummer *
            </label>
            <input
              type="text"
              id="streetNumber"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="123A"
            />
          </div>
        </div>

        {/* Event Details */}
        <div>
          <label htmlFor="eventType" className="form-label">
            Arrangementtype *
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            required
            className="form-input"
          >
            <option value="">Vælg arrangementtype</option>
            <option value="wedding">Bryllup</option>
            <option value="birthday">Fødselsdagsfest</option>
            <option value="anniversary">Jubilæum</option>
            <option value="corporate">Firmaarrangement</option>
            <option value="meeting">Møde</option>
            <option value="other">Andet</option>
          </select>
        </div>

        {/* Date and Time */}
        <div>
          <label htmlFor="eventDate" className="form-label">
            Arrangementsdato *
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
              Starttidspunkt *
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
              Sluttidspunkt *
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
            Yderligere Oplysninger
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="form-input"
            placeholder="Særlige ønsker eller yderligere information..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sender...' : 'Send Bookingforespørgsel'}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Booking bekræftet med succes!
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Din orangeri-reservation er nu sikret. Du vil modtage en bekræftelsesmail snart.
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
                  Fejl ved indgivelse af bookingforespørgsel
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Prøv venligst igen eller kontakt os direkte.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
