/**
 * Step finale — INSERT del lead nel CRM "power-hub".
 *
 * Sostituisce il vecchio step send-email: niente più email transazionali al
 * cliente. Il lead appare nel CRM dell'utente che poi contatta a mano via
 * WhatsApp / telefono per delivery + upsell.
 *
 * Idempotente: UPSERT su `nonce` UNIQUE, retry pipeline non crea duplicati.
 *
 * Failure mode: non bloccante. Se Supabase è giù, logghiamo TUTTO il payload
 * (incluso preview_url) come console.error → l'utente ricostruisce il lead
 * a mano dai Vercel logs. Il sito è comunque deployato.
 */

import type { OrderPayload } from "@/lib/types";
import { getPowerhubClient } from "@/lib/supabase/powerhub";

export interface InsertCrmLeadArgs {
  order: OrderPayload;
  previewUrl: string;
  repoUrl: string;
  stripeSessionId?: string;
}

export interface InsertCrmLeadResult {
  ok: boolean;
  leadId?: string;
  alreadyExisted: boolean;
}

export async function insertCrmLead(args: InsertCrmLeadArgs): Promise<InsertCrmLeadResult> {
  const { order, previewUrl, repoUrl, stripeSessionId } = args;

  // Tag auto-derivati dagli addon, per filtrare nel CRM le delivery che
  // richiedono lavoro post-pipeline (integrazioni manuali, sviluppi custom).
  const tags: string[] = [];
  if (order.addons.includes("contact_form_integration")) {
    tags.push("modulo-contatti:integra-gestionale-cliente");
  }
  if (order.addons.includes("contact_form_bespoke")) {
    tags.push("modulo-contatti:gestionale-su-misura-da-sviluppare");
  }
  if (order.addons.includes("logo_design")) {
    tags.push("logo:da-disegnare");
  }

  const row = {
    nonce: order.nonce,
    first_name: order.firstName || null,
    last_name: order.lastName || null,
    email: order.email,
    phone: order.phone || null,
    company: order.company,
    company_slug: order.companySlug || null,
    website: order.website || null,
    sector: order.sector || null,
    target_audience: order.targetAudience || null,
    unique_selling_proposition: order.uniqueSellingProposition || null,
    tone_of_voice: order.toneOfVoice || null,
    preferred_colors: order.preferredColors || null,
    content_notes: order.contentNotes || null,
    avoid_in_copy: order.avoidInCopy || null,

    // Indirizzo strutturato
    works_remotely: order.worksRemotely ?? false,
    address_street: order.addressStreet || null,
    address_number: order.addressNumber || null,
    address_city: order.addressCity || null,
    address_cap: order.addressCap || null,
    address_province: order.addressProvince || null,
    opening_hours: order.openingHours || null,

    // Trust signals quantitativi
    years_experience: order.yearsExperience ?? null,
    clients_served: order.clientsServed ?? null,
    certifications: order.certifications || null,

    // Logo (vuoto se cliente ha scelto addon logo_design)
    logo_url: order.logoBlobUrl || null,

    // Social
    social_instagram: order.socialInstagram || null,
    social_facebook: order.socialFacebook || null,
    social_linkedin: order.socialLinkedin || null,
    social_tiktok: order.socialTiktok || null,

    // Dati legali (footer + pagine legal del sito cliente)
    legal_company_name: order.legalCompanyName || null,
    legal_vat_number: order.legalVatNumber || null,
    legal_fiscal_code: order.legalFiscalCode || null,
    legal_rea: order.legalRea || null,
    legal_pec: order.legalPec || null,
    legal_share_capital: order.legalShareCapital || null,

    tier: order.tier,
    addons: order.addons,
    total_eur: order.totalEur,
    stripe_session_id: stripeSessionId || null,
    preview_url: previewUrl,
    repo_url: repoUrl,
    ...(tags.length > 0 ? { tags } : {}),
    // status/subscription_status restano ai default (ready_to_deliver / none)
  };

  try {
    const supabase = getPowerhubClient();
    const { data, error } = await supabase
      .from("powersites_leads")
      .upsert(row, { onConflict: "nonce", ignoreDuplicates: false })
      .select("id, created_at")
      .single();

    if (error) throw error;

    // Heuristic per "esisteva già": created_at più vecchio di 60s vs ora.
    const alreadyExisted =
      !!data?.created_at && Date.now() - new Date(data.created_at).getTime() > 60_000;

    console.log(
      `[insert-crm-lead] ${alreadyExisted ? "updated" : "inserted"} lead ${data?.id} (nonce=${order.nonce})`,
    );
    return { ok: true, leadId: data?.id, alreadyExisted };
  } catch (err) {
    // Failure mode: NON propaga. La pipeline ha già deployato il sito.
    // L'utente recupera il lead dai log Vercel se serve.
    console.error(
      `[insert-crm-lead] FAILED for nonce=${order.nonce} — RECOVERY PAYLOAD ↓\n` +
        JSON.stringify({ ...row, error: err instanceof Error ? err.message : String(err) }),
    );
    return { ok: false, alreadyExisted: false };
  }
}
