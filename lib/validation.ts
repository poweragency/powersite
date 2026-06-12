import { z } from "zod";

export const orderIntakeSchema = z.object({
  // Contatti (decision maker)
  firstName: z.string().min(2, "Nome obbligatorio").max(60),
  lastName: z.string().min(2, "Cognome obbligatorio").max(60),
  email: z.string().email("Email non valida"),
  company: z.string().min(2, "Nome azienda obbligatorio").max(100),
  phone: z
    .string()
    .min(8, "Telefono obbligatorio: il sito ti verrà inviato su WhatsApp")
    .max(30),
  website: z.string().url().optional().or(z.literal("")),

  // Brief
  sector: z.string().min(2, "Settore obbligatorio").max(80),
  targetAudience: z.string().max(500).optional().or(z.literal("")),
  uniqueSellingProposition: z.string().max(500).optional().or(z.literal("")),
  primaryCta: z.string().max(60).optional(),
  secondaryCta: z.string().max(60).optional(),
  toneOfVoice: z.enum(["professional", "friendly", "luxury", "energetic", "minimal"]),
  preferredColors: z.string().max(120).optional(),
  contentNotes: z.string().max(2000).optional(),
  avoidInCopy: z.string().max(1000).optional(),
  // Campi narrativi anti-genericità
  frequentQuestions: z.string().max(1500).optional(),
  industryCritique: z.string().max(800).optional(),
  guarantee: z.string().max(500).optional(),

  // NB: Sede & orari (indirizzo strutturato + openingHours) NON sono più
  // raccolti nel briefing. Si gestiscono dopo, via WhatsApp con il cliente.

  // Trust signals (opzionali — meglio vuoto che inventato)
  yearsExperience: z.number().int().min(0).max(150).optional(),
  clientsServed: z.number().int().min(0).max(10_000_000).optional(),
  certifications: z.string().max(1000).optional(),

  // NB: Social media e Dati legali NON sono più raccolti nel briefing.
  // Si gestiscono dopo, via WhatsApp con il cliente.

  // Pacchetto
  tier: z.enum(["standard", "premium", "business"]),
  // "Modulo contatti" (canone) e "Gestionale su misura" (su preventivo) sono
  // ora voci indipendenti: nessun vincolo di mutua esclusività.
  addons: z.array(z.enum([
    "seo","geo","gaio","analytics","chatbot","email_funnel",
    "booking","contact_form_integration","contact_form_bespoke",
    "logo_design",
  ])).default([]),

  // Immagini
  forceAllImages: z.boolean().default(false),
  imageUrls: z.array(z.string().url()).max(30, "Massimo 30 immagini").default([]),

  // Video (solo Business)
  videoScript: z.string().max(1000).optional(),

  // Terms
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare i termini per procedere" }),
  }),
});

export type OrderIntakeInput = z.infer<typeof orderIntakeSchema>;
