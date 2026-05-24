/**
 * Diagnostico permessi GitHub PAT.
 *
 * Verifica passo-passo cosa il GITHUB_TOKEN può fare sull'org GITHUB_ORG:
 *   1. Autenticazione (è valido?)
 *   2. Lettura org (riesce a vederla?)
 *   3. Listing repo (read sui repo)
 *   4. CREATE repo (Administration: Write — quello che ci serve)
 *   5. DELETE repo di test (cleanup)
 *
 * NON stampa MAI il valore del token. Solo log di cosa può/non può fare.
 *
 * Uso:  npx tsx scripts/check-github.ts
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { Octokit } from "@octokit/rest";

config({ path: resolve(process.cwd(), ".env.local") });

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) {
    console.error(`❌ ${key} mancante in .env.local`);
    process.exit(1);
  }
  return v;
}

const token = requireEnv("GITHUB_TOKEN");
const org = requireEnv("GITHUB_ORG");

console.log(`\n🔍 Diagnostico token per org: ${org}\n`);

const octokit = new Octokit({ auth: token });

async function step(label: string, fn: () => Promise<void>): Promise<boolean> {
  process.stdout.write(`  ${label}... `);
  try {
    await fn();
    console.log(`✅`);
    return true;
  } catch (err) {
    const e = err as { status?: number; message?: string; response?: { data?: { message?: string } } };
    const status = e.status ?? "?";
    const msg = e.response?.data?.message ?? e.message ?? "unknown";
    console.log(`❌ ${status} — ${msg}`);
    return false;
  }
}

async function main() {
  let authedLogin = "?";

  // 1. Auth
  const ok1 = await step("1. Auth check", async () => {
    const { data } = await octokit.rest.users.getAuthenticated();
    authedLogin = data.login;
  });
  if (!ok1) {
    console.log(`\n  💡 Token invalido o revocato. Verifica su:`);
    console.log(`     https://github.com/settings/personal-access-tokens`);
    process.exit(1);
  }
  console.log(`     → Authenticated as: ${authedLogin}`);

  // 2. Org read
  const ok2 = await step(`2. Read org "${org}"`, async () => {
    await octokit.rest.orgs.get({ org });
  });
  if (!ok2) {
    console.log(`\n  💡 Possibili cause:`);
    console.log(`     - Nome org sbagliato in .env.local (GITHUB_ORG=...)`);
    console.log(`     - Token "Resource owner" è il tuo user, NON l'org`);
    console.log(`     - L'org non ha abilitato fine-grained PAT (deve fare admin)`);
    process.exit(1);
  }

  // 3. List repos (Read on Contents/Metadata)
  await step(`3. List repos in org`, async () => {
    await octokit.rest.repos.listForOrg({ org, per_page: 1 });
  });

  // 4. CREATE repo (Administration: Write — quello che ci serve)
  const testRepoName = `diagnostic-test-${Date.now().toString(36)}`;
  let created = false;
  const ok4 = await step(`4. CREATE test repo (richiede Administration:Write)`, async () => {
    await octokit.rest.repos.createInOrg({
      org,
      name: testRepoName,
      private: true,
      auto_init: false,
      description: "TEMP — diagnostic test, will be deleted immediately",
      has_issues: false,
      has_projects: false,
      has_wiki: false,
    });
    created = true;
  });

  if (!ok4) {
    console.log(`\n  💡 IL TOKEN NON HA "Administration: Read and write"`);
    console.log(`     Causa più comune: la permission è rimasta "No access" o "Read-only"`);
    console.log(`\n  Fix step-by-step:`);
    console.log(`  1. Vai su https://github.com/settings/personal-access-tokens`);
    console.log(`  2. Trova il token che hai creato → click sul nome`);
    console.log(`  3. Verifica nel pannello:`);
    console.log(`     - "Resource owner" = ${org}   (NON il tuo username)`);
    console.log(`     - Permissions → Repository → Administration = "Read and write"`);
    console.log(`     - Permissions → Repository → Contents = "Read and write"`);
    console.log(`  4. Se Administration è altro → regenerate token, ottieni nuovo valore`);
    console.log(`  5. Aggiorna GITHUB_TOKEN in .env.local col nuovo valore`);
    console.log(`  6. Rilancia: npx tsx scripts/check-github.ts`);
    console.log(`\n  Inoltre, verifica che l'org permetta fine-grained PAT:`);
    console.log(`     https://github.com/organizations/${org}/settings/personal-access-tokens`);
    console.log(`     → "Allow access via fine-grained personal access tokens"`);
    process.exit(1);
  }

  // 5. Cleanup
  if (created) {
    await step(`5. DELETE repo di test (cleanup)`, async () => {
      await octokit.rest.repos.delete({ owner: org, repo: testRepoName });
    });
  }

  console.log(`\n✅ Tutti i permessi OK. Sei pronto per "npm run test:gen ... github".\n`);
}

main().catch((err) => {
  console.error(`\n❌ Errore inatteso:`, err);
  process.exit(1);
});
