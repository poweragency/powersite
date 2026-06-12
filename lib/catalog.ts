import type { AddonSpec, TierSpec } from "./types";

/**
 * Modello commerciale: "crea il tuo sito gratis, paghi solo se ti piace".
 * Niente costo di attivazione: il prezzo del tier è un CANONE MENSILE che
 * include dominio, hosting e mantenimento. Gli addon si sommano al canone
 * (mensili), tranne il logo su misura che è una-tantum. Il gestionale su
 * misura è "su preventivo" (solo spunta, nessun prezzo a listino).
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const TIERS: TierSpec[] = [
  {
    key: "standard",
    name: "Standard",
    priceEur: 29.97,
    priceEurOriginal: 44.97,
    description: "Sito essenziale ad alta conversione.",
    features: [
      "Sito a pagina unica con 6 sezioni",
      "Hero, sezione servizi, recensioni clienti, FAQ, contatti",
      "Copywriting su misura, scritto a mano",
      "100% responsive su mobile, tablet e desktop",
      "Pulsanti diretti a telefono / email / WhatsApp",
      "Dominio + hosting inclusi nel canone (es. tuonegozio.it)",
      "Consegna in 48 ore lavorative",
    ],
    templateRepo: "power-agency/template-standard",
  },
  {
    key: "premium",
    name: "Premium",
    priceEur: 49.97,
    priceEurOriginal: 74.97,
    recommended: true,
    description: "Sito con grafica animata e interattiva.",
    features: [
      "Tutto quello che c'è nello Standard +",
      "Sito multi-pagina (Home, Servizi, Chi siamo, FAQ)",
      "Sezione metodo step-by-step + credenziali aziendali",
      "Sfondo animato interattivo (effetto luce che segue il mouse)",
      "Puntatore del mouse personalizzato sul colore del tuo brand",
      "Numeri e statistiche animati (contatori che partono allo scroll)",
      "Card e recensioni interattive al passaggio del mouse",
      "Hero cinematografico + animazioni eleganti su ogni sezione allo scroll",
    ],
    templateRepo: "power-agency/template-premium",
  },
  {
    key: "business",
    name: "Signature",
    priceEur: 69.97,
    priceEurOriginal: 109.97,
    description: "Sito con esperienza cinematografica completa.",
    features: [
      "Tutto quello che c'è nel Premium +",
      "Video di apertura cinematografico (porta che si apre, ingresso nel locale)",
      "SEO incluso",
      "GEO incluso",
      "GAIO incluso",
      "Loading screen branded",
      "Priorità in delivery e supporto post-vendita",
    ],
    // Signature include SEO + GEO + GAIO: il loro canone è già nel pacchetto,
    // i 3 addon corrispondenti sono auto-attivati nel form ma NON
    // ri-addebitati. La pipeline AI riceve comunque gli addon nei keys
    // → ADDON_GUIDES applicate normalmente.
    includedAddons: ["seo", "geo", "gaio"],
    templateRepo: "power-agency/template-business",
  },
];

export const ADDONS: AddonSpec[] = [
  {
    key: "seo",
    name: "SEO — Ottimizzazione Google",
    priceEur: 1.5,
    billing: "monthly",
    description: "Facciamo in modo che Google capisca cosa fai. Così quando le persone cercano qualcosa che vendi tu, trovano il tuo sito invece di quello del vicino.",
    icon: "Search",
  },
  {
    key: "geo",
    name: "GEO — Local Search",
    priceEur: 1.5,
    billing: "monthly",
    description: "Se le persone cercano qualcosa vicino a casa loro (tipo 'pizza vicino a me'), facciamo apparire il tuo sito tra i primi. Funziona anche su Google Maps.",
    icon: "Globe",
  },
  {
    key: "gaio",
    name: "GAIO — Consigliato dall'AI",
    priceEur: 1.5,
    billing: "monthly",
    description: "Quando uno chiede a ChatGPT 'mi consigli un dentista a Milano?', tu vuoi che ti consigli te. Noi prepariamo il sito perché lo faccia.",
    icon: "Sparkles",
  },
  {
    key: "analytics",
    name: "Google Analytics + Tracking",
    priceEur: 2,
    billing: "monthly",
    description: "Installiamo un piccolo contatore invisibile sul sito. Tu vedi quante persone arrivano, da dove, e cosa guardano. Più i 'pixel' per fare pubblicità su Google e Instagram.",
    icon: "BarChart3",
  },
  {
    key: "chatbot",
    name: "Chatbot custom 24/7",
    priceEur: 5,
    billing: "monthly",
    description: "Un robottino sul sito che chiacchiera con i visitatori al posto tuo. Risponde alle domande sempre, anche di notte, e ti manda i contatti di chi è interessato.",
    icon: "MessageSquare",
  },
  {
    key: "email_funnel",
    name: "Newsletter automatica",
    priceEur: 3,
    billing: "monthly",
    description: "Mandi email a tutti i tuoi clienti contemporaneamente, con un click. Promozioni, novità, eventi: arrivano in casella in automatico, tu non scrivi una per una.",
    icon: "Mail",
  },
  {
    key: "booking",
    name: "Booking & E-commerce",
    priceEur: 5,
    billing: "monthly",
    description: "Le persone possono prenotare un appuntamento o comprare qualcosa direttamente dal sito, pagando online in sicurezza. I soldi arrivano sul tuo conto.",
    icon: "ShoppingCart",
  },
  // ───────────────────────────────────────────────────────────────
  // Modulo contatti / gestionale: due voci indipendenti.
  // Di default il sito NON ha un form: i visitatori contattano via
  // telefono/email/WhatsApp. "Modulo contatti" aggiunge un form
  // (canone mensile). "Gestionale su misura" è solo una richiesta di
  // contatto (su preventivo, nessun prezzo a listino).
  // ───────────────────────────────────────────────────────────────
  {
    key: "contact_form_integration",
    name: "Modulo contatti",
    priceEur: 4,
    billing: "monthly",
    description: "Aggiungiamo al sito un form dove i clienti lasciano nome, telefono e messaggio. Le richieste ti arrivano direttamente, così non perdi nessun contatto.",
    icon: "Inbox",
  },
  {
    key: "contact_form_bespoke",
    name: "Gestionale su misura",
    priceEur: 0,
    quoteOnly: true,
    description: "Vuoi un gestionale dedicato (dashboard web + smartphone) per seguire clienti e richieste? Spunta qui: un nostro tecnico ti ricontatta per capire come svilupparlo su misura, attorno al tuo flusso di lavoro.",
    icon: "Database",
  },
  {
    key: "logo_design",
    name: "Logo design su misura",
    priceEur: 147,
    billing: "oneoff",
    description: "Non hai un logo? Te lo disegniamo noi. Un logo pulito, scalabile, in vettoriale (utilizzabile per stampa, social, biglietti da visita), coerente col tuo settore e il tono del sito. Consegna in 3 varianti tra cui scegliere. Pagamento una-tantum.",
    icon: "Sparkles",
  },
];

export function getTier(key: string): TierSpec | undefined {
  return TIERS.find((t) => t.key === key);
}

export function getAddon(key: string): AddonSpec | undefined {
  return ADDONS.find((a) => a.key === key);
}

/** Restituisce true se un addon è incluso di default nel tier (non a pagamento). */
export function isAddonIncludedInTier(tierKey: string, addonKey: string): boolean {
  const tier = getTier(tierKey);
  return !!tier?.includedAddons?.includes(addonKey as never);
}

