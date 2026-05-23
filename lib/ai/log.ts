/**
 * Logging delle generazioni AI — stateless edition.
 *
 * Senza DB persistente, logghiamo su console (cattura da Vercel logs +
 * eventuale Sentry/PostHog in futuro). I dati del cliente non vengono
 * mai persistiti.
 */

export interface GenerationLog {
  nonce: string;
  step: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  durationMs?: number;
  error?: string;
}

export function logGeneration(entry: GenerationLog): void {
  const billedTokens =
    (entry.inputTokens ?? 0) +
    (entry.cacheCreationTokens ?? 0) +
    (entry.cacheReadTokens ?? 0);

  const summary = {
    nonce: entry.nonce,
    step: entry.step,
    model: entry.model,
    in: entry.inputTokens ?? 0,
    out: entry.outputTokens ?? 0,
    cacheW: entry.cacheCreationTokens ?? 0,
    cacheR: entry.cacheReadTokens ?? 0,
    billed: billedTokens,
    ms: entry.durationMs,
  };

  if (entry.error) {
    console.error("[ai]", JSON.stringify({ ...summary, error: entry.error }));
  } else {
    console.log("[ai]", JSON.stringify(summary));
  }
}
