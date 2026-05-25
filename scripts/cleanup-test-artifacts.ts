/**
 * Cleanup degli artifact creati durante lo sviluppo / test:
 *   - Repo GitHub Powersites/client-*-test* (regex precisa per non toccare repo reali)
 *   - Project Vercel corrispondenti
 *   - Lead Supabase su powersites_leads con company che matcha pattern test
 *   - Eventuali submission orfane su landing_contact_submissions
 *
 * SAFETY:
 *   - Pattern di test esplicito (regex), niente "delete all"
 *   - Stampa la lista di cosa cancellerà PRIMA, poi chiede conferma via flag --yes
 *   - GitHub repo delete è permanente, no undo
 *
 * Uso:
 *   npx tsx scripts/cleanup-test-artifacts.ts          # dry-run (mostra solo)
 *   npx tsx scripts/cleanup-test-artifacts.ts --yes    # esegue
 */

import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";

// Pattern repo/project di test (case-insensitive):
//   client-*-test*  → es. client-studio-bianchi-test1779
//   client-*-test*-* → con suffisso nonce
const TEST_PATTERN = /^client-.*-test[a-z0-9]*$/i;

// Pattern company nei lead Supabase (case-insensitive):
//   "Studio %Test%" + variations
const TEST_COMPANY_PATTERNS = [
  "%test%",        // qualsiasi cosa con "test"
  "Atelier Premium",
  "Studio Conti",
  "Studio Bianchi",
  "Studio Verdi",
  "Studio CrmTest",
  "Studio UI Test",
  "Trattoria del Borgo",
];

const DRY_RUN = !process.argv.includes("--yes");

interface Plan {
  githubRepos: string[];
  vercelProjects: Array<{ id: string; name: string }>;
  supabaseLeads: Array<{ id: string; nonce: string; company: string }>;
  supabaseSubmissions: number;
}

async function planGithub(): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN mancante");
  const octokit = new Octokit({ auth: token });
  const { data: me } = await octokit.rest.users.getAuthenticated();
  // List user repos (max 100, dovrebbe bastare per gli artifact di test)
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "created",
    direction: "desc",
  });
  return repos
    .filter((r) => r.owner.login === me.login && TEST_PATTERN.test(r.name))
    .map((r) => `${me.login}/${r.name}`);
}

async function planVercel(): Promise<Array<{ id: string; name: string }>> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN mancante");
  const teamId = process.env.VERCEL_TEAM_ID || undefined;
  const url = new URL("https://api.vercel.com/v9/projects?limit=100");
  if (teamId) url.searchParams.set("teamId", teamId);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Vercel projects list: ${res.status} ${await res.text()}`);
  const body = (await res.json()) as { projects: Array<{ id: string; name: string }> };
  return body.projects.filter((p) => TEST_PATTERN.test(p.name));
}

async function planSupabase(): Promise<{ leads: Plan["supabaseLeads"]; submissions: number }> {
  const url = process.env.POWERHUB_SUPABASE_URL;
  const key = process.env.POWERHUB_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("POWERHUB_SUPABASE_* mancanti");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Lead di test: company matching uno dei pattern
  const orFilter = TEST_COMPANY_PATTERNS.map((p) => `company.ilike.${p}`).join(",");
  const { data: leads, error: leadsErr } = await supabase
    .from("powersites_leads")
    .select("id, nonce, company")
    .or(orFilter);
  if (leadsErr) throw leadsErr;

  // Submission orfane: powersite_nonce non più presente in powersites_leads OR pertinente ai lead di test
  const testNonces = (leads ?? []).map((l) => l.nonce);
  let submissionCount = 0;
  if (testNonces.length > 0) {
    const { count, error: subsErr } = await supabase
      .from("landing_contact_submissions")
      .select("id", { count: "exact", head: true })
      .in("powersite_nonce", testNonces);
    if (subsErr) throw subsErr;
    submissionCount = count ?? 0;
  }

  return { leads: leads ?? [], submissions: submissionCount };
}

async function executeGithub(repos: string[]): Promise<void> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN! });
  for (const full of repos) {
    const [owner, name] = full.split("/");
    try {
      await octokit.rest.repos.delete({ owner, repo: name });
      console.log(`  ✓ ${full}`);
    } catch (e) {
      console.error(`  ✗ ${full} — ${e instanceof Error ? e.message : e}`);
    }
  }
}

async function executeVercel(projects: Array<{ id: string; name: string }>): Promise<void> {
  const token = process.env.VERCEL_TOKEN!;
  const teamId = process.env.VERCEL_TEAM_ID || undefined;
  for (const p of projects) {
    const url = new URL(`https://api.vercel.com/v9/projects/${p.id}`);
    if (teamId) url.searchParams.set("teamId", teamId);
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok || res.status === 404) {
      console.log(`  ✓ ${p.name} (${p.id})`);
    } else {
      console.error(`  ✗ ${p.name} — ${res.status} ${await res.text()}`);
    }
  }
}

