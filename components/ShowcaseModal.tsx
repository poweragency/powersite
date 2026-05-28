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
/** Cornice MacBook Pro (CSS): schermo con bezel + notch camera + base/cerniera. */
function MacBookFrame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-t-[14px] bg-[#0d0d0f] p-[10px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)]">
        <div className="absolute left-1/2 top-[3.5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#27272b]" aria-hidden />
        <div className="relative overflow-hidden rounded-[3px] bg-white" style={{ width, height }}>
          {children}
          {/* Riflesso vetro dello schermo: decorativo, non intercetta scroll/click */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 100%)" }}
            aria-hidden
          />
        </div>
      </div>
      {/* Base / cerniera, leggermente più larga dello schermo */}
      <div
        className="relative h-[14px] rounded-b-[12px] bg-gradient-to-b from-[#d0d4d8] to-[#a4a9ae]"
        style={{ width: width * 1.12 }}
      >
        <div className="absolute left-1/2 top-0 h-[6px] w-[15%] -translate-x-1/2 rounded-b-[7px] bg-[#888d93]" aria-hidden />
      </div>
    </div>
  );
}

/** Cornice iPhone Pro Max (CSS): bezel nero arrotondato + Dynamic Island. */
function IPhoneFrame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div className="relative rounded-[2.6rem] bg-[#0d0d0f] p-[11px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)]">
      <div className="absolute left-1/2 top-[20px] z-10 h-[22px] w-[32%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
      {/* Tasti laterali (decorativi): accensione a destra, volume/silenzioso a sinistra */}
      <div className="absolute right-[-2px] top-[27%] h-[13%] w-[3px] rounded-r-md bg-[#1c1c1f]" aria-hidden />
      <div className="absolute left-[-2px] top-[19%] h-[6%] w-[3px] rounded-l-md bg-[#1c1c1f]" aria-hidden />
      <div className="absolute left-[-2px] top-[30%] h-[10%] w-[3px] rounded-l-md bg-[#1c1c1f]" aria-hidden />
      <div className="absolute left-[-2px] top-[42%] h-[10%] w-[3px] rounded-l-md bg-[#1c1c1f]" aria-hidden />
      <div className="relative overflow-hidden rounded-[1.9rem] bg-white" style={{ width, height }}>
        {children}
      </div>
    </div>
  );
}

function ResolutionPreview({ url, device }: { url: string; device: Device }) {
  // Mobile usa un VIEWPORT REALE da telefono (390px di larghezza CSS): così
  // i media-query del sito scattano sul layout mobile vero (menu hamburger,
  // testo impilato), non il layout desktop solo rimpicciolito. 1080px sarebbe
  // ancora "desktop" per i breakpoint CSS.
  const baseW = device === "desktop" ? 1920 : 390;
  const baseH = device === "desktop" ? 1080 : 844;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const availW = container.clientWidth;
      const availH = container.clientHeight;
      if (availW <= 0 || availH <= 0) return;
      // Lasciamo spazio alle cornici device (bezel + base MacBook / bezel iPhone).
      let s: number;
      if (device === "desktop") {
        s = Math.min(availW / (baseW * 1.12), (availH - 64) / baseH);
      } else {
        s = Math.min((availW - 28) / baseW, (availH - 28) / baseH);
        s = Math.min(s, 1); // il telefono non si ingrandisce oltre il reale
      }
      setScale(Math.max(s, 0));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [baseW, baseH, device]);

  const scaledW = baseW * scale;
  const scaledH = baseH * scale;

  const iframe = (
    <iframe
      src={url}
      title="Preview"
      loading="lazy"
      /* Interazione e scroll DENTRO l'anteprima sono permessi.
         Niente allow-popups / allow-top-navigation → l'iframe non può aprire
         il sito in una nuova scheda né navigare fuori dal modal. */
      sandbox="allow-same-origin allow-scripts allow-forms"
      style={{
        width: `${baseW}px`,
        height: `${baseH}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      className="absolute left-0 top-0 border-0"
    />
  );

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center">
      {scale > 0 && (
        <div className="flex flex-col items-center gap-3">
          {device === "desktop" ? (
            <MacBookFrame width={scaledW} height={scaledH}>{iframe}</MacBookFrame>
          ) : (
            <IPhoneFrame width={scaledW} height={scaledH}>{iframe}</IPhoneFrame>
          )}
          <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
            {device === "desktop" ? "MacBook Pro" : "iPhone Pro Max"} · {baseW} × {baseH}
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
