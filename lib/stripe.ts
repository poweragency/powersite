import Stripe from "stripe";
import type { AddonKey, Tier } from "@/lib/types";

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
  domain: "STRIPE_PRICE_ADDON_DOMAIN",
};

function priceFor(envVar: string, label: string): string {
  const id = process.env[envVar];
  if (!id) throw new Error(`Price ID Stripe mancante per ${label} (env: ${envVar})`);
  return id;
}

export function buildLineItems(tier: Tier, addons: AddonKey[]) {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceFor(TIER_PRICE_ENV[tier], `tier ${tier}`), quantity: 1 },
  ];
  for (const addon of addons) {
    items.push({ price: priceFor(ADDON_PRICE_ENV[addon], `addon ${addon}`), quantity: 1 });
  }
  return items;
}
