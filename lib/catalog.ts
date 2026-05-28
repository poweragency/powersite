import type { AddonSpec, TierSpec } from "./types";

/**
 * Subscription mensile obbligatoria abbinata al pacchetto: copre
 * hosting + mantenimento dominio + risoluzione problemi tecnici.
 * Mostrata nel checkout come "+ X €/mese" sotto al totale upfront.
 */
export const MONTHLY_MAINTENANCE_EUR = 19;

export const TIERS: TierSpec[] = [
  {
    key: "standard",
    name: "Standard",
    priceEur: 397,
    priceEurOriginal: 549,
    description: "Sito essenziale ad alta conversione.",
    features: [
      "Sito a pagina unica con 6 sezioni",
      "Hero, sezione servizi, recensioni clienti, FAQ, contatti",
      "Copywriting su misura, scritto a mano",
      "100% responsive su mobile, tablet e desktop",
      "Pulsanti diretti a telefono / email / WhatsApp",
      "Dominio + hosting incluso (es. tuonegozio.it)",
      "Consegna in 48 ore lavorative",
    ],
    templateRepo: "power-agency/template-standard",
  },
  {
    key: "premium",
    name: "Premium",
    priceEur: 697,
    priceEurOriginal: 949,
    recommended: true,
    description: "Sito multi-pagina con identità più ricca, percorso narrativo studiato ed esperienza grafica animata e interattiva.",
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
    priceEur: 1297,
    priceEurOriginal: 1797,
    description: "Esperienza cinematografica completa, con SEO completo (Google + Local + AI Search) incluso.",
    features: [
      "Tutto quello che c'è nel Premium +",
      "Video di apertura cinematografico (porta che si apre, ingresso nel locale)",
      "Hero animato in stile cinematografico",
      "SEO, GEO e GAIO inclusi",
      "Loading screen branded",
      "Priorità in delivery e supporto post-vendita",
    ],
    // Signature include SEO + GEO + GAIO: il prezzo è gia' nel pacchetto,
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
    priceEur: 97,
    description: "Facciamo in modo che Google capisca cosa fai. Così quando le persone cercano qualcosa che vendi tu, trovano il tuo sito invece di quello del vicino.",
    icon: "Search",
  },
  {
    key: "geo",
    name: "GEO — Local Search",
    priceEur: 77,
    description: "Se le persone cercano qualcosa vicino a casa loro (tipo 'pizza vicino a me'), facciamo apparire il tuo sito tra i primi. Funziona anche su Google Maps.",
    icon: "Globe",
  },
  {
    key: "gaio",
    name: "GAIO — Consigliato dall'AI",
    priceEur: 127,
    description: "Quando uno chiede a ChatGPT 'mi consigli un dentista a Milano?', tu vuoi che ti consigli te. Noi prepariamo il sito perché lo faccia.",
    icon: "Sparkles",
  },
  {
    key: "analytics",
    name: "Google Analytics + Tracking",
    priceEur: 87,
    description: "Installiamo un piccolo contatore invisibile sul sito. Tu vedi quante persone arrivano, da dove, e cosa guardano. Più i 'pixel' per fare pubblicità su Google e Instagram.",
    icon: "BarChart3",
  },
  {
    key: "chatbot",
    name: "Chatbot custom 24/7",
    priceEur: 297,
    description: "Un robottino sul sito che chiacchiera con i visitatori al posto tuo. Risponde alle domande sempre, anche di notte, e ti manda i contatti di chi è interessato.",
    icon: "MessageSquare",
  },
  {
    key: "email_funnel",
    name: "Newsletter automatica",
    priceEur: 147,
    description: "Mandi email a tutti i tuoi clienti contemporaneamente, con un click. Promozioni, novità, eventi: arrivano in casella in automatico, tu non scrivi una per una.",
    icon: "Mail",
  },
  {
    key: "booking",
    name: "Booking & E-commerce",
    priceEur: 297,
    description: "Le persone possono prenotare un appuntamento o comprare qualcosa direttamente dal sito, pagando online in sicurezza. I soldi arrivano sul tuo conto.",
    icon: "ShoppingCart",
  },
  // ───────────────────────────────────────────────────────────────
  // Modulo Contatti — 2 varianti mutually exclusive.
  // Di default il sito NON ha un form: i visitatori contattano via
  // telefono/email/WhatsApp. Il form viene aggiunto solo con uno
  // di questi addon, in base a dove devono arrivare le richieste.
  // ───────────────────────────────────────────────────────────────
  {
    key: "contact_form_integration",
    name: "Modulo contatti → tuo gestionale",
    priceEur: 197,
    description: "Sul sito aggiungiamo un form dove i clienti lasciano nome, telefono e messaggio. Le richieste arrivano dritte nel gestionale CRM che già usi (Salesforce, HubSpot, Pipedrive, il tuo gestionale custom). Configuriamo noi il collegamento in fase di consegna.",
    icon: "Inbox",
  },
  {
    key: "contact_form_bespoke",
    name: "Modulo contatti + gestionale su misura",
    priceEur: 1799,
    description: "Form contatti sul sito + sviluppiamo per te un gestionale dedicato accessibile da web e smartphone. Vedi tutte le richieste in un'unica dashboard, segui lo stato di ogni cliente, esporti i contatti. Pensato attorno al tuo flusso di lavoro, non un software generico.",
    icon: "Database",
  },
  {
    key: "logo_design",
    name: "Logo design su misura",
    priceEur: 197,
    description: "Non hai un logo? Te lo disegniamo noi. Un logo pulito, scalabile, in vettoriale (utilizzabile per stampa, social, biglietti da visita), coerente col tuo settore e il tono del sito. Consegna in 3 varianti tra cui scegliere.",
    icon: "Sparkles",
  },
];

