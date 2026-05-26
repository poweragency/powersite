import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  readManifest,
  isEventProcessed,
  markEventProcessed,
} from "@/lib/blob";
import { runPipeline } from "@/lib/orchestrator/pipeline";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmation } from "@/lib/email/templates";
import { TIERS } from "@/lib/catalog";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min, serve pipeline + GitHub + Vercel + email

/**
 * Webhook Stripe — punto d'ingresso dell'intera pipeline.
 * Stateless: nessun DB. Tutti i dati dell'ordine sono nel manifest.json
 * su Vercel Blob, l'URL è in `session.metadata.manifest_url`.
 *
 * Idempotenza: Stripe ritenta su 5xx e a volte invia duplicati. Usiamo
 * un marker zero-byte su Vercel Blob (`idempotency/{event.id}.flag`)
 * scritto SOLO dopo runPipeline ok. Una seconda esecuzione dello stesso
 * event.id la vede e ritorna 200 immediatamente senza re-runnare.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] firma invalida:", message);
    return NextResponse.json({ error: "Firma invalida" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  // Idempotenza: skip se già processato
  if (await isEventProcessed(event.id)) {
    console.log(`[stripe webhook] event ${event.id} già processato, skip`);
    return NextResponse.json({ received: true, idempotent: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const manifestUrl = session.metadata?.manifest_url;
  const nonce = session.metadata?.nonce;
  if (!manifestUrl || !nonce) {
    console.error("[stripe webhook] metadata mancanti", session.id);
    return NextResponse.json({ error: "metadata incompleti" }, { status: 400 });
  }

  try {
    const payload = await readManifest(manifestUrl);

    // Mail conferma ordine — no-op se RESEND_API_KEY non è settata.
    const tierName = TIERS.find((t) => t.key === payload.tier)?.name ?? payload.tier;
    const totalEur = Number(session.metadata?.total_eur ?? 0);
    sendEmail({
      to: payload.email,
      subject: `Ordine ricevuto — ${payload.company}`,
      html: orderConfirmation({
        firstName: payload.firstName || payload.company,
        company: payload.company,
        tier: tierName,
        totalEur,
        orderId: payload.nonce,
      }),
    }).catch((e) => console.warn("[stripe webhook] order confirmation email error:", e));

    const result = await runPipeline(payload);

    // Marker scritto DOPO il successo — se la pipeline fallisce
    // a metà, Stripe può legittimamente ritentare
    await markEventProcessed(event.id);

    return NextResponse.json({ received: true, result });
  } catch (err) {
    console.error("[stripe webhook] pipeline failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pipeline failed" },
      { status: 500 },
    );
  }
}
