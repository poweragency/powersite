const port = process.argv[2] || "3000";
const url = `http://localhost:${port}/api/orders`;

// Tutti gli addon TRANNE contact_form_bespoke (mutually exclusive con integration)
const addons = [
  "seo", "geo", "gaio", "analytics", "chatbot",
  "email_funnel", "booking", "contact_form_integration", "logo_design",
];

const fd = new FormData();
fd.set("firstName", "Anna");
fd.set("lastName", "Verdi");
fd.set("email", "test+allereaddons@poweragency.it");
fd.set("company", "Studio Dentistico Verdi");
fd.set("phone", "+39 02 98765432");
fd.set("sector", "Studio dentistico, Milano centro");
fd.set("targetAudience", "Adulti e famiglie della zona di Brera che cercano un dentista di fiducia.");
fd.set("uniqueSellingProposition", "Gli altri ti danno un preventivo generico, noi un piano cura scritto e fisso entro 24h.");
fd.set("frequentQuestions", "Fa male l'impianto?\nQuanto costa uno sbiancamento?\nAccettate pagamenti rateali?");
fd.set("guarantee", "Prima visita e preventivo sempre gratuiti.");
fd.set("toneOfVoice", "professional");
fd.set("preferredColors", "blu, bianco");
fd.set("worksRemotely", "false");
fd.set("addressStreet", "Via Brera");
fd.set("addressNumber", "10");
fd.set("addressCity", "Milano");
fd.set("addressCap", "20121");
fd.set("addressProvince", "MI");
fd.set("openingHours", "Lun-Ven 9-19");
fd.set("yearsExperience", "18");
fd.set("clientsServed", "3000");
fd.set("tier", "business");
fd.set("addons", JSON.stringify(addons));
fd.set("forceAllImages", "false");
fd.set("acceptedTerms", "true");
fd.set("legalCompanyName", "Studio Verdi S.r.l.");
fd.set("legalVatNumber", "99887766554");

console.log(`→ POST ${url}\n  tier=business, addons=[${addons.join(", ")}]\n`);
const res = await fetch(url, { method: "POST", body: fd });
const body = await res.json();
console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(body, null, 2));
if (res.ok && body.orderId) console.log("\n✓ Nonce:", body.orderId);
