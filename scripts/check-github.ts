/**
 * Diagnostico permessi GitHub PAT.
 *
 * Supporta sia user mode (default, repo nel personal account del PAT)
 * sia org mode (repo in un'org). Switch via GITHUB_OWNER_TYPE.
 *
 * Verifica passo-passo cosa il GITHUB_TOKEN può fare:
 *   1. Autenticazione (è valido?)
 *   2. Lettura owner (riesce a vederlo?)
 *   3. CREATE repo (la permission che ci serve)
 *   4. DELETE repo di test (cleanup)
 *
 * NON stampa MAI il valore del token.
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
const ownerType = (process.env.GITHUB_OWNER_TYPE ?? "user") as "user" | "org";

console.log(`\n🔍 Diagnostico token — mode: ${ownerType}\n`);

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
    console.log(`\n  💡 Token invalido o revocato.`);
    process.exit(1);
  }
  console.log(`     → Authenticated as: ${authedLogin}`);

  // 2. Risolvi owner in base alla mode
  let owner: string;
  if (ownerType === "org") {
    owner = process.env.GITHUB_OWNER ?? process.env.GITHUB_ORG ?? "";
    if (!owner) {
      console.error("❌ GITHUB_OWNER_TYPE=org richiede GITHUB_OWNER in .env.local");
      process.exit(1);
    }
    const ok2 = await step(`2. Read org "${owner}"`, async () => {
      await octokit.rest.orgs.get({ org: owner });
    });
    if (!ok2) {
      console.log(`\n  💡 L'org non esiste o il token non la vede.`);
      process.exit(1);
    }
  } else {
    owner = authedLogin;
    console.log(`  2. Owner mode user → owner = ${owner} ✅`);
  }

  // 3. CREATE repo (la permission che ci serve)
  const testRepoName = `diagnostic-test-${Date.now().toString(36)}`;
  let created = false;
  const ok3 = await step(`3. CREATE test repo (richiede Administration:Write)`, async () => {
    if (ownerType === "org") {
      await octokit.rest.repos.createInOrg({
        org: owner,
        name: testRepoName,
        private: true,
        auto_init: false,
        description: "TEMP — diagnostic, deleted immediately",
      });
    } else {
      await octokit.rest.repos.createForAuthenticatedUser({
        name: testRepoName,
        private: true,
        auto_init: false,
        description: "TEMP — diagnostic, deleted immediately",
      });
    }
    created = true;
  });

  if (!ok3) {
    console.log(`\n  💡 IL TOKEN NON HA "Administration: Read and write".`);
    console.log(`     Vai su https://github.com/settings/personal-access-tokens`);
    console.log(`     → ${ownerType === "org" ? `Resource owner = ${owner}` : `Resource owner = ${authedLogin}`}`);
    console.log(`     → Permissions → Repository → Administration = "Read and write"`);
    process.exit(1);
  }

  // 4. Cleanup
  if (created) {
    await step(`4. DELETE repo di test (cleanup)`, async () => {
      await octokit.rest.repos.delete({ owner, repo: testRepoName });
    });
  }

  console.log(`\n✅ Tutti i permessi OK. Pronto per npm run test:gen ... github\n`);
}

main().catch((err) => {
  console.error(`\n❌ Errore inatteso:`, err);
  process.exit(1);
});
