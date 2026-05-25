/**
 * Client Supabase per il CRM "power-hub" (org POWER AGENCY).
 *
 * Si autentica con SERVICE_ROLE_KEY: bypassa RLS, scrittura backend-only.
 * NON esportare mai questo client al client-side (Next.js client components).
 *
 * Project: rageiputoupzrdqthgvw — region eu-central-1
 * Tabella di interesse: public.powersites_leads
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getPowerhubClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.POWERHUB_SUPABASE_URL;
  const key = process.env.POWERHUB_SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("[powerhub] POWERHUB_SUPABASE_URL mancante");
  if (!key) throw new Error("[powerhub] POWERHUB_SUPABASE_SERVICE_ROLE_KEY mancante");

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
