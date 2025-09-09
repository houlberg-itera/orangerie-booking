import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, type Booking } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const booking: Omit<Booking, 'id' | 'created_at'> = req.body
      
      // Basic validation
      if (!booking.name || !booking.email || !booking.event_date || !booking.event_type) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(booking.email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // Validate date is in the future
      const eventDate = new Date(booking.event_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (eventDate < today) {
        return res.status(400).json({ error: 'Event date must be in the future' })
      }

      // Check for existing bookings on the same date
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_date', booking.event_date)
        .in('status', ['confirmed', 'pending'])

      if (checkError) {
        console.error('Error checking existing bookings:', checkError)
        return res.status(500).json({ error: 'Error checking availability' })
      }

      if (existingBookings && existingBookings.length > 0) {
        return res.status(409).json({ 
          error: 'Date is already booked or pending confirmation',
          conflictingBookings: existingBookings.map(b => ({
            date: b.event_date,
            time: `${b.start_time}-${b.end_time}`,
            status: b.status
          }))
        })
      }

      // Insert the booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          name: booking.name,
          email: booking.email,
          phone: booking.phone || null,
          event_type: booking.event_type,
          guest_count: booking.guest_count,
          event_date: booking.event_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          message: booking.message || null,
          status: 'pending'
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to save booking' })
      }

      console.log('New booking created:', data[0])

      return res.json({
        success: true,
        message: 'Booking request submitted successfully',
        bookingId: data[0].id,
        booking: data[0]
      })

    } catch (error) {
      console.error('Booking submission error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    try {
      // Get bookings for availability checking
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('event_date, start_time, end_time, status')
        .in('status', ['confirmed', 'pending'])
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })

      if (error) {
        console.error('Error fetching bookings:', error)
        return res.status(500).json({ error: 'Failed to fetch bookings' })
      }

      return res.json({
        bookings: bookings || []
      })
    } catch (error) {
      console.error('Error in GET handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
