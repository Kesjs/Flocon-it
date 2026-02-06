import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton pattern pour éviter les multiples instances
let supabaseInstance: SupabaseClient<Database> | null = null;

export const supabase = (() => {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('✅ Singleton Supabase client créé');
  }
  return supabaseInstance;
})();

// Export de createClient pour les composants qui en ont besoin
export const createSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};
