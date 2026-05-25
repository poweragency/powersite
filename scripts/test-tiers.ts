/**
 * Confronto STANDARD vs PREMIUM sullo stesso brief.
 *
 * Mostra side-by-side la differenza di:
 *   - numero sezioni e pipeline
 *   - lunghezza testimonianze
 *   - presenza/quantità FAQ
 *   - presenza sezione METODO (features step-by-step)
 *   - presenza sezione TRUST SIGNALS (value riuso)
 *
 * Uso: npx tsx scripts/test-tiers.ts
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { generateLandingContent, type GeneratedContent } from "../lib/ai/generate-content";
import type { OrderPayload, Tier } from "../lib/types";

function makeOrder(tier: Tier, scenario: "dentista" | "ristorante" = "dentista"): OrderPayload {
  if (scenario === "ristorante") {
    return {
      nonce: `tier-test-${tier}-rist-${Date.now()}`,
      createdAt: new Date().toISOString(),
    firstName: "Mario",
    lastName: "Rossi",
      email: "test@example.com",
      company: "Trattoria del Borgo",
      companySlug: "trattoria-del-borgo",
      phone: "+39 02 1234567",
      website: "https://trattoriadelborgo.example",
      sector: "Trattoria tradizionale toscana, centro Milano",
      targetAudience: "Coppie 30-60 anni, business lunch, famiglie nei weekend",
      uniqueSellingProposition:
        "Cucina toscana autentica, materie prime selezionate, menu allergeni dedicato. Asporto e consegna a domicilio.",
      toneOfVoice: "friendly",
      preferredColors: "rosso bordeaux + crema",
      contentNotes:
        "Aperto tutti i giorni 12-15 e 19-23. Domenica sera chiuso. Prenotazione obbligatoria nei weekend.",
      tier,
      addons: [],
      totalEur: tier === "standard" ? 397 : 697,
      forceAllImages: false,
      imageBlobUrls: [],
    };
  }
  return {
    nonce: `tier-test-${tier}-dent-${Date.now()}`,
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
      "20 anni di esperienza in implantologia, prima visita gratuita, tecnologia laser indolore",
    toneOfVoice: "professional",
    preferredColors: "blu navy + oro chiaro",
    contentNotes: "Aperto lun-ven 8-20, parcheggio convenzionato. Certificazione ISO 9001 dal 2018.",
    tier,
    addons: [],
    totalEur: tier === "standard" ? 397 : 697,
    forceAllImages: false,
    imageBlobUrls: [],
  };
}

type Section = GeneratedContent["sections"][number];

function describe(label: string, c: GeneratedContent) {
  console.log(`\n${"━".repeat(60)}`);
  console.log(`▶ ${label}`);
  console.log(`${"━".repeat(60)}`);
  console.log(`Sezioni (${c.sections.length}): ${c.sections.map((s) => s.type).join(" → ")}`);
  console.log(`META.title: ${c.meta.title}`);

  const hero = c.sections.find((s) => s.type === "hero") as Section & {
    headline?: string;
    subheadline?: string;
    ctaPrimary?: { label?: string };
    ctaSecondary?: { label?: string };
  };
  console.log(`\nHERO.headline:    "${hero.headline}"`);
  console.log(`HERO.subheadline: "${hero.subheadline ?? "—"}"`);
  console.log(`HERO ctas:        primary="${hero.ctaPrimary?.label}" / secondary="${hero.ctaSecondary?.label ?? "—"}"`);

  const valueSections = c.sections.filter((s) => s.type === "value") as Array<
    Section & { title?: string; items?: Array<{ title?: string; body?: string }> }
  >;
  valueSections.forEach((v, i) => {
    console.log(`\nVALUE #${i + 1}: "${v.title}" (${v.items?.length ?? 0} items)`);
    v.items?.forEach((it, j) => {
      const bodyLen = (it.body ?? "").length;
      console.log(`  ${j + 1}. ${it.title} — body ${bodyLen} char`);
    });
  });

  const featuresSections = c.sections.filter((s) => s.type === "features") as Array<
    Section & { title?: string; items?: Array<{ title?: string; icon?: string }> }
  >;
  featuresSections.forEach((f, i) => {
    console.log(`\nFEATURES #${i + 1}: "${f.title}" (${f.items?.length ?? 0} items)`);
    console.log(`  icons: ${f.items?.map((it) => it.icon ?? "?").join(" ")}`);
  });

  const processSections = c.sections.filter((s) => s.type === "process") as Array<
    Section & { title?: string; steps?: Array<{ title?: string; icon?: string }> }
  >;
  processSections.forEach((p, i) => {
    console.log(`\nPROCESS #${i + 1} (tipo dedicato): "${p.title}" (${p.steps?.length ?? 0} steps)`);
    console.log(`  icons: ${p.steps?.map((s) => s.icon ?? "?").join(" ")}`);
    p.steps?.forEach((s, j) => console.log(`  ${j + 1}. ${s.icon} ${s.title}`));
  });

  const trustSections = c.sections.filter((s) => s.type === "trust") as Array<
    Section & { title?: string; badges?: Array<{ label?: string; value?: string; detail?: string }> }
  >;
  trustSections.forEach((t, i) => {
    console.log(`\nTRUST #${i + 1} (tipo dedicato): "${t.title}" (${t.badges?.length ?? 0} badges)`);
    t.badges?.forEach((b, j) => console.log(`  ${j + 1}. ${b.value} — ${b.label}${b.detail ? ` (${b.detail})` : ""}`));
  });

  const social = c.sections.find((s) => s.type === "social-proof") as Section & {
    testimonials?: Array<{ name?: string; quote?: string; rating?: number }>;
  };
  if (social) {
    console.log(`\nSOCIAL-PROOF: ${social.testimonials?.length ?? 0} testimonianze`);
    social.testimonials?.forEach((t, i) => {
      const ql = (t.quote ?? "").length;
      console.log(`  ${i + 1}. ${t.name} (★${t.rating}) — quote ${ql} char`);
      console.log(`     "${(t.quote ?? "").slice(0, 100)}${ql > 100 ? "…" : ""}"`);
    });
  }

  const faq = c.sections.find((s) => s.type === "faq") as Section & {
    items?: Array<{ q?: string; a?: string }>;
  };
  console.log(`\nFAQ: ${faq?.items?.length ?? 0} Q&A`);
  faq?.items?.forEach((it, i) => console.log(`  ${i + 1}. Q: "${it.q}"`));

  const ctas = c.sections.filter((s) => s.type === "cta") as Array<
    Section & { title?: string; ctaPrimary?: { label?: string; href?: string } }
  >;
  console.log(`\nCTA sezioni: ${ctas.length}`);
  ctas.forEach((cta, i) =>
    console.log(`  ${i + 1}. "${cta.title}" → ${cta.ctaPrimary?.label} (${cta.ctaPrimary?.href})`),
  );

  const contact = c.sections.find((s) => s.type === "contact") as Section & {
    title?: string;
    address?: string;
  };
  console.log(`\nCONTACT: "${contact?.title}"`);
  console.log(`  address: ${contact?.address ?? "—"}`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY mancante");
    process.exit(1);
  }

  console.log("⏳ Generating STANDARD (dentista, prof.)…");
  const stdDent = await generateLandingContent(makeOrder("standard", "dentista"));
  describe("STANDARD — Dentista", stdDent);

  console.log("\n\n⏳ Generating STANDARD (ristorante, friendly)…");
  const stdRist = await generateLandingContent(makeOrder("standard", "ristorante"));
  describe("STANDARD — Ristorante (settore diverso → FAQ diverse)", stdRist);

  console.log("\n\n⏳ Generating PREMIUM (dentista, prof.)…");
  const prmDent = await generateLandingContent(makeOrder("premium", "dentista"));
  describe("PREMIUM — Dentista (icone settoriali)", prmDent);

  console.log("\n\n⏳ Generating PREMIUM (ristorante, friendly)…");
  const prmRist = await generateLandingContent(makeOrder("premium", "ristorante"));
  describe("PREMIUM — Ristorante (icone settoriali differenti)", prmRist);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err);
  process.exit(1);
});
