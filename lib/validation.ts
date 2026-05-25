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
  targetAudience: z.string().min(10, "Descrivi il target in almeno 10 caratteri").max(500),
  uniqueSellingProposition: z.string().min(10, "Descrivi la USP in almeno 10 caratteri").max(500),
  primaryCta: z.string().max(60).optional(),
  secondaryCta: z.string().max(60).optional(),
  toneOfVoice: z.enum(["professional", "friendly", "luxury", "energetic", "minimal"]),
  preferredColors: z.string().max(120).optional(),
  contentNotes: z.string().max(2000).optional(),

  // Pacchetto
  tier: z.enum(["standard", "premium", "business"]),
  addons: z.array(z.enum([
    "seo","geo","gaio","analytics","chatbot","email_funnel",
    "booking","domain","contact_form_integration","contact_form_bespoke",
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
