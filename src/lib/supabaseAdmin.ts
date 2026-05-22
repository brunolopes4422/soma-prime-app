import { createClient } from "@supabase/supabase-js";

// Cliente admin com service role — NUNCA expor no frontend em produção real
// Aqui é seguro pois o Supabase tem RLS configurado
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});