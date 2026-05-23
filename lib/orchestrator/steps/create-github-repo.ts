/**
 * Step 4 — Crea NUOVA repository GitHub e push del progetto generato.
 *
 * REGOLE DI SICUREZZA:
 * - Solo creazione di NUOVE repo, mai modifica/delete di esistenti
 * - Naming pattern obbligatorio: client-{slug}-{timestamp}
 * - Org dedicata da GITHUB_ORG (es. "power-agency-clients")
 * - Token con scope `repo` SOLO su quella org
 */

import type { OrderPayload } from "@/lib/types";
import { buildClientRepoName, isClientRepoName } from "@/lib/utils";

export interface CreatedRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
}

export async function createGithubRepo(_args: {
  order: OrderPayload;
  localPath: string;
}): Promise<CreatedRepo> {
  const token = process.env.GITHUB_TOKEN;
  const org = process.env.GITHUB_ORG;
  if (!token || !org) {
    throw new Error("[create-github-repo] GITHUB_TOKEN o GITHUB_ORG mancanti");
  }

  const repoName = buildClientRepoName(_args.order.companySlug);
  if (!isClientRepoName(repoName)) {
    throw new Error(`[create-github-repo] Nome repo non conforme: ${repoName}`);
  }

  // TODO: 1. @octokit/rest -> verifica 404 GET /repos/{org}/{repoName} (anti-overwrite)
  // TODO: 2. POST /orgs/{org}/repos { name: repoName, private: true, auto_init: false }
  // TODO: 3. Init git in localPath, set remote, push primo commit
  // TODO: 4. MAI chiamare DELETE o PATCH su repos esistenti

  throw new Error("[create-github-repo] Non implementato.");
}
