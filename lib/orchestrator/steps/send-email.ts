/**
 * Step 6 — Email transazionali (Resend).
 */

export async function sendPreviewEmail(_args: {
  to: string;
  company: string;
  previewUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("[send-email] RESEND_API_KEY mancante");

  // TODO: resend.emails.send con template HTML brandizzato
  throw new Error("[sendPreviewEmail] Non implementato.");
}

export async function sendAdminAlert(_args: {
  nonce: string;
  company: string;
  tier: string;
  previewUrl?: string;
  repoUrl?: string;
  error?: string;
}): Promise<void> {
  // TODO: resend.emails.send a process.env.ADMIN_NOTIFICATION_EMAIL
  console.warn("[sendAdminAlert] stub:", JSON.stringify(_args));
}
