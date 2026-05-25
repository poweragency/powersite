/**
 * Pipeline orchestratore.
 *
 * Input: OrderPayload completo (letto dal manifest su Vercel Blob).
 * Pipeline runtime stateless (non legge mai dal DB). Output finale → INSERT
 * lead nel CRM "power-hub" (Supabase) per delivery manuale WhatsApp/call.
 *
 * Step:
 *   1. Genera contenuto con Claude (testi + struttura sezioni)
 *   2. [Business] Genera video AI di apertura
 *   3. Compila il template col content
 *   4. Crea NUOVA repo GitHub e push
 *   5. Crea project Vercel + deploy
 *   6. INSERT lead nel CRM power-hub (Supabase) — non bloccante
 *   7. Cleanup Vercel Blob (manifest + immagini effimere)
 */

import type { OrderPayload } from "@/lib/types";
import { generateLandingContent } from "@/lib/ai/generate-content";
import { generateVideo } from "./steps/generate-video";
import { buildProject } from "./steps/build-project";
import { createGithubRepo } from "./steps/create-github-repo";
import { deployToVercel } from "./steps/deploy-vercel";
import { insertCrmLead } from "./steps/insert-crm-lead";
import { cleanupOrderBlobs } from "@/lib/blob";

export interface PipelineResult {
  ok: true;
  nonce: string;
  repoUrl: string;
  previewUrl: string;
}

export async function runPipeline(order: OrderPayload): Promise<PipelineResult> {
  console.log(`[pipeline:${order.nonce}] START tier=${order.tier} addons=${order.addons.join(",")}`);

  try {
    // 1. Contenuto con Claude
    const content = await generateLandingContent(order);
    console.log(`[pipeline:${order.nonce}] content generated`);

    // 2. Video di apertura (solo Business)
    let video;
    if (order.tier === "business") {
      video = await generateVideo(order, content);
      console.log(`[pipeline:${order.nonce}] video generated`);
    }

    // 3. Compila template
    const built = await buildProject(order, { ...content, video });
    console.log(
      `[pipeline:${order.nonce}] project built at ${built.path}` +
        ` (imgs=${built.imagesDownloaded}, entrance=${built.entranceImagesDownloaded})`,
    );

    // 4. Crea NUOVA repo GitHub
    const repo = await createGithubRepo({ order, localPath: built.path });
    console.log(`[pipeline:${order.nonce}] repo created ${repo.url}`);

    // 5. Deploy Vercel
    const deploy = await deployToVercel({
      order,
      repoFullName: repo.fullName,
      repoId: repo.id,
    });
    console.log(`[pipeline:${order.nonce}] deployed ${deploy.url}`);

    // 6. INSERT lead nel CRM power-hub (Supabase). Non bloccante: se fallisce,
    //    il sito è comunque deployato e il payload completo finisce nei log.
    const lead = await insertCrmLead({
      order,
      previewUrl: deploy.url,
      repoUrl: repo.url,
    });
    console.log(
      `[pipeline:${order.nonce}] crm lead ${lead.ok ? `ok (${lead.leadId})` : "FAILED — vedi log"}`,
    );

    // 7. Cleanup
    const deleted = await cleanupOrderBlobs(order.nonce).catch((e) => {
      console.warn(`[pipeline:${order.nonce}] cleanup failed:`, e);
      return 0;
    });
    console.log(`[pipeline:${order.nonce}] cleanup ${deleted} blobs`);

    return { ok: true, nonce: order.nonce, repoUrl: repo.url, previewUrl: deploy.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[pipeline:${order.nonce}] FAILED:`, message);
    throw err;
  }
}
