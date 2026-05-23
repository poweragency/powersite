"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Renderizza come <span inline-block> invece di <div block>. */
  inline?: boolean;
}

export function Reveal({ children, delay = 0, className = "", inline = false }: Props) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const classes = cn(
    "transition-all duration-1000 ease-out will-change-transform",
    visible
      ? "opacity-100 translate-y-0 blur-0"
      : "opacity-0 translate-y-8 blur-[6px]",
    className,
  );
  const style = { transitionDelay: `${delay}ms` };

  if (inline) {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} style={style} className={classes}>
        {children}
      </span>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={style} className={classes}>
      {children}
    </div>
  );
}
