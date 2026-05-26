"use client";

import { useEffect } from "react";
import { LEGAL_DOC_META, LegalBodyFor, type LegalDocKey } from "./bodies";

interface Props {
  open: boolean;
  onClose: () => void;
  docKey: LegalDocKey;
}

/**
 * Modal a tutta finestra per visualizzare un documento legale (note, termini,
 * cookies) SENZA navigare via dalla pagina /ordina. L'utente preme "Indietro"
 * o ESC per tornare al form col brief intatto.
 *
 * Implementato come <dialog> nativo per accessibilità + portal-free.
 */
export function LegalDialog({ open, onClose, docKey }: Props) {
  // Lock body scroll + ESC handler
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const meta = LEGAL_DOC_META[docKey];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-dialog-title"
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-obsidian/85 backdrop-blur-sm"
      onClick={(e) => {
        // Click sul backdrop chiude
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-0 flex w-full max-w-3xl flex-col overflow-hidden bg-coal shadow-2xl md:my-8 md:rounded-2xl md:border md:border-bone/10">
        {/* Sola X in alto a destra, niente altri bottoni di chiusura */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-bone/15 bg-coal/80 text-mist backdrop-blur-md transition-all hover:border-brass/60 hover:text-brass"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Title + body scrollable. Scrollbar custom coerente col tema dark. */}
        <div className="legal-dialog-scroll flex-1 overflow-y-auto px-6 py-10 md:px-10 md:py-12">
          <span className="chip-brass">{meta.title.split(" ")[0]}</span>
          <h1
            id="legal-dialog-title"
            className="display mt-4 text-balance text-3xl font-bold leading-[1.05] tracking-tightest text-cream md:text-4xl"
          >
            {meta.title.replace(meta.italic, "")}
            <span className="serif-italic">{meta.italic}.</span>
          </h1>
          <div className="mt-8 space-y-8 text-mist leading-relaxed">
            <LegalBodyFor docKey={docKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
