import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseKey !== 'your_supabase_anon_key' &&
  supabaseUrl.includes('supabase.co')

let supabase: any = null

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error)
  }
}

// Export a mock client if Supabase is not properly configured
export { supabase }
export const isSupabaseConfigured = hasValidCredentials && supabase !== null