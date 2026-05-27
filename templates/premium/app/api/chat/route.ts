import { NextRequest, NextResponse } from "next/server";
import content from "../../../content.json";
import type { Content, Section } from "../../../lib/content-schema";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Endpoint del chatbot del sito cliente (addon "chatbot").
 *
 * Risponde alle domande dei visitatori usando come KNOWLEDGE BASE il
 * content.json del business (FAQ, catalogo, servizi, contatti). Chiama
 * l'API Anthropic via fetch raw (nessun SDK → template leggero).
 *
 * Env vars (iniettate da deploy-vercel.ts quando l'addon chatbot è attivo):
 *   - NEXT_PUBLIC_CHATBOT  = "true"  → gating lato server e client
 *   - ANTHROPIC_API_KEY            → chiave per chiamare Claude (server-only)
 *   - CHATBOT_MODEL (opz.)         → default "claude-haiku-4-5" (economico)
 *
 * SICUREZZA / COSTI:
 *   - max_tokens basso + history troncata a 10 messaggi → costo per turno minimo
 *   - il system prompt vincola il bot a parlare SOLO del business
 *   - se manca la key o l'addon è off → 404
 */

const data = content as unknown as Content;

function buildSystemPrompt(): string {
  const lines: string[] = [];
  const brand = data.brand?.name ?? "questo sito";
  lines.push(
    `Sei l'assistente virtuale del sito di "${brand}". Rispondi in italiano, in modo cordiale, breve e concreto (max 3-4 frasi).`,
    `Parla SOLO di questo business e di ciò che trovi qui sotto. Se non sai una cosa, NON inventare: invita a contattare direttamente (telefono/WhatsApp/email/form).`,
    `Il tuo obiettivo è aiutare il visitatore e, quando ha senso, invitarlo a lasciare un contatto o a prenotare.`,
    ``,
    `=== INFORMAZIONI SUL BUSINESS ===`,
  );

  for (const s of data.sections as Section[]) {
    switch (s.type) {
      case "hero":
        lines.push(`Slogan: ${s.headline}${s.subheadline ? " — " + s.subheadline : ""}`);
        break;
      case "value":
      case "features":
        lines.push(`\n${s.title}:`);
        s.items.forEach((it) => lines.push(`- ${it.title}: ${it.body}`));
        break;
      case "process":
        lines.push(`\n${s.title}:`);
        s.steps.forEach((st) => lines.push(`- ${st.title}: ${st.body}`));
        break;
      case "faq":
        lines.push(`\nDomande frequenti:`);
        s.items.forEach((q) => lines.push(`D: ${q.q}\nR: ${q.a}`));
        break;
      case "catalog":
        lines.push(`\n${s.title} (menù/catalogo):`);
        s.categories.forEach((c) => {
          lines.push(`  ${c.name}:`);
          c.items.forEach((it) =>
            lines.push(`   - ${it.name}${it.price ? ` (${it.price})` : ""}${it.description ? `: ${it.description}` : ""}`),
          );
        });
        break;
      case "contact":
        lines.push(`\nContatti:`);
        if (s.address) lines.push(`Indirizzo: ${s.address}`);
        if (s.phone) lines.push(`Telefono: ${s.phone}`);
        if (s.email) lines.push(`Email: ${s.email}`);
        break;
    }
  }
  return lines.join("\n");
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_CHATBOT !== "true") {
    return NextResponse.json({ error: "Chatbot non attivo" }, { status: 404 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chatbot non configurato" }, { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }
  const history = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  if (history.length === 0 || history[history.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Nessun messaggio" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.CHATBOT_MODEL || "claude-haiku-4-5",
        max_tokens: 400,
        system: buildSystemPrompt(),
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) {
      console.error("[chat] anthropic error", res.status, await res.text());
      return NextResponse.json({ error: "Assistente non disponibile" }, { status: 502 });
    }
    const json = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const reply = json.content?.find((b) => b.type === "text")?.text?.trim() ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] unexpected", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
