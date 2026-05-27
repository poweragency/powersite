/**
 * Test end-to-end: POST /api/orders di un ordine Signature (tier=business)
 * con modalità testo (videoScript fornito, niente immagini ingresso).
 *
 * BYPASS_STRIPE=true deve essere settato in .env.local — il dev server
 * lo legge, salta Stripe, triggera pipeline asincrona via after().
 *
 * Uso:
 *   npx tsx scripts/test-signature-order.ts [port]
 *   (default port: 3003)
 */

const port = process.argv[2] || "3003";
const url = `http://localhost:${port}/api/orders`;

const fd = new FormData();
fd.set("firstName", "Mario");
fd.set("lastName", "Rossi");
fd.set("email", "test+signature@poweragency.it");
fd.set("company", "Studio Fotografico Lume");
fd.set("phone", "+39 333 1234567");
fd.set("sector", "Studio fotografico di ritratti");
fd.set(
  "targetAudience",
  "Professionisti, manager, founder che cercano ritratti corporate eleganti per LinkedIn, sito aziendale, copertine riviste.",
);
fd.set(
  "uniqueSellingProposition",
  "L'unico studio di Milano specializzato in ritratti cinematografici con luce naturale di porta laterale.",
);
fd.set("toneOfVoice", "luxury");
fd.set("preferredColors", "nero profondo, ottone, bianco crema");
fd.set("worksRemotely", "false");
fd.set("addressStreet", "Via Solferino");
fd.set("addressNumber", "15");
fd.set("addressCity", "Milano");
fd.set("addressCap", "20121");
fd.set("addressProvince", "MI");
fd.set("openingHours", "Lun-Ven 10:00-19:00, Sab su appuntamento");
fd.set("yearsExperience", "12");
fd.set("clientsServed", "850");

// Pacchetto + addon
fd.set("tier", "business");
fd.set("addons", JSON.stringify([])); // includedAddons (seo+geo+gaio) auto-applicati
fd.set("forceAllImages", "false");
fd.set("acceptedTerms", "true");

// VIDEO Signature — MODALITÀ TESTO
fd.set(
  "videoScript",
  "Una porta in legno scuro si apre lentamente verso l'interno. Luce naturale calda entra dal corridoio, illuminando un cavalletto di legno con una stampa fine art. La camera avanza con movimento steady, mostrando una parete con stampe di ritratti incorniciate. Pochi secondi finali sul logo dello studio in ottone su parete intonacata. Audio: pianoforte ambient leggero, nessuna voce.",
);

// Dati legali (per /legal /privacy /cookies del sito generato)
fd.set("legalCompanyName", "Studio Lume di Mario Rossi");
fd.set("legalVatNumber", "12345678901");
fd.set("legalFiscalCode", "RSSMRA80A01F205X");
fd.set("legalPec", "studiolume@pec.it");

console.log(`→ POST ${url}`);
console.log(`  tier=business, videoScript=testo, addons=[]`);
console.log("");

(async () => {
  const t0 = Date.now();
  const res = await fetch(url, { method: "POST", body: fd });
  const ms = Date.now() - t0;
  const body = await res.json();
  console.log(`HTTP ${res.status} (${ms}ms)`);
  console.log(JSON.stringify(body, null, 2));
  if (res.ok && body.orderId) {
    console.log("");
    console.log("✓ Ordine accettato. Pipeline gira in background.");
    console.log("  Nonce:", body.orderId);
    console.log("  Aspetta ~1-3 minuti, poi controlla Supabase →");
    console.log("  https://supabase.com/dashboard/project/rageiputoupzrdqthgvw/editor");
  }
})().catch((e) => {
  console.error("✗ Errore:", e instanceof Error ? e.message : e);
  process.exit(1);
});
