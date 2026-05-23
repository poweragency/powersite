import { NextRequest, NextResponse } from "next/server";
import { cleanupOrphans } from "@/lib/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Cron job — cancella blob orfani su Vercel Blob.
 *
 * Cosa elimina:
 *   - `pending/{nonce}/...` più vecchi di 24h (clienti che hanno compilato
 *     il form senza completare il pagamento → manifest + immagini abbandonati)
 *   - `idempotency/{event.id}.flag` più vecchi di 7 giorni (oltre questo
 *     periodo Stripe non ritenta più, il marker non serve)
 *
 * Schedulato in `vercel.json`. Vercel chiama l'endpoint con
 * `Authorization: Bearer {CRON_SECRET}`. Settare CRON_SECRET come env var
 * (stringa random ~32 char). Senza, l'endpoint resta accessibile a chiunque.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn(
      "[cron cleanup] CRON_SECRET non settato: endpoint accessibile a chiunque",
    );
  }

  try {
    const result = await cleanupOrphans({
      pendingMaxAgeHours: 24,
      markerMaxAgeHours: 24 * 7,
    });
    console.log(
      `[cron cleanup] pending: ${result.pendingDeleted} · markers: ${result.markersDeleted}`,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron cleanup] failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
