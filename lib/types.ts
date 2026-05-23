export type Tier = "standard" | "premium" | "business";

export type AddonKey =
  | "seo"
  | "geo"
  | "gaio"
  | "analytics"
  | "chatbot"
  | "email_funnel"
  | "cro"
  | "booking"
  | "domain";

export type ToneOfVoice =
  | "professional"
  | "friendly"
  | "luxury"
  | "energetic"
  | "minimal";

export interface TierSpec {
  key: Tier;
  name: string;
  priceEur: number;
  description: string;
  features: string[];
  templateRepo: string;
}

export interface AddonSpec {
  key: AddonKey;
  name: string;
  priceEur: number;
  description: string;
  icon: string;
}

/**
 * Payload completo che descrive un ordine.
 * Viene serializzato in un manifest.json caricato su Vercel Blob
 * con prefisso effimero (es. `pending/{nonce}/manifest.json`).
 * Stripe metadata contiene solo `{ blobPrefix, email, tier }` per il webhook.
 */
export interface OrderPayload {
  // Identificativi
  nonce: string;             // UUID univoco generato all'invio del form
  createdAt: string;         // ISO timestamp

  // Contatti cliente
  email: string;
  company: string;
  companySlug: string;
  website?: string;
  phone?: string;

  // Brief
  sector: string;
  targetAudience: string;
  uniqueSellingProposition: string;
  primaryCta: string;
  secondaryCta?: string;
  toneOfVoice: ToneOfVoice;
  preferredColors?: string;
  contentNotes?: string;
  videoScript?: string;

  // Pacchetto
  tier: Tier;
  addons: AddonKey[];
  totalEur: number;

  // Immagini
  forceAllImages: boolean;
  imageBlobUrls: string[];   // URL pubblici delle immagini su Vercel Blob
}
