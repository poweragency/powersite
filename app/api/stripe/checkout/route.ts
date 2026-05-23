import { NextResponse } from "next/server";

/**
 * NOTA: la creazione della Stripe Checkout Session è già inline in /api/orders
 * (in modo che validazione brief + upload immagini + creazione checkout siano atomici).
 * Questa route resta solo come placeholder per eventuali flussi futuri
 * (es. ricreare un checkout per un ordine esistente).
 */
export async function POST() {
  return NextResponse.json(
    { error: "Use POST /api/orders to create a checkout session" },
    { status: 410 },
  );
}
