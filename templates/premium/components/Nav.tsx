"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  brandName: string;
  links: NavLink[];
}

/**
 * Navbar dinamica per Premium / Signature (multi-page).
 *
 * ⚠️ REGOLA CONTRASTO (importante): il testo della nav DEVE restare leggibile
 * su QUALSIASI palette generata, in ogni pagina. Il bug storico era usare
 * `text-canvas`: nelle pagine secondarie la nav trasparente sta sopra il body
 * (sfondo = canvas) → testo canvas su sfondo canvas = INVISIBILE.
 * Garanzie applicate:
 *   1. Testo SEMPRE `text-white` — `primary` è il colore brand scuro che
 *      regge il bianco (stessa garanzia di `.btn-primary` = bg-primary+white).
 *   2. Anche da NON scrollata la nav ha uno scrim `from-primary` → su pagine
 *      chiare dà il fondo scuro dietro il testo; sopra l'hero scuro della home
 *      lo scrim si fonde, preservando l'effetto "trasparente".
 * Non usare mai `canvas`/`ink` per testo o sfondo nav: variano con la palette
 * (light vs dark) e possono coincidere.
 */
export function Nav({ brandName, links }: Props) {
  const pathname = usePathname();
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
        <Link href="/" className="text-base md:text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
          {brandName}
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-2 py-1.5 text-xs font-medium uppercase tracking-wider transition-all md:px-4 md:py-2 md:text-[11px] md:tracking-widest [text-shadow:0_1px_8px_rgba(0,0,0,0.35)] ${
                  active
                    ? "text-accent"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
