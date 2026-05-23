import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-obsidian/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo className="shrink min-w-0" />
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="#processo" className="text-sm text-mist transition-colors hover:text-bone">
            Il processo
          </Link>
          <Link href="#pacchetti" className="text-sm text-mist transition-colors hover:text-bone">
            Pacchetti
          </Link>
          <Link href="#faq" className="text-sm text-mist transition-colors hover:text-bone">
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
