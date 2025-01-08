import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svhlkxhypnbiqpjjsznp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGxreGh5cG5iaXFwampzem5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1Mzk4NzcsImV4cCI6MjA1MDExNTg3N30.WmkeiW6r2ctF2i1MznJ-C4FAcYu6bqUvDpcPQRyDYTQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'abod-retreat-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event)
  if (event === 'SIGNED_OUT') {
    // Clear any cached data if needed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('abod-retreat-auth')
    }
  }
})