import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check environment variables
  const envCheck = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    nodeEnv: process.env.NODE_ENV || 'not set'
  }
  
  return res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: envCheck,
    method: req.method
  })
}
