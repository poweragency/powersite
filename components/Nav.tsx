"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 16;

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/#processo",     label: "Il processo" },
  { href: "/#filosofia",    label: "La nostra filosofia" },
  { href: "/#pacchetti",    label: "Listino" },
  { href: "/#recensioni",   label: "Recensioni" },
  { href: "/#faq",          label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500 ease-out",
        scrolled
          ? "border-b border-brass/20 bg-obsidian backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]"
          : "border-b border-transparent bg-gradient-to-b from-obsidian/85 via-obsidian/60 to-transparent backdrop-blur-md",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo className="shrink min-w-0" />
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm text-mist transition-colors hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/ordina?tier=premium" className="btn-flame btn-sm shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline">Avvia il progetto</span>
          <span className="sm:hidden">Inizia</span>
        </Link>
      </div>
    </header>
  );
}
