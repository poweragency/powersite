import content from "../content.json";

/**
 * Sceglie lo stile di sfondo animato + cursore in base al TONO del brand,
 * così ogni sito ha effetti diversi, coerenti col suo carattere.
 *
 *   sfondo:  grid   = griglia blueprint (tech/serio)
 *            dots   = trama di punti (raffinato/minimal)
 *            aurora = macchie gradient morbide che fluttuano (caldo/creativo)
 *   cursore: ring   = dot + anello con trailing (premium)
 *            dot    = singolo punto morbido (essenziale)
 *            glow   = alone luminoso soffuso (amichevole/energico)
 *
 * Tutti gli sfondi sono leggermente animati e si illuminano sotto al mouse.
 */
type Tone = "professional" | "friendly" | "luxury" | "energetic" | "minimal";

export type BgVariant = "grid" | "dots" | "aurora";
export type CursorVariant = "ring" | "dot" | "glow";

const MAP: Record<Tone, { bg: BgVariant; cursor: CursorVariant }> = {
  luxury: { bg: "dots", cursor: "ring" },
  minimal: { bg: "dots", cursor: "dot" },
  professional: { bg: "grid", cursor: "ring" },
  energetic: { bg: "grid", cursor: "glow" },
  friendly: { bg: "aurora", cursor: "glow" },
};

export function siteFx(): { bg: BgVariant; cursor: CursorVariant } {
  const tone = (content as { brand?: { tone?: Tone } }).brand?.tone;
  return (tone && MAP[tone]) || { bg: "grid", cursor: "ring" };
}
