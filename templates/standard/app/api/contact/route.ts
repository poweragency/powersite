import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Endpoint contatti del sito cliente.
 * In fase 1 (deploy su Vercel Power Agency) inoltra a una webhook centralizzata.
 * In fase 2 (dominio cliente) può essere riconfigurato per inoltrare alla mail del cliente
 * (via Resend) leggendo l'env var configurata sul project Vercel.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const payload = {
    name: form.get("name")?.toString(),
    email: form.get("email")?.toString(),
    message: form.get("message")?.toString(),
    receivedAt: new Date().toISOString(),
  };

  // TODO: inviare via Resend a process.env.CONTACT_FORWARD_EMAIL
  console.log("[contact]", payload);

  return NextResponse.redirect(new URL("/?sent=1", req.url), { status: 303 });
}
