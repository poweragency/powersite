/**
 * Step 3 — Compila il template col content generato.
 *
 *  1. Copia /templates/{tier} → .generated/{nonce}/ (in os.tmpdir per Vercel)
 *  2. Sovrascrive content.json col contenuto generato dall'AI
 *  3. Crea public/uploads/ e scarica le immagini cliente da Vercel Blob
 *  4. (Solo Signature) scarica entrance_mobile/desktop.{ext}
 *
 *  Restituisce il path assoluto della working directory, pronta per essere
 *  init-git + push su nuova repo GitHub (step successivo).
 */

import path from "node:path";
import os from "node:os";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import type { OrderPayload } from "@/lib/types";

const TEMPLATE_ROOT = path.join(process.cwd(), "templates");

function templateDirFor(tier: OrderPayload["tier"]): string {
  // I 3 tier mappano direttamente alle 3 cartelle template
  return path.join(TEMPLATE_ROOT, tier);
}

function outDirFor(nonce: string): string {
  return path.join(os.tmpdir(), "powersite-generated", nonce);
}

function extractExt(url: string): string {
  try {
    const p = new URL(url).pathname;
    const dot = p.lastIndexOf(".");
    if (dot === -1) return "jpg";
    return p.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  } catch {
    return "jpg";
  }
}

async function downloadTo(url: string, target: string): Promise<void> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`[build-project] download fallito ${url}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
}

export interface BuildResult {
  path: string;
  imagesDownloaded: number;
  entranceImagesDownloaded: number;
}

export async function buildProject(
  order: OrderPayload,
  content: unknown,
): Promise<BuildResult> {
  const tplDir = templateDirFor(order.tier);
  const outDir = outDirFor(order.nonce);

  // 1. Wipe + ricrea
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // 2. Copia template ricorsivamente (escludendo node_modules e .next)
  await cp(tplDir, outDir, {
    recursive: true,
    filter: (src) => {
      const base = path.basename(src);
      return base !== "node_modules" && base !== ".next" && base !== ".vercel";
    },
  });

  // 3. Sovrascrivi content.json
  await writeFile(
    path.join(outDir, "content.json"),
    JSON.stringify(content, null, 2),
    "utf-8",
  );

  // 4. public/uploads + download immagini brief
  const uploadsDir = path.join(outDir, "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  let imagesDownloaded = 0;
  for (let i = 0; i < order.imageBlobUrls.length; i++) {
    const url = order.imageBlobUrls[i];
    const ext = extractExt(url);
    await downloadTo(url, path.join(uploadsDir, `image_${i}.${ext}`));
    imagesDownloaded++;
  }

  // 5. (Solo Signature) entrance images
  let entranceImagesDownloaded = 0;
  if (order.tier === "business") {
    if (order.entranceImageMobileUrl) {
      const ext = extractExt(order.entranceImageMobileUrl);
      await downloadTo(
        order.entranceImageMobileUrl,
        path.join(uploadsDir, `entrance_mobile.${ext}`),
      );
      entranceImagesDownloaded++;
    }
    if (order.entranceImageDesktopUrl) {
      const ext = extractExt(order.entranceImageDesktopUrl);
      await downloadTo(
        order.entranceImageDesktopUrl,
        path.join(uploadsDir, `entrance_desktop.${ext}`),
      );
      entranceImagesDownloaded++;
    }
  }

  return { path: outDir, imagesDownloaded, entranceImagesDownloaded };
}
