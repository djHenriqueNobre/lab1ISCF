import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://leuluhlpwuosquwovxvj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldWx1aGxwd3Vvc3F1d292eHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjIzNzcsImV4cCI6MjA4ODE5ODM3N30.4HczTdyN-53843vniEsiB1e-dgkYhkLsYD9V0xWxDbg'

export const supabase = createClient(supabaseUrl, supabaseKey)