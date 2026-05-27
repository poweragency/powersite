"use client";

import { useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Widget chatbot del sito cliente (addon "chatbot").
 *
 * Render SOLO se NEXT_PUBLIC_CHATBOT === "true" (iniettata al deploy quando
 * l'addon è attivo). Bubble flottante in basso a destra + pannello chat.
 * Usa la palette dinamica del sito (bg-primary / text-accent / canvas).
 * Si apre anche dai link verso "#chat" (la CTA "Chatta con noi" generata dall'AI).
 */
export function ChatWidget({ brandName }: { brandName: string }) {
  const enabled = process.env.NEXT_PUBLIC_CHATBOT === "true";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Ciao! Sono l'assistente di ${brandName}. Come posso aiutarti?` },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Apertura via link "#chat" (CTA secondaria generata dall'AI).
  useEffect(() => {
    if (!enabled) return;
    const openFromHash = () => {
      if (window.location.hash === "#chat") setOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [enabled]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!enabled) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply || "Scusa, non sono riuscito a rispondere. Prova a contattarci direttamente.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "C'è stato un problema di connessione. Riprova tra poco." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bubble */}
      <button
        type="button"
        aria-label={open ? "Chiudi chat" : "Apri chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-xl transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.5 1.2 4.74 3.13 6.32L4 22l5.2-1.9c.9.2 1.84.3 2.8.3 5.52 0 10-3.94 10-8.8S17.52 2 12 2z" /></svg>
        )}
      </button>

      {/* Pannello */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[60vh] max-h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-2xl">
          <div className="flex items-center gap-2 bg-primary px-4 py-3 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-sm font-bold">
              {brandName.charAt(0)}
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{brandName}</div>
              <div className="text-[10px] opacity-80">Assistente · risponde subito</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-secondary text-ink rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2 text-sm text-ink/50">
                  sto scrivendo…
                </span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-ink/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi un messaggio…"
              className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105 disabled:opacity-40"
              aria-label="Invia"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
