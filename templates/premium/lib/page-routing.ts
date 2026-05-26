import type { Section } from "./content-schema";

/**
 * Mappatura tipo-sezione → pagina del sito Premium multi-page.
 * Quando il content.json è generato dall'AI, ogni sezione finisce nella
 * pagina corrispondente. Tipi non mappati cadono in /chi-siamo (fallback).
 */
export type PageKey = "home" | "servizi" | "chi-siamo" | "contatti";

const TYPE_TO_PAGE: Record<Section["type"], PageKey> = {
  hero: "home",
  value: "home", // PERCHÉ NOI sta in home con hero
  process: "servizi", // metodo step-by-step
  features: "servizi", // caratteristiche prodotto
  "social-proof": "chi-siamo", // testimonianze
  trust: "chi-siamo", // credenziali
  cta: "contatti", // la cta intermedia finisce in /contatti come spinta finale
  faq: "contatti",
  contact: "contatti",
};

export const PAGE_TITLES: Record<PageKey, string> = {
  home: "Home",
  servizi: "Servizi",
  "chi-siamo": "Chi siamo",
  contatti: "Contatti",
};

export const PAGE_HREFS: Record<PageKey, string> = {
  home: "/",
  servizi: "/servizi",
  "chi-siamo": "/chi-siamo",
  contatti: "/contatti",
};

/**
 * Filtra le sezioni del content.json che appartengono a una specifica pagina.
 * Mantiene l'ordine originale del content.
 */
export function sectionsForPage(sections: Section[], page: PageKey): Section[] {
  return sections.filter((s) => TYPE_TO_PAGE[s.type] === page);
}

/**
 * Costruisce i link della navbar in base alle pagine che hanno effettivamente
 * almeno una sezione popolata (nasconde voci vuote — es. nessuna FAQ → no
 * link "Contatti"? In realtà /contatti ha sempre la sezione `contact` → ok).
 */
export function navLinksFromContent(sections: Section[]): Array<{ label: string; href: string }> {
  const pagesWithContent = new Set<PageKey>();
  for (const s of sections) pagesWithContent.add(TYPE_TO_PAGE[s.type]);
  const order: PageKey[] = ["home", "servizi", "chi-siamo", "contatti"];
  return order
    .filter((p) => pagesWithContent.has(p))
    .map((p) => ({ label: PAGE_TITLES[p], href: PAGE_HREFS[p] }));
}
