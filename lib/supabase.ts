import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Booking {
  id?: number
  name: string
  email: string
  phone?: string
  event_type: string
  guest_count: number
  event_date: string
  start_time: string
  end_time: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}
