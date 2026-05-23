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
  const brief = {
    azienda: order.company,
    settore: order.sector,
    target: order.targetAudience,
    proposta_unica: order.uniqueSellingProposition,
    cta_primaria: order.primaryCta ?? null,
    cta_secondaria: order.secondaryCta ?? null,
    tono_di_voce: order.toneOfVoice,
    colori_preferiti: order.preferredColors ?? null,
    note_contenuto: order.contentNotes ?? null,
    telefono: order.phone ?? null,
    sito: order.website ?? null,
    email_contatto: order.email,
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
    "Genera ora il contenuto della landing chiamando `render_landing_content` con tutti i campi popolati secondo le regole del system prompt.",
  ].join("\n");
}

export async function generateLandingContent(
  order: OrderPayload,
): Promise<GeneratedContent> {
  const startedAt = Date.now();
  const client = anthropic();
  const systemPrompt = systemPromptFor(order.tier);
  const userMessage = buildUserMessage(order);

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
      tools: [renderLandingTool],
      tool_choice: { type: "tool", name: RENDER_LANDING_TOOL_NAME },
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
