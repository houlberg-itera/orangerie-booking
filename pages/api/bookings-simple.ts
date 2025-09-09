import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Check if we can import Supabase
    const { supabase } = await import('../../lib/supabase')
    
    if (req.method === 'GET') {
      // Test connection with a simple query
      const { data, error } = await supabase
        .from('bookings')
        .select('id, event_date, status')
        .limit(10)

      if (error) {
        console.error('Supabase query error:', error)
        return res.status(500).json({ 
          error: 'Database query failed',
          details: error.message
        })
      }

      return res.status(200).json({
        message: 'Database connection successful',
        bookingsCount: data?.length || 0,
        bookings: data
      })
    }

    if (req.method === 'POST') {
      // Simplified booking creation for testing
      const booking = req.body
      
      if (!booking.name || !booking.email) {
        return res.status(400).json({ error: 'Name and email are required' })
      }

      return res.status(200).json({
        message: 'Booking received (test mode)',
        booking: booking
      })
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).end(`Method ${req.method} Not Allowed`)

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}
