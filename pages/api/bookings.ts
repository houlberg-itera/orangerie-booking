import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, type Booking } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Log environment variables status (without exposing them)
  console.log('Environment check:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
  })

  if (req.method === 'POST') {
    try {
      const booking: Omit<Booking, 'id' | 'created_at'> = req.body
      
      console.log('Received booking data:', booking)
      
      // Basic validation
      if (!booking.name || !booking.event_date || !booking.event_type || !booking.street_name || !booking.street_number) {
        console.log('Validation failed: Missing required fields')
        return res.status(400).json({ error: 'Manglende påkrævede felter' })
      }

      // Validate date is in the future
      const eventDate = new Date(booking.event_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (eventDate < today) {
        return res.status(400).json({ error: 'Arrangementsdato skal være i fremtiden' })
      }

      // Check for existing bookings on the same date
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_date', booking.event_date)
        .in('status', ['confirmed', 'pending'])

      if (checkError) {
        console.error('Error checking existing bookings:', checkError)
        return res.status(500).json({ error: 'Fejl ved kontrol af tilgængelighed' })
      }

      // Check for time conflicts
      if (existingBookings && existingBookings.length > 0) {
        const newStartTime = booking.start_time
        const newEndTime = booking.end_time
        
        const conflictingBookings = existingBookings.filter(existing => {
          const existingStart = existing.start_time
          const existingEnd = existing.end_time
          
          // Check if times overlap
          // Overlap occurs if: new start < existing end AND new end > existing start
          return (newStartTime < existingEnd && newEndTime > existingStart)
        })
        
        if (conflictingBookings.length > 0) {
          return res.status(409).json({ 
            error: 'Tidspunkt konflikter med eksisterende booking',
            conflictingBookings: conflictingBookings.map(b => ({
              date: b.event_date,
              time: `${b.start_time}-${b.end_time}`,
              status: b.status,
              name: b.name
            })),
            requestedTime: `${newStartTime}-${newEndTime}`
          })
        }
      }

      // Insert the booking into Supabase as confirmed
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          name: booking.name,
          email: booking.email || null,
          phone: booking.phone || null,
          street_name: booking.street_name,
          street_number: booking.street_number,
          event_type: booking.event_type,
          guest_count: booking.guest_count || null,
          event_date: booking.event_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          message: booking.message || null,
          status: 'confirmed'
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Fejl ved gemning af booking' })
      }

      console.log('New booking created:', data[0])

      return res.json({
        success: true,
        message: 'Booking bekræftet med succes! Din orangeri-reservation er nu sikret.',
        bookingId: data[0].id,
        booking: data[0]
      })

    } catch (error) {
      console.error('Booking submission error:', error)
      return res.status(500).json({ error: 'Intern serverfejl' })
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
        return res.status(500).json({ error: 'Fejl ved hentning af bookinger' })
      }

      return res.json({
        bookings: bookings || []
      })
    } catch (error) {
      console.error('Error in GET handler:', error)
      return res.status(500).json({ error: 'Intern serverfejl' })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
