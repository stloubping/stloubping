import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://svwsqioytvvpqbxpekwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2d3NxaW95dHZ2cHFieHBla3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk2MzEsImV4cCI6MjA3Njg5NTYzMX0.JTl37y_D_tr3bnPlCQyPZxOZqVzJHC79rFYYxT3ZXHg';

if (supabaseUrl === 'https://svwsqioytvvpqbxpekwm.supabase.co' || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2d3NxaW95dHZ2cHFieHBla3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk2MzEsImV4cCI6MjA3Njg5NTYzMX0.JTl37y_D_tr3bnPlCQyPZxOZqVzJHC79rFYYxT3ZXHg') {
  console.warn('Supabase URL or Anon Key is still using default hardcoded values. Please ensure environment variables are set on Vercel.');
} else {
  console.log('Connecting to Supabase URL from environment variables:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);