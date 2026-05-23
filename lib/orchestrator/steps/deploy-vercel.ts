/**
 * Step 5 — Crea progetto Vercel collegato alla repo e triggera primo deploy.
 *
 * Fase 1: deploy sul team Vercel di Power Agency su sottodominio
 *         `{company-slug}.poweragency.it`.
 * Fase 2: trasferimento al dominio del cliente (gestito separatamente).
 */

import type { OrderPayload } from "@/lib/types";

export interface DeployResult {
  projectId: string;
  url: string;
  deploymentId: string;
}

export async function deployToVercel(_args: {
  order: OrderPayload;
  repoFullName: string;
}): Promise<DeployResult> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const domainBase = process.env.VERCEL_PROJECT_DOMAIN_BASE;
  if (!token || !teamId || !domainBase) {
    throw new Error("[deploy-vercel] env vars mancanti");
  }

  // TODO: 1. POST /v9/projects -> link gitRepository { type: "github", repo: repoFullName }
  // TODO: 2. POST /v10/projects/{id}/domains -> aggiungi {slug}.{domainBase}
  // TODO: 3. POST /v13/deployments -> trigger build da gitSource
  // TODO: 4. Polling stato deployment fino a READY/ERROR

  throw new Error("[deploy-vercel] Non implementato.");
}
