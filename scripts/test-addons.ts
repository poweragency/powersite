/**
 * Smoke test del nuovo sistema ADDON GUIDES.
 *
 * Esegue 2 generazioni di content sullo stesso brief variando solo gli addon
 * attivi, e stampa le differenze osservabili (sezioni, hero CTA, FAQ, ecc.).
 *
 * Uso: npx tsx scripts/test-addons.ts
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { generateLandingContent } from "../lib/ai/generate-content";
import type { AddonKey, OrderPayload, Tier } from "../lib/types";

function makeOrder(addons: AddonKey[]): OrderPayload {
  return {
    nonce: `addon-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    firstName: "Mario",
    lastName: "Rossi",
    email: "test@example.com",
    company: "Studio Conti",
    companySlug: "studio-conti",
    phone: "+39 02 1234567",
    website: "https://studioconti.example",
    sector: "Studio dentistico, Milano centro",
    targetAudience: "Professionisti 35-55 anni, attenti alla cura del sorriso",
    uniqueSellingProposition:
      "20 anni di esperienza in implantologia avanzata, prima visita gratuita",
    toneOfVoice: "professional",
    preferredColors: "blu navy + oro chiaro",
    contentNotes: "Aperto lun-ven 8-20, parcheggio convenzionato",
    tier: "standard" as Tier,
    addons,
    totalEur: 29.97,
    forceAllImages: false,
    imageBlobUrls: [],
  };
}

function summary(label: string, c: Awaited<ReturnType<typeof generateLandingContent>>) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`▶ ${label}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Section pipeline: ${c.sections.map((s) => s.type).join(" → ")}`);
  console.log(`\nMETA.title:        ${c.meta.title}`);
  console.log(`META.description:  ${c.meta.description}`);
  const hero = c.sections.find((s) => s.type === "hero") as
    | { headline?: string; subheadline?: string; ctaPrimary?: { label?: string; href?: string }; ctaSecondary?: { label?: string; href?: string } }
    | undefined;
  if (hero) {
    console.log(`\nHERO.headline:     ${hero.headline}`);
    console.log(`HERO.sub:          ${hero.subheadline ?? "—"}`);
    console.log(`HERO.ctaPrimary:   ${hero.ctaPrimary?.label} → ${hero.ctaPrimary?.href}`);
    console.log(`HERO.ctaSecondary: ${hero.ctaSecondary?.label ?? "—"} → ${hero.ctaSecondary?.href ?? "—"}`);
  }
  const faq = c.sections.find((s) => s.type === "faq") as
    | { items?: Array<{ q?: string; a?: string }> }
    | undefined;
  console.log(`\nFAQ present:       ${faq ? `yes (${faq.items?.length ?? 0} items)` : "no"}`);
  if (faq?.items?.[0]) {
    console.log(`FAQ Q[0]:          ${faq.items[0].q}`);
    console.log(`FAQ A[0]:          ${faq.items[0].a}`);
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY mancante");
    process.exit(1);
  }

  console.log("⏳ Variante A — NESSUN addon (baseline standard tier)");
  const a = await generateLandingContent(makeOrder([]));
  summary("A — addons: []", a);

  console.log("\n⏳ Variante B — addons: [seo, booking]");
  const b = await generateLandingContent(makeOrder(["seo", "booking"]));
  summary("B — addons: [seo, booking]", b);

  console.log("\n⏳ Variante C — addons: [geo] (Local SEO)");
  const c = await generateLandingContent(makeOrder(["geo"]));
  summary("C — addons: [geo]", c);

  // Stampa contact + value per ispezionare l'effetto geografico
  const contactSection = c.sections.find((s) => s.type === "contact");
  const valueSection = c.sections.find((s) => s.type === "value");
  if (contactSection) {
    console.log(`\nCONTACT section:`);
    console.log(JSON.stringify(contactSection, null, 2));
  }
  if (valueSection) {
    console.log(`\nVALUE section:`);
    console.log(JSON.stringify(valueSection, null, 2));
  }

  console.log("\n⏳ Variante D — addons: [gaio, email_funnel] (AI-citability + lead magnet)");
  const d = await generateLandingContent(makeOrder(["gaio", "email_funnel"]));
  summary("D — addons: [gaio, email_funnel]", d);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err);
  process.exit(1);
});
