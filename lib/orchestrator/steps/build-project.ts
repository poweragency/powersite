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

  // 5. (Solo Signature) materializza _signature-video/ con brief + assets
  //    NON in public/, così non finisce nel sito pubblico. Cartella privata
  //    dedicata al video editor che produrrà il video manualmente.
  let entranceImagesDownloaded = 0;
  if (order.tier === "business") {
    const vDir = path.join(outDir, "_signature-video");
    await mkdir(vDir, { recursive: true });

    if (order.entranceImageMobileUrl) {
      const ext = extractExt(order.entranceImageMobileUrl);
      await downloadTo(order.entranceImageMobileUrl, path.join(vDir, `entrance_mobile.${ext}`));
      entranceImagesDownloaded++;
    }
    if (order.entranceImageDesktopUrl) {
      const ext = extractExt(order.entranceImageDesktopUrl);
      await downloadTo(order.entranceImageDesktopUrl, path.join(vDir, `entrance_desktop.${ext}`));
      entranceImagesDownloaded++;
    }

    await writeFile(
      path.join(vDir, "brief.md"),
      buildSignatureVideoBrief(order),
      "utf-8",
    );
  }

  return { path: outDir, imagesDownloaded, entranceImagesDownloaded };
}

function buildSignatureVideoBrief(order: OrderPayload): string {
  const hasText = Boolean(order.videoScript?.trim());
  const hasImages = Boolean(order.entranceImageMobileUrl || order.entranceImageDesktopUrl);

  return `# Video di apertura — ${order.company}

> ⚠️ Cartella **privata** — non finisce nel sito pubblico (non sta in public/).
> Quando il video è pronto: salvarlo in \`public/uploads/intro_mobile.mp4\` e
> \`public/uploads/intro_desktop.mp4\`, poi \`git push origin main\`.
> Il template Signature li monta automaticamente in hero.

## Cliente
- **Azienda**: ${order.company}
- **Settore**: ${order.sector}
- **Email**: ${order.email}
- **Telefono**: ${order.phone}
- **Tono di voce**: ${order.toneOfVoice}

## Brief originale
- **Target**: ${order.targetAudience}
- **USP**: ${order.uniqueSellingProposition}
${order.preferredColors ? `- **Colori preferiti**: ${order.preferredColors}\n` : ""}${order.contentNotes ? `- **Note contenuto**: ${order.contentNotes}\n` : ""}
## Specifica video Signature
Video di apertura cinematografico — porta che si apre, ingresso fisico nel locale.
- **Durata**: max 30 secondi
- **Formato mobile**: 9:16 verticale (1080×1920)
- **Formato desktop**: 16:9 orizzontale (1920×1080)
- **Audio**: musica ambient leggera, niente voce parlata
- **Ritmo**: lento e cinematografico, no cuts veloci

## Direzione fornita dal cliente
${hasText ? `### Modalità: testo\n\n> ${order.videoScript!.split("\n").join("\n> ")}\n` : ""}${hasImages ? `### Modalità: immagini hi-res\nIl cliente ha caricato ${entranceImageListMd(order)} (vedi file in questa cartella).\nLa porta deve essere **perfettamente al centro** nel video, fedele a queste immagini.\n` : ""}${!hasText && !hasImages ? "### Nessuna direzione esplicita\nIl cliente non ha fornito né testo né immagini d'ingresso. Direzione libera basata su brief + foto del sito (in public/uploads/).\n" : ""}
## Output atteso
Salvare i 2 video in:
- \`public/uploads/intro_mobile.mp4\` (codec H.264, max 5MB ideale)
- \`public/uploads/intro_desktop.mp4\` (codec H.264, max 8MB ideale)

(opzionale, per fallback browser più datati):
- \`public/uploads/intro_mobile.webm\`
- \`public/uploads/intro_desktop.webm\`

Una volta caricati, \`git push origin main\` — Vercel redeploya automaticamente.
`;
}

function entranceImageListMd(order: OrderPayload): string {
  const items: string[] = [];
  if (order.entranceImageMobileUrl) items.push("`entrance_mobile`");
  if (order.entranceImageDesktopUrl) items.push("`entrance_desktop`");
  return items.join(" + ");
}
