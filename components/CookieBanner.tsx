"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "pa-cookie-consent";

/**
 * Cookie banner GDPR minimale. Compare in basso UNA SOLA volta, finché
 * l'utente non sceglie "Accetta" o "Solo necessari". La scelta è salvata
 * in localStorage (no cookie, ironico ma più pulito).
 *
 * Power Agency SaaS NON usa analytics/tracking di terze parti, quindi
 * questo banner è informativo + permette opt-in per eventuali integrazioni
 * future (Vercel Analytics, ecc.). Niente cookie persistenti di tracking
 * vengono settati senza consenso esplicito.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      // Mostra dopo 600ms per non disturbare il first paint
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
    // Trigger custom event per eventuali listener (es. caricare analytics)
    window.dispatchEvent(new CustomEvent("pa-cookie-consent", { detail: { choice } }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="pa-cookie-title"
      aria-describedby="pa-cookie-desc"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-bone/15 bg-coal/95 p-5 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-auto md:right-6 md:p-6"
    >
      <h2
        id="pa-cookie-title"
        className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brass mb-2"
      >
        Cookie e privacy
      </h2>
      <p id="pa-cookie-desc" className="text-sm leading-relaxed text-mist">
        Usiamo solo cookie tecnici necessari al funzionamento del sito. Nessun
        tracker pubblicitario di default. Maggiori dettagli nella{" "}
        <Link href="/cookies" className="text-bone underline hover:text-brass">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => dismiss("necessary")}
          className="rounded-full border border-bone/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-mist transition-colors hover:border-bone/40 hover:text-bone"
        >
          Solo necessari
        </button>
        <button
          type="button"
          onClick={() => dismiss("all")}
          className="rounded-full bg-brass px-5 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:scale-[1.02] hover:shadow-[0_0_18px_rgba(184,150,93,0.4)]"
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
