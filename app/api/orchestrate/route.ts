/**
 * Endpoint interno per triggerare la pipeline async dopo /api/orders.
 *
 * Usato quando BYPASS_STRIPE=true: /api/orders fa POST fire-and-forget qui,
 * /api/orchestrate gira la pipeline in background (maxDuration 300s) mentre
 * l'utente viene già reindirizzato alla pagina /grazie.
 *
 * Autenticazione: header `Authorization: Bearer ${ORCHESTRATE_SECRET}`.
 * Stesso secret usato anche dal cron — riusato per minimo attrito env vars.
 *
 * Idempotenza: marker su Vercel Blob `idempotency/orchestrate-{nonce}.flag`,
 * coerente col pattern del webhook Stripe.
 */

import { NextRequest, NextResponse } from "next/server";
import { readManifest, isEventProcessed, markEventProcessed } from "@/lib/blob";
import { runPipeline } from "@/lib/orchestrator/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.ORCHESTRATE_SECRET || process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ORCHESTRATE_SECRET non configurato" }, { status: 500 });
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let body: { manifestUrl?: string; nonce?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { manifestUrl, nonce } = body;
  if (!manifestUrl || !nonce) {
    return NextResponse.json({ error: "manifestUrl + nonce richiesti" }, { status: 400 });
  }

  // Idempotenza basata su nonce (NON event.id, qui non c'è Stripe event)
  const idempKey = `orchestrate-${nonce}`;
  if (await isEventProcessed(idempKey)) {
    console.log(`[orchestrate] ${nonce} già processato, skip`);
    return NextResponse.json({ received: true, idempotent: true });
  }

  try {
    const payload = await readManifest(manifestUrl);
    const result = await runPipeline(payload);
    await markEventProcessed(idempKey);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[orchestrate] pipeline failed for ${nonce}:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
