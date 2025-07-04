import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createClientComponent = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Server-side Supabase client (using service role for admin operations)
export const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
