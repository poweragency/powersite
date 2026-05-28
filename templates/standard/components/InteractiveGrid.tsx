"use client";

import { useEffect, useRef } from "react";

/**
 * Griglia blueprint interattiva per l'hero.
 *
 * - SPOTLIGHT: un alone azzurro segue il mouse e illumina la griglia attorno
 *   al cursore (CSS vars --mx/--my aggiornate via rAF, niente re-render React).
 * - PARALLAX: la griglia si sposta di pochi px seguendo il mouse (--gx/--gy).
 * - Senza mouse (touch/idle): resta statica come la .tech-grid normale.
 *
 * Si aggancia ai movimenti del mouse sulla sezione genitore (l'hero).
 */
export function InteractiveGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // no su touch

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = parent.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--gx", `${(x / r.width - 0.5) * 16}px`);
        el.style.setProperty("--gy", `${(y / r.height - 0.5) * 16}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty("--gx", "0px");
      el.style.setProperty("--gy", "0px");
      el.style.setProperty("--mx", "-100%");
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="interactive-grid" aria-hidden />;
}
