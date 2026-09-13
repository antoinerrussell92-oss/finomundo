import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zxtkcxabtzwalrpynzpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dGtjeGFidHp3YWxycHluenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTE0NDAsImV4cCI6MjA5MzA4NzQ0MH0.kKQSa7QHVjMR5_byqFiJJt160u_UPGayH0tCqlo-tz0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});