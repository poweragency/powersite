/**
 * Diagnostico Vercel Blob: verifica che BLOB_READ_WRITE_TOKEN sia valido
 * facendo un upload, download e cleanup di un blob temporaneo.
 *
 * Uso: npx tsx scripts/check-blob.ts
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { put, del } from "@vercel/blob";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN mancante in .env.local");
    process.exit(1);
  }

  const probe = `diagnostic/${Date.now()}.json`;
  const payload = JSON.stringify({ probe: true, at: new Date().toISOString() });

  console.log(`⏳ PUT  ${probe}…`);
  const t1 = Date.now();
  const blob = await put(probe, payload, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  console.log(`✓ PUT  ${Date.now() - t1}ms → ${blob.url}`);

  console.log(`⏳ GET  ${blob.url}…`);
  const t2 = Date.now();
  const res = await fetch(blob.url);
  const body = await res.text();
  console.log(`✓ GET  ${Date.now() - t2}ms — body match: ${body === payload}`);

  console.log(`⏳ DEL  ${probe}…`);
  const t3 = Date.now();
  await del(blob.url);
  console.log(`✓ DEL  ${Date.now() - t3}ms`);

  console.log(`\n✅ Blob store operativo`);
}

main().catch((err) => {
  console.error(`\n❌`, err);
  process.exit(1);
});
