import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('bookings')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      console.error('Database test error:', testError)
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: testError.message,
        code: testError.code,
        hint: testError.hint
      })
    }

    return res.json({
      success: true,
      message: 'Database connection successful',
      tableExists: true,
      recordCount: testData || 0
    })

  } catch (error) {
    console.error('Database test error:', error)
    return res.status(500).json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
