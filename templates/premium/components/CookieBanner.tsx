"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site-cookie-consent";

/**
 * Cookie banner GDPR minimale per il sito cliente (versione Premium).
 * Usa le variabili della palette dinamica (--color-accent / --color-ink) per
 * adattarsi a qualsiasi brand generato.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss(choice: "all" | "necessary") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, at: new Date().toISOString() }),
    );
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { choice } }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-ink/15 bg-cream/95 p-5 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-auto md:right-6 md:p-6"
      style={{ color: "rgb(var(--color-ink, 24 24 27))" }}
    >
      <h2
        id="cookie-title"
        className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2"
      >
        Cookie e privacy
      </h2>
      <p id="cookie-desc" className="text-sm leading-relaxed text-ink/80">
        Usiamo solo cookie tecnici necessari al funzionamento del sito. Maggiori
        dettagli nella{" "}
        <a href="/cookies" className="underline hover:text-accent">
          Cookie Policy
        </a>
        .
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => dismiss("necessary")}
          className="rounded-full border border-ink/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
        >
          Solo necessari
        </button>
        <button
          type="button"
          onClick={() => dismiss("all")}
          className="rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
