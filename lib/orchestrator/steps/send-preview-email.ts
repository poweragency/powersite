/**
 * Step pipeline 6.5 — Mail "anteprima pronta" al cliente.
 *
 * NON BLOCCANTE: se RESEND_API_KEY non è settata, `sendEmail` ritorna
 * { skipped: true } e questo step esce silenzioso. Il sito è comunque
 * deployato, il lead è comunque su CRM, e il cliente viene contattato
 * via WhatsApp dal team (workflow attuale).
 *
 * Quando Resend sarà attivo (RESEND_API_KEY + EMAIL_FROM in Vercel env),
 * il cliente riceve in automatico la mail col link di preview.
 */

import type { OrderPayload } from "@/lib/types";
import { sendEmail } from "@/lib/email/send";
import { previewReady } from "@/lib/email/templates";

export async function sendPreviewEmail({
  order,
  previewUrl,
}: {
  order: OrderPayload;
  previewUrl: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const html = previewReady({
    firstName: order.firstName || order.company,
    company: order.company,
    previewUrl,
  });
  const result = await sendEmail({
    to: order.email,
    subject: `Il tuo sito è pronto — ${order.company}`,
    html,
  });
  if ("skipped" in result) return { sent: false, reason: result.reason };
  if ("ok" in result && result.ok) return { sent: true };
  if ("error" in result) return { sent: false, reason: result.error };
  return { sent: false, reason: "unknown" };
}
