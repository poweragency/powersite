"use client";

import { useEffect, useRef } from "react";
import { siteFx } from "../lib/fx";

/**
 * Sfondo animato interattivo per l'hero, in 3 varianti scelte dal tono del
 * brand (siteFx): grid / dots / aurora. Tutte:
 * - leggermente animate in autonomia (drift lento via CSS keyframes)
 * - si illuminano sotto al mouse (spotlight, --mx/--my)
 * - parallax leggero col mouse (--gx/--gy)
 * Niente effetti su touch (resta lo sfondo statico animato).
 */
export function InteractiveGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const { bg } = siteFx();

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

  return <div ref={ref} className={`interactive-grid bg-fx--${bg}`} aria-hidden />;
}
