/**
 * Template HTML per le mail transazionali.
 * Markup inline (no @react-email per ora) — i client di mail sono
 * pignoli, quindi tutto inline-style + table-based fallback dove serve.
 *
 * Palette: brass #C9A55C + obsidian #0C0A08 (coerente col SaaS).
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://poweragency.it";

function shell(body: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Power Agency</title>
</head>
<body style="margin:0;padding:0;background:#0C0A08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#EBE2D3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0C0A08;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#161310;border:1px solid rgba(235,226,211,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 32px 16px;">
          <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#0C0A08,#161310);border:1px solid rgba(201,165,92,0.4);border-radius:12px;line-height:48px;text-align:center;color:#C9A55C;font-style:italic;font-weight:700;font-size:24px;letter-spacing:-1px;font-family:Georgia,serif;">PL</div>
          <div style="margin-top:8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A55C;font-weight:600;">Power Agency</div>
        </td></tr>
        ${body}
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(235,226,211,0.06);color:#9C9180;font-size:12px;line-height:1.6;">
          Hai bisogno di aiuto? Rispondi a questa email o scrivici su WhatsApp.<br>
          <a href="${SITE_URL}" style="color:#C9A55C;text-decoration:none;">poweragency.it</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface OrderConfirmationParams {
  firstName: string;
  company: string;
  tier: string;
  totalEur: number;
  orderId: string;
}

export function orderConfirmation(p: OrderConfirmationParams) {
  const body = `
    <tr><td style="padding:16px 32px 8px;">
      <h1 style="margin:0;font-size:28px;line-height:1.2;color:#F4EDE0;font-family:Georgia,serif;">Grazie, ${escape(p.firstName)}.</h1>
      <p style="margin:16px 0 0;color:#EBE2D3;font-size:16px;line-height:1.6;">Abbiamo ricevuto la tua richiesta di anteprima per <strong>${escape(p.company)}</strong>. Il nostro team è già al lavoro — e l'anteprima è gratuita.</p>
    </td></tr>
    <tr><td style="padding:8px 32px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(201,165,92,0.06);border:1px solid rgba(201,165,92,0.2);border-radius:12px;">
        <tr><td style="padding:18px 20px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#C9A55C;font-weight:600;">Pacchetto</div>
          <div style="margin-top:4px;font-size:18px;color:#F4EDE0;font-weight:600;">${escape(p.tier)}</div>
          <div style="margin-top:14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#C9A55C;font-weight:600;">Se decidi di tenerlo</div>
          <div style="margin-top:4px;font-size:18px;color:#F4EDE0;font-weight:600;">€${p.totalEur.toFixed(2)}/mese</div>
          <div style="margin-top:4px;font-size:12px;color:#9C9180;">Solo se ti piace. Dominio e hosting inclusi.</div>
          <div style="margin-top:14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#9C9180;font-weight:500;">Riferimento</div>
          <div style="margin-top:4px;font-family:'Courier New',monospace;font-size:13px;color:#EBE2D3;">${escape(p.orderId)}</div>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;color:#9C9180;font-size:14px;line-height:1.6;">Entro <strong style="color:#EBE2D3;">48 ore lavorative</strong> ti contatteremo via WhatsApp con il link di anteprima del sito.</p>
    </td></tr>`;
  return shell(body);
}

export interface PreviewReadyParams {
  firstName: string;
  company: string;
  previewUrl: string;
}

export function previewReady(p: PreviewReadyParams) {
  const body = `
    <tr><td style="padding:16px 32px 8px;">
      <h1 style="margin:0;font-size:28px;line-height:1.2;color:#F4EDE0;font-family:Georgia,serif;">Il tuo sito è pronto.</h1>
      <p style="margin:16px 0 0;color:#EBE2D3;font-size:16px;line-height:1.6;">Ciao ${escape(p.firstName)}, abbiamo finito di costruire il sito di <strong>${escape(p.company)}</strong>. Dai un'occhiata.</p>
    </td></tr>
    <tr><td align="center" style="padding:8px 32px 28px;">
      <a href="${escape(p.previewUrl)}" style="display:inline-block;background:#C9A55C;color:#0C0A08;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Apri l'anteprima</a>
      <div style="margin-top:12px;font-size:12px;color:#9C9180;word-break:break-all;">${escape(p.previewUrl)}</div>
    </td></tr>
    <tr><td style="padding:0 32px 24px;">
      <p style="margin:0;color:#9C9180;font-size:14px;line-height:1.6;">Hai modifiche da chiedere? Rispondi a questa email o scrivici su WhatsApp: applichiamo le modifiche entro 24h.</p>
    </td></tr>`;
  return shell(body);
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
