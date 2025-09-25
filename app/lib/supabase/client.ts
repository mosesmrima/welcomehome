import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Client-side only functions
export const getUser = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return supabase.auth.getUser()
}

export const getSession = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return supabase.auth.getSession()
}