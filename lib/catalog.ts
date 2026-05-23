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
    name: "Trovami su Google",
    priceEur: 97,
    description: "Configuriamo il sito perché Google lo legga bene e lo mostri a chi cerca quello che offri. Più posti in alto nei risultati = più visite gratis ogni mese.",
    icon: "Search",
  },
  {
    key: "geo",
    name: "Cercami nella mia zona",
    priceEur: 77,
    description: "Ottimizziamo il sito per le ricerche locali: chi digita 'dentista Milano' o 'pizzeria Roma centro' trova te. Funziona anche per le ricerche su Google Maps.",
    icon: "Globe",
  },
  {
    key: "gaio",
    name: "Consigliato da ChatGPT",
    priceEur: 127,
    description: "Prepariamo il sito perché ChatGPT, Gemini e Perplexity ti consiglino quando le persone fanno domande sul tuo settore. La nuova frontiera del 'come trovare clienti'.",
    icon: "Sparkles",
  },
  {
    key: "analytics",
    name: "Statistiche e tracciamenti",
    priceEur: 47,
    description: "Installiamo gli strumenti che ti dicono quante persone visitano il sito, da dove arrivano, cosa guardano. Più il setup per fare pubblicità mirata su Google e Facebook/Instagram.",
    icon: "BarChart3",
  },
  {
    key: "chatbot",
    name: "Assistente virtuale 24/7",
    priceEur: 197,
    description: "Un chatbot che risponde alle domande dei visitatori giorno e notte, anche nei weekend. Raccoglie i contatti di chi è interessato e te li manda direttamente via email.",
    icon: "MessageSquare",
  },
  {
    key: "email_funnel",
    name: "Email automatiche per nuovi contatti",
    priceEur: 147,
    description: "Scriviamo 5 email che partono in automatico verso ogni nuovo contatto, distribuite nei giorni successivi. Loro imparano a conoscerti, tu non scrivi niente, alcuni diventano clienti.",
    icon: "Mail",
  },
  {
    key: "brand_kit",
    name: "Logo + identità visiva",
    priceEur: 97,
    description: "Disegniamo il tuo logo, scegliamo i colori e i caratteri perfetti per il tuo business. Tutto pronto in alta risoluzione per sito, biglietti da visita, social, carta intestata.",
    icon: "Palette",
  },
  {
    key: "blog",
    name: "Blog mensile gestito",
    priceEur: 197,
    description: "Ogni mese scriviamo 3 articoli sul tuo settore, pensati per portarti visite gratis da Google. Tu non scrivi una riga, il blog cresce da solo. Abbonamento mensile.",
    icon: "FileText",
  },
  {
    key: "cro",
    name: "Più clienti dalle stesse visite",
    priceEur: 127,
    description: "Installiamo strumenti che registrano cosa fanno i visitatori (dove cliccano, dove si bloccano). Poi testiamo 3 varianti del bottone principale per scoprire quale fa contattarti di più.",
    icon: "TrendingUp",
  },
  {
    key: "booking",
    name: "Prenotazioni o vendite online",
    priceEur: 197,
    description: "Integriamo un sistema di pagamento sicuro per accettare prenotazioni o vendere prodotti direttamente dal sito. Soldi che entrano anche mentre dormi.",
    icon: "ShoppingCart",
  },
  {
    key: "pwa",
    name: "App per smartphone",
    priceEur: 77,
    description: "Il sito diventa installabile come una vera app sul telefono dei tuoi clienti, con icona dedicata sulla home. Si apre veloce e funziona anche senza connessione.",
    icon: "Smartphone",
  },
  {
    key: "domain",
    name: "Dominio + email professionale",
    priceEur: 67,
    description: "Registriamo per te un dominio personalizzato (es. tuobrand.it) con casella email professionale (info@tuobrand.it). Tutto compreso per il primo anno.",
    icon: "AtSign",
  },
  {
    key: "performance",
    name: "Sito ultra-veloce",
    priceEur: 87,
    description: "Ottimizziamo immagini e codice per far caricare il sito in meno di un secondo. Google ti premia nei risultati, i visitatori non scappano per la lentezza.",
    icon: "Zap",
  },
  {
    key: "human_review",
    name: "Doppia revisione manuale",
    priceEur: 97,
    description: "Prima della consegna il team rivede tutto a mano: testi, immagini, link, ortografia. Zero refusi, zero dimenticanze. Ideale se sei perfezionista.",
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
