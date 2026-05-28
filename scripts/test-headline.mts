import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { generateLandingContent } from "@/lib/ai/generate-content";
import type { OrderPayload } from "@/lib/types";

const order = {
  nonce: "test-headline",
  createdAt: new Date().toISOString(),
  firstName: "Luca",
  lastName: "Verdi",
  email: "x@y.it",
  company: "Volt Officina Elettrica",
  companySlug: "volt-officina",
  phone: "+39 011 7778899",
  sector: "Officina riparazione auto elettriche, Torino",
  targetAudience: "Proprietari di auto elettriche che cercano assistenza specializzata.",
  uniqueSellingProposition: "Diagnostica in 30 minuti con strumentazione certificata.",
  toneOfVoice: "energetic",
  preferredColors: "blu elettrico e bianco",
  tier: "premium",
  addons: [],
  totalEur: 697,
  forceAllImages: false,
  imageBlobUrls: [],
} as unknown as OrderPayload;

const runs = Number(process.argv[2] || 2);
for (let i = 0; i < runs; i++) {
  const c = await generateLandingContent(order);
  const hero = c.sections.find((s) => s.type === "hero") as { headline: string; subheadline?: string };
  console.log(`\n[run ${i + 1}] HEADLINE: ${hero?.headline}`);
  console.log(`[run ${i + 1}] SUBHEAD : ${hero?.subheadline ?? "(nessuno)"}`);
}
