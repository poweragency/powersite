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
 * - Inizialmente trasparente, integrata visivamente nell'header della pagina
 * - Su scroll (>40px): bg primary + backdrop-blur + bordo sottile
 * - Voci nav: link Next.js a pagine SEPARATE (/, /servizi, /chi-siamo, /contatti)
 * - Pagina attiva: evidenziata con accento
 * - Page transitions: fade-in body via keyframe (in globals.css)
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
          ? "bg-primary/90 backdrop-blur-md border-b border-canvas/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="text-base md:text-lg font-bold tracking-tight text-canvas hover:opacity-80 transition-opacity">
          {brandName}
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-2 py-1.5 text-xs font-medium uppercase tracking-wider transition-all md:px-4 md:py-2 md:text-[11px] md:tracking-widest ${
                  active
                    ? "text-accent"
                    : scrolled
                      ? "text-canvas/80 hover:bg-canvas/10 hover:text-canvas"
                      : "text-canvas/90 hover:text-canvas"
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
