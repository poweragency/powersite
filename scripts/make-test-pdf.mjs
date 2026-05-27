import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const OUT = path.join(os.tmpdir(), "menu-test.pdf");

const lines = [
  "TRATTORIA DEL BORGO - MENU",
  "",
  "ANTIPASTI",
  "Tagliere di salumi misti piemontesi con giardiniera - 12 EUR",
  "Vitello tonnato della casa - 11 EUR",
  "Flan di zucca con fonduta di Castelmagno - 10 EUR",
  "",
  "PRIMI",
  "Tajarin 40 tuorli al ragu di salsiccia - 13 EUR",
  "Agnolotti del plin al sugo d'arrosto - 14 EUR",
  "Risotto al Barolo e Castelmagno - 15 EUR",
  "",
  "SECONDI",
  "Brasato al Barolo con polenta - 18 EUR",
  "Tagliata di fassona con rucola e grana - 20 EUR",
  "",
  "DOLCI",
  "Bonet piemontese - 6 EUR",
  "Panna cotta ai frutti di bosco - 6 EUR",
];

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

let stream = "BT /F1 12 Tf 50 780 Td 16 TL\n";
for (const l of lines) stream += `(${esc(l)}) Tj T*\n`;
stream += "ET";

const objs = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objs.forEach((o, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
});
const xrefStart = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
offsets.forEach((off) => (pdf += `${String(off).padStart(10, "0")} 00000 n \n`));
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

fs.writeFileSync(OUT, pdf, "latin1");
console.log("PDF scritto:", OUT, Buffer.byteLength(pdf), "bytes");
