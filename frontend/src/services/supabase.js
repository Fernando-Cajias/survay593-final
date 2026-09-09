import { createClient } from '@supabase/supabase-js';

// Configuración oficial y fallback automático para producción y desarrollo
const DEFAULT_SUPABASE_URL = 'https://rytdfmxkttelvvndehkp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_OgyrwWkfrCTUX7VeEzMkdA_j-lYvSiV';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
