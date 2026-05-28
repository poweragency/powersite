/**
 * Regole CTA dei siti clienti:
 *
 * 1) MAX UNA CTA-contatti per pagina. La sezione `contact` (ricorrente in fondo
 *    a ogni pagina) è LA call-to-action verso i contatti. Quindi i blocchi
 *    `cta` (CtaBlock) verso i contatti sono ridondanti e NON vanno renderizzati:
 *    l'unico CtaBlock ammesso è il lead-magnet newsletter (#newsletter, azione
 *    diversa). Vedi `shouldRenderCtaBlock`.
 *
 * 2) Solo bottoni che portano ai CONTATTI. Bottoni di navigazione interna
 *    ("Scopri i servizi" → #servizi, ecc.) vanno eliminati. Vedi `isContactCta`.
 */

export function isContactCta(href?: string): boolean {
  if (!href) return false;
  const h = href.toLowerCase().trim();
  return (
    h.startsWith("tel:") ||
    h.startsWith("mailto:") ||
    h.includes("wa.me") ||
    h.includes("whatsapp") ||
    h.includes("#contatt") ||
    h.includes("#prenota") ||
    h.includes("#book") ||
    h.includes("#chat")
  );
}

/** Un CtaBlock si renderizza SOLO se è il lead-magnet newsletter. */
export function shouldRenderCtaBlock(href?: string): boolean {
  return (href ?? "").toLowerCase().trim() === "#newsletter";
}
