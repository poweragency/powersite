import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Endpoint contatti del sito cliente.
 *
 * Riceve il form e fa INSERT su Supabase `power-hub.landing_contact_submissions`
 * usando l'anon key (RLS policy permette INSERT-only ai visitatori anonimi).
 * Il record include `powersite_nonce` per ricondurre il contatto al cliente
 * originale nel CRM.
 *
 * Env vars (settate da deploy-vercel.ts al momento del deploy):
 *   - NEXT_PUBLIC_POWERHUB_URL: URL base Supabase di power-hub
 *   - NEXT_PUBLIC_POWERHUB_ANON_KEY: anon publishable key (RLS-protected)
 *   - POWERSITE_NONCE: nonce del lead originale (per join lato CRM)
 *
 * In dev locale (template eseguito standalone), le env vars sono assenti:
 *   si limita a loggare il payload e rispondere ok.
 */
export async function POST(req: NextRequest) {
  // Gating: form-contatti disponibile SOLO con uno dei 2 addon Modulo Contatti.
  if (process.env.NEXT_PUBLIC_CONTACT_FORM !== "true") {
    return NextResponse.json({ error: "Form contatti non attivo" }, { status: 404 });
  }

  const form = await req.formData();
  const visitorName = form.get("name")?.toString().trim() ?? "";
  const visitorEmail = form.get("email")?.toString().trim() ?? "";
  const visitorPhone = form.get("phone")?.toString().trim() || null;
  const message = form.get("message")?.toString().trim() ?? "";

  if (!visitorName || !visitorEmail || !message) {
    return NextResponse.json(
      { error: "Nome, email e messaggio sono obbligatori" },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_POWERHUB_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_POWERHUB_ANON_KEY;
  const nonce = process.env.POWERSITE_NONCE ?? null;

  if (!supabaseUrl || !supabaseKey) {
    // Dev locale o config incompleta: log + redirect senza salvare.
    console.warn("[contact] Supabase non configurato — payload solo loggato");
    console.log("[contact]", { visitorName, visitorEmail, visitorPhone, message });
    return NextResponse.redirect(new URL("/?sent=1", req.url), { status: 303 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("landing_contact_submissions").insert({
      powersite_nonce: nonce,
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      visitor_phone: visitorPhone,
      message,
      source_url: req.url,
      user_agent: req.headers.get("user-agent") ?? null,
    });

    if (error) {
      console.error("[contact] supabase insert error:", error.message);
      return NextResponse.json({ error: "Salvataggio fallito" }, { status: 500 });
    }
  } catch (err) {
    console.error("[contact] unexpected:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/?sent=1", req.url), { status: 303 });
}
