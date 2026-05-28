const port = process.argv[2] || "3000";
const url = `http://localhost:${port}/api/orders`;

// 3 prove con palette/tono DIVERSI per verificare l'adattamento di
// griglia interattiva + cursore (accent diversi, temi light/dark).
const prove = [
  {
    firstName: "Giulia", lastName: "Neri", email: "test+prova1@poweragency.it",
    company: "Atelier Lumière", phone: "+39 02 1112233",
    sector: "Atelier di alta sartoria, Milano",
    targetAudience: "Clientela esigente che cerca abiti su misura di lusso.",
    uniqueSellingProposition: "Ogni capo è cucito a mano in 40 ore di lavoro artigianale.",
    toneOfVoice: "luxury", preferredColors: "nero profondo e oro",
    tier: "premium",
  },
  {
    firstName: "Marco", lastName: "Bianchi", email: "test+prova2@poweragency.it",
    company: "Studio Yoga Serena", phone: "+39 06 4445566",
    sector: "Studio yoga e meditazione, Roma",
    targetAudience: "Persone che cercano equilibrio e benessere quotidiano.",
    uniqueSellingProposition: "Classi piccole, max 8 persone, attenzione individuale.",
    toneOfVoice: "friendly", preferredColors: "verde salvia e crema chiaro",
    tier: "standard",
  },
  {
    firstName: "Luca", lastName: "Verdi", email: "test+prova3@poweragency.it",
    company: "Volt Officina Elettrica", phone: "+39 011 7778899",
    sector: "Officina riparazione auto elettriche, Torino",
    targetAudience: "Proprietari di auto elettriche che cercano assistenza specializzata.",
    uniqueSellingProposition: "Diagnostica in 30 minuti con strumentazione certificata.",
    toneOfVoice: "energetic", preferredColors: "blu elettrico e bianco",
    tier: "premium",
  },
];

for (const p of prove) {
  const fd = new FormData();
  Object.entries(p).forEach(([k, v]) => {
    if (k === "tier") fd.set("tier", v);
    else fd.set(k, v);
  });
  fd.set("worksRemotely", "false");
  fd.set("addons", JSON.stringify([]));
  fd.set("forceAllImages", "false");
  fd.set("acceptedTerms", "true");
  const res = await fetch(url, { method: "POST", body: fd });
  const body = await res.json();
  console.log(`${p.company} [${p.tier}/${p.toneOfVoice}] → HTTP ${res.status} | nonce: ${body.orderId || body.error}`);
}
console.log("\n3 ordini inviati. Le pipeline girano in background.");
