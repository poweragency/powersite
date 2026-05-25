/**
 * Step 5 — Crea il Project su Vercel collegato alla repo GitHub del cliente
 * e triggera il primo deploy in production.
 *
 * Flow:
 *   1. GET /v9/projects/{name} → idempotenza: se esiste già, recupera.
 *   2. POST /v11/projects → crea project con gitRepository link a GitHub.
 *      Vercel scansiona automaticamente la repo e setta up auto-deploy
 *      su ogni push futuro.
 *   3. POST /v13/deployments → triggera il primo build da main HEAD
 *      (necessario perché i commit sono stati pushati PRIMA che il
 *      project esistesse, quindi Vercel non li ha visti via webhook).
 *
 * VERCEL_TOKEN: token API dell'account Vercel client (separato dal SaaS).
 * VERCEL_TEAM_ID: opzionale, solo se l'account ha Team Pro. Per Personal
 *   accounts (Hobby) si lascia vuoto — l'API usa l'utente del token.
 *
 * Riferimenti:
 *  https://vercel.com/docs/rest-api/endpoints/projects#create-a-project
 *  https://vercel.com/docs/rest-api/endpoints/deployments#create-a-new-deployment
 */

import type { OrderPayload } from "@/lib/types";

const VERCEL_API = "https://api.vercel.com";

export interface DeployResult {
  projectId: string;
  projectName: string;
  url: string;
  inspectorUrl: string;
  deploymentId: string;
  alreadyExisted: boolean;
}

interface VercelProject {
  id: string;
  name: string;
}

interface VercelDeployment {
  id: string;
  url: string;
  inspectorUrl?: string;
}

interface VercelError {
  error?: { code?: string; message?: string };
}

class VercelApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = "VercelApiError";
  }
}

function buildUrl(path: string, teamId?: string): URL {
  const url = new URL(VERCEL_API + path);
  if (teamId) url.searchParams.set("teamId", teamId);
  return url;
}

async function vercelRequest<T>(
  path: string,
  init: RequestInit & { token: string; teamId?: string },
): Promise<T> {
  const { token, teamId, headers, ...rest } = init;
  const res = await fetch(buildUrl(path, teamId), {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...headers,
    },
  });
  if (!res.ok) {
    let body: VercelError | string;
    try {
      body = (await res.json()) as VercelError;
    } catch {
      body = await res.text();
    }
    const code = typeof body === "object" ? body.error?.code : undefined;
    const message =
      typeof body === "object" ? body.error?.message ?? JSON.stringify(body) : body;
    throw new VercelApiError(res.status, code, `${res.status} ${code ?? ""} — ${message}`);
  }
  return (await res.json()) as T;
}

export async function deployToVercel(args: {
  order: OrderPayload;
  repoFullName: string; // "owner/client-studio-bianchi-xxx"
  repoId: number;       // numeric GitHub repo id (Vercel deployments richiede questo)
}): Promise<DeployResult> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || undefined;

  if (!token) {
    throw new Error("[deploy-vercel] VERCEL_TOKEN mancante");
  }

  const [, repoName] = args.repoFullName.split("/");
  if (!repoName) {
    throw new Error(`[deploy-vercel] repoFullName invalido: ${args.repoFullName}`);
  }
  // Project name su Vercel = stesso nome della repo (max 100 char, lowercase, hyphen ok)
  const projectName = repoName;

  // 1. Idempotenza: project già esistente?
  let project: VercelProject | null = null;
  let alreadyExisted = false;
  try {
    project = await vercelRequest<VercelProject>(`/v11/projects/${projectName}`, {
      token,
      teamId,
      method: "GET",
    });
    alreadyExisted = true;
    console.log(`[deploy-vercel] project ${projectName} esiste già (id: ${project.id})`);
  } catch (err) {
    if (!(err instanceof VercelApiError) || err.status !== 404) throw err;
    // 404 → procediamo col create
  }

  // 2. Crea project con gitRepository link (se non esiste)
  if (!project) {
    project = await vercelRequest<VercelProject>(`/v11/projects`, {
      token,
      teamId,
      method: "POST",
      body: JSON.stringify({
        name: projectName,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: args.repoFullName,
        },
      }),
    });
    console.log(`[deploy-vercel] project ${project.name} creato (id: ${project.id})`);
  }

  // 3. Triggera deployment da main HEAD (i commit erano già lì prima della
  //    creazione del project, quindi Vercel via webhook non li ha rilevati).
  //    `gitSource` richiede l'ID numerico GitHub della repo, NON owner/name.
  const deployment = await vercelRequest<VercelDeployment>(`/v13/deployments`, {
    token,
    teamId,
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      project: project.id,
      target: "production",
      gitSource: {
        type: "github",
        repoId: args.repoId,
        ref: "main",
      },
    }),
  });

  const url = deployment.url.startsWith("http")
    ? deployment.url
    : `https://${deployment.url}`;

  console.log(`[deploy-vercel] deployment ${deployment.id} avviato → ${url}`);

  return {
    projectId: project.id,
    projectName: project.name,
    url,
    inspectorUrl: deployment.inspectorUrl ?? "",
    deploymentId: deployment.id,
    alreadyExisted,
  };
}
