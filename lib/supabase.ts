import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase environment check:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseKey ? 'Set' : 'Missing'
})

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? 'Set' : 'Missing'
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Booking {
  id?: number
  name: string
  email?: string
  phone?: string
  street_name: string
  street_number: string
  event_type: string
  guest_count?: number
  event_date: string
  start_time: string
  end_time: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}
