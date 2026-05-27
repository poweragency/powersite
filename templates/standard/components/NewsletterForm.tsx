"use client";

import { useState } from "react";

/**
 * Form iscrizione newsletter / lead-magnet (addon "email_funnel").
 * Raccoglie l'email e la salva nel CRM (via /api/subscribe). La SEQUENZA di
 * email automatiche va collegata manualmente al provider (Resend/Mailchimp)
 * per il singolo cliente — qui c'è l'infrastruttura di raccolta.
 *
 * Usato dentro CtaBlock quando la CTA ha href="#newsletter" e l'addon è attivo.
 */
export function NewsletterForm({ label }: { label: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-lg font-semibold text-white">
        ✓ Perfetto! Controlla la tua casella, ci sentiamo presto.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="La tua email"
        className="flex-1 rounded-full border-0 px-5 py-4 text-ink focus:outline-none focus:ring-2 focus:ring-white"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {state === "loading" ? "Invio…" : label}
      </button>
      {state === "error" && (
        <p className="text-sm text-white/80">Qualcosa è andato storto, riprova.</p>
      )}
    </form>
  );
}
