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
 * - Inizialmente trasparente, integrata visivamente nell'hero
 * - Su scroll (>40px): bg primary + backdrop-blur + bordo sottile
 * - Voci nav: anchor (#hero, #servizi, ecc.) → smooth scroll via CSS
 * - Mobile: voci visibili in linea (no hamburger, count basso ≤5)
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
          ? "bg-primary/90 backdrop-blur-md border-b border-canvas/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          className={`text-base md:text-lg font-bold tracking-tight transition-colors ${
            scrolled ? "text-canvas" : "text-canvas"
          }`}
        >
          {brandName}
        </a>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-full px-2 py-1.5 text-xs font-medium uppercase tracking-wider transition-all md:px-4 md:py-2 md:text-[11px] md:tracking-widest ${
                scrolled
                  ? "text-canvas/80 hover:bg-canvas/10 hover:text-canvas"
                  : "text-canvas/90 hover:text-canvas"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
