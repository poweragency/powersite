/**
 * Genera il contenuto della landing chiamando Claude API.
 *
 * Strategia:
 * - SYSTEM PROMPT lungo, statico per tier → cacheato con `cache_control: ephemeral`
 *   (>4K token, sopra la soglia minima di cache di Sonnet 4.6)
 * - TOOL definition (`render_landing_content`) con `strict: true` → cacheata
 *   insieme al system (rendering order: tools → system → messages)
 * - USER message: dati brief + image manifest (volatile, ogni richiesta è diversa)
 * - `tool_choice` forza Claude a chiamare il tool una sola volta
 * - Parsiamo `block.input` per ottenere l'output strutturato già validato
 *
 * Caching: ogni chiamata successiva per lo stesso tier riusa il prefisso
 * (system + tool) → ~90% di risparmio sui token cached.
 */

import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL_COPY } from "./anthropic";
import { renderLandingTool, RENDER_LANDING_TOOL_NAME } from "./content-schema";
import { systemPromptFor } from "./system-prompts";
import { logGeneration } from "./log";

export interface GeneratedContent {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  brand: {
    name: string;
    tone: "professional" | "friendly" | "luxury" | "energetic" | "minimal";
    palette: [string, string, string];
  };
  sections: Array<Record<string, unknown> & { type: string }>;
  images: {
    forceAll: boolean;
    selected: string[];
    unused: string[];
  };
}

import type { OrderPayload } from "@/lib/types";

function buildUserMessage(order: OrderPayload): string {
  // Indirizzo composto SOLO se ha sede fisica
  const indirizzo = order.worksRemotely
    ? null
    : [order.addressStreet, order.addressNumber, order.addressCap, order.addressCity, order.addressProvince]
        .filter(Boolean)
        .join(" ")
        .trim() || null;

  const social = {
    instagram: order.socialInstagram || null,
    facebook: order.socialFacebook || null,
    linkedin: order.socialLinkedin || null,
    tiktok: order.socialTiktok || null,
  };
  const hasSocial = Object.values(social).some(Boolean);

  const brief = {
    azienda: order.company,
    settore: order.sector,
    target: order.targetAudience ?? null,
    proposta_unica: order.uniqueSellingProposition ?? null,
    cta_primaria: order.primaryCta ?? null,
    cta_secondaria: order.secondaryCta ?? null,
    tono_di_voce: order.toneOfVoice,
    colori_preferiti: order.preferredColors ?? null,
    note_contenuto: order.contentNotes ?? null,
    cose_da_evitare_nel_copy: order.avoidInCopy ?? null,
    telefono: order.phone ?? null,
    sito: order.website ?? null,
    email_contatto: order.email,
    // Indirizzo (alimenta sezione contact + addon GEO)
    sede_fisica: order.worksRemotely ? "no — solo online" : indirizzo,
    orari_apertura: order.openingHours ?? null,
    // Trust signals quantitativi (alimentano tier Premium sezione TRUST)
    anni_esperienza: order.yearsExperience ?? null,
    clienti_serviti: order.clientsServed ?? null,
    certificazioni: order.certifications ?? null,
    // Social (footer del template)
    social: hasSocial ? social : null,
  };

  const imageManifest = order.imageBlobUrls.map((url, i) => ({
    index: i,
    path: `/uploads/image_${i}.${url.split(".").pop()?.split("?")[0] ?? "jpg"}`,
  }));

  return [
    "<brief_cliente>",
    JSON.stringify(brief, null, 2),
    "</brief_cliente>",
    "",
    "<image_manifest>",
    JSON.stringify(imageManifest, null, 2),
    "</image_manifest>",
    "",
    `<force_all_images>${order.forceAllImages}</force_all_images>`,
    "",
    "<addon_attivi>",
    JSON.stringify(order.addons),
    "</addon_attivi>",
    "",
    "Genera ora il contenuto della landing chiamando `render_landing_content` con tutti i campi popolati secondo le regole del system prompt. Applica SOLO le regole degli addon presenti in `<addon_attivi>`; ignora le regole degli altri addon.",
  ].join("\n");
}

export async function generateLandingContent(
  order: OrderPayload,
): Promise<GeneratedContent> {
  const startedAt = Date.now();
  const client = anthropic();
  const systemPrompt = systemPromptFor(order.tier);
  const userMessage = buildUserMessage(order);

  // Tool web_search (server-side Anthropic) per cercare recensioni reali
  // del business quando il brief NON le fornisce e il business sembra
  // avere presenza online. Server tool = eseguito da Anthropic, risultati
  // inclusi nella stessa response (no client loop).
  // Limitato a 2 uses per call → controllo costi ($10/1000 searches).
  const webSearchTool = {
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 2,
  };

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: MODEL_COPY,
      max_tokens: 8000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      // any = il modello DEVE usare almeno un tool ma sceglie quale. Cosi
      // può prima fare web_search per recensioni (se serve), poi chiamare
      // render_landing_content. Forzare 'tool' specifico bloccherebbe il
      // web_search prima del render.
      tools: [renderLandingTool, webSearchTool as unknown as Anthropic.Tool],
      tool_choice: { type: "any" },
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logGeneration({
      nonce: order.nonce,
      step: "generate-content",
      model: MODEL_COPY,
      durationMs: Date.now() - startedAt,
      error: message,
    });
    throw new Error(`[generate-content] Claude API error: ${message}`);
  }

  const toolUseBlock = response.content.find(
    (b): b is Anthropic.ToolUseBlock =>
      b.type === "tool_use" && b.name === RENDER_LANDING_TOOL_NAME,
  );

  if (!toolUseBlock) {
    const errMsg = `Nessuna chiamata a ${RENDER_LANDING_TOOL_NAME}. stop_reason=${response.stop_reason}`;
    logGeneration({
      nonce: order.nonce,
      step: "generate-content",
      model: MODEL_COPY,
      durationMs: Date.now() - startedAt,
      error: errMsg,
    });
    throw new Error(`[generate-content] ${errMsg}`);
  }

  const content = toolUseBlock.input as GeneratedContent;

  logGeneration({
    nonce: order.nonce,
    step: "generate-content",
    model: MODEL_COPY,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
    durationMs: Date.now() - startedAt,
  });

  return content;
}
