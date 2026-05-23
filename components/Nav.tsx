"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 16;

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
          ? "border-b border-bone/10 bg-obsidian/90 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          : "border-b border-transparent bg-transparent backdrop-blur-0",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo className="shrink min-w-0" />
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/#processo" className="text-sm text-mist transition-colors hover:text-bone">
            Il processo
          </Link>
          <Link href="/#pacchetti" className="text-sm text-mist transition-colors hover:text-bone">
            Pacchetti
          </Link>
          <Link href="/#faq" className="text-sm text-mist transition-colors hover:text-bone">
            FAQ
          </Link>
        </nav>
        <Link href="/ordina?tier=premium" className="btn-flame btn-sm shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline">Avvia il progetto</span>
          <span className="sm:hidden">Inizia</span>
        </Link>
      </div>
    </header>
  );
}
