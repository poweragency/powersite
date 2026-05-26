/**
 * Email transazionale via Resend.
 *
 * ⚠️ ATTUALMENTE NON ATTIVO — la spedizione è disabilitata finché non viene
 * settato `RESEND_API_KEY` in env. Se la chiave manca, `sendEmail` è no-op
 * (ritorna { skipped: true }) — niente errori, niente blocchi.
 *
 * Per attivare:
 *   1. npm install resend
 *   2. RESEND_API_KEY=re_xxx in .env.local + Vercel env
 *   3. EMAIL_FROM="Power Agency <onboarding@poweragency.it>" (verifica dominio)
 *   4. EMAIL_REPLY_TO="hello@poweragency.it" (opzionale)
 *
 * I template HTML sono in `lib/email/templates/` come funzioni che ritornano
 * stringhe — niente dipendenza @react-email per ora. Quando vorrai mail più
 * carine, swappa con `import { render } from "@react-email/render"`.
 */

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export type SendEmailResult =
  | { ok: true; id: string }
  | { skipped: true; reason: string }
  | { ok: false; error: string };

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return { skipped: true, reason: "RESEND_API_KEY o EMAIL_FROM non configurati" };
  }

  try {
    // Fetch raw — evita di importare il pkg "resend" finché non è installato.
    // Quando installi `resend`, puoi sostituire con:
    //   import { Resend } from "resend";
    //   return await new Resend(apiKey).emails.send({ from, ... });
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo ?? process.env.EMAIL_REPLY_TO,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${err}` };
    }
    const body = (await res.json()) as { id: string };
    return { ok: true, id: body.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
