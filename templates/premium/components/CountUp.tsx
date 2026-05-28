"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counter animato (solo Premium): un valore tipo "20+", "500+", "98%", "1.200"
 * conta da 0 al numero quando entra in viewport. La parte NON numerica
 * (prefissi/suffissi come "+", "%", "ISO 9001") è preservata.
 * Se non c'è alcun numero (es. "ISO 9001"), mostra il valore statico.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Estrae il primo numero (con eventuali . o , come separatori migliaia).
    const match = value.match(/[\d.,]+/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const numStr = match[0];
    const target = parseInt(numStr.replace(/[.,]/g, ""), 10);
    if (!Number.isFinite(target) || target === 0) {
      setDisplay(value);
      return;
    }
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numStr.length);
    const grouped = /[.,]/.test(numStr);
    const fmt = (n: number) =>
      `${prefix}${grouped ? n.toLocaleString("it-IT") : String(n)}${suffix}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(target));
      return;
    }

    setDisplay(fmt(0));
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const dur = 1400;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setDisplay(fmt(Math.round(target * eased)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
