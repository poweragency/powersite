"use client";

import { useEffect, useRef } from "react";
import { siteFx } from "../lib/fx";

/**
 * Cursore custom in 3 varianti scelte dal tono del brand (siteFx):
 * - ring : dot + anello con trailing (premium / professional)
 * - dot  : singolo punto morbido che segue 1:1 (minimal)
 * - glow : alone luminoso soffuso che segue (friendly / energetic)
 * Colore = --color-accent del cliente. Si espande sugli elementi interattivi.
 * Disattivato su touch → cursore di sistema normale.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { cursor } = siteFx();

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
    <div aria-hidden className={`cursor-layer cursor-layer--${cursor}`}>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