/** true se l'addon è "su preventivo" (nessun prezzo, solo richiesta di contatto). */
export function isQuoteOnlyAddon(addonKey: string): boolean {
  return !!getAddon(addonKey)?.quoteOnly;
}

/** Periodicità dell'addon per la UI: "monthly" | "oneoff" | "quote". */
export function getAddonBilling(addonKey: string): "monthly" | "oneoff" | "quote" {
  const addon = getAddon(addonKey);
  if (!addon) return "monthly";
  if (addon.quoteOnly) return "quote";
  return addon.billing ?? "monthly";
}

function isMonthly(addon: AddonSpec): boolean {
  return !addon.quoteOnly && (addon.billing ?? "monthly") === "monthly";
}

function isOneoff(addon: AddonSpec): boolean {
  return !addon.quoteOnly && addon.billing === "oneoff";
}

/**
 * Canone mensile ricorrente: prezzo mensile del tier + addon mensili scelti.
 * Esclude gli addon già inclusi nel tier (il loro valore è nel pacchetto) e
 * quelli "su preventivo" / una-tantum.
 */
export function calculateMonthlyTotal(tierKey: string, addonKeys: string[]): number {
  const tier = getTier(tierKey);
  if (!tier) return 0;
  const included = new Set<string>(tier.includedAddons ?? []);
  const addonsMonthly = addonKeys
    .filter((k) => !included.has(k))
    .map((k) => getAddon(k))
    .filter((a): a is AddonSpec => !!a && isMonthly(a))
    .reduce((sum, a) => sum + a.priceEur, 0);
  return round2(tier.priceEur + addonsMonthly);
}

/**
 * Addebito una-tantum oggi: somma degli addon "oneoff" scelti (es. logo).
 * Indipendente dal tier (gli inclusi sono mensili, non una-tantum).
 */
export function calculateOneoffTotal(addonKeys: string[]): number {
  const total = addonKeys
    .map((k) => getAddon(k))
    .filter((a): a is AddonSpec => !!a && isOneoff(a))
    .reduce((sum, a) => sum + a.priceEur, 0);
  return round2(total);
}

/**
 * Canone mensile "ancora" prima dello sconto (barrato): usa priceEurOriginal
 * del tier + somma degli addon mensili (anche inclusi, perché fanno parte del
 * valore originale mostrato barrato).
 */
export function calculateMonthlyOriginalTotal(tierKey: string, addonKeys: string[]): number {
  const tier = getTier(tierKey);
  if (!tier) return 0;
  const tierAnchor = tier.priceEurOriginal ?? tier.priceEur;
  const addonsMonthly = addonKeys
    .map((k) => getAddon(k))
    .filter((a): a is AddonSpec => !!a && isMonthly(a))
    .reduce((sum, a) => sum + a.priceEur, 0);
  return round2(tierAnchor + addonsMonthly);
}
