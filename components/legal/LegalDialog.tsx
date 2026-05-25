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
        {/* Header sticky con tasto Indietro */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-bone/10 bg-coal/95 px-6 py-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Indietro
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="text-mist transition-colors hover:text-bone"
          >
            ✕
          </button>
        </header>

        {/* Title + body scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12">
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

        {/* Footer con tasto Indietro pieno */}
        <footer className="sticky bottom-0 border-t border-bone/10 bg-coal/95 px-6 py-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-bone btn-md w-full md:w-auto"
          >
            ← Indietro al pagamento
          </button>
        </footer>
      </div>
    </div>
  );
}
