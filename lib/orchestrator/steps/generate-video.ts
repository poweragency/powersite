/**
 * Step 2 — Genera video AI di apertura (solo tier Business).
 *
 * ⚠️ NON CHIAMATO DALLA PIPELINE CORRENTE — il video Signature viene
 * girato MANUALMENTE dal team. La pipeline materializza brief + assets
 * nella cartella privata `_signature-video/` della repo cliente
 * (vedi build-project.ts step 5) e nel CRM viene taggato col tag
 * `video-signature:da-girare-modalita-{testo|immagini|libera}` per
 * filtrare gli ordini in attesa di video.
 *
 * Questo file resta come placeholder per quando si vorrà integrare un
 * provider AI (HeyGen / D-ID / Synthesia). Allora basterà ri-aggiungere
 * la chiamata in pipeline.ts e rimuovere il tag CRM.
 */

import type { OrderPayload } from "@/lib/types";

export interface VideoArtifact {
  url: string;
  durationSec: number;
  provider: "heygen" | "did" | "synthesia";
}

export async function generateVideo(
  _order: OrderPayload,
  _content: unknown,
): Promise<VideoArtifact> {
  // TODO: 1. Se manca videoScript, generarlo con Claude dal brief
  // TODO: 2. Chiamare HeyGen API (polling fino a render completato)
  // TODO: 3. Ritornare URL pubblico

  throw new Error("[generate-video] Non implementato.");
}
