import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-obsidian/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-10 md:flex">
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
        <Link href="/ordina?tier=premium" className="btn-flame btn-sm">
          Avvia il progetto
        </Link>
      </div>
    </header>
  );
}
