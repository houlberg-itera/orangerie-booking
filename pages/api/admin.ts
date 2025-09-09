import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Get all bookings for admin view
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) {
        console.error('Error fetching bookings:', error)
        return res.status(500).json({ error: 'Failed to fetch bookings' })
      }

      return res.json({
        bookings: bookings || []
      })
    } catch (error) {
      console.error('Error in admin GET handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, status } = req.body
      
      if (!id || !status) {
        return res.status(400).json({ error: 'ID and status are required' })
      }

      if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Use "confirmed" or "cancelled"' })
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating booking:', error)
        return res.status(500).json({ error: 'Failed to update booking' })
      }

      return res.json({
        success: true,
        message: `Booking ${status} successfully`,
        booking: data[0]
      })
    } catch (error) {
      console.error('Error in admin PUT handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting booking:', error)
        return res.status(500).json({ error: 'Failed to delete booking' })
      }

      return res.json({
        success: true,
        message: 'Booking deleted successfully'
      })
    } catch (error) {
      console.error('Error in admin DELETE handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
