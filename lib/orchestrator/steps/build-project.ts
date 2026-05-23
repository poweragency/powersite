/**
 * Step 3 — Compila il template col content generato in una working dir locale.
 *
 * 1. Copia templates/{tier} in .generated/{nonce}/
 * 2. Sovrascrivi content.json
 * 3. Scarica immagini da Vercel Blob in public/uploads/
 *
 * Restituisce il path della cartella pronta per il push GitHub.
 */

import path from "node:path";
import type { OrderPayload } from "@/lib/types";

export async function buildProject(
  _order: OrderPayload,
  _content: unknown,
): Promise<string> {
  const _outDir = path.join(process.cwd(), ".generated", _order.nonce);

  // TODO: fs.cp ricorsiva del template /templates/{order.tier}
  // TODO: fs.writeFile content.json con _content
  // TODO: per ogni order.imageBlobUrls, fetch + save in public/uploads/image_{i}.{ext}
  // TODO: applica palette CSS (sostituisci variabili in globals.css)

  throw new Error("[build-project] Non implementato.");
}
