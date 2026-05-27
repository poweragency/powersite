import Stripe from "stripe";
import type { AddonKey, Tier } from "@/lib/types";
import { MONTHLY_MAINTENANCE_EUR } from "@/lib/catalog";

let _client: Stripe | null = null;

export function stripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY mancante");
  _client = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return _client;
}

/**
 * Price ID di Stripe del subscription ricorrente mensile (manutenzione +
 * hosting). Va creato su Stripe Dashboard come Product "Manutenzione +
 * hosting" → Price ricorrente 19€/mese. L'ID (price_xxx) va in
 * STRIPE_PRICE_MAINTENANCE. Vedi MONTHLY_MAINTENANCE_EUR in catalog.ts.
 */
const MAINTENANCE_PRICE_ENV = "STRIPE_PRICE_MAINTENANCE";

export { MONTHLY_MAINTENANCE_EUR };

const TIER_PRICE_ENV: Record<Tier, string> = {
  standard: "STRIPE_PRICE_STANDARD",
  premium: "STRIPE_PRICE_PREMIUM",
  business: "STRIPE_PRICE_BUSINESS",
};

const ADDON_PRICE_ENV: Record<AddonKey, string> = {
  seo: "STRIPE_PRICE_ADDON_SEO",
  geo: "STRIPE_PRICE_ADDON_GEO",
  gaio: "STRIPE_PRICE_ADDON_GAIO",
  analytics: "STRIPE_PRICE_ADDON_ANALYTICS",
  chatbot: "STRIPE_PRICE_ADDON_CHATBOT",
  email_funnel: "STRIPE_PRICE_ADDON_EMAIL_FUNNEL",
  booking: "STRIPE_PRICE_ADDON_BOOKING",
  contact_form_integration: "STRIPE_PRICE_ADDON_CONTACT_FORM_INTEGRATION",
  contact_form_bespoke: "STRIPE_PRICE_ADDON_CONTACT_FORM_BESPOKE",
  logo_design: "STRIPE_PRICE_ADDON_LOGO_DESIGN",
};

function priceFor(envVar: string, label: string): string {
  const id = process.env[envVar];
  if (!id) throw new Error(`Price ID Stripe mancante per ${label} (env: ${envVar})`);
  return id;
}

/**
 * Costruisce i line items della Checkout Session in mode='subscription'.
 *
 * Mescola:
 *   - 1 price ricorrente (manutenzione + hosting 19€/mese) — sempre presente
 *   - 1 price one-time del tier
 *   - N price one-time degli addon scelti
 *
 * Stripe gestisce nativamente i mix: i one-time vengono fatturati alla
 * PRIMA invoice insieme al primo mese ricorrente. Dal secondo mese
 * il cliente paga solo i 19€ ricorrenti.
 *
 * Vedi: https://docs.stripe.com/billing/subscriptions/checkout#one-time-charges
 */
export function buildLineItems(tier: Tier, addons: AddonKey[]) {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    // Recurring: manutenzione mensile (sempre per primo per chiarezza nel checkout)
    {
      price: priceFor(MAINTENANCE_PRICE_ENV, `manutenzione ${MONTHLY_MAINTENANCE_EUR}€/mese`),
      quantity: 1,
    },
    // One-time: tier
    { price: priceFor(TIER_PRICE_ENV[tier], `tier ${tier}`), quantity: 1 },
  ];
  // One-time: addon scelti
  for (const addon of addons) {
    items.push({ price: priceFor(ADDON_PRICE_ENV[addon], `addon ${addon}`), quantity: 1 });
  }
  return items;
}
