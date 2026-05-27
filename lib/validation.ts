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

  // Indirizzo strutturato (opzionali; obbligatori solo se NON works_remotely)
  worksRemotely: z.boolean().default(false),
  addressStreet: z.string().max(120).optional(),
  addressNumber: z.string().max(10).optional(),
  addressCity: z.string().max(80).optional(),
  addressCap: z.string().regex(/^\d{5}$/, "CAP non valido (5 cifre)").optional().or(z.literal("")),
  addressProvince: z.string().regex(/^[A-Z]{2}$/, "Sigla provincia (2 lettere maiuscole, es. MI)").optional().or(z.literal("")),
  openingHours: z.string().max(400).optional(),

  // Trust signals (opzionali — meglio vuoto che inventato)
  yearsExperience: z.number().int().min(0).max(150).optional(),
  clientsServed: z.number().int().min(0).max(10_000_000).optional(),
  certifications: z.string().max(1000).optional(),

  // Social media (URL opzionali)
  socialInstagram: z.string().url().max(200).optional().or(z.literal("")),
  socialFacebook: z.string().url().max(200).optional().or(z.literal("")),
  socialLinkedin: z.string().url().max(200).optional().or(z.literal("")),
  socialTiktok: z.string().url().max(200).optional().or(z.literal("")),

  // Dati legali (tutti opzionali; necessari per footer GDPR)
  legalCompanyName: z.string().max(200).optional(),
  legalVatNumber: z.string().regex(/^\d{11}$/, "P.IVA non valida (11 cifre)").optional().or(z.literal("")),
  legalFiscalCode: z.string().max(16).optional(),
  legalRea: z.string().max(50).optional(),
  legalPec: z.string().email("PEC non valida").optional().or(z.literal("")),
  legalShareCapital: z.string().max(50).optional(),

  // Pacchetto
  tier: z.enum(["standard", "premium", "business"]),
  addons: z.array(z.enum([
    "seo","geo","gaio","analytics","chatbot","email_funnel",
    "booking","contact_form_integration","contact_form_bespoke",
    "logo_design",
  ]))
    .default([])
    // Mutual exclusivity: solo UNA delle 2 varianti "Modulo contatti" può
    // essere attiva (il form è uno solo, varia dove arrivano le richieste).
    .refine(
      (addons) => !(addons.includes("contact_form_integration") && addons.includes("contact_form_bespoke")),
      { message: "Scegli solo UNA opzione per il modulo contatti: collegamento al tuo gestionale OPPURE gestionale su misura" },
    ),

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
