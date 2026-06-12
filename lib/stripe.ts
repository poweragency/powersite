import Stripe from "stripe";
import type { AddonKey, Tier } from "@/lib/types";
import { isAddonIncludedInTier, isQuoteOnlyAddon } from "@/lib/catalog";

let _client: Stripe | null = null;

export function stripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY mancante");
  _client = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return _client;
}

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
 * Modello "canone mensile" (niente upfront del sito):
 *   - 1 price RICORRENTE mensile del tier (29,97 / 49,97 / 69,97 €/mese):
 *     include dominio + hosting + mantenimento.
 *   - N price ricorrenti mensili degli addon mensili scelti.
 *   - eventuali price ONE-TIME degli addon una-tantum (es. logo 147€).
 *
 * Esclusioni:
 *   - addon GIÀ INCLUSI nel tier (es. SEO/GEO/GAIO nel Signature): il loro
 *     canone è nel prezzo del pacchetto → niente line item (no doppio addebito).
 *   - addon "su preventivo" (gestionale su misura): nessun prezzo a listino →
 *     niente line item, solo lead nel CRM.
 *
 * Stripe gestisce nativamente i mix recurring + one-time nello stesso
 * checkout: gli one-time vengono fatturati alla PRIMA invoice insieme al
 * primo mese; dal secondo mese il cliente paga solo i ricorrenti.
 *
 * NB: i Price ID in STRIPE_PRICE_* devono ora essere RICORRENTI mensili (tier
 * e addon mensili) e ONE-TIME per il logo. Vedi .env.example.
 *
 * Vedi: https://docs.stripe.com/billing/subscriptions/checkout#one-time-charges
 */
export function buildLineItems(tier: Tier, addons: AddonKey[]) {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    // Recurring: canone mensile del tier (sempre per primo nel checkout)
    { price: priceFor(TIER_PRICE_ENV[tier], `tier ${tier}`), quantity: 1 },
  ];
  for (const addon of addons) {
    // Inclusi nel tier → già pagati nel canone del pacchetto.
    if (isAddonIncludedInTier(tier, addon)) continue;
    // Su preventivo → nessun addebito, solo segnalazione lato CRM.
    if (isQuoteOnlyAddon(addon)) continue;
    items.push({ price: priceFor(ADDON_PRICE_ENV[addon], `addon ${addon}`), quantity: 1 });
  }
  return items;
}