// Le 2 varianti "Modulo contatti" sono mutually exclusive: non ha senso
// comprarle entrambe (il form è uno solo, varia dove arrivano i dati).
export const CONTACT_FORM_ADDONS = ["contact_form_integration", "contact_form_bespoke"] as const;

export function getTier(key: string): TierSpec | undefined {
  return TIERS.find((t) => t.key === key);
}

export function getAddon(key: string): AddonSpec | undefined {
  return ADDONS.find((a) => a.key === key);
}

export function calculateTotal(tierKey: string, addonKeys: string[]): number {
  const tier = getTier(tierKey);
  if (!tier) return 0;
  const included = new Set<string>(tier.includedAddons ?? []);
  // Saltiamo gli addon gia' inclusi nel tier: il loro valore e' nel
  // prezzo del pacchetto, non vanno ri-addebitati.
  const addonsTotal = addonKeys
    .filter((k) => !included.has(k))
    .map((k) => getAddon(k)?.priceEur ?? 0)
    .reduce((a, b) => a + b, 0);
  return tier.priceEur + addonsTotal;
}

/** Restituisce true se un addon è incluso di default nel tier (non a pagamento). */
export function isAddonIncludedInTier(tierKey: string, addonKey: string): boolean {
  const tier = getTier(tierKey);
  return !!tier?.includedAddons?.includes(addonKey as never);
}

/**
 * Totale "anchor" prima dello sconto: usa priceEurOriginal del tier se
 * presente + somma di tutti i priceEur addon (anche inclusi, perché
 * fanno parte del "valore originale" mostrato barrato).
 */
export function calculateOriginalTotal(tierKey: string, addonKeys: string[]): number {
  const tier = getTier(tierKey);
  if (!tier) return 0;
  const tierAnchor = tier.priceEurOriginal ?? tier.priceEur;
  const addonsTotal = addonKeys
    .map((k) => getAddon(k)?.priceEur ?? 0)
    .reduce((a, b) => a + b, 0);
  return tierAnchor + addonsTotal;
}
