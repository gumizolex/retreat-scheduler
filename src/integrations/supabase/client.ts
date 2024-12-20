import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svhlkxhypnbiqpjjsznp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGxreGh5cG5iaXFwampzem5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5ODc1NzgsImV4cCI6MjAxODU2MzU3OH0.hCHQvgR6oF_NQz7LeFXgEqxvvVV3-GUWvTBL6aAMqKA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          return Promise.resolve(localStorage.getItem(key))
        } catch {
          return Promise.resolve(null)
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
          return Promise.resolve()
        } catch {
          return Promise.resolve()
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
          return Promise.resolve()
        } catch {
          return Promise.resolve()
        }
      },
    },
    cookieOptions: {
      domain: window.location.hostname.includes('lovable.app') 
        ? 'lovable.app' 
        : 'netlify.app',
      sameSite: 'lax',
      secure: true
    }
  }
})