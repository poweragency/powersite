/**
 * Audit di un sito cliente deployato: verifica quali marker degli addon
 * sono effettivamente presenti nell'HTML.
 *
 * Uso: npx tsx scripts/audit-site.ts <url> <addon1,addon2,...> [tier]
 */

interface CheckResult {
  marker: string;
  expected: boolean;
  found: boolean;
}

function ok(found: boolean, expected: boolean): string {
  if (expected && found) return "✅ OK";
  if (expected && !found) return "❌ MANCA";
  if (!expected && found) return "⚠️  presente non atteso";
  return "—";
}

async function main() {
  const [url, addonsArg, tierArg = "premium"] = process.argv.slice(2);
  if (!url) {
    console.error("Uso: npx tsx scripts/audit-site.ts <url> <addons> [tier]");
    process.exit(1);
  }
  const addons = (addonsArg ?? "").split(",").filter(Boolean);

  console.log(`\n🔍 Audit: ${url}`);
  console.log(`   addons attivi: ${addons.join(", ") || "(nessuno)"}`);
  console.log(`   tier: ${tierArg}\n`);

  // Fetch home
  const homeRes = await fetch(url);
  const homeHtml = await homeRes.text();
  console.log(`HTTP ${homeRes.status} — ${(homeHtml.length / 1024).toFixed(1)} KB`);

  // Parse meta title + description
  const title = homeHtml.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "—";
  const description = homeHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] ?? "—";
  console.log(`\nMETA.title:        ${title}`);
  console.log(`META.description:  ${description}\n`);

  const checks: CheckResult[] = [];

  // ─── SEO / GEO: keyword + città nel meta.title ───
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const cityMarkers = /milano|roma|torino|firenze|napoli|bologna|genova|verona|padova|bari/i;
  checks.push({
    marker: "META.title contiene keyword settore (SEO)",
    expected: addons.includes("seo"),
    found: /dentist|studio|ristoran|avvocat|salone|palestra|hotel|consulen|estetic|farmaci/i.test(titleLower),
  });
  checks.push({
    marker: "META.title contiene città (GEO Local SEO)",
    expected: addons.includes("geo"),
    found: cityMarkers.test(title),
  });
  checks.push({
    marker: "META.description contiene città nei primi 80 char (GEO)",
    expected: addons.includes("geo"),
    found: cityMarkers.test(description.slice(0, 80)),
  });

  // ─── FAQ: presenza di details/summary (FAQ accordion) ───
  const faqCount = (homeHtml.match(/<details[^>]*>/g) || []).length;
  const navMultiPage = /href=["']\/(servizi|chi-siamo|contatti)["']/i.test(homeHtml);

  // Per Premium multi-pagina, FAQ è su /contatti — non in homepage. Skip
  if (tierArg !== "premium" || !navMultiPage) {
    checks.push({
      marker: "Sezione FAQ presente (utile per GAIO citabilità AI)",
      expected: addons.includes("gaio") || tierArg !== "standard",
      found: faqCount > 0,
    });
  }

  // ─── Booking ───
  checks.push({
    marker: "Hero CTA primary punta a #prenota (BOOKING)",
    expected: addons.includes("booking"),
    found: /href=["']#prenota["']/i.test(homeHtml),
  });

  // ─── Contact form ───
  checks.push({
    marker: "Form contatti HTML presente (contact_form_*)",
    expected: addons.includes("contact_form_integration") || addons.includes("contact_form_bespoke"),
    found: /<form[^>]+action=["']\/api\/contact/i.test(homeHtml),
  });

  // ─── Chatbot ───
  checks.push({
    marker: "CTA 'chatta con noi' (CHATBOT)",
    expected: addons.includes("chatbot"),
    found: /chatta|chat/i.test(homeHtml) && addons.includes("chatbot"),
  });

  // ─── Logo ───
  checks.push({
    marker: "Logo image presente in hero (utente ha caricato logo)",
    expected: false, // se logo_design attivo, il logo NON c'è (deve essere disegnato)
    found: /\/uploads\/logo\.(png|jpg|jpeg|svg|webp)/i.test(homeHtml),
  });

  // ─── Premium multi-page nav ───
  if (tierArg === "premium" || tierArg === "business") {
    checks.push({
      marker: "Nav multi-pagina (Premium/Signature): link a /servizi, /chi-siamo, /contatti",
      expected: true,
      found: navMultiPage,
    });
  }

  // ─── Navbar fixed ───
  checks.push({
    marker: "Navbar fixed in cima (transparent → bg al scroll)",
    expected: true,
    found: /fixed inset-x-0 top-0/i.test(homeHtml) || /position[:\s]+fixed/i.test(homeHtml),
  });

  // ─── Powered by badge ───
  checks.push({
    marker: "Badge 'Powered by PowerAgency' nel footer",
    expected: true,
    found: /Powered by/i.test(homeHtml) && /poweragency\.it/i.test(homeHtml),
  });

  // Output tabellare
  console.log("─".repeat(80));
  console.log("CHECK".padEnd(60) + "STATO");
  console.log("─".repeat(80));
  for (const c of checks) {
    const status = ok(c.found, c.expected);
    console.log(c.marker.padEnd(60) + status);
  }
  console.log("─".repeat(80));

  // Se Premium multi-page, audit anche delle altre pagine
  if (navMultiPage && tierArg !== "standard") {
    console.log("\n📑 Audit pagine Premium multi-page:\n");
    for (const path of ["/servizi", "/chi-siamo", "/contatti"]) {
      const subUrl = url.replace(/\/$/, "") + path;
      const r = await fetch(subUrl);
      const html = await r.text();
      const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "—";
      const sectionCount = (html.match(/<section/g) || []).length;
      const hasFAQ = /<details[^>]*>/.test(html);
      const hasContactForm = /<form[^>]+action=["']\/api\/contact/i.test(html);
      console.log(`  ${path.padEnd(15)} HTTP ${r.status} | ${(html.length / 1024).toFixed(1)} KB | <section>×${sectionCount}${hasFAQ ? " | FAQ✓" : ""}${hasContactForm ? " | form✓" : ""}`);
      console.log(`    title: ${t}`);
    }
  }

  console.log();
}

main().catch((err) => {
  console.error("\n❌", err);
  process.exit(1);
});
