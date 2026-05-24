/**
 * Step 4 — Crea NUOVA repository GitHub e ci pusha il progetto generato.
 *
 * STRATEGIA:
 *  1. Calcola nome deterministico da nonce: `client-{slug}-{8char}`.
 *  2. GET /repos/{org}/{name} — se 200 (repo già esistente):
 *     - ha già commit → assumiamo deploy precedente ok, restituiamo l'esistente
 *       (idempotenza: Stripe ha ritentato, niente da fare)
 *     - è vuota → andiamo avanti col push
 *     Se 404 → POST /orgs/{org}/repos per crearla privata.
 *  3. Walk ricorsivo della build dir → blob/tree/commit/ref via Git Trees API
 *     (no shell git, funziona su serverless).
 *
 * REGOLE SICUREZZA:
 *  - Solo creazione di repo NUOVE che matchano `isClientRepoName(...)`.
 *  - Operazioni GitHub limitate a: GET repo, POST org repos, POST git blobs/trees/
 *    commits/refs, PATCH default_branch. MAI DELETE.
 *  - Token deve essere fine-grained scoped SOLO all'org `GITHUB_ORG`.
 */

import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { Octokit } from "@octokit/rest";
import type { OrderPayload } from "@/lib/types";
import { buildClientRepoName, isClientRepoName } from "@/lib/utils";

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".vercel",
  ".git",
  ".turbo",
  "dist",
  "build",
]);

const BRANCH = "main";
const MAX_FILE_BYTES = 50 * 1024 * 1024; // sanity check

export interface CreatedRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  alreadyExisted: boolean;
  filesPushed: number;
}

interface RepoFile {
  relPath: string;
  content: Buffer;
}

async function walkDir(dir: string, base: string): Promise<RepoFile[]> {
  const out: RepoFile[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walkDir(full, base);
      out.push(...sub);
    } else if (entry.isFile()) {
      const buf = await readFile(full);
      if (buf.byteLength > MAX_FILE_BYTES) {
        console.warn(`[create-github-repo] skip ${full}: ${buf.byteLength} bytes (>${MAX_FILE_BYTES})`);
        continue;
      }
      out.push({
        relPath: path.relative(base, full).split(path.sep).join("/"),
        content: buf,
      });
    }
  }
  return out;
}

export async function createGithubRepo(args: {
  order: OrderPayload;
  localPath: string;
}): Promise<CreatedRepo> {
  const token = process.env.GITHUB_TOKEN;
  const org = process.env.GITHUB_ORG;
  if (!token || !org) {
    throw new Error("[create-github-repo] GITHUB_TOKEN o GITHUB_ORG mancanti");
  }

  const repoName = buildClientRepoName(args.order.companySlug, args.order.nonce);
  if (!isClientRepoName(repoName)) {
    throw new Error(`[create-github-repo] Nome repo non conforme: ${repoName}`);
  }

  const octokit = new Octokit({ auth: token });

  // 1. Idempotenza: la repo esiste già?
  let repoInfo: {
    id: number;
    full_name: string;
    html_url: string;
    default_branch: string;
  } | null = null;
  let alreadyExisted = false;

  try {
    const { data } = await octokit.rest.repos.get({ owner: org, repo: repoName });
    repoInfo = data;
    alreadyExisted = true;

    // Se la repo esiste E ha già il branch main popolato, assumiamo deploy
    // precedente ok → restituiamo subito senza ricreare commit (idempotenza)
    try {
      await octokit.rest.repos.getBranch({ owner: org, repo: repoName, branch: BRANCH });
      console.log(`[create-github-repo] ${org}/${repoName} esiste già con branch ${BRANCH} popolato, skip push`);
      return {
        id: data.id,
        name: repoName,
        fullName: data.full_name,
        url: data.html_url,
        defaultBranch: data.default_branch,
        alreadyExisted: true,
        filesPushed: 0,
      };
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status !== 404) throw err;
      // branch non esiste → continuiamo col push iniziale
      console.log(`[create-github-repo] ${org}/${repoName} esiste ma è vuota, proseguo col push iniziale`);
    }
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status !== 404) throw err;

    // 2. Repo non esistente → crea NUOVA repo privata nell'org
    const { data } = await octokit.rest.repos.createInOrg({
      org,
      name: repoName,
      description: `Sito web per ${args.order.company} — consegnato da Power Agency.`,
      private: true,
      auto_init: false,
      has_issues: false,
      has_projects: false,
      has_wiki: false,
    });
    repoInfo = data;
    console.log(`[create-github-repo] creata ${data.full_name}`);
  }

  if (!repoInfo) {
    throw new Error("[create-github-repo] repoInfo non inizializzato (logica inconsistente)");
  }

  // 3. Walk files
  const files = await walkDir(args.localPath, args.localPath);
  console.log(`[create-github-repo] ${files.length} file da pushare`);

  if (files.length === 0) {
    throw new Error(`[create-github-repo] nessun file in ${args.localPath}`);
  }

  // 4. Crea blob per ogni file (base64 per supportare binari come immagini)
  const tree: Array<{
    path: string;
    mode: "100644";
    type: "blob";
    sha: string;
  }> = [];

  for (const file of files) {
    const { data } = await octokit.rest.git.createBlob({
      owner: org,
      repo: repoName,
      content: file.content.toString("base64"),
      encoding: "base64",
    });
    tree.push({
      path: file.relPath,
      mode: "100644",
      type: "blob",
      sha: data.sha,
    });
  }

  // 5. Crea tree (snapshot del filesystem)
  const { data: treeData } = await octokit.rest.git.createTree({
    owner: org,
    repo: repoName,
    tree,
  });

  // 6. Crea commit iniziale (no parent perché repo vuota)
  const { data: commitData } = await octokit.rest.git.createCommit({
    owner: org,
    repo: repoName,
    message: `Initial commit — sito ${args.order.company}`,
    tree: treeData.sha,
    parents: [],
    author: {
      name: "Power Agency",
      email: "delivery@poweragency.it",
      date: new Date().toISOString(),
    },
  });

  // 7. Crea ref refs/heads/main puntando al commit
  await octokit.rest.git.createRef({
    owner: org,
    repo: repoName,
    ref: `refs/heads/${BRANCH}`,
    sha: commitData.sha,
  });

  // 8. Imposta main come default branch (se non già)
  if (repoInfo.default_branch !== BRANCH) {
    await octokit.rest.repos.update({
      owner: org,
      repo: repoName,
      default_branch: BRANCH,
    });
  }

  console.log(
    `[create-github-repo] ${repoInfo.full_name} pushato: ${files.length} file, commit ${commitData.sha.slice(0, 7)}`,
  );

  return {
    id: repoInfo.id,
    name: repoName,
    fullName: repoInfo.full_name,
    url: repoInfo.html_url,
    defaultBranch: BRANCH,
    alreadyExisted,
    filesPushed: files.length,
  };
}
