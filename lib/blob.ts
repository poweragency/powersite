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

export function blobPath(nonce: string, filename: string): string {
  return `${PREFIX}/${nonce}/${filename}`;
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
