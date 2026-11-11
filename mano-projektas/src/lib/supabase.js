import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Trūksta Supabase konfigūracijos. Patikrinkite VITE_SUPABASE_URL ir VITE_SUPABASE_PUBLISHABLE_KEY faile .env.local.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
