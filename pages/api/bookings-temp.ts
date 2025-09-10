import type { NextApiRequest, NextApiResponse } from 'next'

// Temporary in-memory storage for demo purposes
let bookings: any[] = [
  {
    id: 1,
    event_date: '2025-09-15',
    start_time: '14:00',
    end_time: '18:00',
    status: 'confirmed'
  },
  {
    id: 2,
    event_date: '2025-09-20',
    start_time: '10:00',
    end_time: '16:00',
    status: 'confirmed'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const booking = req.body
      
      // Basic validation
      if (!booking.name || !booking.email || !booking.event_date || !booking.event_type) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(booking.email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // Check for date conflicts (simplified)
      const existingBooking = bookings.find(b => 
        b.event_date === booking.event_date && 
        b.status !== 'cancelled'
      )

      if (existingBooking) {
        return res.status(409).json({ 
          error: 'This date is already booked. Please choose another date.' 
        })
      }

      // Add booking to temporary storage
      const newBooking = {
        ...booking,
        id: Date.now(),
        status: 'pending',
        created_at: new Date().toISOString()
      }

      bookings.push(newBooking)

      console.log('New booking received:', newBooking)
      
      return res.status(200).json({ 
        message: 'Booking request submitted successfully! We will contact you soon to confirm.',
        booking: newBooking
      })

    } catch (error) {
      console.error('Error processing booking:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    // Return existing bookings for calendar
    return res.status(200).json({ bookings })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
