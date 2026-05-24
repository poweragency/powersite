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

type OwnerType = "user" | "org";

async function resolveOwner(
  octokit: Octokit,
  type: OwnerType,
): Promise<string> {
  if (type === "org") {
    const explicit = process.env.GITHUB_OWNER ?? process.env.GITHUB_ORG;
    if (!explicit) {
      throw new Error(
        "[create-github-repo] GITHUB_OWNER_TYPE=org richiede GITHUB_OWNER (o GITHUB_ORG)",
      );
    }
    return explicit;
  }
  // user mode: l'owner è SEMPRE l'utente proprietario del PAT
  // (createForAuthenticatedUser crea nella sua personal account)
  const { data } = await octokit.rest.users.getAuthenticated();
  return data.login;
}

export async function createGithubRepo(args: {
  order: OrderPayload;
  localPath: string;
}): Promise<CreatedRepo> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("[create-github-repo] GITHUB_TOKEN mancante");
  }

  // user mode (default) = repo nel personal account proprietario del PAT
  // org mode = repo nell'org GITHUB_OWNER (richiede Vercel Pro per private repo)
  const ownerType: OwnerType =
    (process.env.GITHUB_OWNER_TYPE as OwnerType | undefined) ?? "user";

  const repoName = buildClientRepoName(args.order.companySlug, args.order.nonce);
  if (!isClientRepoName(repoName)) {
    throw new Error(`[create-github-repo] Nome repo non conforme: ${repoName}`);
  }

  const octokit = new Octokit({ auth: token });
  const owner = await resolveOwner(octokit, ownerType);

  // 1. Idempotenza: la repo esiste già?
  let repoInfo: {
    id: number;
    full_name: string;
    html_url: string;
    default_branch: string;
  } | null = null;
  let alreadyExisted = false;

  try {
    const { data } = await octokit.rest.repos.get({ owner, repo: repoName });
    repoInfo = data;
    alreadyExisted = true;

    try {
      await octokit.rest.repos.getBranch({ owner, repo: repoName, branch: BRANCH });
      console.log(`[create-github-repo] ${owner}/${repoName} esiste già con branch ${BRANCH} popolato, skip push`);
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
      console.log(`[create-github-repo] ${owner}/${repoName} esiste ma è vuota, proseguo col push iniziale`);
    }
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status !== 404) throw err;

    // 2. Repo non esistente → crea NUOVA repo privata
    const repoOpts = {
      name: repoName,
      description: `Sito web per ${args.order.company} — consegnato da Power Agency.`,
      private: true,
      auto_init: false,
      has_issues: false,
      has_projects: false,
      has_wiki: false,
    };

    const { data } =
      ownerType === "org"
        ? await octokit.rest.repos.createInOrg({ org: owner, ...repoOpts })
        : await octokit.rest.repos.createForAuthenticatedUser(repoOpts);

    repoInfo = data;
    console.log(`[create-github-repo] creata ${data.full_name} (mode=${ownerType})`);
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

  // 4. SEED: la Git Data API (blob/tree/commit) non funziona su repo vuote.
  //    Creiamo il primo commit via Contents API con UN file (preferito:
  //    .gitignore, sempre presente nei template). Questo stabilisce il branch
  //    main + ci dà un parent SHA per il commit successivo.
  const seedFile = files.find((f) => f.relPath === ".gitignore") ?? files[0];
  const author = {
    name: "Power Agency",
    email: "delivery@poweragency.it",
  };

  const { data: seedRes } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: seedFile.relPath,
    message: `Initial commit — sito ${args.order.company}`,
    content: seedFile.content.toString("base64"),
    branch: BRANCH,
    committer: author,
    author,
  });
  const seedCommitSha = seedRes.commit.sha!;
  console.log(`[create-github-repo] seed commit ${seedCommitSha.slice(0, 7)} via ${seedFile.relPath}`);

  // 5. PUSH RESTO: ora la repo non è più vuota → Git Data API funziona.
  //    Creiamo blob per tutti gli altri file (escludendo il seed già presente).
  const remainingFiles = files.filter((f) => f.relPath !== seedFile.relPath);

  const tree: Array<{
    path: string;
    mode: "100644";
    type: "blob";
    sha: string;
  }> = [];

  for (const file of remainingFiles) {
    const { data } = await octokit.rest.git.createBlob({
      owner,
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

  // 6. Recupera tree del seed commit per "ereditare" il .gitignore già pushato
  const { data: seedCommit } = await octokit.rest.git.getCommit({
    owner,
    repo: repoName,
    commit_sha: seedCommitSha,
  });

  // 7. Crea tree con base_tree del seed (così .gitignore resta + aggiungiamo tutto)
  const { data: treeData } = await octokit.rest.git.createTree({
    owner,
    repo: repoName,
    base_tree: seedCommit.tree.sha,
    tree,
  });

  // 8. Crea commit di aggiunta files (parent = seed commit)
  const { data: commitData } = await octokit.rest.git.createCommit({
    owner,
    repo: repoName,
    message: `Aggiunti ${remainingFiles.length} file del sito`,
    tree: treeData.sha,
    parents: [seedCommitSha],
    author: { ...author, date: new Date().toISOString() },
  });

  // 9. Fast-forward update di main (no force, è un fast-forward legittimo)
  await octokit.rest.git.updateRef({
    owner,
    repo: repoName,
    ref: `heads/${BRANCH}`,
    sha: commitData.sha,
  });

  // 10. Imposta main come default branch (se necessario)
  if (repoInfo.default_branch !== BRANCH) {
    await octokit.rest.repos.update({
      owner,
      repo: repoName,
      default_branch: BRANCH,
    });
  }

  console.log(
    `[create-github-repo] ${repoInfo.full_name} pushato: ${files.length} file (seed + ${remainingFiles.length}), HEAD ${commitData.sha.slice(0, 7)}`,
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
