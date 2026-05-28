"use client";

import { useEffect, useRef } from "react";

/**
 * Cursore custom premium (stile agenzia di design).
 *
 * - Dot centrale che segue il mouse 1:1 + anello (ring) che insegue con
 *   leggero ritardo (lerp) → senso di fluidità.
 * - `mix-blend-mode: difference`: il cursore si inverte sullo sfondo, quindi
 *   appare SCURO sulle aree chiare e chiaro sulle aree scure — sempre visibile
 *   ed elegante, niente colore acceso.
 * - Su elementi interattivi (a, button, input) l'anello si espande.
 * - Disattivato su touch (pointer: coarse) → cursore di sistema normale.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const loop = () => {
      // lerp morbido del ring verso la posizione del mouse
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const hideOut = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    // Espansione su elementi interattivi
    const interactiveSel = "a, button, input, textarea, select, [role='button'], label";
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(interactiveSel)) {
        ring.classList.add("cursor-ring--active");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(interactiveSel)) {
        ring.classList.remove("cursor-ring--active");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", hideOut);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", hideOut);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
