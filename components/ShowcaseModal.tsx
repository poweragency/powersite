"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SHOWCASE } from "@/lib/showcase";
import type { Tier } from "@/lib/types";

type Device = "desktop" | "mobile";

/**
 * Renderizza un sito esterno a risoluzione FISSA (1920×1080 desktop o
 * 1080×1920 mobile) e lo scala via CSS transform per entrare INTERO
 * nello spazio disponibile — senza scroll, proporzioni native preservate.
 *
 * Logica: misura larghezza + altezza del contenitore, calcola
 * `min(maxW/baseW, maxH/baseH)`. Così se manca altezza si stringe, se
 * manca larghezza si stringe — qualunque sia il vincolo prevalente.
 */
function ResolutionPreview({ url, device }: { url: string; device: Device }) {
  const baseW = device === "desktop" ? 1920 : 1080;
  const baseH = device === "desktop" ? 1080 : 1920;
  // Cap di larghezza per mobile: anche se ci fosse spazio in larghezza,
  // restringiamo per simulare un telefono reale.
  const widthCap = device === "desktop" ? Infinity : 420;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const availW = Math.min(container.clientWidth, widthCap);
      const availH = container.clientHeight;
      if (availW <= 0 || availH <= 0) return;
      setScale(Math.min(availW / baseW, availH / baseH));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [baseW, baseH, widthCap]);

  const scaledW = baseW * scale;
  const scaledH = baseH * scale;

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center">
      {scale > 0 && (
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative overflow-hidden rounded-lg border border-bone/10 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
            style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
          >
            <iframe
              src={url}
              title="Preview"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              style={{
                width: `${baseW}px`,
                height: `${baseH}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="absolute left-0 top-0 border-0"
            />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
            Risoluzione · {baseW} × {baseH} · scale {(scale * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  tier: Tier | null;
  onClose: () => void;
}

export function ShowcaseModal({ tier, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [device, setDevice] = useState<Device>("desktop");

  const items = tier ? SHOWCASE[tier] : [];
  const active = items[activeIdx];

  useEffect(() => {
    setActiveIdx(0);
    setDevice("desktop");
  }, [tier]);

  // ESC chiude
  useEffect(() => {
    if (!tier) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll mentre il modal è aperto
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [tier, onClose]);

  if (!tier || !active) return null;

  const tierLabel = tier === "business" ? "Signature" : tier === "premium" ? "Premium" : "Standard";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-brass/20 bg-coal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 p-5 md:p-6">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                Esempi · {tierLabel}
              </span>
              <span className="font-mono text-[10px] text-mist">
                {activeIdx + 1} / {items.length}
              </span>
            </div>
            <h2 className="display mt-1.5 text-xl font-bold tracking-tighter text-cream md:text-2xl">
              {active.name}
            </h2>
            <p className="mt-1 text-xs italic text-mist">{active.sector}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Device toggle */}
            <div className="flex rounded-lg border border-bone/15 bg-coal/60 p-1">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={cn(
                  "px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-colors",
                  device === "desktop" ? "bg-brass text-obsidian" : "text-mist hover:text-bone",
                )}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={cn(
                  "px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-colors",
                  device === "mobile" ? "bg-brass text-obsidian" : "text-mist hover:text-bone",
                )}
              >
                Mobile
              </button>
            </div>

            {/* Apri in nuova tab */}
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden items-center gap-1.5 rounded-lg border border-bone/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-mist transition-colors hover:border-brass/40 hover:text-brass md:inline-flex"
            >
              Apri
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg border border-bone/15 text-mist transition-all hover:border-flame/40 hover:bg-flame/10 hover:text-flame"
              aria-label="Chiudi"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Iframe viewport — risoluzione fissa HD scalata per entrare intera, niente scroll */}
        <div className="relative flex-1 overflow-hidden bg-obsidian/60 p-4 md:p-6">
          <ResolutionPreview key={active.url + device} url={active.url} device={device} />
        </div>

        {/* Footer — tab thumbnails se più esempi */}
        {items.length > 1 && (
          <footer className="border-t border-bone/10 p-4 md:p-5">
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <button
                  type="button"
                  key={item.name + i}
                  onClick={() => setActiveIdx(i)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-left transition-all",
                    i === activeIdx
                      ? "border-brass bg-brass/10"
                      : "border-bone/10 bg-coal/40 hover:border-bone/30 hover:bg-coal",
                  )}
                >
                  <div className="text-xs font-semibold text-cream">{item.name}</div>
                  <div className="text-[10px] text-mist">{item.sector}</div>
                </button>
              ))}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
