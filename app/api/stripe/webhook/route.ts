import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { readManifest } from "@/lib/blob";
import { runPipeline } from "@/lib/orchestrator/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min, serve pipeline + GitHub + Vercel + email

/**
 * Webhook Stripe — punto d'ingresso dell'intera pipeline.
 * Stateless: nessun DB. Tutti i dati dell'ordine sono nel manifest.json
 * su Vercel Blob, l'URL è in `session.metadata.manifest_url`.
 *
 * Idempotenza: Stripe ritenta su 5xx. Una doppia esecuzione genererebbe 2 repo
 * GitHub diverse (nome con timestamp diverso) — per ora accettiamo il rischio
 * (raro), TODO: in-memory dedup su event.id.
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

  const session = event.data.object as Stripe.Checkout.Session;
  const manifestUrl = session.metadata?.manifest_url;
  const nonce = session.metadata?.nonce;
  if (!manifestUrl || !nonce) {
    console.error("[stripe webhook] metadata mancanti", session.id);
    return NextResponse.json({ error: "metadata incompleti" }, { status: 400 });
  }

  try {
    const payload = await readManifest(manifestUrl);
    // Eseguiamo la pipeline in modo bloccante: con maxDuration=300 c'è margine.
    // Se in produzione superiamo i 300s, splittiamo in step async (Inngest/Trigger.dev).
    const result = await runPipeline(payload);
    return NextResponse.json({ received: true, result });
  } catch (err) {
    console.error("[stripe webhook] pipeline failed:", err);
    // Ritorniamo 500 così Stripe ritenta — ma il dedup è ancora TODO
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pipeline failed" },
      { status: 500 },
    );
  }
}
