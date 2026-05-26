/**
 * Schema TS del file content.json — corrisponde al `GeneratedContent` prodotto
 * dalla pipeline SaaS. Tenere in sync con
 *   lib/orchestrator/steps/generate-content.ts (nel repo SaaS).
 */

export interface Cta {
  label: string;
  href: string;
}

export interface MetaContent {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface BrandContent {
  name: string;
  tone: string;
  palette: [string, string, string];   // [primary, secondary, accent] in HEX o HSL
}

export type Section =
  | { type: "hero"; headline: string; subheadline?: string; ctaPrimary: Cta; ctaSecondary?: Cta; image?: string }
  | { type: "value"; title: string; items: { title: string; body: string }[] }
  | { type: "features"; title: string; items: { title: string; body: string; icon?: string }[] }
  | { type: "process"; title: string; steps: { title: string; body: string; icon: string }[] }
  | { type: "trust"; title: string; badges: { label: string; value: string; detail?: string }[] }
  | { type: "social-proof"; title: string; testimonials: { name: string; quote: string; rating?: number; image?: string }[] }
  | { type: "cta"; title: string; body?: string; ctaPrimary: Cta }
  | { type: "faq"; title: string; items: { q: string; a: string }[] }
  | { type: "contact"; title: string; address?: string; phone?: string; email?: string };

export interface ImagesMeta {
  forceAll: boolean;
  selected: string[];
  unused: string[];
}

export interface LegalContent {
  companyName: string;
  vatNumber: string | null;
  fiscalCode: string | null;
  rea: string | null;
  pec: string | null;
  shareCapital: string | null;
  sedeLegale: string | null;
  email: string;
  phone: string;
  hasContactForm: boolean;
}

export interface Content {
  meta: MetaContent;
  brand: BrandContent;
  sections: Section[];
  images: ImagesMeta;
  legal?: LegalContent;
}
