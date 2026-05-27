import type { Section } from "./content-schema";

/**
 * Mappatura tipo-sezione → pagina del sito Premium multi-page.
 *
 * REGOLA CONTATTI (importante): la sezione `contact` NON è una pagina a sé.
 * È RICORRENTE: viene renderizzata in fondo a OGNI pagina (CTA ripetuta) da
 * SiteShell. Quindi non compare nella navbar e viene esclusa da
 * `sectionsForPage`. La navbar mostra invece la voce FAQ.
 * Se l'addon "Modulo contatti" è attivo (NEXT_PUBLIC_CONTACT_FORM=true) il
 * form vive dentro la sezione Contact → comparendo in fondo a ogni pagina.
 */
export type PageKey = "home" | "servizi" | "chi-siamo" | "faq";

const TYPE_TO_PAGE: Record<Section["type"], PageKey> = {
  hero: "home",
  value: "home", // PERCHÉ NOI sta in home con hero
  process: "servizi", // metodo step-by-step
  features: "servizi", // caratteristiche prodotto
  "social-proof": "chi-siamo", // testimonianze
  trust: "chi-siamo", // credenziali
  gallery: "chi-siamo", // vetrina foto/lavori
  cta: "faq", // la cta intermedia chiude la pagina FAQ
  faq: "faq",
  catalog: "servizi", // menù/catalogo/listino vive nella pagina Servizi
  contact: "faq", // placeholder: la contact è ricorrente, esclusa da sectionsForPage
};

export const PAGE_TITLES: Record<PageKey, string> = {
  home: "Home",
  servizi: "Servizi",
  "chi-siamo": "Chi siamo",
  faq: "FAQ",
};

export const PAGE_HREFS: Record<PageKey, string> = {
  home: "/",
  servizi: "/servizi",
  "chi-siamo": "/chi-siamo",
  faq: "/faq",
};

/**
 * Filtra le sezioni del content.json che appartengono a una specifica pagina.
 * La sezione `contact` è SEMPRE esclusa: è ricorrente (vedi getContactSection).
 * Mantiene l'ordine originale del content.
 */
export function sectionsForPage(sections: Section[], page: PageKey): Section[] {
  return sections.filter((s) => s.type !== "contact" && TYPE_TO_PAGE[s.type] === page);
}

/**
 * Estrae la sezione `contact` (se presente): SiteShell la renderizza in fondo
 * a ogni pagina come CTA ricorrente. Col form contatti se l'addon è attivo.
 */
export function getContactSection(sections: Section[]): Section | undefined {
  return sections.find((s) => s.type === "contact");
}

/**
 * Costruisce i link della navbar in base alle pagine che hanno effettivamente
 * almeno una sezione popolata. La sezione `contact` non genera voce (è
 * ricorrente in fondo a ogni pagina). Ordine fisso: Home · Servizi · Chi siamo · FAQ.
 */
export function navLinksFromContent(sections: Section[]): Array<{ label: string; href: string }> {
  const pagesWithContent = new Set<PageKey>();
  for (const s of sections) {
    if (s.type === "contact") continue; // ricorrente, niente voce nav
    pagesWithContent.add(TYPE_TO_PAGE[s.type]);
  }
  const order: PageKey[] = ["home", "servizi", "chi-siamo", "faq"];
  return order
    .filter((p) => pagesWithContent.has(p))
    .map((p) => ({ label: PAGE_TITLES[p], href: PAGE_HREFS[p] }));
}
