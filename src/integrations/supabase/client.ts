import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pmrwcidqwjinmtvgvuvj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcndjaWRxd2ppbm10dmd2dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODkyMDksImV4cCI6MjA3NjM2NTIwOX0.mUAWc_tNCBFDgZ21VvhAG8_4sPDhV7JyJMn00wFUxVs';

if (supabaseUrl === 'https://pmrwcidqwjinmtvgvuvj.supabase.co' || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcndjaWRxd2ppbm10dmd2dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODkyMDksImV4cCI6MjA3NjM2NTIwOX0.mUAWc_tNCBFDgZ21VvhAG8_4sPDhV7JyJMn00wFUxVs') {
  console.warn('Supabase URL or Anon Key is still using default hardcoded values. Please ensure environment variables are set on Vercel.');
} else {
  console.log('Connecting to Supabase URL from environment variables:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);