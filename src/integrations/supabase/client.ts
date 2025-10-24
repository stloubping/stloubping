import { createClient } from '@supabase/supabase-js';

// REMPLACEZ CES VALEURS PAR CELLES DE VOTRE NOUVEAU PROJET SUPABASE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'VOTRE_NOUVELLE_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'VOTRE_NOUVELLE_SUPABASE_ANON_KEY';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'VOTRE_NOUVELLE_SUPABASE_URL' || supabaseAnonKey === 'VOTRE_NOUVELLE_SUPABASE_ANON_KEY') {
  console.error('Supabase URL or Anon Key is not set in environment variables or still uses placeholder values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);