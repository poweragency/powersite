export type Tier = "standard" | "premium" | "business";

export type AddonKey =
  | "seo"
  | "geo"
  | "gaio"
  | "analytics"
  | "chatbot"
  | "email_funnel"
  | "booking"
  | "domain"
  | "contact_form_integration"
  | "contact_form_bespoke"
  | "logo_design";

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
  /**
   * Prezzo "originale" usato come ancoraggio visivo (barrato) accanto al
   * priceEur reale — leva commerciale di scontistica percepita.
   */
  priceEurOriginal?: number;
  description: string;
  features: string[];
  /**
   * Addon inclusi automaticamente in questo tier: il prezzo è già nel
   * pacchetto (non vengono ri-addebitati in calculateTotal) ma le loro
   * regole di prompting vengono comunque applicate dalla pipeline AI.
   */
  includedAddons?: AddonKey[];
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

  // Contatti cliente (decision maker — chi compila il form, non il brand)
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  companySlug: string;
  phone: string;
  website?: string;

  // Brief
  sector: string;
  targetAudience?: string;
  uniqueSellingProposition?: string;
  primaryCta?: string;
  secondaryCta?: string;
  toneOfVoice: ToneOfVoice;
  preferredColors?: string;
  contentNotes?: string;
  videoScript?: string;
  avoidInCopy?: string;

  // Indirizzo strutturato (opzionale: businesses online non hanno sede)
  worksRemotely?: boolean;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressCap?: string;
  addressProvince?: string;
  openingHours?: string;

  // Trust signals (alimentano sezione TRUST badges del tier Premium)
  yearsExperience?: number;
  clientsServed?: number;
  certifications?: string;

  // Social media (footer + schema markup)
  socialInstagram?: string;
  socialFacebook?: string;
  socialLinkedin?: string;
  socialTiktok?: string;

  // Logo: o ha il proprio file e lo carica, OPPURE seleziona addon
  // "logo_design" per farselo fare. Mutually exclusive lato form.
  logoBlobUrl?: string;

  // Pacchetto
  tier: Tier;
  addons: AddonKey[];
  totalEur: number;

  // Immagini
  forceAllImages: boolean;
  imageBlobUrls: string[];   // URL pubblici delle immagini su Vercel Blob

  // Solo Signature: due immagini hi-res dell'ingresso del locale (mobile + desktop)
  entranceImageMobileUrl?: string;
  entranceImageDesktopUrl?: string;
}
