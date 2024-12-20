import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svhlkxhypnbiqpjjsznp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGxreGh5cG5iaXFwampzem5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1Mzk4NzcsImV4cCI6MjA1MDExNTg3N30.WmkeiW6r2ctF2i1MznJ-C4FAcYu6bqUvDpcPQRyDYTQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)