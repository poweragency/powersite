/**
 * Step 2 — Genera video AI di apertura (solo tier Business).
 *
 * Provider candidati: HeyGen, D-ID, Synthesia.
 * Input: brief + script (opzionale, altrimenti generato da Claude).
 * Output: URL del video MP4.
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
