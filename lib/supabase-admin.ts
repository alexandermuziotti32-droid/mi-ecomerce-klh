import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ⚠️ Esta key bypassa RLS por completo. NUNCA la importes desde un
// Client Component ni le pongas el prefijo NEXT_PUBLIC_.
// Solo se usa dentro de Route Handlers / Server Actions.
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});