async function executeSupabase(plan: Plan): Promise<void> {
  const supabase = createClient(
    process.env.POWERHUB_SUPABASE_URL!,
    process.env.POWERHUB_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  const nonces = plan.supabaseLeads.map((l) => l.nonce);
  if (nonces.length === 0) return;
  // Submissions prima (FK soft, ma puliamo per coerenza visiva)
  const { error: subsErr } = await supabase
    .from("landing_contact_submissions")
    .delete()
    .in("powersite_nonce", nonces);
  if (subsErr) console.error(`  ✗ submissions: ${subsErr.message}`);
  else console.log(`  ✓ submissions: ${plan.supabaseSubmissions} eliminate`);

  const { error: leadsErr } = await supabase
    .from("powersites_leads")
    .delete()
    .in("nonce", nonces);
  if (leadsErr) console.error(`  ✗ leads: ${leadsErr.message}`);
  else console.log(`  ✓ leads: ${plan.supabaseLeads.length} eliminati`);
}

async function main() {
  console.log(`\n🔍 Pianificazione cleanup (mode: ${DRY_RUN ? "DRY-RUN" : "EXECUTE"})\n`);

  const [githubRepos, vercelProjects, supabasePlan] = await Promise.all([
    planGithub(),
    planVercel(),
    planSupabase(),
  ]);

  const plan: Plan = {
    githubRepos,
    vercelProjects,
    supabaseLeads: supabasePlan.leads,
    supabaseSubmissions: supabasePlan.submissions,
  };

  console.log(`📦 GitHub repos da cancellare (${plan.githubRepos.length}):`);
  plan.githubRepos.forEach((r) => console.log(`   - ${r}`));

  console.log(`\n▲ Vercel projects da cancellare (${plan.vercelProjects.length}):`);
  plan.vercelProjects.forEach((p) => console.log(`   - ${p.name} (${p.id})`));

  console.log(`\n🗄  Supabase lead da cancellare (${plan.supabaseLeads.length}):`);
  plan.supabaseLeads.forEach((l) => console.log(`   - ${l.company} (nonce: ${l.nonce})`));
  console.log(`\n🗄  Submission collegate da cancellare (${plan.supabaseSubmissions})\n`);

  if (DRY_RUN) {
    console.log(`Per eseguire DAVVERO: npx tsx scripts/cleanup-test-artifacts.ts --yes\n`);
    return;
  }

  console.log(`\n⚡ Esecuzione cleanup…\n`);

  console.log(`🐙 GitHub:`);
  await executeGithub(plan.githubRepos);

  console.log(`\n▲ Vercel:`);
  await executeVercel(plan.vercelProjects);

  console.log(`\n🗄  Supabase:`);
  await executeSupabase(plan);

  console.log(`\n✅ Cleanup completato.\n`);
}

main().catch((err) => {
  console.error(`\n❌`, err);
  process.exit(1);
});
