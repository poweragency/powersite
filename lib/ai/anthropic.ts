import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY mancante");
  _client = new Anthropic({ apiKey });
  return _client;
}

export const MODEL_COPY = process.env.ANTHROPIC_MODEL_COPY ?? "claude-sonnet-4-6";
export const MODEL_LAYOUT = process.env.ANTHROPIC_MODEL_LAYOUT ?? "claude-opus-4-7";
