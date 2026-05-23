import type { AddonSpec, TierSpec } from "./types";

export const TIERS: TierSpec[] = [
  {
    key: "standard",
    name: "Standard",
    priceEur: 397,
    description: "Landing essenziale ad alta conversione. Consegna in 48h.",
    features: [
      "5 sezioni (hero, valore, prova, CTA, contatti)",
      "Copywriting su misura, scritto a mano",
      "Mobile responsive",
      "Form contatti integrato",
      "Deploy su sottodominio Power Agency",
    ],
    templateRepo: "power-agency/template-standard",
  },
  {
    key: "premium",
    name: "Premium",
    priceEur: 697,
    description: "Landing avanzata con animazioni e integrazioni.",
    features: [
      "Tutto Standard +",
      "Animazioni e micro-interazioni",
      "3 varianti A/B su hero/CTA",
      "Integrazioni WhatsApp / Calendly",
      "Favicon + Open Graph custom",
      "Multilingua (fino a 2 lingue)",
    ],
    templateRepo: "power-agency/template-premium",
  },
  {
    key: "business",
    name: "Signature",
    priceEur: 1297,
    description: "Esperienza cinematografica con video di apertura su misura.",
    features: [
      "Tutto Premium +",
      "Video di apertura con avatar parlante",
      "Hero animato in stile cinematografico",
      "Soundtrack e effetti audio",
      "Loading screen branded",
      "Sezione testimonianze video",
    ],
    templateRepo: "power-agency/template-business",
  },
];

export const ADDONS: AddonSpec[] = [
  {
    key: "seo",
    name: "SEO ottimizzato",
    priceEur: 97,
    description: "Meta tag, schema.org, sitemap.xml, robots.txt, Open Graph completo.",
    icon: "Search",
  },
  {
    key: "geo",
    name: "GEO — Local SEO",
    priceEur: 77,
    description: "Geo-targeting, hreflang multilingua, ottimizzazione local search.",
    icon: "Globe",
  },
  {
    key: "gaio",
    name: "GAIO — Search assistenti",
    priceEur: 127,
    description: "Structured data, FAQ schema, llms.txt: il tuo sito ben rappresentato dai motori conversazionali (ChatGPT, Perplexity, Gemini).",
    icon: "Sparkles",
  },
  {
    key: "analytics",
    name: "Analytics & Tracking",
    priceEur: 47,
    description: "Google Analytics 4 + Tag Manager + Meta Pixel configurati.",
    icon: "BarChart3",
  },
  {
    key: "chatbot",
    name: "Chatbot custom",
    priceEur: 197,
    description: "Assistente conversazionale addestrato sul tuo business per supporto 24/7 e lead capture.",
    icon: "MessageSquare",
  },
  {
    key: "email_funnel",
    name: "Email funnel professionale",
    priceEur: 147,
    description: "5 email scritte su misura + integrazione Brevo/Mailchimp.",
    icon: "Mail",
  },
  {
    key: "brand_kit",
    name: "Brand kit completo",
    priceEur: 97,
    description: "Logo + palette colori + abbinamento font studiati per il tuo brand.",
    icon: "Palette",
  },
  {
    key: "blog",
    name: "Blog mensile",
    priceEur: 197,
    description: "3 articoli SEO al mese scritti per te. Abbonamento mensile.",
    icon: "FileText",
  },
  {
    key: "cro",
    name: "CRO pack",
    priceEur: 127,
    description: "Microsoft Clarity / Hotjar + 3 varianti CTA testate.",
    icon: "TrendingUp",
  },
  {
    key: "booking",
    name: "Booking / E-commerce",
    priceEur: 197,
    description: "Stripe integrato per prenotazioni o vendita prodotti.",
    icon: "ShoppingCart",
  },
  {
    key: "pwa",
    name: "PWA app-like",
    priceEur: 77,
    description: "Sito installabile come app sul cellulare, offline-ready.",
    icon: "Smartphone",
  },
  {
    key: "domain",
    name: "Dominio + SSL + email pro",
    priceEur: 67,
    description: "Registrazione dominio custom + email professionale @tuobrand (1 anno).",
    icon: "AtSign",
  },
  {
    key: "performance",
    name: "Performance pack",
    priceEur: 87,
    description: "CDN immagini, lazy load avanzato, target Lighthouse 95+.",
    icon: "Zap",
  },
  {
    key: "human_review",
    name: "Review umana garantita",
    priceEur: 97,
    description: "Revisione manuale da parte del team Power Agency prima della consegna.",
    icon: "UserCheck",
  },
];

export function getTier(key: string): TierSpec | undefined {
  return TIERS.find((t) => t.key === key);
}

export function getAddon(key: string): AddonSpec | undefined {
  return ADDONS.find((a) => a.key === key);
}

export function calculateTotal(tierKey: string, addonKeys: string[]): number {
  const tier = getTier(tierKey);
  if (!tier) return 0;
  const addonsTotal = addonKeys
    .map((k) => getAddon(k)?.priceEur ?? 0)
    .reduce((a, b) => a + b, 0);
  return tier.priceEur + addonsTotal;
}
