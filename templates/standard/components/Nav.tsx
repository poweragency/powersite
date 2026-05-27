"use client";

import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  brandName: string;
  /**
   * Solo le voci con sezione presente nel content (filtrate dal page.tsx)
   * vengono passate qui, così non mostriamo link a sezioni inesistenti.
   */
  links: NavLink[];
}

/**
 * Navbar dinamica per il template Standard (single-page).
 *
 * ⚠️ REGOLA CONTRASTO (importante): il testo nav DEVE restare leggibile su
 * QUALSIASI palette generata. Bug storico: `text-canvas` su sfondo canvas =
 * invisibile. Garanzie:
 *   1. Testo SEMPRE `text-white` (primary regge il bianco — cfr .btn-primary).
 *   2. Scrim `from-primary` anche da non scrollata: fondo scuro dietro il testo
 *      su qualsiasi sezione; sopra l'hero scuro si fonde (effetto trasparente).
 * Mai usare `canvas`/`ink` per testo o sfondo nav (variano con la palette).
 */
export function Nav({ brandName, links }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-gradient-to-b from-primary/85 via-primary/45 to-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          className="text-base md:text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]"
        >
          {brandName}
        </a>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 transition-all hover:bg-white/10 hover:text-white md:px-4 md:py-2 md:text-[11px] md:tracking-widest [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
