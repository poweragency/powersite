/**
 * Sincronizza le env vars del SaaS dal .env.local al project Vercel
 * (production + preview + development), via API Vercel REST.
 *
 * SAFETY:
 *   - Salta `BLOB_*` (sono auto-popolate da Vercel Blob integration; sovrascriverle
 *     può romperle)
 *   - Salta `NEXT_PUBLIC_APP_URL` (in prod deve puntare al dominio finale, non a
 *     localhost — lo lascia settare manualmente)
 *   - Dry-run default; richiede --yes per applicare
 *   - Idempotente: usa `?upsert=true` su POST /v10/projects/{id}/env
 *
 * Uso:
 *   npx tsx scripts/sync-vercel-env.ts                        # dry-run
 *   npx tsx scripts/sync-vercel-env.ts --project=<name>       # specifica project Vercel
 *   npx tsx scripts/sync-vercel-env.ts --project=<name> --yes # esegui
 */

import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const SKIP_PREFIXES = ["BLOB_"];
const SKIP_EXACT = new Set([
  "NEXT_PUBLIC_APP_URL", // in prod = dominio finale, va settato manualmente
]);

interface ParsedEnv {
  key: string;
  value: string;
}

function parseEnvFile(path: string): ParsedEnv[] {
  const content = readFileSync(path, "utf-8");
  const result: ParsedEnv[] = [];
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip wrapping quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!key || !value) continue;
    result.push({ key, value });
  }
  return result;
}

function shouldSync(key: string): boolean {
  if (SKIP_EXACT.has(key)) return false;
  return !SKIP_PREFIXES.some((p) => key.startsWith(p));
}

async function findProjectByName(token: string, teamId: string | undefined, name: string) {
  const url = new URL("https://api.vercel.com/v9/projects?limit=100");
  if (teamId) url.searchParams.set("teamId", teamId);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`list projects failed: ${res.status} ${await res.text()}`);
  const body = (await res.json()) as { projects: Array<{ id: string; name: string }> };
  const project = body.projects.find((p) => p.name === name);
  if (!project) {
    const available = body.projects.map((p) => p.name).join(", ");
    throw new Error(`project "${name}" not found. Disponibili: ${available}`);
  }
  return project;
}

async function upsertEnv(args: {
  token: string;
  teamId?: string;
  projectId: string;
  key: string;
  value: string;
}) {
  const url = new URL(`https://api.vercel.com/v10/projects/${args.projectId}/env?upsert=true`);
  if (args.teamId) url.searchParams.set("teamId", args.teamId);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: args.key,
      value: args.value,
      type: "encrypted",
      target: ["production", "preview", "development"],
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

async function main() {
  const projectArg = process.argv.find((a) => a.startsWith("--project="));
  const projectName = projectArg?.split("=")[1] ?? "powersite";
  const execute = process.argv.includes("--yes");

  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN mancante");
  const teamId = process.env.VERCEL_TEAM_ID || undefined;

  const all = parseEnvFile(resolve(process.cwd(), ".env.local"));
  const toSync = all.filter((e) => shouldSync(e.key));
  const skipped = all.filter((e) => !shouldSync(e.key));

  console.log(`\n🔍 Project Vercel: ${projectName} (mode: ${execute ? "EXECUTE" : "DRY-RUN"})\n`);

  console.log(`Da sincronizzare (${toSync.length}):`);
  toSync.forEach((e) => {
    const masked =
      e.value.length > 12 ? `${e.value.slice(0, 4)}…${e.value.slice(-4)}` : "•".repeat(e.value.length);
    console.log(`  - ${e.key} = ${masked}`);
  });

  console.log(`\nSkipped (${skipped.length}):`);
  skipped.forEach((e) => console.log(`  - ${e.key}  (auto-popolata o env-specific)`));

  if (!execute) {
    console.log(`\nPer eseguire: npx tsx scripts/sync-vercel-env.ts --project=${projectName} --yes\n`);
    return;
  }

  const project = await findProjectByName(token, teamId, projectName);
  console.log(`\n⚡ Upsert su project ${project.name} (${project.id})…\n`);

  let ok = 0;
  let fail = 0;
  for (const e of toSync) {
    try {
      await upsertEnv({ token, teamId, projectId: project.id, key: e.key, value: e.value });
      console.log(`  ✓ ${e.key}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${e.key}: ${err instanceof Error ? err.message : err}`);
      fail++;
    }
  }

  console.log(`\n✅ ${ok} OK / ${fail} fallite\n`);
  if (fail === 0) {
    console.log(`Ricorda di settare manualmente nel project Vercel (sono ambiente-specifiche):`);
    console.log(`  - NEXT_PUBLIC_APP_URL = https://<dominio-finale-del-saas>`);
    console.log(`  - BYPASS_STRIPE: lascia 'true' fino a quando attiviamo Stripe in prod\n`);
  }
}

main().catch((err) => {
  console.error(`\n❌`, err);
  process.exit(1);
});
