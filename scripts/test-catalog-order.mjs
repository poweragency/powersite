import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const port = process.argv[2] || "3000";
const url = `http://localhost:${port}/api/orders`;
const pdfPath = path.join(os.tmpdir(), "menu-test.pdf");

const fd = new FormData();
fd.set("firstName", "Luca");
fd.set("lastName", "Borgo");
fd.set("email", "test+catalog@poweragency.it");
fd.set("company", "Trattoria del Borgo");
fd.set("phone", "+39 011 1234567");
fd.set("sector", "Trattoria piemontese tradizionale, Torino");
fd.set("targetAudience", "Famiglie e coppie che cercano cucina piemontese autentica in centro a Torino.");
fd.set("uniqueSellingProposition", "Gli altri ti danno la carta dei vini standard, noi solo etichette piemontesi di piccoli produttori che conosciamo di persona.");
fd.set("frequentQuestions", "Avete opzioni vegetariane?\nSi puo prenotare per gruppi grandi?\nFate anche pranzo nei feriali?");
fd.set("industryCritique", "Troppe trattorie 'tipiche' comprano pasta industriale e la spacciano per fatta in casa.");
fd.set("guarantee", "La pasta e fatta a mano ogni mattina, o e gratis.");
fd.set("toneOfVoice", "friendly");
fd.set("preferredColors", "bordeaux, crema, legno");
fd.set("worksRemotely", "false");
fd.set("addressStreet", "Via Maria Vittoria");
fd.set("addressNumber", "8");
fd.set("addressCity", "Torino");
fd.set("addressCap", "10123");
fd.set("addressProvince", "TO");
fd.set("openingHours", "Mar-Dom 12:00-14:30 e 19:30-22:30, lunedi chiuso");
fd.set("tier", "premium");
fd.set("addons", JSON.stringify([]));
fd.set("forceAllImages", "false");
fd.set("acceptedTerms", "true");
fd.set("legalCompanyName", "Trattoria del Borgo S.r.l.");
fd.set("legalVatNumber", "11223344556");

// Allego il PDF menu
const buf = fs.readFileSync(pdfPath);
fd.set("catalogPdf", new Blob([buf], { type: "application/pdf" }), "menu.pdf");

console.log(`→ POST ${url}  (tier=premium, PDF menu allegato: ${buf.length}b)`);

const res = await fetch(url, { method: "POST", body: fd });
const body = await res.json();
console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(body, null, 2));
if (res.ok && body.orderId) {
  console.log("\n✓ Nonce:", body.orderId, "\n  Aspetta la pipeline, poi controllo content.json + sito.");
}
