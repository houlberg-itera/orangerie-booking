import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: error.message,
        hint: error.hint,
        code: error.code
      })
    }

    console.log('Supabase connection successful:', data)
    
    return res.status(200).json({ 
      message: 'Supabase connection successful!',
      dataCount: data?.length || 0,
      sampleData: data
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: String(error) 
    })
  }
}
