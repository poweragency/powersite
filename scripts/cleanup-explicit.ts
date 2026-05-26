/**
 * Cleanup ESPLICITO: cancella SOLO i repo nominati qui sotto.
 * Niente regex, niente "delete all" — la lista è hardcoded per evitare
 * di toccare repo reali per errore.
 *
 * Per ogni nome repo, deriva il nonce-prefix (ultimi 8 char hex) e
 * cancella il lead Supabase con `nonce LIKE '{prefix}%'` (gli ID
 * Supabase sono UUID completi, ma il repo name include solo i primi 8).
 *
 * Cancella anche le submission Supabase orfane collegate a quei nonce.
 *
 * Uso:
 *   npx tsx scripts/cleanup-explicit.ts          # dry-run
 *   npx tsx scripts/cleanup-explicit.ts --yes    # esegue
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";

const TARGET_REPOS = [
  "client-swrwer-7bf85621",
  "client-highlights-36cd20c0",
  "client-mravcn95c27f839r-e0c283dd",
  "client-studio-verdoneee-86467f29",
  "client-studio-verdi-cf710d80",
  "client-wqdqw-25e17b32",
  "client-studio-diag-final-test-ad97b013",
  "client-studio-after-fix-test-989c5d4e",
  "sitotest",
];

const DRY_RUN = !process.argv.includes("--yes");

function noncePrefix(repoName: string): string | null {
  // pattern: client-{slug}-{8hex}
  const m = repoName.match(/-([0-9a-f]{8})$/i);
  return m ? m[1] : null;
}

async function main() {
  console.log(`\n🔍 Cleanup ESPLICITO (mode: ${DRY_RUN ? "DRY-RUN" : "EXECUTE"})\n`);
  console.log(`Target repos (${TARGET_REPOS.length}):`);
  TARGET_REPOS.forEach((r) => console.log(`  - ${r}`));

  // ── GitHub ────────────────────────────────────────────────────
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) throw new Error("GITHUB_TOKEN mancante");
  const octokit = new Octokit({ auth: ghToken });
  const { data: me } = await octokit.rest.users.getAuthenticated();
  const owner = me.login;
  console.log(`\n🐙 GitHub owner: ${owner}`);

  const repoExists = new Map<string, boolean>();
  for (const name of TARGET_REPOS) {
    try {
      await octokit.rest.repos.get({ owner, repo: name });
      repoExists.set(name, true);
    } catch (e) {
      repoExists.set(name, false);
    }
  }
  console.log(`   esistenti: ${[...repoExists.values()].filter(Boolean).length}/${TARGET_REPOS.length}`);

  // ── Vercel ────────────────────────────────────────────────────
  const vercelToken = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || undefined;
  if (!vercelToken) throw new Error("VERCEL_TOKEN mancante");

  const vercelProjects = new Map<string, string>(); // name -> id
  const projUrl = new URL("https://api.vercel.com/v9/projects?limit=100");
  if (teamId) projUrl.searchParams.set("teamId", teamId);
  const vRes = await fetch(projUrl, { headers: { Authorization: `Bearer ${vercelToken}` } });
  if (!vRes.ok) throw new Error(`Vercel list: ${vRes.status} ${await vRes.text()}`);
  const vBody = (await vRes.json()) as { projects: Array<{ id: string; name: string }> };
  for (const p of vBody.projects) {
    if (TARGET_REPOS.includes(p.name)) vercelProjects.set(p.name, p.id);
  }
  console.log(`\n▲ Vercel projects matched: ${vercelProjects.size}/${TARGET_REPOS.length}`);

  // ── Supabase leads (by nonce prefix) ──────────────────────────
  const sbUrl = process.env.POWERHUB_SUPABASE_URL;
  const sbKey = process.env.POWERHUB_SUPABASE_SERVICE_ROLE_KEY;
  if (!sbUrl || !sbKey) throw new Error("POWERHUB_SUPABASE_* mancanti");
  const sb = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

  const noncePrefixes = TARGET_REPOS.map(noncePrefix).filter((x): x is string => !!x);
  const orFilter = noncePrefixes.map((p) => `nonce.ilike.${p}%`).join(",");
  const { data: leads, error: leadsErr } = await sb
    .from("powersites_leads")
    .select("id, nonce, company")
    .or(orFilter);
  if (leadsErr) throw leadsErr;
  console.log(`\n🗄  Supabase leads matched: ${leads?.length ?? 0}`);
  leads?.forEach((l) => console.log(`   - ${l.company} (${l.nonce})`));

  const fullNonces = (leads ?? []).map((l) => l.nonce);
  let submCount = 0;
  if (fullNonces.length > 0) {
    const { count, error: sErr } = await sb
      .from("landing_contact_submissions")
      .select("id", { count: "exact", head: true })
      .in("powersite_nonce", fullNonces);
    if (sErr) throw sErr;
    submCount = count ?? 0;
  }
  console.log(`🗄  Submission collegate: ${submCount}`);

  if (DRY_RUN) {
    console.log(`\n→ DRY-RUN. Per eseguire: npx tsx scripts/cleanup-explicit.ts --yes\n`);
    return;
  }

  // ── EXECUTE ───────────────────────────────────────────────────
  console.log(`\n⚡ Esecuzione…\n`);

  console.log(`🐙 GitHub:`);
  for (const [name, exists] of repoExists) {
    if (!exists) {
      console.log(`  · ${name} (non esiste, skip)`);
      continue;
    }
    try {
      await octokit.rest.repos.delete({ owner, repo: name });
      console.log(`  ✓ ${owner}/${name}`);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\n▲ Vercel:`);
  for (const [name, id] of vercelProjects) {
    const url = new URL(`https://api.vercel.com/v9/projects/${id}`);
    if (teamId) url.searchParams.set("teamId", teamId);
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${vercelToken}` },
    });
    if (res.ok || res.status === 404) console.log(`  ✓ ${name}`);
    else console.error(`  ✗ ${name}: ${res.status} ${await res.text()}`);
  }

  console.log(`\n🗄  Supabase:`);
  if (fullNonces.length > 0) {
    const { error: sErr } = await sb
      .from("landing_contact_submissions")
      .delete()
      .in("powersite_nonce", fullNonces);
    if (sErr) console.error(`  ✗ submissions: ${sErr.message}`);
    else console.log(`  ✓ submissions: ${submCount} eliminate`);

    const { error: lErr } = await sb
      .from("powersites_leads")
      .delete()
      .in("nonce", fullNonces);
    if (lErr) console.error(`  ✗ leads: ${lErr.message}`);
    else console.log(`  ✓ leads: ${fullNonces.length} eliminati`);
  }

  console.log(`\n✅ Cleanup completato.\n`);
}

main().catch((e) => {
  console.error(`\n❌`, e);
  process.exit(1);
});
