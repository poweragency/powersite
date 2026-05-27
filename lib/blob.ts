/**
 * Wrapper per Vercel Blob — storage effimero per immagini + manifest in transito
 * dal form al webhook Stripe. Tutto sotto il prefisso `pending/{nonce}/`.
 *
 * Lifecycle:
 *   - Form submit → upload `manifest.json` + image_N.* in `pending/{nonce}/`
 *   - Stripe metadata = { nonce } per recuperarli nel webhook
 *   - Pipeline scarica, processa, poi `cleanupOrderBlobs(nonce)`
 *   - Se cliente non paga: i blob restano fino al cron di cleanup (TODO).
 */

import { put, del, list, type PutBlobResult } from "@vercel/blob";
import type { OrderPayload } from "@/lib/types";

const PREFIX = "pending";
const IDEMPOTENCY_PREFIX = "idempotency";

export function blobPath(nonce: string, filename: string): string {
  return `${PREFIX}/${nonce}/${filename}`;
}

// ─── Idempotenza webhook Stripe ──────────────────────────────
// Marker zero-byte per ogni event.id già processato. Lo
// scriviamo SOLO dopo che runPipeline è andata a buon fine.

function eventMarkerPath(eventId: string): string {
  return `${IDEMPOTENCY_PREFIX}/${eventId}.flag`;
}

export async function isEventProcessed(eventId: string): Promise<boolean> {
  const page = await list({ prefix: eventMarkerPath(eventId), limit: 1 });
  return page.blobs.length > 0;
}

export async function markEventProcessed(eventId: string): Promise<void> {
  // Body NON vuoto: @vercel/blob rifiuta body vuoto ("body is required").
  // Un marker zero-byte facevamo prima → rompeva l'idempotenza (e con Stripe
  // un retry del webhook avrebbe rigenerato un sito duplicato).
  await put(eventMarkerPath(eventId), new Date().toISOString(), {
    access: "public",
    contentType: "text/plain",
    addRandomSuffix: false,
  });
}

// ─── Cleanup blob orfani ─────────────────────────────────────
// Cancella tutto sotto `pending/` più vecchio di N ore (clienti
// che hanno compilato il form senza completare il pagamento) e i
// marker idempotenza scaduti.

export interface CleanupResult {
  pendingDeleted: number;
  markersDeleted: number;
}

export async function cleanupOrphans(opts: {
  pendingMaxAgeHours?: number;
  markerMaxAgeHours?: number;
} = {}): Promise<CleanupResult> {
  const pendingMaxAge = (opts.pendingMaxAgeHours ?? 24) * 60 * 60 * 1000;
  const markerMaxAge = (opts.markerMaxAgeHours ?? 24 * 7) * 60 * 60 * 1000;
  const now = Date.now();

  const result: CleanupResult = { pendingDeleted: 0, markersDeleted: 0 };

  for (const prefix of [PREFIX + "/", IDEMPOTENCY_PREFIX + "/"]) {
    const cutoff = prefix.startsWith(PREFIX) ? now - pendingMaxAge : now - markerMaxAge;
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor });
      const expired = page.blobs.filter(
        (b) => new Date(b.uploadedAt).getTime() < cutoff,
      );
      if (expired.length) {
        await del(expired.map((b) => b.url));
        if (prefix.startsWith(PREFIX)) result.pendingDeleted += expired.length;
        else result.markersDeleted += expired.length;
      }
      cursor = page.cursor;
    } while (cursor);
  }

  return result;
}

export async function uploadImage(
  nonce: string,
  index: number,
  file: File,
): Promise<PutBlobResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = blobPath(nonce, `image_${index}.${ext}`);
  return put(path, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
  });
}

export async function uploadEntranceImage(
  nonce: string,
  format: "mobile" | "desktop",
  file: File,
): Promise<PutBlobResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = blobPath(nonce, `entrance_${format}.${ext}`);
  return put(path, file, {
    access: "public",
    contentType: file.type || "image/jpeg",
    addRandomSuffix: false,
  });
}

export async function uploadCatalogPdf(nonce: string, file: File): Promise<PutBlobResult> {
  const path = blobPath(nonce, "catalog.pdf");
  return put(path, file, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: false,
  });
}

export async function uploadLogo(nonce: string, file: File): Promise<PutBlobResult> {
  const ext = (file.name.split(".").pop()?.toLowerCase() ?? "png").replace(/[^a-z0-9]/g, "");
  const path = blobPath(nonce, `logo.${ext || "png"}`);
  return put(path, file, {
    access: "public",
    contentType: file.type || "image/png",
    addRandomSuffix: false,
  });
}

export async function uploadManifest(payload: OrderPayload): Promise<PutBlobResult> {
  const path = blobPath(payload.nonce, "manifest.json");
  return put(path, JSON.stringify(payload), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function readManifest(manifestUrl: string): Promise<OrderPayload> {
  const res = await fetch(manifestUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Impossibile leggere manifest: HTTP ${res.status}`);
  return res.json() as Promise<OrderPayload>;
}

export async function cleanupOrderBlobs(nonce: string): Promise<number> {
  const prefix = `${PREFIX}/${nonce}/`;
  let deleted = 0;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor });
    if (page.blobs.length) {
      await del(page.blobs.map((b) => b.url));
      deleted += page.blobs.length;
    }
    cursor = page.cursor;
  } while (cursor);
  return deleted;
}
