import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Iscrizione newsletter / lead-magnet (addon "email_funnel").
 *
 * INFRASTRUTTURA di raccolta: salva l'email come lead nel CRM power-hub
 * (landing_contact_submissions, con message marker) così le iscrizioni sono
 * subito visibili e esportabili. Riusa lo stesso pattern del form contatti.
 *
 * ⚠️ La SEQUENZA di email automatiche NON parte da qui: va collegata
 * manualmente al provider (Resend/Mailchimp) per il singolo cliente. Il punto
 * di aggancio è indicato sotto (TODO Resend).
 */
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_EMAIL_FUNNEL !== "true") {
    return NextResponse.json({ error: "Newsletter non attiva" }, { status: 404 });
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Email non valida" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_POWERHUB_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_POWERHUB_ANON_KEY;
  const nonce = process.env.POWERSITE_NONCE ?? null;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("[subscribe] Supabase non configurato — iscrizione solo loggata:", email);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("landing_contact_submissions").insert({
      powersite_nonce: nonce,
      visitor_name: "Iscrizione newsletter",
      visitor_email: email,
      message: "[email_funnel] Iscrizione lead-magnet / newsletter",
      source_url: req.url,
      user_agent: req.headers.get("user-agent") ?? null,
    });
    if (error) {
      console.error("[subscribe] supabase insert error:", error.message);
      return NextResponse.json({ error: "Salvataggio fallito" }, { status: 500 });
    }
  } catch (err) {
    console.error("[subscribe] unexpected:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }

  // TODO (manuale, per cliente): qui agganciare il provider mailing per
  // far partire la sequenza automatica. Esempio con Resend:
  //   await fetch("https://api.resend.com/audiences/<AUDIENCE_ID>/contacts", {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
  //     body: JSON.stringify({ email }),
  //   });

  return NextResponse.json({ ok: true });
}
