/**
 * Vetrina dei siti già consegnati ai clienti, mostrati nel modal
 * "Vedi esempi" sotto ogni tier nel checkout.
 *
 * Sostituire gli URL placeholder con i veri siti dei clienti reali.
 * Ogni esempio mostra cliente + nicchia + URL pubblico (visibile in iframe).
 */

import type { Tier } from "@/lib/types";

export interface ShowcaseItem {
  name: string;
  sector: string;
  url: string;
}

// TODO: sostituire con URL reali dei lavori già consegnati.
const PLACEHOLDER = "https://powersite.vercel.app";

export const SHOWCASE: Record<Tier, ShowcaseItem[]> = {
  standard: [
    { name: "Studio Bianchi", sector: "Studio dentistico · Milano", url: PLACEHOLDER },
    { name: "Pizzeria Da Mario", sector: "Ristorazione · Roma", url: PLACEHOLDER },
    { name: "Studio Rossi", sector: "Avvocato · Torino", url: PLACEHOLDER },
  ],
  premium: [
    { name: "Atelier Couture", sector: "Sartoria · Firenze", url: PLACEHOLDER },
    { name: "Fitness Studio MI", sector: "Personal trainer · Milano", url: PLACEHOLDER },
    { name: "Concierge Lake Como", sector: "Hospitality · Como", url: PLACEHOLDER },
  ],
  business: [
    { name: "Hotel Villa Toscana", sector: "Boutique hotel · Toscana", url: PLACEHOLDER },
    { name: "Ristorante Stellato", sector: "Fine dining · Roma", url: PLACEHOLDER },
    { name: "Luxury Spa Resort", sector: "Wellness · Sardegna", url: PLACEHOLDER },
  ],
};
