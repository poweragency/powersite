/**
 * Test harness locale per la pipeline di generazione contenuto + build.
 *
 * Esegue:
 *   1. generateLandingContent() → Claude API genera il content strutturato
 *   2. buildProject() → copia template, scrive content.json, scarica immagini
 *
 * NON crea repo GitHub, NON deploya su Vercel, NON manda email.
 * Serve a verificare che AI + build funzionino prima di andare in produzione.
 *
 *
 * Uso:
 *   1. Crea .env.local con ANTHROPIC_API_KEY (e BLOB_READ_WRITE_TOKEN se vuoi
 *      testare con immagini reali su Vercel Blob)
 *   2. npx tsx scripts/test-generation.ts standard "Studio Bianchi"
 *
 * Output:
 *   Stampa il path della cartella generata (sotto os.tmpdir()), che contiene
 *   un progetto Next.js pronto da runnare:
 *     cd <path>
 *     npm install
 *     npm run dev
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { generateLandingContent } from "../lib/ai/generate-content";
import { buildProject } from "../lib/orchestrator/steps/build-project";
import { createGithubRepo } from "../lib/orchestrator/steps/create-github-repo";
import type { OrderPayload, Tier, ToneOfVoice } from "../lib/types";

// Carica .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const TIERS_VALID: Tier[] = ["standard", "premium", "business"];

function makeFakeOrder(tier: Tier, company: string): OrderPayload {
  const nonce = `test-${Date.now()}`;
  return {
    nonce,
    createdAt: new Date().toISOString(),
    email: "test@example.com",
    company,
    companySlug: company.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    phone: "+39 333 1234567",
    website: "https://example.com",
    sector: "Studio dentistico, Milano centro",
    targetAudience:
      "Professionisti 35-55 anni con redditi medio-alti, attenti alla cura del proprio sorriso, alla ricerca di uno studio dentistico moderno e di fiducia.",
    uniqueSellingProposition:
      "20 anni di esperienza in implantologia avanzata, tecnologia laser indolore, prima visita sempre gratuita.",
    toneOfVoice: "professional" as ToneOfVoice,
    preferredColors: "blu navy + oro chiaro",
    contentNotes:
      "Includere fascia oraria 8-20 lun-ven, parcheggio convenzionato, pagamento rateale tasso zero.",
    tier,
    addons: ["seo"],
    totalEur: tier === "standard" ? 397 : tier === "premium" ? 697 : 1297,
    forceAllImages: false,
    imageBlobUrls: [], // niente immagini reali in test locale, vuoto
  };
}

async function main() {
  const [tierArg = "standard", companyArg = "Studio Bianchi", flagArg] = process.argv.slice(2);
  const doGithub = flagArg === "github";

  if (!TIERS_VALID.includes(tierArg as Tier)) {
    console.error(`Tier invalido: ${tierArg}. Usa: ${TIERS_VALID.join(", ")}`);
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY mancante in .env.local");
    process.exit(1);
  }

  const order = makeFakeOrder(tierArg as Tier, companyArg);
  console.log(`\n📋 Test order:`);
  console.log(`   nonce: ${order.nonce}`);
  console.log(`   tier:  ${order.tier}`);
  console.log(`   brand: ${order.company}\n`);

  console.log(`🧠 [1/2] Generazione contenuto con Claude...`);
  const t0 = Date.now();
  const content = await generateLandingContent(order);
  console.log(`   ✓ ${Date.now() - t0}ms — ${content.sections.length} sezioni\n`);

  const totalSteps = doGithub ? 3 : 2;

  console.log(`📦 [2/${totalSteps}] Build del progetto...`);
  const t1 = Date.now();
  const result = await buildProject(order, content);
  console.log(`   ✓ ${Date.now() - t1}ms\n`);

  console.log(`✅ Progetto generato in:`);
  console.log(`   ${result.path}\n`);

  if (doGithub) {
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_ORG) {
      console.error("❌ Per testare GitHub serve GITHUB_TOKEN + GITHUB_ORG in .env.local");
      process.exit(1);
    }
    console.log(`🐙 [3/${totalSteps}] Push su GitHub...`);
    const t2 = Date.now();
    const repo = await createGithubRepo({ order, localPath: result.path });
    console.log(`   ✓ ${Date.now() - t2}ms\n`);

    console.log(`✅ Repo ${repo.alreadyExisted ? "trovata (idempotenza)" : "creata"}:`);
    console.log(`   ${repo.url}`);
    console.log(`   ${repo.filesPushed} file pushati su ${repo.defaultBranch}\n`);
  } else {
    console.log(`Per testarlo:`);
    console.log(`   cd "${result.path}"`);
    console.log(`   npm install`);
    console.log(`   npm run dev\n`);
    console.log(`(Per pushare anche su GitHub: aggiungi 'github' come 3° arg)\n`);
  }
}

main().catch((err) => {
  console.error("\n❌ Errore:", err);
  process.exit(1);
});
