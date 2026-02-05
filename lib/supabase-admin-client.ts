import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client Supabase pour les composants admin (côté client)
export const supabaseAdminClient = createClient(supabaseUrl, supabaseAnonKey);
