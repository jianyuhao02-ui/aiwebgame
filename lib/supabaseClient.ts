import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // It's okay for local dev to not have these; components should handle missing client gracefully
  // but createClient requires strings, so provide empty placeholders to avoid runtime crash during import
}

const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export default supabase
